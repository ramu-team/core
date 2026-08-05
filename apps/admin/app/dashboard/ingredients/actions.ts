'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function saveIngredientAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  // Silence unused warning — prevState is required by useActionState signature
  void prevState;

  try {
    const id = formData.get('id') as string | null;
    const name = (formData.get('name') as string)?.trim();
    const unit = (formData.get('unit') as string)?.trim();

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized. Please login first.' };
    }

    if (!name || !unit) {
      return { error: 'Please fill in all fields.' };
    }

    if (id) {
      const existing = await prisma.ingredient.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          NOT: { id },
        },
      });
      if (existing) {
        return { error: `Ingredient "${name}" already exists.` };
      }
      await prisma.ingredient.update({
        where: { id },
        data: { name: name, unit: unit },
      });
    } else {
      const existing = await prisma.ingredient.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      if (existing) {
        return { error: `Ingredient "${name}" already exists.` };
      }
      await prisma.ingredient.create({
        data: { name: name, unit: unit },
      });
    }

    revalidatePath('/dashboard/ingredients');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[saveIngredientAction] Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
