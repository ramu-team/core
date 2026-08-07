'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@ramu/ui/components/button';
import Image from 'next/image';

export default function ModeSelectionPage() {
  const router = useRouter();

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero-bg-traditional.png"
          alt="Background"
          fill
          sizes="100vw"
          className="object-cover object-center scale-105 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-stone-950/80" />
        
        {/* Consistent Independent Animation: Elegant Guilloche */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-start pl-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="opacity-[0.10] text-amber-500/80 mix-blend-screen"
          >
            <svg width="1200" height="1200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.15" strokeDasharray="0.5 1" />
              {[...Array(24)].map((_, i) => (
                <ellipse key={i} cx="50" cy="50" rx="45" ry="6" transform={`rotate(${i * 15} 50 50)`} stroke="currentColor" strokeWidth="0.1" />
              ))}
              <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Top Navigation / Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 left-16 z-50 flex items-center"
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.push('/')}
          className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent"
        >
          <ChevronLeftIcon className="mr-3 size-8" />
          Kembali
        </Button>
      </motion.div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="font-serif text-[4.5rem] font-normal tracking-wide text-white drop-shadow-lg">
            Pilih <span className="italic text-amber-400">Cara Memesan</span>
          </h1>
          <p className="text-2xl font-light text-stone-300">
            Pesan langsung di layar ini, atau gunakan smartphone Anda untuk privasi.
          </p>
        </motion.div>

        {/* 2 Massive Cards Layout (Matching Catalog Design) */}
        <div className="grid w-full max-w-5xl grid-cols-2 gap-12">
          
          {/* Card 1: Layar Mesin (Kiosk Chassis) */}
          <motion.button
            onClick={() => router.push('/order-type')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="w-full text-left relative flex flex-col overflow-hidden rounded-[3rem] bg-gradient-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-[2px] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer outline-none focus:outline-none"
          >
            {/* Top Visual Container */}
            <div className="relative w-full h-[280px] bg-stone-950 shrink-0 overflow-hidden flex items-center justify-center">
               <Image src="/img-mode-screen.png" alt="Layar Mesin" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-40" />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
               <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 opacity-90 drop-shadow-2xl">
                 <rect x="70" y="40" width="60" height="140" rx="4" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.4" />
                 <rect x="40" y="20" width="120" height="130" rx="12" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
                 <motion.rect animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} x="45" y="25" width="110" height="120" rx="8" fill="#fbbf24" />
                 <rect x="55" y="35" width="90" height="30" rx="6" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
                 <motion.rect animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} x="55" y="35" width="90" height="30" rx="6" fill="#fbbf24" />
                 <rect x="55" y="75" width="40" height="40" rx="6" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
                 <rect x="105" y="75" width="40" height="40" rx="6" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
                 <motion.circle animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} cx="100" cy="130" r="4" fill="#fbbf24" />
               </svg>
            </div>
            
            {/* Bottom Content Container */}
            <div className="flex flex-1 flex-col p-8 pt-6 h-[220px]">
              <div className="mb-4">
                <h2 className="font-serif text-[2.5rem] leading-none text-white drop-shadow-md mb-3">
                  Layar Mesin
                </h2>
                <p className="text-xl text-stone-400 font-light leading-snug">
                  Eksplorasi menu dan bayar langsung dari layar ini.
                </p>
              </div>

              <div className="mt-auto pt-2 relative">
                <motion.div animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.02, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" />
                <div className="relative pointer-events-none">
                  <div
                    className="flex items-center justify-center h-20 w-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[1.4rem] tracking-wide font-extrabold text-stone-950 shadow-[0_5px_20px_rgba(251,191,36,0.3)] border-b-[5px] border-amber-700"
                  >
                    GUNAKAN LAYAR
                  </div>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Card 2: Smartphone */}
          <motion.button
            onClick={() => router.push('/paired')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="w-full text-left relative flex flex-col overflow-hidden rounded-[3rem] bg-gradient-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-[2px] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-pointer outline-none focus:outline-none"
          >
            {/* Top Visual Container */}
            <div className="relative w-full h-[280px] bg-stone-950 shrink-0 overflow-hidden flex items-center justify-center">
               <Image src="/img-mode-phone.png" alt="Smartphone" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-40" />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
               <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 opacity-90 drop-shadow-2xl">
                 <defs>
                   <linearGradient id="laserGlow" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                     <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
                   </linearGradient>
                 </defs>
                 <rect x="65" y="25" width="70" height="150" rx="14" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
                 <rect x="70" y="30" width="60" height="140" rx="8" fill="#f59e0b" fillOpacity="0.05" />
                 <rect x="80" y="75" width="40" height="40" rx="4" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 4" />
                 <motion.line animate={{ y1: [75, 115, 75], y2: [75, 115, 75] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} x1="75" x2="125" stroke="#fbbf24" strokeWidth="2" strokeOpacity="0.9" />
                 <motion.rect animate={{ y: [55, 95, 55] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} x="75" width="50" height="20" fill="url(#laserGlow)" />
               </svg>
            </div>
            
            {/* Bottom Content Container */}
            <div className="flex flex-1 flex-col p-8 pt-6 h-[220px]">
              <div className="mb-4">
                <h2 className="font-serif text-[2.5rem] leading-none text-white drop-shadow-md mb-3">
                  Smartphone
                </h2>
                <p className="text-xl text-stone-400 font-light leading-snug">
                  Scan QR Code untuk melanjutkan di perangkat Anda secara privat.
                </p>
              </div>

              <div className="mt-auto pt-2 relative">
                <motion.div animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.02, 0.95] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" />
                <div className="relative pointer-events-none">
                  <div
                    className="flex items-center justify-center h-20 w-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[1.4rem] tracking-wide font-extrabold text-stone-950 shadow-[0_5px_20px_rgba(251,191,36,0.3)] border-b-[5px] border-amber-700"
                  >
                    GUNAKAN SMARTPHONE
                  </div>
                </div>
              </div>
            </div>
          </motion.button>

        </div>
      </div>
    </main>
  );
}
