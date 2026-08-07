'use client';

import { useState, useTransition } from 'react';

import { useKioskStore } from '@/store/kiosk-store';
import { activateMachineAction } from '@/app/actions';
import { Button } from '@ramu/ui/components/button';
import { Input } from '@ramu/ui/components/input';
import { LeafIcon, ArrowRightIcon, LoaderIcon, CpuIcon } from 'lucide-react';

export default function SetupClient() {

  const { registerMachine } = useKioskStore();
  const [code, setCode] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return;

    startTransition(async () => {
      const res = await activateMachineAction(code.trim());
      
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.machine) {
        // Save to local storage via Zustand
        registerMachine(res.machine.id, res.machine.registration_code, res.machine.location_name);
        // KioskWrapper will automatically redirect to '/'
      }
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 p-8">
      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] left-[10%] size-[500px] rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[10%] size-[400px] rounded-full bg-emerald-500/5 blur-[80px]" />
      
      <div className="relative z-10 w-full max-w-lg space-y-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/20">
            <LeafIcon className="size-12 text-amber-950" strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-800 tracking-tight text-white">Setup Mesin Kiosk</h1>
            <p className="text-xl text-stone-400">Masukkan kode aktivasi untuk menghubungkan mesin ini ke jaringan Ramu IoT.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-stone-950/60 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="activationCode" className="text-lg font-medium text-stone-300">
                Kode Aktivasi Mesin
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <CpuIcon className="size-6 text-amber-500/50" />
                </div>
                <Input
                  id="activationCode"
                  type="text"
                  placeholder="Contoh: RMU-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={isPending}
                  className="h-20 bg-black/50 border-white/10 pl-14 text-center text-3xl font-bold tracking-widest text-amber-400 placeholder:text-stone-700 focus-visible:ring-amber-500 rounded-2xl transition-all"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending || code.length < 4}
              className="h-20 w-full rounded-2xl bg-amber-500 hover:bg-amber-400 text-2xl font-bold text-amber-950 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="mr-3 size-8 animate-spin" />
                  Mengaktifkan...
                </>
              ) : (
                <>
                  Aktifkan Mesin
                  <ArrowRightIcon className="ml-3 size-8" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-stone-500 text-sm font-medium">
          Dapatkan kode aktivasi dari Dashboard Admin Ramu.
        </div>
      </div>
    </div>
  );
}
