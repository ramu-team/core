'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { prisma } from '@ramu/db';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password must be provided.' };
  }

  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { last_login: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          admin_id: admin.id,
          action: 'LOGIN',
          entity: 'Admin',
          entity_id: admin.id,
          details: { message: 'Admin authenticated successfully' },
        },
      });
    }
  } catch (err) {
    console.error('Failed to record login audit:', err);
  }

  redirect('/dashboard');
}

export async function recordLogin(email: string) {
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { last_login: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          admin_id: admin.id,
          action: 'LOGIN',
          entity: 'Admin',
          entity_id: admin.id,
          details: { message: 'Admin authenticated successfully' },
        },
      });
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to record login audit:', err);
    return { error: 'Failed to record login' };
  }
}
