'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function saveSymptomAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const id = formData.get('id') as string | null;
    const name = (formData.get('name') as string)?.trim();
    const category = (formData.get('category') as string)?.trim();
    const icon = (formData.get('icon') as string)?.trim() || null;

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized. Please login first.' };
    }

    if (!name || !category) {
      return { error: 'Please enter a name and category.' };
    }

    if (id) {
      const existing = await prisma.symptomOption.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          category: category,
          NOT: { id },
        },
      });
      if (existing) {
        return { error: `Symptom "${name}" already exists in this category.` };
      }
      await prisma.symptomOption.update({
        where: { id },
        data: { name: name, category: category, icon: icon },
      });
    } else {
      const existing = await prisma.symptomOption.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          category: category,
        },
      });
      if (existing) {
        return { error: `Symptom "${name}" already exists in this category.` };
      }
      await prisma.symptomOption.create({
        data: { name: name, category: category, icon: icon, isActive: true },
      });
    }

    revalidatePath('/dashboard/symptoms');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[saveSymptomAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function toggleSymptomStatusAction(
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

    await prisma.symptomOption.update({
      where: { id },
      data: { isActive: status },
    });

    revalidatePath('/dashboard/symptoms');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[toggleSymptomStatusAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function deleteSymptomAction(
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

    await prisma.symptomOption.delete({ where: { id } });

    revalidatePath('/dashboard/symptoms');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[deleteSymptomAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}
