'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, InfoIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@ramu/ui/components/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RecipeItem {
  id: string;
  amountMl: number;
  ingredient: { name: string };
}

interface Menu {
  id: string;
  name: string;
  description: string | null;
  price: any;
  recipes: RecipeItem[];
}

export default function CatalogClient({ menus }: { menus: Menu[] }) {
  const router = useRouter();

  const handleOrder = (menuId: string) => {
    // Di prototipe ini, langsung ke brewing screen seolah-olah sukses bayar
    // Nanti bisa diarahkan ke halaman konfirmasi atau metode pembayaran mesin
    router.push(`/brewing?menu=${menuId}`);
  };

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

      {/* Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 mb-8 flex items-center justify-between"
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

      <div className="relative z-10 flex-1 overflow-y-auto pr-4 pb-10 scrollbar-hide">
        {menus.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-6">
            <AlertCircleIcon className="size-24 text-stone-600" />
            <p className="text-3xl text-stone-400 font-light">Belum ada menu jamu yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menus.map((menu, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={menu.id} 
                className="flex flex-col justify-between overflow-hidden rounded-[2rem] bg-stone-900/60 p-8 backdrop-blur-xl border border-white/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex size-20 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                      {/* Minimal SVG Cup */}
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 5 L14 30 C15 35 20 38 25 38 C30 38 35 35 36 30 L40 5" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M15 20 Q25 15 35 20" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.5" />
                      </svg>
                    </div>
                    <span className="rounded-full border border-amber-500/30 px-6 py-2 text-xl font-bold text-amber-400">
                      Rp {Number(menu.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 font-serif text-[2.5rem] font-normal text-white">{menu.name}</h3>
                  <p className="mb-6 text-xl font-light text-stone-300 line-clamp-2">
                    {menu.description || 'Racikan tradisional istimewa untuk kebugaran Anda.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-stone-400">
                      <InfoIcon className="size-4 text-stone-500" />
                      Komposisi:
                    </div>
                    {menu.recipes.map((r) => (
                      <span key={r.id} className="rounded-full bg-stone-800/80 px-4 py-2 text-sm font-medium text-stone-300 border border-white/5">
                        {r.ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={() => handleOrder(menu.id)}
                    className="h-20 w-full rounded-2xl bg-amber-500 hover:bg-amber-500 text-2xl font-bold text-stone-950 active:bg-amber-600 transition-colors"
                  >
                    Pesan Sekarang
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
