'use client';

import { useEffect } from 'react';
import { Button } from '@ramu/ui/components/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Terjadi Kesalahan!</h2>
      <p className="text-muted-foreground max-w-125">
        Sistem mendeteksi adanya kendala saat memuat halaman ini. Silakan coba muat ulang atau kembali ke halaman sebelumnya.
      </p>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => reset()} variant="default">
          Coba Lagi
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Muat Ulang Halaman
        </Button>
      </div>
    </div>
  );
}
