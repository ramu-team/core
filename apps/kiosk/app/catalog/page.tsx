import { prisma } from '@ramu/db';
import CatalogClient from './catalog-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Katalog Menu - Ramu Kiosk',
};

export default async function CatalogPage() {
  const menusData = await prisma.menu.findMany({
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

  const menus = JSON.parse(JSON.stringify(menusData));

  return <CatalogClient menus={menus} />;
}
