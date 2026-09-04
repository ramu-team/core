'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import mqtt from 'mqtt';
import { BookOpenIcon, SparklesIcon, HistoryIcon, ChevronLeftIcon, UserCircleIcon, QrCodeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import QrScanner from '@/components/qr-scanner';

export default function AppClient({ urlSessionId, urlMachineId }: { urlSessionId?: string, urlMachineId?: string }) {
  const router = useRouter();
  const { activeSessionId, setSession, isLoggedIn, userName } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (urlSessionId) {
      setSession(urlSessionId, urlMachineId);
      // Bersihkan URL dari parameter session agar rapi
      router.replace('/app', undefined);
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

  const handleScanSuccess = (decodedText: string) => {
    setShowScanner(false);
    try {
      // Expecting URL format: http://.../?session=xxx&machineId=yyy
      const url = new URL(decodedText);
      const session = url.searchParams.get('session');
      const machine = url.searchParams.get('machineId');
      
      if (session) {
        setSession(session, machine);
      } else {
        alert("QR Code tidak valid atau tidak memiliki parameter session.");
      }
    } catch (e) {
      // If it's just a raw session string
      if (decodedText.length > 5) {
        setSession(decodedText, null);
      } else {
        alert("Format QR Code tidak dikenali.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 font-sans">
      {showScanner && (
        <QrScanner 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-6 rounded-b-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/jamu-trad-bg.png" 
            alt="Jamu Traditional" 
            fill 
            className="object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/40" />
        </div>
        
        <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-1 text-stone-400 hover:text-amber-500 transition-colors">
            <ChevronLeftIcon className="size-5" />
            <span className="text-sm font-semibold">Web</span>
        </Link>

        {mounted && !isLoggedIn && (
          <Link href="/login" className="absolute top-6 right-6 z-20 flex items-center gap-2 text-stone-900 bg-amber-500 px-4 py-1.5 rounded-full hover:bg-amber-400 transition-colors font-semibold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Masuk
          </Link>
        )}

        {mounted && isLoggedIn && (
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 text-stone-300 bg-stone-900/80 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            <UserCircleIcon className="size-5 text-amber-500" />
            <span className="text-sm font-medium truncate max-w-[100px]">{userName?.split(' ')[0] || 'Pengguna'}</span>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 mt-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-amber-500 font-bold tracking-wider drop-shadow-md mb-2">Ramu</h1>
            {mounted && isLoggedIn ? (
              <p className="text-stone-300 font-medium text-lg leading-snug">Selamat datang kembali,<br/><span className="text-white">{userName}</span></p>
            ) : (
              <p className="text-stone-400 font-light text-md leading-snug max-w-[250px] mx-auto">Pesan jamu tradisional langsung dari genggaman Anda.</p>
            )}
          </div>
          
          {activeSessionId ? (
            <div className="flex items-center gap-3 bg-stone-900/60 px-5 py-2.5 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400 tracking-wide">Terhubung ke Mesin</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-stone-900/60 px-5 py-2.5 rounded-full border border-red-500/30 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500/80"></span>
              </span>
              <span className="text-sm font-medium text-red-400 tracking-wide">Belum Terhubung</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6 max-w-md mx-auto w-full relative z-10">
        
        {!activeSessionId ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 pt-10">
            <div className="size-24 rounded-full bg-stone-900 border border-white/5 flex items-center justify-center">
              <QrCodeIcon className="size-10 text-stone-500" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white mb-2">Pindai Kiosk Ramu</h3>
              <p className="text-stone-400 text-sm max-w-[250px] mx-auto">
                Anda harus memindai QR Code di layar mesin Kiosk untuk mulai memesan jamu.
              </p>
            </div>
            <button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-amber-500 text-stone-950 font-bold py-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition-all hover:scale-105 active:scale-95 text-lg"
            >
              Scan Kiosk Sekarang
            </button>
          </div>
        ) : (
          <>
            {mounted && !isLoggedIn && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                <p className="text-amber-200/80 text-sm font-light mb-3">
                  Riwayat pesanan Anda saat ini hanya tersimpan di perangkat ini.
                </p>
                <Link href="/login" className="inline-block bg-amber-500 text-stone-950 font-semibold px-6 py-2 rounded-full text-sm hover:bg-amber-400 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  Masuk untuk Simpan Permanen
                </Link>
              </div>
            )}

            {/* Menu Buttons */}
            <button 
              className="group w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-stone-900/60 backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-5 focus:outline-none hover:bg-stone-900 transition-all hover:border-amber-500/30"
              onClick={() => router.push('/catalog')}
            >
              <div className="size-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <BookOpenIcon className="size-7" />
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-serif text-white tracking-wide">Katalog Jamu</h2>
                <p className="text-stone-400 text-sm font-light leading-snug mt-1">Eksplorasi menu tradisional</p>
              </div>
            </button>

            <button 
              className="group w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-stone-900/60 backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-5 focus:outline-none hover:bg-stone-900 transition-all hover:border-indigo-500/30"
              onClick={() => router.push('/ai-consultation')}
            >
              <div className="size-14 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <SparklesIcon className="size-7" />
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-serif text-white tracking-wide">Konsultasi AI</h2>
                <p className="text-stone-400 text-sm font-light leading-snug mt-1">Racikan khusus keluhan Anda</p>
              </div>
            </button>

            <button 
              className="group w-full text-left relative flex items-center overflow-hidden rounded-[2rem] bg-stone-900/60 backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-5 focus:outline-none hover:bg-stone-900 transition-all hover:border-stone-500/50"
              onClick={() => router.push('/history')}
            >
              <div className="size-14 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 shrink-0 border border-white/5 group-hover:scale-110 transition-all">
                <HistoryIcon className="size-7" />
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-serif text-white tracking-wide">Riwayat Saya</h2>
                <p className="text-stone-400 text-sm font-light leading-snug mt-1">Daftar pesanan sebelumnya</p>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
