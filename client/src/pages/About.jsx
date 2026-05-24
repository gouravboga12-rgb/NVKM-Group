export default function About() {
  const GENERAL_WA_MSG = 'Hello NVKM GROUP, I would like to know more about your company and products.';

  const coreValues = [
    { icon: 'fa-award', title: 'Quality First', desc: 'Zero compromises on raw harvest selection.', color: 'from-emerald-500 to-green-600' },
    { icon: 'fa-seedling', title: 'Natural Content', desc: '100% preservative-free powders.', color: 'from-green-500 to-teal-600' },
    { icon: 'fa-heart-pulse', title: 'Daily Nutrition', desc: 'Formulated to enrich bodily health.', color: 'from-teal-500 to-emerald-600' },
    { icon: 'fa-shield-halved', title: 'Total Trust', desc: 'Transparency in origins and labeling.', color: 'from-emerald-600 to-green-700' },
    { icon: 'fa-face-smile-wink', title: 'Satisfaction', desc: 'Reliable logistics and fast customer response.', color: 'from-green-600 to-emerald-700' }
  ];

  const timeline = [
    { year: '2020', event: 'NVKM GROUP founded in Bathalapalli by Janagonda Naveen with a vision for pure natural powders.', icon: 'fa-flag' },
    { year: '2021', event: 'Launched Banana Powder — quickly became a bestseller for infant and health food consumers.', icon: 'fa-seedling' },
    { year: '2022', event: 'Expanded to Moringa Powder, Fruit Powders, and Vegetable Powder product lines.', icon: 'fa-leaf' },
    { year: '2023', event: 'Started B2B wholesale supply to food manufacturers, bakeries, and nutrition brands.', icon: 'fa-handshake' },
    { year: '2024', event: 'Achieved 500+ satisfied customers and expanded to online direct ordering platform.', icon: 'fa-trophy' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16 page-transition">

      {/* ── PAGE HEADER ── */}
      <div className="text-center max-w-2xl mx-auto space-y-4" data-aos="fade-up">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wider uppercase shadow-sm">
          <i className="fa-solid fa-leaf" /> Our Heritage
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#111827] bg-gradient-to-r from-[#111827] to-[#14532d] bg-clip-text text-transparent">
          About NVKM GROUP
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
          Providing high-quality natural fruit and vegetable nutrition powders for retail &amp; wholesale wellness customers across India.
        </p>
      </div>

      {/* ── FOUNDER STORY ── */}
      <div data-aos="fade-up" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center glass-premium rounded-[38px] p-6 sm:p-10 shadow-2xl">
        <div className="lg:col-span-5 relative rounded-[28px] overflow-hidden aspect-[4/5] shadow-2xl group w-full max-w-md mx-auto lg:max-w-none">
          <img
            src="/about_hero.png"
            alt="NVKM GROUP - Natural Powders"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-lg">
            <h3 className="font-heading font-extrabold text-sm text-slate-900">100% Pure &amp; Natural</h3>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Sourced &amp; Processed Locally</span>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-5 text-left">
          <span className="inline-flex items-center bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">
            Manufacturing Business
          </span>
          <h2 className="font-heading font-black text-3xl text-slate-900 leading-tight">
            Our Roots &amp; Commitment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Established under the visionary leadership of <strong>Janagonda Naveen</strong>, <strong>NVKM GROUP</strong> was founded to address the lack of fresh, preservative-free nutritional powders in the market. Operating from Bathalapalli, Sri Sathya Sai district, our manufacturing plant sources fresh seasonal fruits and green harvests directly from local farms.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            By avoiding any artificial preservatives, colorants, starch fillers, or sugars, we ensure that every spoonful of our powders contains wholesome, raw biological energy. We serve customers in both <strong>Retail and Wholesale markets</strong>, with physical store pick-up and express door delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 mt-2">
            {[
              { icon: 'fa-circle-check', label: 'Sales Options', value: 'Retail & Wholesale' },
              { icon: 'fa-store', label: 'Store Availability', value: 'Store Pick-up' },
              { icon: 'fa-map-pin', label: 'Location', value: 'Bathalapalli, AP' },
              { icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', value: '+91 9014274293', href: `https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}` }
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-50/50 to-white border border-emerald-100/50 hover:shadow-md transition-all duration-300">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">{label}</span>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#14532D] hover:text-[#22C55E] flex items-center gap-1.5 mt-1.5 transition-colors">
                    <i className={`${icon} text-[#22C55E]`} /> {value}
                  </a>
                ) : (
                  <span className="text-xs font-extrabold text-[#14532D] flex items-center gap-1.5 mt-1.5">
                    <i className={`fa-solid ${icon} text-[#22C55E]`} /> {value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VISION & MISSION ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision */}
        <div data-aos="fade-right" className="bg-gradient-to-br from-[#14532d] to-[#065f46] text-white p-8 sm:p-10 rounded-[38px] relative overflow-hidden shadow-2xl hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-radial-gradient(circle,rgba(74,222,128,.2),transparent) pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-[150px] h-[150px] rounded-full bg-radial-gradient(circle,rgba(74,222,128,.1),transparent) pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 shadow-lg border border-white/10">
            <i className="fa-solid fa-eye text-xl text-[#4ADE80]" />
          </div>
          <h3 className="font-heading font-black text-2xl mb-4 tracking-tight">Our Vision</h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            To provide healthy and natural nutrition products to customers worldwide through premium quality fruit, vegetable, and herbal powders — cultivating a toxicant-free natural lifestyle and empowering communities through nutrition.
          </p>
        </div>
        {/* Mission */}
        <div data-aos="fade-left" className="glass-premium p-8 sm:p-10 rounded-[38px] relative overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] rounded-full bg-radial-gradient(circle,rgba(34,197,94,.08),transparent) pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 shadow-inner border border-emerald-100">
            <i className="fa-solid fa-bullseye text-xl text-[#16a34a]" />
          </div>
          <h3 className="font-heading font-black text-2xl mb-4 text-slate-900 tracking-tight">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            To manufacture and deliver high-quality, pure natural powders while maintaining complete freshness, high nutrition value, affordable retail-wholesale pricing, and total customer satisfaction — with complete origin transparency.
          </p>
        </div>
      </div>

      {/* ── JOURNEY TIMELINE ── */}
      <div data-aos="fade-up" className="glass-premium rounded-[38px] p-6 sm:p-10 shadow-xl">
        <div className="text-center mb-10">
          <span className="text-[10px] font-extrabold text-[#22c55e] tracking-widest uppercase">Our Journey</span>
          <h2 className="font-heading font-black text-3xl text-slate-900 mt-2">Company Milestones</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full mx-auto mt-3" />
        </div>

        <div className="relative max-w-3xl mx-auto pl-8 sm:pl-16">
          {/* Vertical connector line */}
          <div className="absolute left-6 sm:left-14 top-4 bottom-4 w-[3px] bg-gradient-to-b from-[#14532d] via-[#22c55e] to-slate-100 rounded-full" />

          <div className="flex flex-col gap-6">
            {timeline.map(({ year, event, icon }, i) => (
              <div key={year} data-aos="fade-up" data-aos-delay={i * 100} className="flex gap-4 sm:gap-6 items-start relative group">
                {/* Node */}
                <div className="w-12 h-12 rounded-full flex-shrink-0 z-10 bg-gradient-to-tr from-[#14532d] to-[#22c55e] flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-115 transition-all duration-300 absolute -left-6 sm:-left-14">
                  <i className={`fa-solid ${icon} text-white text-xs`} />
                </div>
                {/* Card */}
                <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                  <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">{year}</span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORE VALUES ── */}
      <div>
        <div className="text-center mb-10" data-aos="fade-up">
          <span className="text-[10px] font-extrabold text-[#22c55e] tracking-widest uppercase">What We Stand For</span>
          <h2 className="font-heading font-black text-3xl text-slate-900 mt-2">Our Core Values</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {coreValues.map(({ icon, title, desc }, i) => (
            <div key={title} data-aos="fade-up" data-aos-delay={i * 80} className="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14532d] to-[#22c55e] flex items-center justify-center text-white text-lg mx-auto mb-4 shadow-md">
                <i className={`fa-solid ${icon}`} />
              </div>
              <h4 className="font-heading font-extrabold text-sm text-slate-900">{title}</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-semibold">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div data-aos="fade-up" className="bg-gradient-to-tr from-[#14532d] via-[#065f46] to-[#064e3b] rounded-[38px] p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(74,222,128,.15),transparent_65%)] pointer-events-none" />
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-radial-gradient(circle,rgba(74,222,128,.08),transparent) pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl mb-4 tracking-tight">
            Ready to Experience Pure Natural Nutrition?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-md mx-auto mb-8 leading-relaxed font-medium">
            Join hundreds of health-conscious families and businesses who trust NVKM GROUP for their daily nutrition powders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/shop" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs py-4 px-8 rounded-2xl shadow-xl shadow-green-950/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 uppercase tracking-wider">
              <i className="fa-solid fa-cart-shopping" /> Browse Products
            </a>
            <a href={`https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}`} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-xs py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 uppercase tracking-wider">
              <i className="fa-brands fa-whatsapp text-emerald-400 text-base" /> Chat With Us
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
