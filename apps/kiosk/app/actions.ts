'use server'

import { prisma } from '@ramu/db'

export async function activateMachineAction(activationCode: string) {
  try {
    // 1. Find activation code
    const codeRecord = await prisma.machineActivationCode.findUnique({
      where: { activation_code: activationCode },
    });

    if (!codeRecord) {
      return { error: 'Kode aktivasi tidak valid atau tidak ditemukan.' };
    }

    if (codeRecord.is_used) {
      return { error: 'Kode aktivasi ini sudah digunakan oleh mesin lain.' };
    }

    if (codeRecord.expires_at && codeRecord.expires_at < new Date()) {
      return { error: 'Kode aktivasi ini sudah kedaluwarsa.' };
    }

    // 2. Mark code as used and create new Machine data
    // We use transaction to ensure consistency
    const machine = await prisma.$transaction(async (tx) => {
      // Mark code as used
      const updatedCode = await tx.machineActivationCode.update({
        where: { id: codeRecord.id },
        data: { is_used: true },
      });

      // Create new machine
      // generate random registration code e.g. RMU-MACHINE-XYZ
      const regCode = `RMU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newMachine = await tx.machine.create({
        data: {
          registration_code: regCode,
          is_registered: true,
          status: 'Online',
        },
      });

      // Link code with machine
      await tx.machineActivationCode.update({
        where: { id: updatedCode.id },
        data: { used_by_machine_id: newMachine.id },
      });

      return newMachine;
    });

    return { 
      success: true, 
      machine: {
        id: machine.id,
        registration_code: machine.registration_code,
        location_name: machine.location_name
      } 
    };

  } catch (error) {
    console.error('Activation error:', error);
    return { error: 'Terjadi kesalahan sistem saat aktivasi.' };
  }
}

export async function deductCupAction(machineId: string) {
  try {
    const machine = await prisma.machine.findUnique({ where: { id: machineId } });
    if (machine && machine.cups_stock > 0) {
      await prisma.machine.update({
        where: { id: machineId },
        data: { cups_stock: { decrement: 1 } }
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Deduct cup error:', error);
    return { error: 'Gagal mengurangi stok cup.' };
  }
}
