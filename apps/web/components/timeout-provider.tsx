'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'next/navigation';

export function TimeoutProvider({ children }: { children: React.ReactNode }) {
  const updateActivity = useUserStore((state) => state.updateActivity);
  const checkTimeout = useUserStore((state) => state.checkTimeout);
  const router = useRouter();

  useEffect(() => {
    // Check timeout every 10 seconds
    const intervalId = setInterval(() => {
      if (checkTimeout()) {
        router.push('/');
      }
    }, 10000);

    const handleActivity = () => updateActivity();

    // Attach listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, handleActivity));

    return () => {
      clearInterval(intervalId);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [updateActivity, checkTimeout, router]);

  // If there is no active session and we are not on the root page, redirect to root
  // We can't easily check pathname here without usePathname, so we will handle that in a separate AuthGuard if needed.
  
  return <>{children}</>;
}
