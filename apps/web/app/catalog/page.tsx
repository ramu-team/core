import { prisma } from '@ramu/db';
import CatalogClient from './catalog-client';

export default async function CatalogPage() {
  const menus = await prisma.menu.findMany({
    include: {
      recipes: {
        include: { ingredient: true }
      }
    }
  });

  const formattedMenus = menus.map(m => ({
    id: m.id,
    name: m.name,
    description: m.description,
    price: m.price.toNumber(),
    image_url: m.image_url,
    isAvailable: m.isActive,
    recipes: m.recipes.map(r => ({
      id: r.id,
      amountMl: r.amountMl,
      ingredient: { name: r.ingredient.name }
    }))
  }));

  return (
    <main className="min-h-screen bg-stone-950 text-white pb-12">
      <CatalogClient menus={formattedMenus} />
    </main>
  );
}
