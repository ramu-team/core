'use server'

import { prisma } from '@ramu/db'

export async function activateMachineAction(activationCode: string) {
  try {
    // 1. Cari kode aktivasi
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

    // 2. Tandai kode terpakai dan buat data Mesin baru
    // Kita gunakan transaksi agar konsisten
    const machine = await prisma.$transaction(async (tx) => {
      // Tandai kode terpakai
      const updatedCode = await tx.machineActivationCode.update({
        where: { id: codeRecord.id },
        data: { is_used: true },
      });

      // Buat mesin baru
      // generate random registration code e.g. RMU-MACHINE-XYZ
      const regCode = `RMU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newMachine = await tx.machine.create({
        data: {
          registration_code: regCode,
          is_registered: true,
          status: 'Online',
        },
      });

      // Hubungkan kode dengan mesin
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

  } catch (error: any) {
    console.error('Activation error:', error);
    return { error: 'Terjadi kesalahan sistem saat aktivasi.' };
  }
}
