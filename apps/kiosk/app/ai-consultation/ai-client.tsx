'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, CheckIcon } from 'lucide-react';
import { Button } from '@ramu/ui/components/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Symptom {
  id: string;
  name: string;
  icon: string | null;
  category: string;
}

export default function AIClient({ symptoms }: { symptoms: Symptom[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleSymptom = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, id]);
      }
    }
  };

  const handleRecommend = () => {
    if (selected.length === 0) return;
    setIsAnalyzing(true);
    
    // Simulasi AI Berpikir
    setTimeout(() => {
      // Di tahap ini harusnya ke halaman hasil rekomendasi, tapi prototipe bisa lempar ke order-preview atau langsung brewing.
      // Kita asumsikan akan ada API call ke backend AI, lalu return Jamu Menu ID / Recipe.
      router.push('/catalog'); // Untuk sementara kembali ke katalog / pura-pura rekomendasi jadi menu
    }, 4000);
  };

  if (isAnalyzing) {
    return (
      <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image src="/hero-bg-traditional.png" alt="Background" fill className="object-cover object-center scale-105 blur-[2px]" priority />
          <div className="absolute inset-0 bg-stone-950/90" />
        </div>
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          {/* Animated Neural AI Node (Amber Theme) */}
          <div className="relative flex size-64 items-center justify-center mb-12">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute z-10 opacity-90">
              {/* Outer Expanding Rings */}
              <motion.circle animate={{ r: [40, 90, 40], strokeOpacity: [0.6, 0, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} cx="100" cy="100" stroke="#fbbf24" strokeWidth="1.5" />
              <motion.circle animate={{ r: [60, 120, 60], strokeOpacity: [0.3, 0, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} cx="100" cy="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Core AI Sparkle Shape */}
              <motion.path 
                animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 90, 180] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                d="M100 40 C100 80 80 100 40 100 C80 100 100 120 100 160 C100 120 120 100 160 100 C120 100 100 80 100 40 Z" 
                stroke="#fbbf24" strokeWidth="3" fill="#f59e0b" fillOpacity="0.1" 
              />
              {/* Center Glowing Processing Core */}
              <motion.circle animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} cx="100" cy="100" r="8" fill="#fbbf24" />
            </svg>
          </div>
          
          <motion.h2 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="font-serif text-[3.5rem] font-normal text-amber-400 mb-4">
            AI Sedang Meracik
          </motion.h2>
          <p className="text-2xl text-stone-300 font-light">Menganalisis keluhan Anda untuk resep jamu terbaik...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image src="/hero-bg-traditional.png" alt="Background" fill className="object-cover object-center scale-105 blur-[2px]" priority />
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

      {/* Top Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 mb-8 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={() => router.back()} className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent">
          <ChevronLeftIcon className="mr-3 size-8" />
          Kembali
        </Button>
        <div className="flex items-center gap-4 bg-stone-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10">
          <span className="text-2xl font-serif text-amber-400">Konsultasi AI</span>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col mx-auto w-full max-w-7xl">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="font-serif text-[4rem] font-normal text-white">
            Apa keluhan Anda hari ini?
          </h1>
          <p className="text-2xl text-stone-300 font-light">
            Pilih hingga 3 gejala penyakit (<span className="font-medium text-amber-400">{selected.length}</span>/3 terpilih)
          </p>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap justify-center gap-6 content-start h-full px-4">
            {symptoms.length === 0 ? (
              <div className="w-full py-20 text-center text-3xl text-stone-500 font-light">Belum ada data keluhan yang dikonfigurasi.</div>
            ) : (
              symptoms.map((symptom) => {
                const isSelected = selected.includes(symptom.id);
                return (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`relative flex h-[100px] items-center gap-6 rounded-[2rem] border-2 px-8 transition-colors ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-white/10 bg-stone-900/60 backdrop-blur-md text-stone-300'
                    }`}
                  >
                    <div className="text-4xl opacity-90">{symptom.icon || '🤒'}</div>
                    <span className="text-2xl font-medium tracking-wide">{symptom.name}</span>
                    
                    {isSelected && (
                      <div className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-amber-500 text-stone-950 shadow-lg">
                        <CheckIcon className="size-6" strokeWidth={3} />
                      </div>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-8 flex justify-center pt-8 pb-4">
          <motion.div whileTap={selected.length > 0 ? { scale: 0.95 } : {}}>
            <Button
              size="lg"
              disabled={selected.length === 0}
              onClick={handleRecommend}
              className="h-20 rounded-full bg-amber-500 hover:bg-amber-500 px-16 text-2xl font-bold text-stone-950 transition-colors disabled:opacity-50 disabled:bg-stone-800 disabled:text-stone-500"
            >
              Rekomendasikan Jamu
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
