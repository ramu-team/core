'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

// Generate random unique alphanumeric code (e.g. RAMU-8X2F)
function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RAMU-${result}`;
}

export async function generateActivationCodeAction() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized: Admin session not found.' };
  }

  // Create code linked to the current Admin
  try {
    const activation_code = generateRandomCode();

    // Sinkronisasi/Verifikasi profil admin sebelum insert untuk menghindari FK Constraint error
    const adminExists = await prisma.admin.findUnique({
      where: { id: session.user.id },
    });

    if (!adminExists) {
      await prisma.admin.create({
        data: {
          id: session.user.id,
          nama_admin: session.user.name || "Admin",
          email: session.user.email || "admin@ramu.com",
          password_hash: "neon_managed",
          role: "Superadmin",
        },
      });
    }

    await prisma.machineActivationCode.create({
      data: {
        activation_code,
        generated_by_id: session.user.id,
        is_used: false,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expirasi 24 Jam
      },
    });

    revalidatePath('/dashboard/machines');
    return { success: true, code: activation_code };
  } catch (error: any) {
    console.error('Error generating activation code:', error);
    return { error: error.message || 'Failed to generate activation code.' };
  }
}

export async function updateMachineLocationAction(machineId: string, locationName: string) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return { error: 'Unauthorized.' };
  }

  try {
    await prisma.machine.update({
      where: { id: machineId },
      data: { location_name: locationName },
    });

    revalidatePath('/dashboard/machines');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating machine location:', error);
    return { error: error.message || 'Failed to update machine location.' };
  }
}
