import { prisma } from '@ramu/db';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import AdminsClient from './admins-client';
import { ShieldAlertIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect('/login');
  }

  const currentUser = await prisma.admin.findUnique({
    where: { id: session.user.id }
  });

  if (!currentUser) {
    redirect('/login');
  }

  const searchParams = await props.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const role = typeof searchParams?.role === 'string' ? searchParams.role : undefined;

  const where: Prisma.AdminWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const admins = await prisma.admin.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <ShieldAlertIcon className="size-8 text-primary" /> User Management
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage system administrators and operators.
        </p>
      </div>

      <AdminsClient initialAdmins={admins} currentUserId={session.user.id} />
    </div>
  );
}
