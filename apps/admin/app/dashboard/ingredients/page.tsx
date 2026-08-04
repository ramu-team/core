import { prisma } from '@ramu/db';
import IngredientsClient from './ingredients-client';

// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { nama_bahan: 'asc' },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bahan Baku</h1>
        <p className="text-muted-foreground">
          Manage raw liquid bases and measurement configurations.
        </p>
      </div>
      <IngredientsClient initialIngredients={ingredients} />
    </div>
  );
}
