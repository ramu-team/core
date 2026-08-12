'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@ramu/ui/components/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useKioskStore } from '@/store/kiosk-store';
import { fetchMachineMenusAction } from './actions';
import { LoaderIcon } from 'lucide-react';

interface RecipeItem {
  id: string;
  amountMl: number;
  ingredient: { name: string };
}

interface Menu {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  isAvailable: boolean;
  recipes: RecipeItem[];
}

export default function CatalogClient() {
  const router = useRouter();
  const { machineId } = useKioskStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Use refs for drag variables to prevent React re-renders during high-frequency mouse moves
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  useEffect(() => {
    if (!machineId) return;
    
    let mounted = true;
    const loadMenus = async () => {
      setIsLoading(true);
      const res = await fetchMachineMenusAction(machineId);
      if (mounted && res.success && res.data) {
        setMenus(res.data);
      }
      if (mounted) setIsLoading(false);
    };

    loadMenus();
    return () => { mounted = false; };
  }, [machineId]);

  const handleOrder = (menuId: string, isAvailable?: boolean) => {
    if (isAvailable === false) return;
    router.push(`/brewing?menu=${menuId}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    
    // Disable CSS scroll snapping while dragging to prevent violent jitter
    scrollRef.current.style.scrollSnapType = 'none';
  };

  const stopDragging = () => {
    if (!isDragging.current || !scrollRef.current) return;
    isDragging.current = false;
    // Restore CSS scroll snapping
    scrollRef.current.style.scrollSnapType = 'x mandatory';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = startScrollLeft.current - walk;
    
    if (!hasScrolled) setHasScrolled(true);
  };

  const handleScroll = () => {
    if (!hasScrolled) setHasScrolled(true);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
      if (!hasScrolled) setHasScrolled(true);
    }
  };

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 pt-10">
      {/* Background with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
        <Image
          src="/hero-bg-traditional.png"
          alt="Background"
          fill
          className="object-cover object-center scale-110 blur-xs opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/80 via-stone-950/60 to-stone-950" />
        
        {/* Consistent Independent Animation: Elegant Guilloche */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-start pl-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="opacity-[0.15] text-amber-500/80 mix-blend-screen"
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
        <div className="absolute inset-0 z-0 bg-stone-950/80" />
      </div>

      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 mb-8 flex items-center justify-between px-16"
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
        <div className="flex items-center gap-4 bg-stone-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10">
          <span className="text-2xl font-serif text-amber-400">Katalog Menu</span>
        </div>
      </motion.div>

      {/* Tablet Swipe Affordance (Animated Hand Gesture) */}
      {!hasScrolled && menus.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute right-32 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ x: [80, -80] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4"
          >
            {/* Hand Cursor SVG */}
            <svg 
              className="size-24 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M15.4,11.2l-2.7-2.7c-0.2-0.2-0.5-0.3-0.7-0.3c-0.3,0-0.5,0.1-0.7,0.3l-2.6,2.6V4.5C8.7,3.7,8,3,7.2,3C6.4,3,5.7,3.7,5.7,4.5v9.1 L4.4,12.3c-0.3-0.3-0.7-0.4-1.1-0.3c-0.4,0.1-0.7,0.4-0.8,0.8l-0.4,2.3c-0.1,0.5,0.1,1,0.4,1.4l5.3,6C8.2,22.8,8.7,23,9.2,23h6 c1.1,0,2-0.9,2.2-2l1.4-8C18.9,12.4,18.5,11.8,17.9,11.6L15.4,11.2z"/>
            </svg>
            <div className="bg-amber-500/90 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(251,191,36,0.4)] border border-white/20">
              <span className="text-stone-950 font-bold tracking-[0.15em] uppercase text-sm whitespace-nowrap">Usap Layar</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative flex-1 w-full">
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={stopDragging}
          onMouseUp={stopDragging}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          onScroll={handleScroll}
          className="relative z-10 h-full overflow-x-auto overflow-y-hidden w-full snap-x snap-mandatory scroll-pl-16 scrollbar-hide cursor-grab active:cursor-grabbing"
        >
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center space-y-6">
            <LoaderIcon className="size-16 text-amber-500 animate-spin" />
            <p className="text-xl text-stone-400 font-light">Checking machine stock availability...</p>
          </div>
        ) : menus.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-6">
            <AlertCircleIcon className="size-24 text-stone-600" />
            <p className="text-3xl text-stone-400 font-light">No jamu menus available yet.</p>
          </div>
        ) : (
          <div className="flex h-full items-center pb-24 w-max px-16">
            <div className="flex items-stretch gap-6">
              {menus.map((menu, index) => (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                key={menu.id} 
                className={`w-105 shrink-0 relative flex flex-col overflow-hidden rounded-[3rem] bg-linear-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-2 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] snap-start ${menu.isAvailable === false ? 'opacity-50 grayscale' : ''}`}
              >
                {/* Full Bleed Image Container */}
                <div className="relative w-full h-70 bg-stone-950 shrink-0 overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={menu.image_url || "/jamu-placeholder.png"} 
                      alt={menu.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover" 
                      priority={index < 4} 
                    />
                  </motion.div>
                  
                  {/* Rich Vignette & Bottom Blend */}
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-black/40" />
                  <div className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent h-24" />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 rounded-full px-5 py-2 border shadow-xl backdrop-blur-md ${menu.isAvailable === false ? 'bg-red-500/80 border-red-500' : 'bg-black/50 border-white/10'}`}>
                    <span className={`font-bold tracking-widest text-[0.8rem] uppercase ${menu.isAvailable === false ? 'text-white' : 'text-amber-400'}`}>
                      {menu.isAvailable === false ? 'Out of Stock' : 'Signature'}
                    </span>
                  </div>

                  {/* Floating Composition Badges over the image */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                    {menu.recipes.map((r) => (
                      <span key={r.id} className="rounded-full bg-black/70 backdrop-blur-md px-4 py-1.5 text-[0.85rem] font-bold text-amber-400 border border-amber-500/30 shadow-lg">
                        {r.ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="relative z-10 flex flex-col flex-1 p-8 pt-6">
                  <h3 className="mb-3 font-serif text-[2.5rem] leading-none text-white drop-shadow-xl">
                    {menu.name}
                  </h3>
                  
                  <p className="mb-6 text-[1.15rem] font-light text-stone-300 line-clamp-2 leading-relaxed opacity-90">
                    {menu.description || 'Racikan tradisional istimewa untuk kebugaran Anda.'}
                  </p>

                  <div className="mt-auto pt-2 relative">
                    {/* Animated Glow behind button to attract taps */}
                    {menu.isAvailable !== false && (
                      <motion.div 
                        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.02, 0.95] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-amber-500/40 blur-xl rounded-full" 
                      />
                    )}
                    
                    <motion.div whileTap={menu.isAvailable !== false ? { scale: 0.95 } : {}} className="relative">
                      <Button
                        size="lg"
                        disabled={menu.isAvailable === false}
                        onClick={() => handleOrder(menu.id, menu.isAvailable)}
                        className={`h-20 w-full rounded-full text-[1.4rem] tracking-wide font-extrabold shadow-[0_5px_20px_rgba(251,191,36,0.3)] border-b-[5px] active:border-b-0 active:translate-y-1.25 transition-all
                          ${menu.isAvailable === false 
                            ? 'bg-stone-800 text-stone-500 border-stone-900 shadow-none' 
                            : 'bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 border-amber-700'}`}
                      >
                        {menu.isAvailable === false ? 'TIDAK TERSEDIA' : 'RAMU SEKARANG'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Explicit Right Spacer */}
            <div className="w-10 shrink-0" />
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
