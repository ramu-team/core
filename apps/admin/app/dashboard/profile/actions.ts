'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;

  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized. Please login first.' };
    }

    const name = formData.get('name') as string;
    
    if (!name || name.trim().length === 0) {
      return { error: 'Name cannot be empty.' };
    }

    await prisma.admin.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    revalidatePath('/dashboard/profile');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[updateProfileAction] Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
