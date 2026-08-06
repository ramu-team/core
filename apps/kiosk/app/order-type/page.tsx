'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@ramu/ui/components/button';
import Image from 'next/image';

export default function OrderTypePage() {
  const router = useRouter();

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero-bg-traditional.png"
          alt="Background"
          fill
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
        className="relative z-10 mb-8 flex items-center"
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
          className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent"
        >
          <ChevronLeftIcon className="mr-3 size-8" />
          Kembali
        </Button>
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center space-y-12 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="font-serif text-[4.5rem] font-normal tracking-wide text-white drop-shadow-lg">
            Pilih <span className="italic text-amber-400">Jenis Layanan</span>
          </h1>
          <p className="text-2xl font-light text-stone-300">
            Pilih menu langsung atau biarkan AI kami merekomendasikan jamu untuk Anda.
          </p>
        </motion.div>

        {/* 2 Massive Cards Layout (Ultra Simple Design) */}
        <div className="grid w-full max-w-5xl grid-cols-2 gap-12">
          
          {/* Card 1: Katalog Jamu */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/catalog')}
            className="relative flex h-[500px] flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-stone-900/60 p-10 backdrop-blur-xl border border-white/10 active:border-amber-500/50 transition-colors"
          >
            {/* Minimalist Animated SVG: Waving Liquid in Glass */}
            <div className="relative flex-1 flex items-center justify-center w-full">
               <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 opacity-90">
                 {/* Elegant Glass Outline */}
                 <path d="M60 40 L75 150 C77 160 85 165 100 165 C115 165 123 160 125 150 L140 40 Z" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" />
                 
                 {/* Liquid Level (Animated waving) */}
                 <motion.path 
                   animate={{ d: [
                     "M70 100 Q100 90 130 100 L126 145 C125 152 118 155 100 155 C82 155 75 152 74 145 Z",
                     "M70 100 Q100 110 130 100 L126 145 C125 152 118 155 100 155 C82 155 75 152 74 145 Z",
                     "M70 100 Q100 90 130 100 L126 145 C125 152 118 155 100 155 C82 155 75 152 74 145 Z"
                   ]}}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   fill="#f59e0b" fillOpacity="0.1" 
                 />
                 
                 {/* Liquid Top Line (Animated waving) */}
                 <motion.path
                   animate={{ d: [
                     "M70 100 Q100 90 130 100",
                     "M70 100 Q100 110 130 100",
                     "M70 100 Q100 90 130 100"
                   ]}}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.6"
                 />
                 
                 {/* Ambient Steaming/Sparkling Bubbles */}
                 <motion.circle 
                   animate={{ y: [0, -25, -50], opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0 }}
                   cx="90" cy="80" r="3" fill="#fbbf24" 
                 />
                 <motion.circle 
                   animate={{ y: [0, -30, -60], opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
                   cx="110" cy="90" r="2" fill="#fbbf24" 
                 />
               </svg>
            </div>
            
            <div className="text-center space-y-3">
              <h2 className="font-serif text-[2.5rem] font-normal text-amber-400">Katalog Menu</h2>
              <p className="text-lg font-light text-stone-300 leading-relaxed">
                Pilih sendiri racikan jamu kesukaan Anda dari daftar menu kami.
              </p>
            </div>
          </motion.button>

          {/* Card 2: Konsultasi AI */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/ai-consultation')}
            className="relative flex h-[500px] flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-stone-900/60 p-10 backdrop-blur-xl border border-white/10 active:border-amber-500/50 transition-colors"
          >
            {/* Minimalist Animated SVG: Pulsing AI Sparkle/Node */}
            <div className="relative flex-1 flex items-center justify-center w-full">
               <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 opacity-90">
                 {/* Outer Expanding Rings */}
                 <motion.circle 
                   animate={{ r: [30, 70, 30], strokeOpacity: [0.6, 0.1, 0.6] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   cx="100" cy="90" stroke="#fbbf24" strokeWidth="1" 
                 />
                 <motion.circle 
                   animate={{ r: [50, 90, 50], strokeOpacity: [0.3, 0.05, 0.3] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   cx="100" cy="90" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" 
                 />
                 
                 {/* Core AI Sparkle Shape */}
                 <motion.path 
                   animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 90, 180] }}
                   transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                   d="M100 40 C100 80 80 100 40 100 C80 100 100 120 100 160 C100 120 120 100 160 100 C120 100 100 80 100 40 Z" 
                   stroke="#fbbf24" strokeWidth="2.5" fill="#f59e0b" fillOpacity="0.05" 
                 />
                 
                 {/* Center Glowing Processing Core */}
                 <motion.circle 
                   animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                   cx="100" cy="90" r="5" fill="#fbbf24" 
                 />
               </svg>
            </div>
            
            <div className="text-center space-y-3">
              <h2 className="font-serif text-[2.5rem] font-normal text-amber-400">Rekomendasi AI</h2>
              <p className="text-lg font-light text-stone-300 leading-relaxed">
                Ceritakan keluhan Anda dan biarkan AI meracik resep terbaik.
              </p>
            </div>
          </motion.button>

        </div>
      </div>
    </main>
  );
}
