'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, UserCircleIcon, LogOutIcon, HistoryIcon } from 'lucide-react';
import { useUserStore } from '@/store/user-store';
import { authClient } from '@/lib/auth/client';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, userName, setUser, logout } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sessionData?.user && !isLoggedIn) {
      setUser(sessionData.user.name || '', sessionData.user.email || '');
    }
  }, [sessionData, isLoggedIn, setUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-stone-950/80 backdrop-blur-md border-b border-white/10 shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-serif text-amber-500 font-bold tracking-wider">Ramu</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-stone-300 hover:text-amber-500 transition-colors">Beranda</Link>
            <Link href="/#fitur" className="text-sm font-medium text-stone-300 hover:text-amber-500 transition-colors">Fitur</Link>
            <Link href="/#tentang" className="text-sm font-medium text-stone-300 hover:text-amber-500 transition-colors">Tentang Kami</Link>
            
            {mounted && isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="flex items-center gap-2 text-stone-300 hover:text-amber-500 transition-colors py-2">
                    <UserCircleIcon className="size-5 text-amber-500" />
                    <span className="text-sm font-medium">{userName?.split(' ')[0] || 'Pengguna'}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-stone-900 border border-white/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-white/5 mb-2 bg-stone-800/30 rounded-t-xl">
                      <p className="text-sm text-white font-medium truncate">{userName}</p>
                      <p className="text-xs text-stone-400 truncate mt-0.5">{sessionData?.user?.email}</p>
                    </div>
                    <Link href="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:bg-white/5 hover:text-amber-500 transition-colors">
                      <HistoryIcon className="size-4" />
                      Riwayat Pesanan
                    </Link>
                    <button 
                      onClick={async () => {
                        await authClient.signOut();
                        logout();
                        window.location.reload();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-300 hover:bg-white/5 hover:text-red-400 transition-colors text-left"
                    >
                      <LogOutIcon className="size-4" />
                      Keluar
                    </button>
                  </div>
                </div>
                <Link href="/app" className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Buka Dasbor
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-stone-300 hover:text-amber-500 transition-colors">Masuk</Link>
                <Link href="/app" className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Scan Kiosk
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-stone-300 hover:text-amber-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-stone-950/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col space-y-4 shadow-xl h-screen">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-300 hover:text-amber-500">Beranda</Link>
          <Link href="/#fitur" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-300 hover:text-amber-500">Fitur</Link>
          <Link href="/#tentang" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-300 hover:text-amber-500">Tentang Kami</Link>
          
          <div className="pt-6 mt-2 border-t border-white/10 flex flex-col space-y-4">
            {mounted && isLoggedIn ? (
              <>
                <div className="flex items-center gap-4 text-stone-300 px-2 mb-4 bg-stone-900/50 p-4 rounded-2xl border border-white/5">
                  <UserCircleIcon className="size-12 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-medium text-white truncate">{userName || 'Pengguna'}</div>
                    <div className="text-sm text-stone-400 truncate mt-1">{sessionData?.user?.email}</div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/history" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-stone-300 hover:text-amber-500 hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-white/5"
                  >
                    <HistoryIcon className="size-5" />
                    <span className="text-lg">Riwayat Pesanan</span>
                  </Link>
                  <button 
                    onClick={async () => {
                      await authClient.signOut();
                      logout();
                      setIsMobileMenuOpen(false);
                      window.location.reload();
                    }}
                    className="flex items-center gap-3 text-stone-300 hover:text-red-400 hover:bg-red-500/10 p-4 rounded-xl transition-colors border border-transparent hover:border-red-500/10 text-left"
                  >
                    <LogOutIcon className="size-5" />
                    <span className="text-lg">Keluar</span>
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-300 hover:text-amber-500">Masuk / Daftar</Link>
            )}
            
            <Link href="/app" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-4 rounded-xl font-bold transition-all mt-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              {mounted && isLoggedIn ? 'Buka Dasbor' : 'Scan Kiosk'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
