'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user-store';
import mqtt from 'mqtt';
import Image from 'next/image';
import { Button } from '@ramu/ui/components/button';
import { ChevronLeftIcon, LoaderIcon, CheckCircleIcon, SparklesIcon } from 'lucide-react';
import { recommendAIAction } from './actions';

interface Symptom {
  id: string;
  name: string;
  category: string;
}

export default function AIClient({ symptoms }: { symptoms: Symptom[] }) {
  const router = useRouter();
  const { activeSessionId, activeMachineId, addHistory } = useUserStore();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [result, setResult] = useState<{
    consultationId: string;
    menuId: string;
    explanation: string;
    recipe: { name: string; description: string | null; image: string | null; }
  } | null>(null);
  
  const [ordering, setOrdering] = useState(false);

  const toggleSymptom = (name: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleConsult = async () => {
    if (!activeMachineId) {
      setError('ID Mesin tidak ditemukan. Silakan scan ulang Kiosk.');
      return;
    }
    
    if (selectedSymptoms.length === 0 && !customCondition.trim()) {
      setError('Pilih minimal 1 keluhan atau isi keluhan tambahan.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await recommendAIAction({
      machineId: activeMachineId,
      symptoms: selectedSymptoms,
      customCondition: customCondition.trim()
    });

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || 'Terjadi kesalahan.');
    }
    
    setIsLoading(false);
  };

  const handleOrder = () => {
    if (!activeSessionId || !result) return;
    setOrdering(true);

    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL || 'wss://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8884/mqtt';
    const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
    const client = mqtt.connect(brokerUrl, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    });

    const topic = `${topicPrefix}/pair/${activeSessionId}`;
    
    client.on('connect', () => {
      client.publish(topic, JSON.stringify({ 
        status: 'brew', 
        consultationId: result.consultationId,
        menuId: result.menuId
      }));
      client.end();
      
      addHistory({
        id: crypto.randomUUID(),
        type: 'ai',
        title: result.recipe.name,
        description: `Rekomendasi AI: ${result.explanation}`,
        timestamp: Date.now(),
      });

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
        <h1 className="text-xl font-serif font-bold ml-2 text-white">Konsultasi AI</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6 max-w-md mx-auto w-full relative z-10">
        {!result ? (
          <>
            <div className="bg-indigo-900/30 p-5 rounded-2xl border border-indigo-500/20 backdrop-blur-sm">
              <h2 className="text-xl font-serif font-bold text-indigo-300 mb-2 drop-shadow-sm">Apa yang Anda rasakan hari ini?</h2>
              <p className="text-indigo-200/70 text-sm font-light">Pilih keluhan di bawah ini atau ceritakan secara detail pada kolom yang tersedia.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.name)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedSymptoms.includes(s.name) 
                    ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400' 
                    : 'bg-stone-900/50 text-stone-300 border border-white/10 hover:bg-stone-800 backdrop-blur-md'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 mt-8">
              <label className="text-sm font-medium text-stone-400 block">Atau ceritakan lebih detail (Opsional):</label>
              <textarea 
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                placeholder="Contoh: Saya habis lari marathon lutut saya pegal sekali..."
                className="w-full h-32 p-4 rounded-2xl border border-white/10 bg-stone-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-stone-200 placeholder:text-stone-600 backdrop-blur-md"
              />
            </div>

            {error && <div className="text-red-500 text-sm font-medium px-2">{error}</div>}

            <Button 
              onClick={handleConsult}
              disabled={isLoading || (selectedSymptoms.length === 0 && !customCondition.trim())}
              className="w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg shadow-[0_5px_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
            >
              {isLoading ? <LoaderIcon className="animate-spin size-6 mr-2" /> : <SparklesIcon className="size-6 mr-2" />}
              {isLoading ? 'Menganalisis...' : 'Cari Rekomendasi'}
            </Button>
          </>
        ) : (
          <div className="bg-gradient-to-b from-stone-900/90 to-stone-900/50 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[2px] border-white/5 space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <SparklesIcon className="size-8" />
            </div>
            
            <h2 className="text-3xl font-serif font-normal tracking-wide text-white drop-shadow-md">Rekomendasi AI</h2>
            <p className="text-stone-300 bg-stone-950/50 p-5 rounded-2xl text-sm italic border border-white/5 font-light leading-relaxed">
              "{result.explanation}"
            </p>

            <div className="relative w-full h-56 bg-stone-950 rounded-2xl overflow-hidden mt-6 mb-4 border border-white/5">
              {result.recipe.image ? (
                <>
                  <Image src={result.recipe.image} alt={result.recipe.name} fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-80" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">No Image</div>
              )}
            </div>
            
            <h3 className="text-2xl font-serif font-normal text-white">{result.recipe.name}</h3>
            
            <div className="pt-6 border-t border-white/10 mt-6">
              <Button 
                onClick={handleOrder}
                disabled={ordering}
                className={`w-full h-14 rounded-xl font-bold text-lg shadow-[0_5px_20px_rgba(245,158,11,0.2)] ${ordering ? 'bg-emerald-500 text-white opacity-100' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'}`}
              >
                {ordering ? (
                  <>
                    <CheckCircleIcon className="size-6 mr-2" />
                    Memproses di Kiosk...
                  </>
                ) : 'PESAN JAMU INI'}
              </Button>
              
              {!ordering && (
                <Button 
                  variant="ghost" 
                  onClick={() => setResult(null)}
                  className="w-full mt-3 text-stone-400 hover:text-white hover:bg-white/5"
                >
                  Cari Ulang
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
