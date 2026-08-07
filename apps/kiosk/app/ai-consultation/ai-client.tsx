'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeftIcon, CheckIcon, 
  ShieldPlusIcon, ActivityIcon, BatteryChargingIcon, 
  StethoscopeIcon, WindIcon, FlameIcon, PillIcon, HeartPulseIcon,
  MoonIcon, DropletIcon, BrainIcon, ThermometerIcon, DumbbellIcon, WavesIcon
} from 'lucide-react';
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

  const groupedSymptoms = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category]!.push(symptom);
    return acc;
  }, {} as Record<string, Symptom[]>);

  const categoryDisplay: Record<string, { title: string, icon: React.ReactNode }> = {
    'immunity': { title: 'Daya Tahan Tubuh', icon: <ShieldPlusIcon className="size-8" /> },
    'digestion': { title: 'Pencernaan', icon: <ActivityIcon className="size-8" /> },
    'fatigue & aches': { title: 'Pegal & Kelelahan', icon: <BatteryChargingIcon className="size-8" /> },
    'others': { title: 'Keluhan Lainnya', icon: <StethoscopeIcon className="size-8" /> }
  };

  const getSymptomIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('angin')) return <WindIcon className="size-8 text-stone-400" />;
    if (n.includes('tenggorokan')) return <FlameIcon className="size-8 text-stone-400" />;
    if (n.includes('batuk') || n.includes('flu')) return <ThermometerIcon className="size-8 text-stone-400" />;
    
    if (n.includes('kembung') || n.includes('mual')) return <WavesIcon className="size-8 text-stone-400" />;
    if (n.includes('perut')) return <ActivityIcon className="size-8 text-stone-400" />;
    if (n.includes('lambung')) return <FlameIcon className="size-8 text-stone-400" />;
    
    if (n.includes('pegal') || n.includes('linu')) return <HeartPulseIcon className="size-8 text-stone-400" />;
    if (n.includes('tenaga') || n.includes('lelah')) return <BatteryChargingIcon className="size-8 text-stone-400" />;
    if (n.includes('otot') || n.includes('kaku')) return <DumbbellIcon className="size-8 text-stone-400" />;
    
    if (n.includes('haid')) return <DropletIcon className="size-8 text-stone-400" />;
    if (n.includes('tidur')) return <MoonIcon className="size-8 text-stone-400" />;
    if (n.includes('kepala')) return <BrainIcon className="size-8 text-stone-400" />;
    
    return <PillIcon className="size-8 text-stone-400" />;
  };

  const toggleSymptom = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      // No choice limits
      setSelected([...selected, id]);
    }
  };

  const handleRecommend = () => {
    if (selected.length === 0) return;
    setIsAnalyzing(true);
    
    // AI Thinking Simulation
    setTimeout(() => {
      // At this stage it should go to the recommendation result page, but the prototype can throw to order-preview or directly brewing.
      // We assume there will be an API call to the AI backend, then return Jamu Menu ID / Recipe.
      router.push('/catalog'); // Temporarily return to catalog / pretend recommendation becomes menu
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
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 mb-4 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={() => router.back()} className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent">
          <ChevronLeftIcon className="mr-3 size-8" />
          Kembali
        </Button>
        <div className="flex items-center gap-4 bg-stone-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10">
          <span className="text-2xl font-serif text-amber-400">Konsultasi AI</span>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col mx-auto w-full max-w-[1800px]">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="font-serif text-[4rem] font-normal text-white drop-shadow-md">
            Apa keluhan Anda hari ini?
          </h1>
          <p className="text-2xl text-stone-300 font-light">
            Pilih semua gejala yang Anda rasakan (<span className="font-medium text-amber-400">{selected.length}</span> terpilih)
          </p>
        </div>

        <div className="w-full mb-8">
          {symptoms.length === 0 ? (
            <div className="w-full py-20 text-center text-3xl text-stone-500 font-light">Belum ada data keluhan yang dikonfigurasi.</div>
          ) : (
            <div className="grid grid-cols-4 gap-8 w-full items-start">
              {Object.entries(groupedSymptoms).map(([category, items]) => {
                const display = categoryDisplay[category] || { title: category, icon: <StethoscopeIcon className="size-8" /> };
                return (
                  <div key={category} className="flex flex-col bg-stone-900/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center gap-4 mb-8 text-amber-500 text-center">
                      <div className="size-12 flex items-center justify-center bg-white/5 rounded-full shadow-lg border border-white/10">
                        {display.icon}
                      </div>
                      <h3 className="font-serif text-[2.2rem] font-normal text-amber-400 drop-shadow-md">
                        {display.title}
                      </h3>
                    </div>
                    
                    {/* Items fully displayed, no scrolling */}
                    <div className="flex flex-col gap-4">
                        {items.map((symptom) => {
                          const isSelected = selected.includes(symptom.id);
                          return (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              key={symptom.id}
                              onClick={() => toggleSymptom(symptom.id)}
                              className={`group relative flex h-[110px] w-full items-center gap-6 rounded-[2rem] border-2 px-6 shadow-md transition-all duration-300 ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                  : 'border-white/20 bg-white/5 backdrop-blur-md text-stone-300'
                              }`}
                            >
                              <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-stone-400'}`}>
                                {getSymptomIcon(symptom.name)}
                              </div>
                              <span className="text-2xl font-medium tracking-wide text-left flex-1 line-clamp-2">{symptom.name}</span>
                              
                              {/* Selection Indicator (Checkbox style) */}
                              <div className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                isSelected 
                                  ? 'bg-amber-500 border-amber-500 text-stone-950' 
                                  : 'border-stone-500/50 bg-stone-900/50 group-active:border-white/50'
                              }`}>
                                {isSelected && <CheckIcon className="size-6" strokeWidth={3} />}
                              </div>
                            </motion.button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Bottom Bar */}
        <div className="flex justify-center pb-4 mt-4">
          <motion.div whileTap={selected.length > 0 ? { scale: 0.95 } : {}}>
            <Button
              size="lg"
              disabled={selected.length === 0}
              onClick={handleRecommend}
              className="h-24 rounded-full bg-amber-500 hover:bg-amber-500 px-16 text-[1.75rem] font-bold text-stone-950 transition-colors disabled:opacity-30 disabled:bg-stone-800 disabled:text-stone-500 shadow-xl shadow-amber-500/20 disabled:shadow-none"
            >
              Minta Rekomendasi Jamu
            </Button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
