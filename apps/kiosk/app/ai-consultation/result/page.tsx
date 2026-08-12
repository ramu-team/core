import { prisma } from '@ramu/db';
import { notFound } from 'next/navigation';
import ResultClient from './result-client';

export default async function AIResultPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  const consultationId = params.id;
  
  if (!consultationId) {
    notFound();
  }

  const consultation = await prisma.consultationHistory.findUnique({
    where: { id: consultationId }
  });

  if (!consultation || !consultation.recommendedMenuId) {
    notFound();
  }

  const aiData = consultation.aiCustomRecipe as { explanation?: string };
  const explanation = aiData?.explanation || "Sistem AI menyarankan menu ini untuk mengatasi keluhan Anda.";

  const menu = await prisma.menu.findUnique({
    where: { id: consultation.recommendedMenuId },
    include: {
      recipes: {
        include: { ingredient: true }
      }
    }
  });

  if (!menu) {
    notFound();
  }

  const recipeWithNames = menu.recipes.map((r) => ({
    ingredient_id: r.ingredient_id,
    name: r.ingredient.name,
    amountMl: r.amountMl
  }));

  return (
    <ResultClient 
      consultationId={consultation.id}
      menuId={menu.id}
      explanation={explanation}
      recipe={{
        name: menu.name,
        description: menu.description || '',
        price: Number(menu.price),
        image: menu.image_url,
        ingredients: recipeWithNames
      }} 
    />
  );
}
