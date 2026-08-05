import { prisma } from '@ramu/db';
import { Prisma } from '@prisma/client';
import MenuClient from './menu-client';

import { CupSodaIcon } from 'lucide-react';

export const metadata = {
  title: "Menu",
}


// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function MenuPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const isActive = typeof searchParams?.isActive === 'string' ? searchParams.isActive : undefined;

  const where: Prisma.MenuWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [menus, ingredients] = await Promise.all([
    prisma.menu.findMany({
      where,
      include: {
        recipes: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const serializedMenus = menus.map(menu => ({
    ...menu,
    price: Number(menu.price),
  }));

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <CupSodaIcon className="size-8 text-primary" /> Jamu Catalog
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Configure available Jamu products and define liquid compound recipes.
        </p>
      </div>
      <MenuClient initialMenus={serializedMenus} ingredientsList={ingredients} />
    </div>
  );
}
