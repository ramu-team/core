'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/app';
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({ 
        provider: "google", 
        callbackURL: redirectUrl 
      });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <Link href={redirectUrl} className="absolute top-6 left-6 z-20 flex items-center gap-1 text-stone-400 hover:text-amber-500 transition-colors">
        <ChevronLeftIcon className="size-5" />
        <span className="text-sm font-semibold">Kembali</span>
      </Link>

      <div className="w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-amber-500 font-bold tracking-wider mb-2">Ramu</h1>
          <p className="text-stone-400 text-sm">Masuk untuk menyimpan riwayat pesanan Anda.</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-100 text-stone-900 px-6 py-4 rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.7 17.57V20.34H19.27C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.27 20.34L15.7 17.57C14.72 18.23 13.47 18.63 12 18.63C9.15 18.63 6.74 16.71 5.86 14.12H2.18V16.97C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.86 14.12C5.63 13.45 5.5 12.74 5.5 12C5.5 11.26 5.63 10.55 5.86 9.88V7.03H2.18C1.43 8.5 1 10.2 1 12C1 13.8 1.43 15.5 2.18 16.97L5.86 14.12Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.03L5.86 9.88C6.74 7.29 9.15 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
          )}
          <span>Lanjutkan dengan Google</span>
        </button>
        
        <p className="mt-8 text-xs text-stone-500 font-light leading-relaxed">
          Dengan masuk, riwayat pesanan (Lazy Registration) Anda akan disimpan secara permanen ke akun ini.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-amber-500"><Loader2Icon className="animate-spin size-8" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
