'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export function IdleTimeoutProvider({ 
  children, 
  timeoutMinutes = 60 
}: { 
  children: React.ReactNode, 
  timeoutMinutes?: number 
}) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      // Clear session from Neon Managed Auth
      await authClient.signOut();
      // Redirect to login with expired flag
      router.push('/login?expired=1');
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, router]);

  useEffect(() => {
    // Setup initial timeout
    resetTimeout();
    
    // Listen to user interactions to reset the timeout
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimeout));
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => document.removeEventListener(event, resetTimeout));
    };
  }, [timeoutMinutes, resetTimeout]); // Re-bind if timeoutMinutes changes

  return <>{children}</>;
}
