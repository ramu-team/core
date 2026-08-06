'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useKioskStore } from '@/store/kiosk-store';
import { LoaderIcon } from 'lucide-react';

export function KioskWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isRegistered } = useKioskStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch by checking after mount
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Route guards
    if (!isRegistered && pathname !== '/setup') {
      router.replace('/setup');
    } else if (isRegistered && pathname === '/setup') {
      router.replace('/');
    }
  }, [isRegistered, pathname, router, isHydrated]);

  if (!isHydrated) {
    // Show splash screen while hydrating from local storage
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-950 text-amber-500">
        <LoaderIcon className="size-10 animate-spin" />
      </div>
    );
  }

  // Hide scrollbar globally for Kiosk mode, prevent text selection
  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          user-select: none; /* Prevent text selection on touch screens */
          -webkit-user-select: none;
          overscroll-behavior: none; /* Prevent pull-to-refresh on mobile/tablet */
        }
      `}</style>
      {children}
    </>
  );
}
