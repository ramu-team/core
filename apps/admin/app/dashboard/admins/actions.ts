'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export async function addAdminAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState; // silence warning

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

    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const role = formData.get('role') as string;

    if (!email || !name || !password || !role) {
      return { error: 'Please provide all required fields.' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match.' };
    }

    const { error, data } = await auth.signUp.email({
      email,
      name,
      password,
    });

    if (error || !data) {
      return { error: error?.message || 'Failed to create account in Auth provider.' };
    }

    try {
      await prisma.admin.create({
        data: {
          id: data.user.id,
          name: name,
          email: email,
          password_hash: 'neon_managed',
          role: role,
        },
      });
    } catch (dbError) {
      console.error('Failed to sync admin user to database:', dbError);
      return { error: 'Account created in Auth, but failed to sync to local database.' };
    }

    revalidatePath('/dashboard/admins');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
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
