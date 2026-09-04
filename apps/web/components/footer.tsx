export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="text-3xl font-serif text-amber-500 font-bold tracking-wider block mb-6">Ramu</span>
            <p className="text-stone-400 leading-relaxed">
              Membawa warisan budaya jamu Nusantara ke era modern melalui teknologi AI dan presisi robotik untuk pengalaman personal dan higienis.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider">Tautan Pintas</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-stone-400 hover:text-amber-500 transition-colors">Beranda</a></li>
              <li><a href="#fitur" className="text-stone-400 hover:text-amber-500 transition-colors">Fitur Kiosk</a></li>
              <li><a href="#tentang" className="text-stone-400 hover:text-amber-500 transition-colors">Cerita Kami</a></li>
              <li><a href="/app" className="text-stone-400 hover:text-amber-500 transition-colors">Buka Aplikasi</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="text-stone-400">info@ramu-kiosk.id</li>
              <li className="text-stone-400">+62 812 3456 7890</li>
              <li className="text-stone-400 mt-4 pt-4 border-t border-white/10">
                Jl. Nusantara No. 45<br/>
                Jakarta Selatan, Indonesia
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-stone-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Ramu Nusantara. Hak cipta dilindungi.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-stone-500 hover:text-amber-500 transition-colors text-sm">Syarat & Ketentuan</a>
            <a href="#" className="text-stone-500 hover:text-amber-500 transition-colors text-sm">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
