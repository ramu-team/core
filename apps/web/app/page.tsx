import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { SparklesIcon, LeafIcon, SettingsIcon, ChevronRightIcon, QrCodeIcon, SmartphoneIcon, CoffeeIcon } from 'lucide-react';

export default async function LandingPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ session?: string, machineId?: string }> 
}) {
  const params = await searchParams;
  
  // Jika parameter session terdeteksi (hasil scan QR dari Kiosk), arahkan langsung ke App Mode
  if (params.session) {
    const searchString = new URLSearchParams(params as Record<string, string>).toString();
    redirect(`/app?${searchString}`);
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/jamu-hero-bg.png" 
              alt="Jamu Nusantara" 
              fill 
              priority
              className="object-cover opacity-60 mix-blend-luminosity brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/50 border border-amber-500/30 backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">Mesin Jamu Pintar</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] drop-shadow-2xl">
              Tradisi Nusantara,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                Dalam Genggaman.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-stone-300 mb-10 max-w-3xl font-light leading-relaxed drop-shadow-lg">
              Hubungkan HP Anda ke Kiosk Ramu terdekat. Nikmati kemudahan memesan jamu segar yang diracik presisi oleh mesin robotik otomatis.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/app" 
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
              >
                Scan Kiosk Sekarang
                <ChevronRightIcon className="size-5" />
              </Link>
              <Link 
                href="#cara-kerja" 
                className="w-full sm:w-auto px-8 py-4 bg-stone-800/80 hover:bg-stone-700/80 text-white rounded-full font-semibold text-lg backdrop-blur-md border border-white/10 transition-all hover:border-amber-500/50 flex items-center justify-center"
              >
                Cara Kerja
              </Link>
            </div>
          </div>
        </section>

        {/* CARA KERJA SECTION */}
        <section id="cara-kerja" className="py-24 bg-stone-950 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-amber-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Bagaimana Cara Menggunakan Ramu?</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">3 Langkah Mudah</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Garis penghubung (hanya terlihat di desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent z-0"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="size-24 rounded-full bg-stone-900 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <QrCodeIcon className="size-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">1. Temukan Kiosk</h3>
                <p className="text-stone-400 font-light">Kunjungi mesin Kiosk Ramu terdekat, lalu klik tombol <strong className="text-stone-200">Scan Kiosk</strong> pada aplikasi ini.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="size-24 rounded-full bg-stone-900 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <SmartphoneIcon className="size-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">2. Hubungkan HP</h3>
                <p className="text-stone-400 font-light">Arahkan kamera HP Anda ke layar mesin untuk menghubungkan aplikasi dengan Kiosk secara instan.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="size-24 rounded-full bg-stone-900 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <CoffeeIcon className="size-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">3. Pesan & Nikmati</h3>
                <p className="text-stone-400 font-light">Pilih jamu favorit Anda lewat HP, selesaikan pembayaran, dan mesin akan menyeduhnya untuk Anda.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="fitur" className="py-32 bg-stone-900/50 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Harmoni Alam & Teknologi</h2>
              <p className="text-stone-400 max-w-2xl mx-auto text-lg">
                Ramu memadukan warisan leluhur dengan kecerdasan masa kini untuk memberikan pengalaman minum jamu terbaik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-stone-900/50 border border-white/5 rounded-[2rem] p-8 hover:bg-stone-900 hover:border-amber-500/30 transition-all duration-500">
                <div className="size-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                  <SparklesIcon className="size-8" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">Konsultasi AI</h3>
                <p className="text-stone-400 leading-relaxed font-light">
                  Kecerdasan Buatan kami akan menganalisis keluhan Anda langsung dari HP Anda, lalu merekomendasikan racikan jamu yang paling tepat dan aman.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-stone-900/50 border border-white/5 rounded-[2rem] p-8 hover:bg-stone-900 hover:border-amber-500/30 transition-all duration-500 mt-0 md:mt-12">
                <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                  <LeafIcon className="size-8" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">100% Bahan Alami</h3>
                <p className="text-stone-400 leading-relaxed font-light">
                  Menggunakan rempah-rempah pilihan Nusantara yang diseduh tanpa pengawet buatan, menjaga kemurnian dan khasiat asli dari setiap tetesnya.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-stone-900/50 border border-white/5 rounded-[2rem] p-8 hover:bg-stone-900 hover:border-amber-500/30 transition-all duration-500 mt-0 md:mt-24">
                <div className="size-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-500">
                  <SettingsIcon className="size-8" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">Presisi Kiosk Robotik</h3>
                <p className="text-stone-400 leading-relaxed font-light">
                  Setiap takaran diseduh dengan akurasi tinggi menggunakan teknologi mesin Kiosk otomatis kami, memastikan higienitas dan konsistensi rasa yang sempurna.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="tentang" className="py-32 bg-stone-950 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 z-0 hidden lg:block">
            <Image 
              src="/jamu-trad-bg.png" 
              alt="Sejarah Ramu" 
              fill 
              className="object-cover opacity-30 mix-blend-luminosity mask-image-l"
              style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
            />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-amber-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Cerita Kami</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
                Melestarikan yang Pudar,<br/>Menghidupkan yang Baru.
              </h2>
              <div className="space-y-6 text-stone-300 font-light text-lg leading-relaxed">
                <p>
                  Jamu telah menjadi bagian tak terpisahkan dari budaya Nusantara selama berabad-abad. Namun, gaya hidup yang serba cepat seringkali membuat generasi muda melupakan kebaikan rempah alami ini.
                </p>
                <p>
                  Ramu lahir dari kegelisahan tersebut. Kami percaya bahwa tradisi tidak harus kuno. Dengan memadukan kearifan lokal pembuat jamu tradisional dan kepraktisan mesin Kiosk otomatis modern, kami membawa jamu kembali ke kehidupan harian Anda.
                </p>
                <p className="font-medium text-amber-200">
                  Kini, minum jamu tidak hanya sehat, tapi juga se-praktis menyentuh layar pintar di genggaman Anda.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
