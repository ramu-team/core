'use client';

import { useRouter } from 'next/navigation';
import { useKioskStore } from '@/store/kiosk-store';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HandIcon } from 'lucide-react';
import Image from 'next/image';

export default function IdleScreen() {
  const router = useRouter();
  const { locationName, registrationCode } = useKioskStore();

  const handleTouch = () => {
    router.push('/mode-selection');
  };

  useEffect(() => {
    router.prefetch('/mode-selection');
  }, [router]);

  return (
    <main
      onClick={handleTouch}
      className="relative flex h-screen w-screen cursor-pointer flex-col overflow-hidden bg-stone-950"
    >
      {/* 1. Fullscreen Hero Image with Cinematic Ken Burns Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="relative h-full w-full"
        >
          <Image
            src="/hero-bg-traditional.png"
            alt="Premium Jamu Background"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        
        {/* Soft, simple gradient for text legibility on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />
        
        {/* Independent Animation: Elegant, Ultra-Thin Geometric Guilloche (Luxury Watch Style) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-start pl-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="opacity-[0.15] text-amber-500/80 mix-blend-screen"
          >
            <svg width="1200" height="1200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer orbit */}
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.15" strokeDasharray="0.5 1" />
              
              {/* Guilloche / Spirograph pattern (overlapping ellipses) */}
              {[...Array(24)].map((_, i) => (
                <ellipse 
                  key={i} 
                  cx="50" 
                  cy="50" 
                  rx="45" 
                  ry="6" 
                  transform={`rotate(${i * 15} 50 50)`} 
                  stroke="currentColor" 
                  strokeWidth="0.1" 
                />
              ))}
              
              {/* Inner focus ring */}
              <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* 2. Left-Aligned, Proportional Layout */}
      <div className="relative z-10 flex h-full flex-col justify-center px-40 max-w-7xl">
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Simple, Elegant Tagline */}
          <div className="inline-flex items-center gap-4 border-b border-amber-500/50 pb-2">
            <span className="text-xl font-medium tracking-[0.2em] text-amber-500 uppercase drop-shadow-md">
              Ramu
            </span>
          </div>

          {/* Clean, Massive Heading */}
          <h1 className="font-serif text-[6.5rem] leading-[1.1] font-normal text-white drop-shadow-xl">
            Rasa Baru,<br />
            <span className="text-amber-400">Tradisi Lama.</span>
          </h1>
          
          <p className="text-2xl font-light text-stone-300 max-w-lg leading-relaxed mt-2">
            Nikmati kesegaran jamu racikan modern langsung dari smart dispenser.
          </p>
        </motion.div>

        {/* Proportional, Premium CTA with Shine/Sweep Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16"
        >
          <div className="relative inline-flex overflow-hidden rounded-full p-[2px] bg-gradient-to-r from-amber-500/50 via-amber-200/80 to-amber-500/50">
            {/* The sweeping light (Shimmer) */}
            <motion.div
              animate={{ x: ['-200%', '300%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute inset-0 z-20 w-1/3 skew-x-[45deg] bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            
            <button className="relative z-10 inline-flex items-center gap-6 rounded-full bg-stone-950 px-12 py-5 transition-all hover:bg-stone-900 active:scale-[0.98]">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                <HandIcon className="size-7 text-amber-500" strokeWidth={2} />
              </div>
              <span className="text-3xl font-bold tracking-wide text-amber-500 uppercase">
                Sentuh Untuk Memulai
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Simple Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-16 left-40 z-10 flex items-center gap-6 opacity-60"
      >
        <div className="flex items-center gap-3">
          <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-base font-medium text-stone-300">Siap Melayani</span>
        </div>
        <div className="h-4 w-px bg-stone-500" />
        <span className="text-base font-medium text-stone-300">{locationName || "Location Not Set"}</span>
      </motion.div>
    </main>
  );
}
