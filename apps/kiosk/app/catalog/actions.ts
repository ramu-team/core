'use server'

import { prisma } from '@ramu/db'
import { unstable_noStore as noStore } from 'next/cache'

export async function fetchMachineMenusAction(machineId: string) {
  noStore();
  try {
    const menus = await prisma.menu.findMany({
      where: { isActive: true },
      include: {
        recipes: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const stocks = await prisma.machineStock.findMany({
      where: { machine_id: machineId },
    });

    // Map ingredients available in this specific machine
    const stockMap = new Map<string, number>();
    stocks.forEach(stock => {
      stockMap.set(stock.ingredient_id, stock.current_volume);
    });

    // Compute availability for each menu
    const processedMenus = menus.map(menu => {
      let isAvailable = true;
      if (menu.recipes.length === 0) {
        isAvailable = false; // Cannot brew a menu with no ingredients
      } else {
        for (const recipe of menu.recipes) {
          const availableVolume = stockMap.get(recipe.ingredient_id) || 0;
          if (availableVolume < recipe.amountMl) {
            isAvailable = false;
            break;
          }
        }
      }

      return {
        ...menu,
        price: Number(menu.price),
        isAvailable
      };
    });

    // Sort: Available first, then alphabetically
    processedMenus.sort((a, b) => {
      if (a.isAvailable === b.isAvailable) {
        return a.name.localeCompare(b.name);
      }
      return a.isAvailable ? -1 : 1;
    });

    return { success: true, data: processedMenus };
  } catch (error) {
    console.error('Failed to fetch machine menus:', error);
    return { error: 'Failed to fetch menus' };
  }
}
