'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@ramu/ui/components/button';
import { ChevronLeftIcon, SparklesIcon, DropletIcon } from 'lucide-react';


interface AIResultProps {
  consultationId: string;
  menuId: string;
  explanation: string;
  recipe: {
    name: string;
    description: string;
    price: number;
    image: string | null;
    ingredients: {
      ingredient_id: string;
      name: string;
      amountMl: number;
    }[];
  }
}

export default function ResultClient({ consultationId, menuId, explanation, recipe }: AIResultProps) {
  const router = useRouter();

  const handleBrew = () => {
    // Send to paired page which handles payment then brewing
    // Using menuId since the AI just recommended an existing menu
    router.push(`/paired?menu=${menuId}`);
  };

  return (
    <main className="relative flex min-h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image src="/hero-bg-traditional.png" alt="Background" fill className="object-cover object-center scale-105 blur-[4px]" priority />
        <div className="absolute inset-0 bg-stone-950/80" />
      </div>

      {/* Top Navigation */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 mb-8 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={() => router.push('/ai-consultation')} className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent">
          <ChevronLeftIcon className="mr-3 size-8" />
          Kembali
        </Button>
        <div className="flex items-center gap-4 bg-stone-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-amber-500/30">
          <SparklesIcon className="size-6 text-amber-500" />
          <span className="text-2xl font-serif text-amber-400">Rekomendasi Spesial AI</span>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-row items-center justify-center w-full gap-12 px-8">
        
        {/* Left: Catalog-style Jamu Card */}
        <motion.div 
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-[460px] shrink-0 relative flex flex-col overflow-hidden rounded-[3rem] bg-gradient-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-[2px] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Full Bleed Image Container */}
          <div className="relative w-full h-[320px] bg-stone-950 shrink-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image 
                src={recipe.image || "/jamu-placeholder.png"} 
                alt={recipe.name} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover" 
                priority
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent h-24" />
            
            {/* Status Badge */}
            <div className="absolute top-6 right-6 rounded-full px-5 py-2 border shadow-xl backdrop-blur-md bg-amber-500/90 border-amber-400">
              <span className="font-bold tracking-widest text-[0.8rem] uppercase text-stone-950">
                Pilihan Terbaik
              </span>
            </div>

            {/* Floating Composition Badges over the image */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
              {recipe.ingredients.map((r, i) => (
                <span key={i} className="rounded-full bg-black/70 backdrop-blur-md px-4 py-1.5 text-[0.85rem] font-bold text-amber-400 border border-amber-500/30 shadow-lg">
                  {r.name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="relative z-10 flex flex-col flex-1 p-8 pt-6">
            <h3 className="mb-3 font-serif text-[2.8rem] leading-none text-white drop-shadow-xl">
              {recipe.name}
            </h3>
            
            <p className="mb-6 text-[1.2rem] font-light text-stone-300 line-clamp-2 leading-relaxed opacity-90">
              {recipe.description || 'Racikan tradisional istimewa untuk kebugaran Anda.'}
            </p>

            <div className="mt-auto pt-2 relative">
              <motion.div 
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.02, 0.95] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" 
              />
              
              <motion.div whileTap={{ scale: 0.95 }} className="relative">
                <Button
                  size="lg"
                  onClick={handleBrew}
                  className="h-20 w-full rounded-full text-[1.5rem] tracking-wide font-extrabold shadow-[0_5px_20px_rgba(251,191,36,0.3)] border-b-[5px] active:border-b-0 active:translate-y-[5px] transition-all bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 border-amber-700"
                >
                  BUAT JAMU INI
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right: AI Explanation Area */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col justify-center w-[500px] shrink-0"
        >
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-10 backdrop-blur-sm shadow-[inset_0_0_50px_rgba(251,191,36,0.03)]">
            <div className="flex items-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 mr-4 border border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <SparklesIcon className="size-6" />
              </div>
              <h2 className="text-[2rem] font-medium text-amber-400 font-serif">Saran AI Mixologist</h2>
            </div>
            
            <div className="relative flex flex-col items-center justify-center min-h-[120px]">
              <span className="absolute top-0 -left-6 text-[4rem] text-amber-500/20 font-serif leading-none">"</span>
              <p className="text-[1.8rem] text-stone-200 font-light leading-snug relative z-10 text-center italic px-4">
                {explanation}
              </p>
              <span className="absolute bottom-0 -right-6 text-[4rem] text-amber-500/20 font-serif leading-none translate-y-6">"</span>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
