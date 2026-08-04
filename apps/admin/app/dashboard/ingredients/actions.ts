'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function createIngredientAction(name: string, unit: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  if (!name || !unit) {
    return { error: 'Please fill in all fields.' };
  }

  try {
    const existing = await prisma.ingredient.findFirst({
      where: { nama_bahan: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      return { error: `Ingredient "${name}" already exists.` };
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        nama_bahan: name,
        satuan: unit,
      },
    });

    revalidatePath('/dashboard/ingredients');
    return { success: true, data: ingredient };
  } catch (error: any) {
    console.error('Error creating ingredient:', error);
    return { error: error.message || 'Failed to create ingredient.' };
  }
}
