import { prisma } from '@ramu/db';
import AIClient from './ai-client';

export default async function AIConsultationPage() {
  const symptoms = await prisma.symptomOption.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <main className="min-h-screen bg-stone-950 text-white pb-12">
      <AIClient symptoms={symptoms} />
    </main>
  );
}
