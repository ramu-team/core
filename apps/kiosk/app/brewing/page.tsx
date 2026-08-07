'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { deductCupAction } from '../actions';
import { useKioskStore } from '@/store/kiosk-store';

export default function BrewingScreenPage() {
  const router = useRouter();
  const { machineId } = useKioskStore();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Menyiapkan gelas...');

  useEffect(() => {
    // -------------------------------------------------------------
    // SIMULATING HARDWARE MACHINE PROGRESS
    // -------------------------------------------------------------
    let current = 0;
    const interval = setInterval(() => {
      current += 1; // Increase 1% every 80ms for smooth animation
      
      if (current <= 15) {
        setStatusText('Menyiapkan gelas...');
      } else if (current <= 80) {
        setStatusText('Menuangkan racikan herbal...');
      } else if (current <= 99) {
        setStatusText('Menyelesaikan proses...');
      } else {
        setStatusText('Jamu Siap Dinikmati!');
        clearInterval(interval);
      }
      
      setProgress(Math.min(current, 100));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Return to Idle Screen after finished
    if (progress === 100) {
      if (machineId) {
        deductCupAction(machineId).catch(console.error);
      }
      
      const timeout = setTimeout(() => {
        router.replace('/');
      }, 6000); // Wait 6 seconds for user to take their drink
      return () => clearTimeout(timeout);
    }
  }, [progress, router, machineId]);

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-stone-950 px-16 py-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image src="/hero-bg-traditional.png" alt="Background" fill sizes="100vw" className="object-cover object-center scale-105 blur-[2px]" priority />
        <div className="absolute inset-0 bg-stone-950/80" />
        
        {/* Elegant Guilloche */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-start pl-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }} className="opacity-[0.10] text-amber-500/80 mix-blend-screen">
            <svg width="1200" height="1200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.15" strokeDasharray="0.5 1" />
              {[...Array(24)].map((_, i) => <ellipse key={i} cx="50" cy="50" rx="45" ry="6" transform={`rotate(${i * 15} 50 50)`} stroke="currentColor" strokeWidth="0.1" />)}
              <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Dynamic Ambient Glow from Bottom */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1/2 w-full max-w-3xl rounded-t-[100%] bg-amber-500/20 blur-[120px] transition-all duration-1000 ease-out"
        style={{ opacity: progress / 100 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-4xl gap-12">
        
        {/* Status Text Area (Flexible height to accommodate wrapping) */}
        <div className="text-center flex flex-col items-center justify-end min-h-[160px] w-full px-8">
          <motion.h1 
            key={statusText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-[3.5rem] leading-tight font-normal text-amber-400 drop-shadow-lg max-w-3xl"
          >
            {statusText}
          </motion.h1>
          {progress < 100 && (
             <p className="text-2xl text-stone-300 font-light mt-4">
               Mohon jangan tinggalkan mesin...
             </p>
          )}
        </div>

        {/* Dynamic Cup Visualizer */}
        <div className="relative flex flex-col items-center justify-center">
           
           {/* The Glass SVG Container */}
           <div className="relative w-64 h-80 flex items-end justify-center pb-4">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 250" fill="none" preserveAspectRatio="xMidYMid meet">
                 <defs>
                   {/* This clipPath perfectly traces the inner shape of the glass so liquid never bleeds out */}
                   <clipPath id="glassClip">
                     <path d="M42 30 L60 220 C65 238 135 238 140 220 L158 30 Z" />
                   </clipPath>
                   <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#d97706" /> {/* amber-600 */}
                     <stop offset="100%" stopColor="#f59e0b" /> {/* amber-500 */}
                   </linearGradient>
                 </defs>

                 {/* Back of the glass outline */}
                 <path d="M40 30 L60 220 C65 240 135 240 140 220 L160 30" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.2" strokeLinejoin="round" />

                 {/* The Liquid Fill (Perfectly clipped to the glass shape) */}
                 <g clipPath="url(#glassClip)">
                   <g 
                     style={{ transform: `translateY(${190 - (190 * (progress / 100))}px)` }} 
                     className="transition-transform duration-[80ms] ease-linear"
                   >
                     {/* Body of liquid */}
                     <rect x="0" y="30" width="200" height="250" fill="url(#liquidGradient)" fillOpacity="0.8" />
                     
                     {/* Wavy top surface (Continuous horizontal animation) */}
                     {progress > 0 && progress < 100 && (
                       <>
                         <motion.path 
                           animate={{ x: [0, -200] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           d="M0 30 Q 50 15, 100 30 T 200 30 T 300 30 T 400 30 L 400 40 L 0 40 Z"
                           fill="url(#liquidGradient)" fillOpacity="0.8"
                         />
                         <motion.path 
                           animate={{ x: [0, -200] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           d="M0 30 Q 50 15, 100 30 T 200 30 T 300 30 T 400 30"
                           stroke="#fbbf24" strokeWidth="2" fill="none" strokeOpacity="0.9"
                         />
                       </>
                     )}
                   </g>
                 </g>

                 {/* Front of the glass outline */}
                 <ellipse cx="100" cy="30" rx="60" ry="10" stroke="#fbbf24" strokeWidth="4" />
                 <path d="M40 30 L60 220 C65 240 135 240 140 220 L160 30" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                 {/* Glass Glare */}
                 <path d="M50 50 L65 180" stroke="white" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
              </svg>
              
              {/* Steaming Bubbles */}
              {progress > 50 && (
                 <motion.div 
                   animate={{ y: [0, -50], opacity: [0, 0.8, 0], scale: [0.5, 1] }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} 
                   className="absolute top-[20%] left-1/2 size-4 rounded-full bg-amber-200 blur-[2px]"
                 />
              )}
           </div>

           {/* Percentage Text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full">
              <span className="font-serif text-[5rem] font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                {progress}%
              </span>
           </div>

        </div>

        <div className="h-24">
          {progress === 100 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full bg-amber-500 px-10 py-5 shadow-[0_0_50px_rgba(251,191,36,0.5)] border border-amber-400"
            >
              <p className="text-3xl font-bold text-stone-950">
                Silakan ambil minuman Anda
              </p>
            </motion.div>
          )}
        </div>

      </div>
    </main>
  );
}
