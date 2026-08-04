'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function createSymptomAction(name: string, category: string, icon?: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  if (!name || !category) {
    return { error: 'Please enter a name and category.' };
  }

  try {
    const existing = await prisma.symptomOption.findFirst({
      where: {
        nama_gejala: { equals: name, mode: 'insensitive' },
        kategori: category,
      },
    });

    if (existing) {
      return { error: `Symptom "${name}" already exists in category "${category}".` };
    }

    const symptom = await prisma.symptomOption.create({
      data: {
        nama_gejala: name,
        kategori: category,
        ikon: icon || null,
        status_aktif: true,
      },
    });

    revalidatePath('/dashboard/symptoms');
    return { success: true, data: symptom };
  } catch (error: any) {
    console.error('Error creating symptom option:', error);
    return { error: error.message || 'Failed to create symptom.' };
  }
}

export async function toggleSymptomStatusAction(symptomId: string, active: boolean) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  try {
    await prisma.symptomOption.update({
      where: { id: symptomId },
      data: { status_aktif: active },
    });

    revalidatePath('/dashboard/symptoms');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling symptom status:', error);
    return { error: error.message || 'Failed to toggle status.' };
  }
}

export async function deleteSymptomAction(symptomId: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  try {
    await prisma.symptomOption.delete({
      where: { id: symptomId },
    });

    revalidatePath('/dashboard/symptoms');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting symptom:', error);
    return { error: error.message || 'Failed to delete symptom.' };
  }
}
