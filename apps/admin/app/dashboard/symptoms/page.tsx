import { prisma } from '@ramu/db';
import { Prisma } from '@prisma/client';
import SymptomsClient from './symptoms-client';
import { ActivityIcon } from 'lucide-react';

export const metadata = {
  title: "Symptoms",
}


// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function SymptomsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const isActive = typeof searchParams?.isActive === 'string' ? searchParams.isActive : undefined;

  const where: Prisma.SymptomOptionWhereInput = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }
  if (category) {
    where.category = category;
  }
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const symptoms = await prisma.symptomOption.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <ActivityIcon className="size-8 text-primary" /> Symptom Options
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Configure symptoms catalog offered during customer consultations.
        </p>
      </div>
      <SymptomsClient initialSymptoms={symptoms} />
    </div>
  );
}
