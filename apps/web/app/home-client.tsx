'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import mqtt from 'mqtt';
import { BookOpenIcon, SparklesIcon, HistoryIcon } from 'lucide-react';

export default function HomeClient({ urlSessionId, urlMachineId }: { urlSessionId?: string, urlMachineId?: string }) {
  const router = useRouter();
  const { activeSessionId, setSession } = useUserStore();

  useEffect(() => {
    if (urlSessionId) {
      setSession(urlSessionId, urlMachineId);
      // Bersihkan URL dari parameter session agar rapi
      router.replace('/', undefined);
    }
  }, [urlSessionId, urlMachineId, setSession, router]);

  // MQTT Connection Logic for Home (Tell kiosk we are connected)
  useEffect(() => {
    const currentSession = urlSessionId || activeSessionId;
    if (!currentSession) return;

    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'wss://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8884/mqtt';
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
    const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;
    
    const client = mqtt.connect(brokerUrl, { username, password });
    const topic = `${topicPrefix}/pair/${currentSession}`;

    client.on('connect', () => {
      client.publish(topic, JSON.stringify({ status: 'connected' }));
    });

    return () => {
      client.end();
    };
  }, [activeSessionId, urlSessionId]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-12 pb-8 px-6 bg-amber-500 rounded-b-[2.5rem] shadow-[0_10px_30px_rgba(245,158,11,0.2)] overflow-hidden border-b-2 border-amber-400/50">
        <div className="absolute inset-0 opacity-40 bg-stone-950 pointer-events-none mix-blend-overlay" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <h1 className="text-5xl font-serif font-normal text-stone-950 tracking-wide drop-shadow-md">Ramu</h1>
          <p className="text-stone-900 font-medium text-lg leading-snug">Pesan jamu tradisional<br/>langsung dari genggaman.</p>
          
          {activeSessionId ? (
            <div className="flex items-center gap-2 bg-stone-950/20 px-4 py-2 rounded-full border border-stone-950/30 backdrop-blur-sm mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-stone-900">Terhubung ke Mesin</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-stone-950/20 px-4 py-2 rounded-full border border-stone-950/30 backdrop-blur-sm mt-2">
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-500/80"></span>
              </span>
              <span className="text-sm font-semibold text-stone-900">Offline (Scan Kiosk untuk terhubung)</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6 max-w-md mx-auto w-full relative z-10">
        {/* Menu Buttons */}
        <button 
          className="w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-linear-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-2 border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 focus:outline-none"
          onClick={() => router.push('/catalog')}
        >
          <div className="size-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <BookOpenIcon className="size-7" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-serif text-white tracking-wide">Katalog Jamu</h2>
            <p className="text-stone-400 text-sm font-light leading-snug mt-1">Eksplorasi menu tradisional</p>
          </div>
        </button>

        <button 
          className="w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-linear-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-2 border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 focus:outline-none"
          onClick={() => router.push('/ai-consultation')}
        >
          <div className="size-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <SparklesIcon className="size-7" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-serif text-white tracking-wide">Konsultasi AI</h2>
            <p className="text-stone-400 text-sm font-light leading-snug mt-1">Racikan khusus keluhan Anda</p>
          </div>
        </button>

        <button 
          className="w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-linear-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl border-2 border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 focus:outline-none"
          onClick={() => router.push('/history')}
        >
          <div className="size-14 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-300 shrink-0 border border-white/5">
            <HistoryIcon className="size-7" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-serif text-white tracking-wide">Riwayat Saya</h2>
            <p className="text-stone-400 text-sm font-light leading-snug mt-1">Daftar pesanan sebelumnya</p>
          </div>
        </button>
      </div>
    </div>
  );
}
