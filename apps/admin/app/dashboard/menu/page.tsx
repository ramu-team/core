import { prisma } from '@ramu/db';
import MenuClient from './menu-client';

// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [menus, ingredients] = await Promise.all([
    prisma.menu.findMany({
      include: {
        recipes: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { nama_jamu: 'asc' },
    }),
    prisma.ingredient.findMany({
      orderBy: { nama_bahan: 'asc' },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Katalog Jamu</h1>
        <p className="text-muted-foreground">
          Configure available Jamu products and define liquid compound recipes.
        </p>
      </div>
      <MenuClient initialMenus={menus} ingredientsList={ingredients} />
    </div>
  );
}
