'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

export async function generateActivationCodeAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  void formData;
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
    if (!admin) {
      return { error: 'Admin account not found in database.' };
    }

    const activationCode = `RAMU-${randomBytes(2).toString('hex').toUpperCase()}`;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await prisma.machineActivationCode.create({
      data: {
        activation_code: activationCode,
        is_used: false,
        expires_at: expiresAt,
        generated_by_id: admin.id,
      },
    });

    revalidatePath('/dashboard/machines');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[generateActivationCodeAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function saveMachineAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const machineId = formData.get('machineId') as string;
    const locationName = (formData.get('locationName') as string)?.trim() || null;
    const status = formData.get('status') as string;

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    if (!machineId) {
      return { error: 'Machine ID is missing.' };
    }

    await prisma.machine.update({
      where: { id: machineId },
      data: { location_name: locationName, status },
    });

    revalidatePath('/dashboard/machines');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[saveMachineAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}
