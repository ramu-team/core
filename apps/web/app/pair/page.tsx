import { notFound } from 'next/navigation';
import { prisma } from '@ramu/db';
import ClientPair from './client-pair';

export default async function PairPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ session?: string, menu?: string, consultationId?: string }> 
}) {
  const params = await searchParams;
  const { session, menu, consultationId } = params;
  
  if (!session) {
    return <div className="p-8 text-center text-red-500 font-medium text-lg mt-20">Sesi tidak valid atau telah kadaluarsa. Silakan scan ulang QR Code di Kiosk.</div>;
  }

  let menuData = null;

  if (menu) {
    const dbMenu = await prisma.menu.findUnique({
      where: { id: menu },
      include: {
        recipes: {
          include: { ingredient: true }
        }
      }
    });
    
    if (dbMenu) {
      menuData = {
        name: dbMenu.name,
        description: dbMenu.description,
        image_url: dbMenu.image_url,
        ingredients: dbMenu.recipes.map(r => r.ingredient.name)
      };
    }
  } else if (consultationId) {
    const consultation = await prisma.consultationHistory.findUnique({
      where: { id: consultationId },
    });
    if (consultation && consultation.aiCustomRecipe) {
      const aiData = consultation.aiCustomRecipe as { recipe?: { name?: string, image?: string, description?: string, ingredients?: { name: string }[] } };
      if (aiData.recipe) {
        menuData = {
          name: aiData.recipe.name || 'Rekomendasi Spesial AI',
          description: aiData.recipe.description || 'Jamu khusus untuk mengatasi keluhan Anda.',
          image_url: aiData.recipe.image || null,
          ingredients: (aiData.recipe.ingredients || []).map(ing => ing.name)
        };
      }
    }
  }

  if (!menuData && (menu || consultationId)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      <ClientPair sessionId={session} menu={menuData} />
    </main>
  );
}
