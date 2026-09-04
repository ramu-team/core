import { prisma } from '@ramu/db';
import CatalogClient from './catalog-client';

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ machineId?: string }> }) {
  const params = await searchParams;
  const machineId = params.machineId;

  const menus = await prisma.menu.findMany({
    include: {
      recipes: {
        include: { ingredient: true }
      }
    }
  });

  let machineStocks: Record<string, number> = {};

  if (machineId) {
    const stocks = await prisma.machineStock.findMany({
      where: { machine_id: machineId }
    });
    stocks.forEach(stock => {
      machineStocks[stock.ingredient_id] = stock.current_volume;
    });
  }

  const formattedMenus = menus.map(m => {
    let isAvailable = m.isActive;
    
    // Jika ada machineId, periksa apakah stok mesin mencukupi untuk setiap bahan
    if (machineId && isAvailable) {
      for (const recipe of m.recipes) {
        const availableStock = machineStocks[recipe.ingredient_id] || 0;
        if (availableStock < recipe.amountMl) {
          isAvailable = false;
          break;
        }
      }
    }

    return {
      id: m.id,
      name: m.name,
      description: m.description,
      price: m.price.toNumber(),
      image_url: m.image_url,
      isAvailable,
      recipes: m.recipes.map(r => ({
        id: r.id,
        amountMl: r.amountMl,
        ingredient: { name: r.ingredient.name }
      }))
    };
  });

  return (
    <main className="min-h-screen bg-stone-950 text-white pb-12">
      <CatalogClient menus={formattedMenus} />
    </main>
  );
}
