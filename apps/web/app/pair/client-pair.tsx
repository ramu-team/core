'use client';

import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Image from 'next/image';
import { Button } from '@ramu/ui/components/button';
import { CheckCircle2Icon, LoaderIcon } from 'lucide-react';

interface ClientPairProps {
  sessionId: string;
  menu: {
    name: string;
    description: string | null;
    image_url: string | null;
    ingredients: string[];
  } | null;
}

export default function ClientPair({ sessionId, menu }: ClientPairProps) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'confirmed'>('connecting');
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'wss://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8884/mqtt';
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
    const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;
    
    const mqttClient = mqtt.connect(brokerUrl, { username, password });
    const topic = `${topicPrefix}/pair/${sessionId}`;

    mqttClient.on('connect', () => {
      setClient(mqttClient);
      setStatus('connected');
      // Beritahu Kiosk bahwa HP sudah terhubung
      mqttClient.publish(topic, JSON.stringify({ status: 'connected' }));
    });

    return () => {
      mqttClient.end();
    };
  }, [sessionId]);

  const handleConfirm = () => {
    if (!client) return;
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const topic = `${topicPrefix}/pair/${sessionId}`;
    
    // Beritahu Kiosk bahwa pesanan dikonfirmasi
    client.publish(topic, JSON.stringify({ status: 'confirmed' }));
    setStatus('confirmed');
  };

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-6">
        <CheckCircle2Icon className="size-28 text-emerald-500 shadow-emerald-500/20 drop-shadow-lg" strokeWidth={1.5} />
        <h1 className="text-4xl font-serif font-bold text-stone-900">Pesanan Diterima!</h1>
        <p className="text-stone-500 text-xl font-light">Silakan lihat layar Kiosk Anda, mesin sedang bersiap meracik jamu spesial untuk Anda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-amber-500 text-stone-950 p-8 shadow-md rounded-b-[2.5rem]">
        <h1 className="text-3xl font-serif font-bold text-center mt-4">Konfirmasi Jamu</h1>
      </div>

      <div className="flex-1 px-6 py-10 flex flex-col items-center space-y-8 max-w-md mx-auto w-full">
        {menu ? (
          <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-xl border border-stone-100">
            <div className="relative w-full h-64 bg-stone-100">
              {menu.image_url ? (
                <Image src={menu.image_url} alt={menu.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-medium">Tanpa Gambar</div>
              )}
            </div>
            <div className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3">{menu.name}</h2>
              <p className="text-stone-500 text-base mb-6 leading-relaxed line-clamp-3">{menu.description}</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {menu.ingredients.map((ing, i) => (
                  <span key={i} className="bg-stone-50 border border-stone-200 text-stone-600 px-4 py-1.5 rounded-full text-sm font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-8 text-center bg-white rounded-3xl shadow-sm border border-stone-100 text-stone-600">
            Memuat data pesanan...
          </div>
        )}

        <div className="w-full mt-auto pt-8">
          <Button 
            onClick={handleConfirm} 
            disabled={status !== 'connected'}
            className="w-full h-16 rounded-full text-xl font-bold shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-amber-500 hover:bg-amber-600 text-stone-950 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {status === 'connecting' ? (
              <span className="flex items-center gap-3">
                <LoaderIcon className="animate-spin size-6" /> Menghubungkan...
              </span>
            ) : (
              'KONFIRMASI SEKARANG'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
