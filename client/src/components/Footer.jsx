import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#05111E] text-slate-300 font-light border-t border-blue-950/40 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-950/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 relative z-10">
        
        {/* Brand */}
        <div className="space-y-4 sm:space-y-5 md:col-span-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="NVKM GROUP Logo" 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl object-contain bg-white/5 p-1 shadow-md border border-white/10"
            />
            <span className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-white">NVKM <span className="text-secondary">GROUP</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">NVKM GROUP manufactures premium natural fruit & vegetable powders. 100% organic, preservative-free, and nutrient-rich for healthy living.</p>
          <div className="flex space-x-3 mt-4">
            {[['fa-facebook-f', '#'], ['fa-instagram', '#'], ['fa-whatsapp', 'https://wa.me/9014274293'], ['fa-youtube', '#']].map(([icon, link], idx) => (
              <a 
                key={idx} 
                href={link} 
                target={link.startsWith('http') ? '_blank' : undefined} 
                rel={link.startsWith('http') ? 'noreferrer' : undefined} 
                className="w-9 h-9 bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/35 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <i className={`fa-brands ${icon} text-xs`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links + Categories: 2-col on mobile, separate cols on md+ */}
        <div className="grid grid-cols-2 md:contents gap-6 md:col-span-5">
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4 sm:mb-5">Quick Links</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs font-semibold">
              <li><Link to="/" className="text-slate-400 hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-secondary transition-colors">Shop Products</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-secondary transition-colors">About NVKM GROUP</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="text-slate-400 hover:text-secondary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h3 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-4 sm:mb-5">Categories</h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs font-semibold">
              <li><Link to="/shop?category=Tomato+Powder" className="text-slate-400 hover:text-secondary transition-colors">Tomato Powder</Link></li>
              <li><Link to="/shop?category=Banana+Powder" className="text-slate-400 hover:text-secondary transition-colors">Banana Powder</Link></li>
              <li><Link to="/shop?category=Moringa+Powder" className="text-slate-400 hover:text-secondary transition-colors">Moringa Powder</Link></li>
              <li><Link to="/shop?category=Beetroot+Powder" className="text-slate-400 hover:text-secondary transition-colors">Beetroot Powder</Link></li>
              <li><Link to="/shop?category=Pooja+Accessories" className="text-slate-400 hover:text-secondary transition-colors">Pooja Accessories</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-3">
          <h3 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider mb-5">Contact Details</h3>
          <ul className="space-y-3 text-xs font-semibold">
            <li className="flex items-start gap-2.5 text-slate-400"><i className="fa-solid fa-location-dot text-secondary mt-0.5 text-xs"></i><span>NVKM GROUP Manufacturing,<br />Andhra Pradesh, India</span></li>
            <li className="flex items-center gap-2.5 text-slate-400"><i className="fa-solid fa-phone text-secondary text-xs"></i><a href="tel:9014274293" className="hover:text-secondary transition-colors">+91 90142 74293</a></li>
            <li className="flex items-center gap-2.5 text-slate-400"><i className="fa-solid fa-phone text-secondary text-xs"></i><a href="tel:7075604700" className="hover:text-secondary transition-colors">+91 70756 04700</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-950/60 py-6 px-4 relative z-10 bg-black/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-semibold">
          <span>© {new Date().getFullYear()} NVKM GROUP. All rights reserved.</span>
          <span>Premium Natural Powder Products | Made with <i className="fa-solid fa-heart text-red-500 text-[10px] animate-pulse"></i> in India</span>
        </div>
      </div>
    </footer>
  );
}
