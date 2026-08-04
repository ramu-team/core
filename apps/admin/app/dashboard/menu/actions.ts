'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

interface RecipeItem {
  ingredientId: string;
  ml: number;
}

export async function createMenuAction(
  name: string,
  description: string,
  price: number,
  recipeItems: RecipeItem[]
) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  if (!name || !price) {
    return { error: 'Please enter a name and price.' };
  }

  if (!recipeItems || recipeItems.length === 0) {
    return { error: 'Please configure at least one ingredient for the recipe.' };
  }

  try {
    // Jalankan transaksi database
    const newMenu = await prisma.$transaction(async (tx) => {
      // 1. Buat record Menu baru
      const menu = await tx.menu.create({
        data: {
          nama_jamu: name,
          deskripsi: description,
          harga: price,
          status_aktif: true,
        },
      });

      // 2. Buat record Recipe untuk setiap bahan baku terpilih
      await Promise.all(
        recipeItems.map((item) =>
          tx.recipe.create({
            data: {
              menu_id: menu.id,
              ingredient_id: item.ingredientId,
              takaran_ml: item.ml,
            },
          })
        )
      );

      return menu;
    });

    revalidatePath('/dashboard/menu');
    return { success: true, data: newMenu };
  } catch (error: any) {
    console.error('Error creating Jamu menu:', error);
    return { error: error.message || 'Failed to create Jamu menu.' };
  }
}

export async function toggleMenuStatusAction(menuId: string, active: boolean) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  try {
    await prisma.menu.update({
      where: { id: menuId },
      data: { status_aktif: active },
    });

    revalidatePath('/dashboard/menu');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling menu status:', error);
    return { error: error.message || 'Failed to toggle menu status.' };
  }
}

export async function deleteMenuAction(menuId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Hapus resep terlebih dahulu karena relasi FK
      await tx.recipe.deleteMany({
        where: { menu_id: menuId },
      });

      // Hapus menu
      await tx.menu.delete({
        where: { id: menuId },
      });
    });

    revalidatePath('/dashboard/menu');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting menu:', error);
    return { error: error.message || 'Failed to delete menu.' };
  }
}
