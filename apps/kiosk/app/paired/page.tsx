'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, CheckIcon } from 'lucide-react';
import { Button } from '@ramu/ui/components/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import mqtt from 'mqtt';
import { useKioskStore } from '@/store/kiosk-store';

function PairedContent() {
  const router = useRouter();
  const { machineId } = useKioskStore();
  const [status, setStatus] = useState<'waiting' | 'connected' | 'success'>('waiting');
  const [sessionId, setSessionId] = useState('');
  const [orderPayload, setOrderPayload] = useState<{menuId?: string, consultationId?: string}>({});
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

  useEffect(() => {
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'wss://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8884/mqtt';
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
    const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;
    
    const client = mqtt.connect(brokerUrl, {
      username,
      password
    });

    let currentTopic = '';

    const setupSession = () => {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      
      if (currentTopic) {
        client.unsubscribe(currentTopic);
      }
      
      currentTopic = `${topicPrefix}/pair/${newSessionId}`;
      if (client.connected) {
        client.subscribe(currentTopic);
      }
    };

    setupSession();

    client.on('connect', () => {
      if (currentTopic) {
        client.subscribe(currentTopic);
      }
    });

    client.on('message', (topicReceived, message) => {
      if (topicReceived === currentTopic) {
        try {
          const payload = JSON.parse(message.toString());
          if (payload.status === 'connected') {
            setStatus('connected');
          } else if (payload.status === 'brew') {
            setOrderPayload({ 
              menuId: payload.menuId, 
              consultationId: payload.consultationId 
            });
            setStatus('success');
          }
        } catch (e) {
          console.error('Invalid MQTT message payload', e);
        }
      }
    });

    // Perbarui QR Code (Session ID) setiap 1 menit jika masih menunggu
    const interval = setInterval(() => {
      setStatus((currentStatus) => {
        if (currentStatus === 'waiting') {
          setupSession();
        }
        return currentStatus; // return the same status to avoid side-effects
      });
    }, 60000);

    return () => {
      clearInterval(interval);
      client.end();
    };
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const t3 = setTimeout(() => {
        let targetUrl = '/brewing';
        if (orderPayload.consultationId) targetUrl += `?consultationId=${orderPayload.consultationId}`;
        else if (orderPayload.menuId) targetUrl += `?menu=${orderPayload.menuId}`;
        
        router.push(targetUrl); // Redirect to brewing screen
      }, 2500);
      return () => clearTimeout(t3);
    }
  }, [status, router, orderPayload]);

  const qrUrl = `${webUrl}/?session=${sessionId}${machineId ? `&machineId=${machineId}` : ''}`;

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-stone-950 px-16 py-10">
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

      {/* Top Navigation */}
      {status === 'waiting' && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 mb-8 flex items-center">
          <Button variant="ghost" size="lg" onClick={() => router.back()} className="h-16 rounded-full px-6 text-xl font-medium text-stone-300 active:bg-white/10 hover:bg-transparent">
            <ChevronLeftIcon className="mr-3 size-8" />
            Batalkan
          </Button>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center space-y-12">
        
        {/* State: Waiting for Scan */}
        {status === 'waiting' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-12">
            <div className="text-center space-y-4">
              <h1 className="font-serif text-[4.5rem] font-normal text-amber-400 drop-shadow-lg">Scan QR Code</h1>
              <p className="text-2xl text-stone-300 font-light max-w-2xl">Buka kamera atau aplikasi QR Scanner di HP Anda untuk terhubung.</p>
            </div>
            
            <div className="relative flex size-96 items-center justify-center rounded-[3rem] bg-white p-8 shadow-[0_0_100px_rgba(251,191,36,0.2)] border-2 border-amber-500/20">
              {sessionId ? (
                <QRCodeCanvas 
                  value={qrUrl} 
                  size={300} 
                  level="Q" 
                  fgColor="#1c1917" // stone-900
                />
              ) : (
                <div className="animate-pulse bg-stone-200 size-75 rounded-xl" />
              )}
              
              {/* Elegant Scanning Laser Animation */}
              <motion.div 
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[10%] w-[80%] h-1 bg-amber-500 shadow-[0_0_20px_rgba(251,191,36,1)] rounded-full" 
              />
            </div>
            
            <div className="flex items-center gap-4 rounded-full bg-stone-900/60 backdrop-blur-xl px-8 py-4 border border-white/10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="size-6 border-2 border-amber-500 border-t-transparent rounded-full" />
              <span className="text-xl font-medium text-amber-400">Menunggu scan...</span>
            </div>
          </motion.div>
        )}

        {/* State: Phone Connected (Browsing Menu) */}
        {status === 'connected' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-12">
            <div className="relative flex size-64 items-center justify-center">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute size-48 rounded-full bg-amber-500/20" />
              <div className="relative flex size-40 items-center justify-center rounded-full bg-stone-900/80 backdrop-blur-xl border border-amber-500/30 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
                {/* Minimalist Phone Connected SVG */}
                <svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="5" width="20" height="30" rx="3" fill="#1c1917" stroke="#fbbf24" strokeWidth="1.5" />
                  <rect x="12" y="8" width="16" height="24" rx="1" fill="#f59e0b" fillOpacity="0.1" />
                  <circle cx="20" cy="20" r="4" fill="#fbbf24" />
                </svg>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h1 className="font-serif text-[4.5rem] font-normal text-amber-400 drop-shadow-lg">
                HP Terhubung
              </h1>
              <p className="text-2xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
                Silakan lihat HP Anda dan tekan tombol konfirmasi untuk melanjutkan pembuatan jamu.
              </p>
            </div>
          </motion.div>
        )}

        {/* State: Payment Success */}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex size-48 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.5)] border-4 border-white/20">
              <CheckIcon className="size-24 text-stone-950" strokeWidth={3} />
            </motion.div>
            <div className="text-center space-y-4">
              <h1 className="font-serif text-[4.5rem] font-normal text-emerald-400 drop-shadow-lg">
                Pesanan Dikonfirmasi
              </h1>
              <p className="text-2xl text-stone-300 font-light">
                Mempersiapkan mesin pembuat jamu...
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}

export default function PairedScreenPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-stone-950 text-amber-500 text-2xl font-serif">Memuat...</div>}>
      <PairedContent />
    </Suspense>
  );
}
