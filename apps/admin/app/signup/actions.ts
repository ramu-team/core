'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpAdminAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm-password') as string;

  if (!email || !name || !password) {
    return { error: 'Please provide name, email, and password.' };
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
    return { error: error?.message || 'Failed to create account.' };
  }

  // Simpan data admin baru ke tabel Admin di database
  try {
    const { prisma } = await import('@ramu/db');
    await prisma.admin.create({
      data: {
        id: data.user.id, // Sesuaikan ID dengan ID dari Neon Auth
        nama_admin: name,
        email: email,
        password_hash: 'neon_managed', // Password dikelola secara aman oleh Neon Auth
        role: 'Superadmin', // Role default
      },
    });
  } catch (dbError) {
    console.error('Failed to sync admin user to database:', dbError);
    return { error: 'Account created in Auth, but failed to sync to local database.' };
  }

  redirect('/dashboard');
}
