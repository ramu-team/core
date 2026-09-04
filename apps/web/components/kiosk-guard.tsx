'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import { Loader2Icon } from 'lucide-react';

export default function KioskGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeSessionId } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!activeSessionId) {
      router.replace('/app');
    }
  }, [activeSessionId, router]);

  if (!mounted || !activeSessionId) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2Icon className="size-10 text-amber-500 animate-spin mb-4" />
        <p className="text-stone-400">Memeriksa koneksi Kiosk...</p>
      </div>
    );
  }

  return <>{children}</>;
}
