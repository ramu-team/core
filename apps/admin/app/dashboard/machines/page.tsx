import { prisma } from '@ramu/db';
import MachinesClient from './machines-client';

// Force Next.js to dynamically fetch data on each request
export const dynamic = 'force-dynamic';

export default async function MachinesPage() {
  const [machines, codes] = await Promise.all([
    prisma.machine.findMany({
      orderBy: { registration_code: 'asc' },
    }),
    prisma.machineActivationCode.findMany({
      include: {
        generated_by: {
          select: { nama_admin: true },
        },
        used_by_machine: {
          select: { registration_code: true },
        },
      },
      orderBy: { expires_at: 'desc' },
      take: 20,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mesin IoT</h1>
        <p className="text-muted-foreground">
          Monitor your IoT dispensers, update locations, and generate codes for machine setup.
        </p>
      </div>
      <MachinesClient initialMachines={machines} initialCodes={codes} />
    </div>
  );
}
