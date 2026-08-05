import { prisma } from '@ramu/db';
import { Prisma } from '@prisma/client';
import IngredientsClient from './ingredients-client';
import { FlaskConicalIcon } from 'lucide-react';

export const metadata = {
  title: "Ingredients",
}


// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function IngredientsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;

  const where: Prisma.IngredientWhereInput = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const ingredients = await prisma.ingredient.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <FlaskConicalIcon className="size-8 text-primary" /> Raw Ingredients
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage raw liquid bases and measurement configurations.
        </p>
      </div>
      <IngredientsClient initialIngredients={ingredients} />
    </div>
  );
}
