import { prisma } from '@ramu/db';
import AIClient from './ai-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Konsultasi AI - Ramu Kiosk',
};

export default async function AIConsultationPage() {
  const symptomsData = await prisma.symptomOption.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, icon: true, category: true },
  });

  const symptoms = JSON.parse(JSON.stringify(symptomsData));

  return <AIClient symptoms={symptoms} />;
}
