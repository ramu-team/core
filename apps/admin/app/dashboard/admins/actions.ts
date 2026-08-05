'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function addAdminAction(payload: { id: string; name: string; email: string; role: string }) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized. Please login first.' };
    }

    // Verify current user is allowed to add admins (Optional, but good practice)
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.user.id }
    });

    if (!currentAdmin || currentAdmin.role !== 'Superadmin') {
      return { error: 'Only Superadmin can add new admins.' };
    }

    const { id, name, email, role } = payload;

    if (!email || !name || !role || !id) {
      return { error: 'Please provide all required fields.' };
    }

    // Buat data Admin di Prisma menggunakan ID dari Auth Provider
    await prisma.$transaction(async (tx) => {
      await tx.admin.create({
        data: {
          id: id,
          name: name,
          email: email,
          password_hash: 'neon_managed',
          role: role,
        },
      });
    });

    revalidatePath('/dashboard/admins');
    return { success: true, timestamp: Date.now() };

  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'An admin with this email already exists.' };
    }
    console.error('[addAdminAction] Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}

export async function deleteAdminAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized' };
    }
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.user.id }
    });

    if (!currentAdmin || currentAdmin.role !== 'Superadmin') {
      return { error: 'Only Superadmin can delete admins.' };
    }

    const id = formData.get('id') as string;
    if (!id) return { error: 'ID is missing' };

    if (id === session.user.id) {
      return { error: 'You cannot delete your own account.' };
    }

    // Notice: To delete a user completely, we should ideally delete from Neon Auth as well.
    // However, without the Server SDK admin method to delete users, we might only be able to delete from Prisma.
    // We will delete from Prisma for now.
    await prisma.admin.delete({
      where: { id },
    });

    revalidatePath('/dashboard/admins');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : 'Failed to delete' };
  }
}
