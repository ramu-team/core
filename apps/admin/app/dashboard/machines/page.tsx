import { prisma } from '@ramu/db';
import { Prisma } from '@prisma/client';
import MachinesClient from './machines-client';
import { CpuIcon } from 'lucide-react';

export const metadata = {
  title: "Machines",
}


// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function MachinesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Clean up expired codes
  await prisma.machineActivationCode.deleteMany({
    where: {
      is_used: false,
      expires_at: { lt: new Date() },
    },
  });

  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const status = typeof searchParams?.status === 'string' ? searchParams.status : undefined;
  const is_registered = typeof searchParams?.is_registered === 'string' ? searchParams.is_registered : undefined;

  const where: Prisma.MachineWhereInput = {};
  if (search) {
    where.OR = [
      { registration_code: { contains: search, mode: 'insensitive' } },
      { location_name: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status;
  }
  if (is_registered !== undefined) {
    where.is_registered = is_registered === 'true';
  }

  const [machines, codes, ingredients] = await Promise.all([
    prisma.machine.findMany({
      where,
      include: {
        stocks: {
          include: { ingredient: true },
          orderBy: { tankNumber: 'asc' },
        },
      },
      orderBy: { registration_code: 'asc' },
    }),
    prisma.machineActivationCode.findMany({
      include: {
        generated_by: {
          select: { name: true },
        },
        used_by_machine: {
          select: { registration_code: true },
        },
      },
      orderBy: { expires_at: 'desc' },
      take: 20,
    }),
    prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <CpuIcon className="size-8 text-primary" /> IoT Machines
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Monitor your IoT dispensers, update locations, and generate codes for machine setup.
        </p>
      </div>
      <MachinesClient initialMachines={machines} initialCodes={codes} ingredientsList={ingredients} />
    </div>
  );
}
