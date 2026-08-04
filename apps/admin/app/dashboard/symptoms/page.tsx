import { prisma } from '@ramu/db';
import SymptomsClient from './symptoms-client';

// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function SymptomsPage() {
  const symptoms = await prisma.symptomOption.findMany({
    orderBy: { nama_gejala: 'asc' },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pilihan Gejala</h1>
        <p className="text-muted-foreground">
          Configure symptoms catalog offered during customer consultations.
        </p>
      </div>
      <SymptomsClient initialSymptoms={symptoms} />
    </div>
  );
}
