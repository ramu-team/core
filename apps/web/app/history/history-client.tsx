'use client';

import { useUserStore, OrderHistoryItem } from '@/store/user-store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@ramu/ui/components/button';
import { ChevronLeftIcon, LogInIcon, LogOutIcon, HistoryIcon, BookOpenIcon, SparklesIcon, Loader2Icon } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { getUserHistory, syncLocalHistory } from '@/app/actions/history-actions';

interface UserProps {
  name?: string | null;
  email?: string | null;
}

export default function HistoryClient({ user }: { user: UserProps | null }) {
  const router = useRouter();
  const { history: localHistory, activeMachineId, clearHistory } = useUserStore();
  const [dbHistory, setDbHistory] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      if (user) {
        setIsLoading(true);
        // Sync first if we have local history
        if (localHistory.length > 0) {
          setIsSyncing(true);
          const res = await syncLocalHistory(localHistory, activeMachineId || 'unknown');
          if (res.success) {
            clearHistory(); // clear local after sync
          }
          setIsSyncing(false);
        }
        
        // Fetch fresh from DB
        const dbData = await getUserHistory();
        setDbHistory(dbData);
        setIsLoading(false);
      }
    }
    loadHistory();
  }, [user, localHistory, activeMachineId, clearHistory]);

  const displayHistory = user ? dbHistory : localHistory;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-4 py-4 shadow-sm border-b border-white/5">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full text-stone-300 hover:text-white hover:bg-white/10">
          <ChevronLeftIcon className="size-6" />
        </Button>
        <h1 className="text-xl font-serif font-bold ml-2 text-white">Riwayat Saya</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6 max-w-md mx-auto w-full relative z-10">
        {/* Auth Section */}
        <div className="bg-gradient-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-white/5 text-center">
          {user ? (
            <div className="space-y-5">
              <div className="size-16 bg-amber-500/20 rounded-full mx-auto flex items-center justify-center text-amber-500 text-2xl font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30">
                {user.name?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-white">{user.name}</h2>
                <p className="text-stone-400 text-sm mt-1">{user.email}</p>
                {isSyncing && <p className="text-amber-500 text-xs mt-2 animate-pulse">Menyinkronkan riwayat...</p>}
              </div>
              <Button
                variant="outline"
                className="w-full text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 rounded-xl h-12"
                onClick={() => {
                  authClient.signOut();
                  window.location.reload();
                }}
              >
                <LogOutIcon className="size-5 mr-2" /> Keluar
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="size-16 bg-stone-800/80 rounded-full mx-auto flex items-center justify-center text-stone-400 border border-white/5 shadow-inner">
                <HistoryIcon className="size-8" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-normal text-white">Lazy Register</h2>
                <p className="text-stone-400 text-sm mt-2 font-light leading-relaxed">
                  Riwayat Anda saat ini disimpan sementara di perangkat.
                  Masuk dengan Google untuk menyimpannya secara permanen.
                </p>
              </div>
              <Button
                className="w-full bg-white hover:bg-stone-200 text-stone-950 rounded-xl h-12 font-bold shadow-[0_5px_15px_rgba(255,255,255,0.1)]"
                onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/history' })}
              >
                <LogInIcon className="size-5 mr-2" /> Masuk dengan Google
              </Button>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="pt-4">
          <h2 className="text-xl font-serif text-white mb-4 px-2 tracking-wide drop-shadow-md flex items-center gap-2">
            Riwayat Pesanan
            {isLoading && <Loader2Icon className="size-4 animate-spin text-stone-500" />}
          </h2>

          {!isLoading && displayHistory.length === 0 ? (
            <div className="bg-stone-900/40 rounded-2xl p-8 text-center text-stone-500 border border-white/10 border-dashed backdrop-blur-sm">
              Belum ada riwayat pesanan.
            </div>
          ) : (
            <div className="space-y-4">
              {displayHistory.map(item => (
                <div key={item.id} className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-[1.5rem] p-5 shadow-lg border border-white/5 flex gap-4 backdrop-blur-md transition-transform hover:scale-[1.02]">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    item.type === 'ai' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                  }`}>
                    {item.type === 'ai' ? <SparklesIcon className="size-6" /> : <BookOpenIcon className="size-6" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-white truncate text-lg">{item.title}</h3>
                    <p className="text-stone-400 text-sm line-clamp-2 mt-1 font-light">{item.description}</p>
                    <p className="text-stone-500 text-xs mt-3 font-mono">
                      {new Date(item.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
