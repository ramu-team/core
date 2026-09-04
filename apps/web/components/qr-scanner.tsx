'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { XIcon } from 'lucide-react';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScanSuccess, onClose }: QrScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  const handleStop = useCallback(async (callback: () => void) => {
    if (scannerRef.current && isScanning.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        // Abaikan error saat menghentikan kamera
      } finally {
        isScanning.current = false;
        callback();
      }
    } else {
      callback();
    }
  }, []);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader', {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });
    
    scannerRef.current = html5QrCode;
    let mounted = true;

    const startScanning = async () => {
      try {
        if (!isScanning.current) {
          isScanning.current = true;
          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              // Buat ukuran kotak QR menjadi dinamis sesuai resolusi kamera HP
              qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdgePercentage = 0.7; // 70% dari ukuran terkecil
                const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                return {
                  width: qrboxSize,
                  height: qrboxSize
                };
              }
            },
            (decodedText) => {
              if (mounted) {
                handleStop(() => {
                  if (mounted) onScanSuccess(decodedText);
                });
              }
            },
            () => {
              // Abaikan kegagalan deteksi (terjadi terus-menerus setiap frame)
            }
          );
          
          if (!mounted) {
            try {
              html5QrCode.stop().catch(() => {});
            } catch (e) {
              // Ignore
            }
          }
        }
      } catch (err: unknown) {
        if (mounted) {
          isScanning.current = false;
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(errorMessage || 'Gagal mengakses kamera. Pastikan Anda telah memberikan izin.');
        }
      }
    };

    // Jeda 500ms untuk menghindari race-condition dari React Strict Mode
    // yang menyebabkan AbortError saat memuat kamera
    const timeoutId = setTimeout(() => {
      if (mounted) {
        startScanning();
      }
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      isScanning.current = false;
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [handleStop, onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-xl font-serif text-white">Scan Kiosk</h3>
            <p className="text-stone-400 text-sm">Arahkan kamera ke layar Kiosk</p>
          </div>
          <button 
            onClick={() => handleStop(onClose)}
            className="p-2 rounded-full bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <XIcon className="size-6" />
          </button>
        </div>

        <div className="relative bg-black w-full min-h-[300px] flex items-center justify-center">
          {error ? (
            <div className="p-6 text-center text-red-400">
              <p className="font-medium mb-2">Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : (
            <div id="reader" className="w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
