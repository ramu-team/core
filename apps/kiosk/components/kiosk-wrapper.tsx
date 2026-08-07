'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useKioskStore } from '@/store/kiosk-store';
import { LoaderIcon, AlertTriangleIcon } from 'lucide-react';
import { getMachineHealthAction } from '@/app/status-actions';

export function KioskWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isRegistered, machineId, locationName, setLocationName } = useKioskStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);

  useEffect(() => {
    // Prevent hydration mismatch by checking after mount
    const t = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(t);
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

  useEffect(() => {
    if (!isHydrated || !machineId || !isRegistered) return;

    let mounted = true;
    const checkHealth = async () => {
      const res = await getMachineHealthAction(machineId);
      if (!mounted) return;

      if (res.error) {
        setMaintenanceMsg('Mesin tidak ditemukan atau terjadi kesalahan server.');
        return;
      }

      if (res.data) {
        if (res.data.location_name && res.data.location_name !== locationName) {
          setLocationName(res.data.location_name);
        }

        if (!res.data.is_registered) {
          setMaintenanceMsg('Mesin ini tidak terdaftar.');
        } else if (res.data.status === 'Offline') {
          setMaintenanceMsg('Mesin Sedang Offline');
        } else if (res.data.status === 'Maintenance') {
          setMaintenanceMsg('Mesin Sedang Dalam Pemeliharaan');
        } else if (res.data.cups_stock <= 0) {
          setMaintenanceMsg('Stok Cup Habis. Silakan hubungi petugas.');
        } else if (res.data.is_ingredients_empty) {
          setMaintenanceMsg('Stok Bahan Habis. Silakan hubungi petugas.');
        } else {
          setMaintenanceMsg(null);
        }
      }
    };

    // Initial check
    checkHealth();

    // Poll every 15 seconds
    const intervalId = setInterval(checkHealth, 15000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [isHydrated, machineId, isRegistered, locationName, setLocationName]);

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
      <style>{`
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
      {maintenanceMsg && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-950/95 backdrop-blur-xl text-center">
          <div className="rounded-full bg-red-500/10 p-8 border border-red-500/20 mb-8 animate-pulse">
            <AlertTriangleIcon className="size-24 text-red-500" />
          </div>
          <h1 className="text-5xl font-serif text-white mb-6 tracking-wide uppercase drop-shadow-lg">
            Mohon Maaf
          </h1>
          <p className="text-2xl text-stone-300 font-light max-w-2xl leading-relaxed">
            {maintenanceMsg}
          </p>
          <div className="mt-16 text-sm text-stone-500 flex items-center gap-3">
            <div className="size-2 rounded-full bg-red-500 animate-ping" />
            Sistem Terkunci
          </div>
        </div>
      )}
      {children}
    </>
  );
}
