'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { logAdminAction } from '@/lib/audit';
import { uploadImageToS3 } from '@/lib/s3';

export async function saveMenuAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const id = formData.get('id') as string | null;
    const name = (formData.get('name') as string)?.trim();
    const description = (formData.get('description') as string)?.trim() || '';
    const priceRaw = formData.get('price') as string;
    const recipesStr = formData.get('recipes') as string;
    
    // Check for physical file upload
    const imageFile = formData.get('image_file') as File | null;
    let finalImageUrl = (formData.get('image_url') as string)?.trim() || null;

    if (imageFile && imageFile.size > 0) {
      finalImageUrl = await uploadImageToS3(imageFile);
    }

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized. Please login first.' };
    }

    if (!name) {
      return { error: 'Please enter a name.' };
    }

    const price = parseFloat(priceRaw);
    if (isNaN(price) || price <= 0) {
      return { error: 'Please enter a valid price.' };
    }

    let recipes: { ingredientId: string; ml: number }[] = [];
    try {
      recipes = JSON.parse(recipesStr);
    } catch {
      return { error: 'Invalid recipe data. Please try again.' };
    }

    if (!recipes || recipes.length === 0) {
      return { error: 'Please configure at least one ingredient for the recipe.' };
    }

    if (id) {
      await prisma.$transaction(async (tx) => {
        await tx.menu.update({
          where: { id },
          data: { name: name, description: description, price: price, image_url: finalImageUrl },
        });
        await tx.recipe.deleteMany({ where: { menu_id: id } });
        await Promise.all(
          recipes.map((item) =>
            tx.recipe.create({
              data: { menu_id: id, ingredient_id: item.ingredientId, amountMl: item.ml },
            })
          )
        );
      });
    } else {
      await prisma.$transaction(async (tx) => {
        const menu = await tx.menu.create({
          data: { name: name, description: description, price: price, isActive: true, image_url: finalImageUrl },
        });
        await Promise.all(
          recipes.map((item) =>
            tx.recipe.create({
              data: { menu_id: menu.id, ingredient_id: item.ingredientId, amountMl: item.ml },
            })
          )
        );
      });
    }

    await logAdminAction({
      adminId: session.user.id,
      action: id ? 'UPDATE_MENU' : 'CREATE_MENU',
      entity: 'Menu',
      entityId: id || undefined,
      details: { name, price, image_url: finalImageUrl },
    });

    revalidatePath('/dashboard/menu');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[saveMenuAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function toggleMenuStatusAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const id = formData.get('id') as string;
    const status = formData.get('status') === 'true';

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    await prisma.menu.update({ where: { id }, data: { isActive: status } });
    
    await logAdminAction({
      adminId: session.user.id,
      action: 'TOGGLE_MENU_STATUS',
      entity: 'Menu',
      entityId: id,
      details: { isActive: status },
    });

    revalidatePath('/dashboard/menu');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[toggleMenuStatusAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function deleteMenuAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const id = formData.get('id') as string;

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.recipe.deleteMany({ where: { menu_id: id } });
      await tx.menu.delete({ where: { id } });
    });

    await logAdminAction({
      adminId: session.user.id,
      action: 'DELETE_MENU',
      entity: 'Menu',
      entityId: id,
    });

    revalidatePath('/dashboard/menu');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[deleteMenuAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}
