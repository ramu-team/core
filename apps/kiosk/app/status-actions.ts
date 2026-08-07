'use server'

import { prisma } from '@ramu/db'
import { unstable_noStore as noStore } from 'next/cache'
import { fetchMachineMenusAction } from './catalog/actions'

export async function getMachineHealthAction(machineId: string) {
  noStore();
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: machineId },
      select: {
        status: true,
        cups_stock: true,
        is_registered: true,
        location_name: true,
      },
    });

    if (!machine) {
      return { error: 'Machine not found' };
    }

    const menusRes = await fetchMachineMenusAction(machineId);
    // It's empty if menus were fetched successfully, menus exist in DB, but NONE of them are available
    const is_ingredients_empty = menusRes.success && menusRes.data && menusRes.data.length > 0 && !menusRes.data.some(m => m.isAvailable);

    return { success: true, data: { ...machine, is_ingredients_empty } };
  } catch (error) {
    console.error('Failed to get machine health:', error);
    return { error: 'Failed to fetch machine health' };
  }
}
