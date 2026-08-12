'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { logAdminAction } from '@/lib/audit';

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

    await logAdminAction({
      adminId: admin.id,
      action: 'GENERATE_ACTIVATION_CODE',
      entity: 'MachineActivationCode',
      details: { activation_code: activationCode, expires_at: expiresAt },
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
    const locationName = (formData.get('location_name') as string)?.trim() || null;
    const status = formData.get('status') as string;
    const cupsStockRaw = formData.get('cupsStock') as string;
    const cupsStock = cupsStockRaw ? parseInt(cupsStockRaw, 10) : 0;
    const tanksRaw = formData.get('tanks') as string;

    let tanksConfig: { tankNumber: number; ingredientId: string; currentVolume: number; maxCapacity: number }[] = [];
    if (tanksRaw) {
      try { tanksConfig = JSON.parse(tanksRaw); } catch (e) { console.error('Failed to parse tanks', e); }
    }

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    if (!machineId) {
      return { error: 'Machine ID is missing.' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.machine.update({
        where: { id: machineId },
        data: { location_name: locationName, status, cups_stock: cupsStock },
      });

      if (tanksConfig.length > 0) {
        await tx.machineStock.deleteMany({ where: { machine_id: machineId } });
        await Promise.all(
          tanksConfig.map(tank => {
            if (!tank.ingredientId) return Promise.resolve();
            return tx.machineStock.create({
              data: {
                machine_id: machineId,
                tankNumber: tank.tankNumber,
                ingredient_id: tank.ingredientId,
                current_volume: tank.currentVolume,
                max_capacity: tank.maxCapacity,
              },
            });
          })
        );
      }
    });

    await logAdminAction({
      adminId: session.user.id,
      action: 'UPDATE_MACHINE',
      entity: 'Machine',
      entityId: machineId,
      details: { location_name: locationName, status, cups_stock: cupsStock },
    });

    revalidatePath('/dashboard/machines');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[saveMachineAction] Error:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}

export async function deleteMachineAction(
  prevState: { error?: string; success?: boolean; timestamp?: number } | null,
  formData: FormData
) {
  void prevState;
  try {
    const machineId = formData.get('machineId') as string;

    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return { error: 'Unauthorized.' };
    }

    if (!machineId) {
      return { error: 'Machine ID is missing.' };
    }

    await prisma.$transaction(async (tx) => {
      // Delete associated machine stocks first to avoid foreign key constraint errors
      await tx.machineStock.deleteMany({ where: { machine_id: machineId } });
      
      // Attempt to delete the machine
      // This might throw if there are orders/consultations tied to it without cascading delete
      await tx.machine.delete({
        where: { id: machineId }
      });
    });

    await logAdminAction({
      adminId: session.user.id,
      action: 'DELETE_MACHINE',
      entity: 'Machine',
      entityId: machineId,
      details: { deletedAt: new Date().toISOString() },
    });

    revalidatePath('/dashboard/machines');
    return { success: true, timestamp: Date.now() };
  } catch (error: unknown) {
    console.error('[deleteMachineAction] Error:', error);
    if (error instanceof Error && error.message.includes('Foreign key constraint failed')) {
      return { error: 'Gagal menghapus mesin: Terdapat riwayat pesanan atau konsultasi yang terkait dengan mesin ini.' };
    }
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred.' };
  }
}
