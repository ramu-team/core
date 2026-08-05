import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';
import { UserCircleIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
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

  return (
    <div className="flex flex-col gap-8 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
          <UserCircleIcon className="size-8 text-primary" /> My Profile
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your personal settings.
        </p>
      </div>

      <ProfileClient initialProfile={currentUser} />
    </div>
  );
}
