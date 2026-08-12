'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, OrderHistoryItem } from '@/store/user-store';
import mqtt from 'mqtt';
import Image from 'next/image';
import { Button } from '@ramu/ui/components/button';
import { ChevronLeftIcon, LoaderIcon, CheckCircleIcon } from 'lucide-react';

interface Menu {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  isAvailable: boolean;
  recipes: { ingredient: { name: string } }[];
}

export default function CatalogClient({ menus }: { menus: Menu[] }) {
  const router = useRouter();
  const { activeSessionId, addHistory } = useUserStore();
  const [orderingId, setOrderingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleOrder = async (menu: Menu) => {
    if (!activeSessionId) {
      alert('Sesi Anda tidak valid. Silakan scan Kiosk lagi.');
      return;
    }

    setOrderingId(menu.id);

    // Send MQTT Brew command
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'wss://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8884/mqtt';
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const client = mqtt.connect(brokerUrl, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    });

    const topic = `${topicPrefix}/pair/${activeSessionId}`;
    
    client.on('connect', () => {
      client.publish(topic, JSON.stringify({ status: 'brew', menuId: menu.id }));
      client.end();
      
      // Save to lazy register history
      const historyItem: OrderHistoryItem = {
        id: crypto.randomUUID(),
        type: 'menu',
        title: menu.name,
        description: menu.description || 'Pesanan jamu dari katalog',
        timestamp: Date.now(),
      };
      addHistory(historyItem);

      setOrderingId(null);
      setSuccessId(menu.id);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-4 py-4 shadow-sm border-b border-white/5">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full text-stone-300 hover:text-white hover:bg-white/10">
          <ChevronLeftIcon className="size-6" />
        </Button>
        <h1 className="text-xl font-serif font-bold ml-2 text-white">Katalog Jamu</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6 max-w-md mx-auto w-full relative z-10">
        {menus.map((menu) => (
          <div key={menu.id} className={`bg-linear-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl rounded-[2rem] shadow-lg border-2 border-white/5 overflow-hidden flex flex-col ${!menu.isAvailable ? 'opacity-60 grayscale' : ''}`}>
            <div className="relative w-full h-56 bg-stone-950">
              {menu.image_url ? (
                <Image src={menu.image_url} alt={menu.name} fill className="object-cover opacity-80" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">No Image</div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-stone-900 to-transparent opacity-80" />
              {!menu.isAvailable && (
                <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                  Habis
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1 -mt-8 relative z-10">
              <h2 className="text-3xl font-serif font-normal tracking-wide text-white drop-shadow-md mb-2">{menu.name}</h2>
              <p className="text-stone-400 text-sm mb-4 line-clamp-2 leading-relaxed">{menu.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {menu.recipes.map((r, i) => (
                  <span key={i} className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-medium">
                    {r.ingredient.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                {successId === menu.id ? (
                  <Button disabled className="w-full h-12 rounded-xl bg-emerald-500 text-white font-bold opacity-100">
                    <CheckCircleIcon className="size-5 mr-2" />
                    Memproses di Kiosk...
                  </Button>
                ) : (
                  <Button 
                    disabled={!menu.isAvailable || orderingId === menu.id}
                    onClick={() => handleOrder(menu)}
                    className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
                  >
                    {orderingId === menu.id ? <LoaderIcon className="animate-spin size-5" /> : 'PESAN SEKARANG'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
