import { auth } from '@/lib/auth/server';
import HistoryClient from './history-client';

export default async function HistoryPage() {
  const { data: session } = await auth.getSession();

  return (
    <main className="min-h-screen bg-stone-950 text-white pb-12">
      <HistoryClient user={session?.user || null} />
    </main>
  );
}
