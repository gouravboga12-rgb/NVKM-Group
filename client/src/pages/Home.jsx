import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

// Local fallback products — renders instantly if API is unavailable
const FALLBACK_PRODUCTS = [
  {
    id: 'tomato-powder-250g',
    name: 'Tomato Powder 250 Grams',
    category: 'Tomato Powder',
    shortDesc: 'Experience the pure, natural goodness of NVKM Dry-Fresh Tomato Powder — crafted for health-conscious consumers and professional culinary applications.',
    longDesc: '',
    benefits: ['100% Pure & Natural Farm-Fresh Tomatoes', 'Rich in Lycopene, Vitamin C, and Antioxidants', 'No artificial preservatives, colors, or additives', 'Ideal for soups, gravies, sauces, and culinary use'],
    ingredients: '100% Pure Dehydrated Farm-Fresh Tomatoes',
    usage: 'Add 1-2 teaspoons to soups, curries, pasta sauces, or gravies.',
    image: '/products images/tomato_main.png',
    images: ['/products images/tomato_main.png', '/products images/tomato_2.png', '/products images/tomato_3.png', '/products images/tomato_4.png'],
    rating: 4.7,
    reviewsCount: 22,
    badge: 'New',
    variations: [{ weight: '250g', price: 150, discountPrice: 150 }],
    reviews: []
  },
  {
    id: 'raw-banana-powder-250g',
    name: 'Raw Banana Powder 250 Grams',
    category: 'Banana Powder',
    shortDesc: 'Experience the pure, natural goodness of NVKM Dry-Fresh Banana Powder — crafted for health-conscious consumers and professional culinary applications.',
    longDesc: '',
    benefits: ['100% Pure & Natural Farm-Fresh Raw Banana', 'Rich in Resistant Starch, Potassium, and Dietary Fiber', 'Supports digestion, gut health, and natural energy', 'Gluten-free, vegan-friendly, zero artificial preservatives'],
    ingredients: '100% Pure Dehydrated Farm-Fresh Raw Banana',
    usage: 'Add 1-2 tablespoons to baby food, porridge, smoothies, or baking recipes.',
    image: '/products images/banana_main.png',
    images: ['/products images/banana_main.png', '/products images/banana_2.png', '/products images/banana_3.png'],
    rating: 4.8,
    reviewsCount: 31,
    badge: 'Bestseller',
    variations: [{ weight: '250g', price: 180, discountPrice: 150 }],
    reviews: []
  },
  {
    id: 'moringa-powder-250g',
    name: 'Moringa Powder 250 Grams',
    category: 'Moringa Powder',
    shortDesc: 'Experience the pure, natural goodness of NVKM Dry-Fresh Moringa Leaves Powder — crafted for health-conscious consumers and professional culinary applications.',
    longDesc: '',
    benefits: ['100% Pure Organic Moringa Oleifera Leaf Powder', 'Rich in Antioxidants, Vitamin A, Vitamin C, Iron, and Calcium', 'Supports immune defense, skin health, and energy levels', 'Natural anti-inflammatory and detoxifying properties'],
    ingredients: '100% Pure Organic Dried Moringa Leaves',
    usage: 'Take 1 teaspoon daily. Mix in warm water, herbal teas, or smoothies.',
    image: '/products images/moringa_main.png',
    images: ['/products images/moringa_main.png', '/products images/moringa_2.png', '/products images/moringa_3.png'],
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Bestseller',
    variations: [{ weight: '250g', price: 180, discountPrice: 150 }],
    reviews: []
  },
  {
    id: '4-inch-long-cotton-wicks',
    name: '4 inch Long Cotton Wicks',
    category: 'Pooja Accessories',
    shortDesc: 'Pure white 4-inch long cotton wicks, pack of 100 count. Premium 1st quality cotton for oil lamps and religious puja ceremonies.',
    longDesc: '',
    benefits: ['100% Pure White First Quality Cotton', 'Pack of 100 wicks — excellent value for daily use', 'Precise 4-inch length for standard oil lamps', 'Clean, steady burn with no black smoke'],
    ingredients: '100% Pure White Cotton',
    usage: 'Place wick in lamp, soak in oil or ghee before lighting.',
    image: '/products images/cotton_wicks_main.png',
    images: ['/products images/cotton_wicks_main.png', '/products images/cotton_wicks_2.png', '/products images/cotton_wicks_3.png', '/products images/cotton_wicks_4.png'],
    rating: 4.9,
    reviewsCount: 56,
    badge: '100 Count',
    variations: [{ weight: '100 Wicks', price: 6.00, discountPrice: 6.00 }],
    reviews: []
  }
];

const categories = [
  { name: 'Tomato Powder', icon: 'fa-solid fa-apple-whole', color: 'from-red-100 to-orange-100', text: 'Rich in lycopene & Vitamin C, perfect for culinary bases.' },
  { name: 'Banana Powder', icon: 'fa-solid fa-seedling', color: 'from-amber-100 to-yellow-100', text: 'Rich in potassium & fiber, ideal for infants & baking.' },
  { name: 'Carrot Powder', icon: 'fa-solid fa-carrot', color: 'from-orange-100 to-amber-100', text: 'Rich in beta-carotene & Vitamin A for natural wellness.' },
  { name: 'Beetroot Powder', icon: 'fa-solid fa-heart-pulse', color: 'from-pink-100 to-red-100', text: 'Loaded with nitrates & iron for stamina and active life.' },
  { name: 'Moringa Powder', icon: 'fa-solid fa-leaf', color: 'from-sky-100 to-blue-100', text: 'Organic leaves superfood filled with minerals & antioxidants.' },
  { name: 'Pooja Accessories', icon: 'fa-solid fa-hands-praying', color: 'from-yellow-100 to-orange-200', text: 'Hand-made pure cotton round and long wicks for daily puja.' }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const featuredSlugs = ['tomato-powder-250g', 'raw-banana-powder-250g', 'moringa-powder-250g', '4-inch-long-cotton-wicks'];
        const featured = res.data.filter(p => featuredSlugs.includes(p.id));
        if (featured.length > 0) setFeaturedProducts(featured);
      })
      .catch(() => {/* silently use fallback */ })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (catName) => {
    navigate(`/shop?category=${encodeURIComponent(catName)}`);
  };

  const GENERAL_WA_MSG = 'Hello NVKM GROUP, I am interested in your natural powder products.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 page-transition">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-10 sm:py-20 lg:py-32 bg-gradient-to-br from-[#0A192F] via-[#0D2447] to-[#050B14] rounded-[24px] sm:rounded-[40px] text-white shadow-2xl mt-4">
        {/* Soft background decor blurs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 px-4 xs:px-6 sm:px-12 lg:px-16">
          <div className="lg:col-span-7 space-y-6 lg:space-y-7 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-blue-800/40 border border-blue-700/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#38BDF8] shadow-sm animate-pulse-glow">
              <i className="fa-solid fa-leaf text-xs" /> 100% Pure, Organic &amp; Natural
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.15] tracking-tight text-white">
              Premium Natural Fruit &amp; <span className="bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#93C5FD] bg-clip-text text-transparent">Vegetable Powders</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              NVKM GROUP manufactures nutrient-rich powders for daily wellness. Sourced from natural harvests and processed under strict hygienic standards — healthy, organic, and preservative-free nutrition for retail &amp; wholesale buyers.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <button onClick={() => navigate('/shop')} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl shadow-blue-950/40 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 text-xs uppercase tracking-wider">
                <i className="fa-solid fa-cart-shopping" /> Shop Our Powders
              </button>
              <a href={`https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}`} target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 text-xs uppercase tracking-wider">
                <i className="fa-brands fa-whatsapp text-base text-sky-400" /> Contact on WhatsApp
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-4 border-t border-white/10 mt-4">
              {[['fa-certificate', 'FSSAI Certified'], ['fa-leaf', 'Zero Preservatives'], ['fa-truck', 'Fast Delivery'], ['fa-shield-halved', 'Quality Tested']].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-[11px] text-slate-300 font-semibold">
                  <i className={`${icon} text-[#38BDF8] text-xs`} /> {label}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative max-w-sm mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] sm:rounded-[40px] shadow-2xl animate-float">
              <img
                src="/products images/moringa_main.png"
                alt="Moringa Powder 250 Grams"
                className="w-full h-48 sm:h-56 object-cover rounded-[20px] sm:rounded-[30px] shadow-md border border-white/5"
              />
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">Moringa Powder</h3>
                  <span className="text-xs text-[#38BDF8] font-bold">⭐ 4.9 · Bestseller Powder</span>
                </div>
                <div className="bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-3.5 py-1.5 rounded-2xl text-[#38BDF8] text-sm font-extrabold shadow-sm">
                  ₹150 <span className="text-[10px] font-normal text-slate-300">/ 250g</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-2 text-xs text-slate-300 text-center font-bold">Pack size: 250g</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {[
          ['500+', 'Happy Customers'],
          ['6+', 'Product Variants'],
          ['100%', 'Natural & Organic'],
          ['48hr', 'Express Delivery']
        ].map(([num, label]) => (
          <div key={label} className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-glow-blue">
            <div className="font-heading font-extrabold text-2xl sm:text-4xl text-[#0F2942] tracking-tight">{num}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1.5 font-bold uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Healthy &amp; Nutritious</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#111827]">Benefits of Natural Powders</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Our powders are produced from chosen natural produce, containing high nutrition concentration to enrich your daily diet.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'fa-certificate', title: '100% Pure & Natural', desc: 'No added preservatives, artificial flavorings, MSG, colorants, or binding fillers. You experience only pure organic nutrients directly from nature.' },
            { icon: 'fa-dna', title: 'Nutrient Lock-in System', desc: 'Our low-temperature dehydration process preserves high vitamins, dietary fibers, enzymes, and active mineral profiles of fresh raw ingredients.' },
            { icon: 'fa-box', title: 'Food-Grade Packaging', desc: 'Packaged in food-safe standup ziplock bags that block UV rays, keeping powders moisture-free with a long shelf life of up to 12 months.' }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0F2942] flex items-center justify-center text-xl mb-6 shadow-inner border border-blue-100/50">
                <i className={`fa-solid ${icon}`} />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#111827]">{title}</h3>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Explore Range</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-[#111827]">Product Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">We manufacture a diverse range of fruit, vegetable, health, and botanical powders catering to all nutritional needs.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="group bg-white border border-slate-100 p-4 sm:p-6 rounded-[20px] sm:rounded-[30px] hover:border-[#38BDF8] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-[#0F2942] text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm border border-black/5`}>
                <i className={cat.icon} />
              </div>
              <div className="mt-5">
                <h3 className="font-heading font-extrabold text-sm md:text-base text-[#111827] group-hover:text-[#0F2942] transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed font-semibold">{cat.text}</p>
              </div>
              <span className="text-xs font-bold text-[#0F2942] flex items-center gap-1.5 mt-5 group-hover:translate-x-1.5 transition-all">
                Shop Now <i className="fa-solid fa-arrow-right text-[9px]" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Best Sellers</span>
            <h2 className="font-heading font-extrabold text-3xl text-[#111827] mt-1">Featured Products</h2>
          </div>
          <button onClick={() => navigate('/shop')} className="text-sm font-bold text-[#0F2942] hover:text-[#2563EB] flex items-center gap-1.5 mt-4 sm:mt-0 transition-colors">
            View All Products <i className="fa-solid fa-arrow-right text-xs" />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F2942]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── WHOLESALE BANNER ── */}
      <section className="py-4">
        <div className="bg-gradient-to-tr from-[#0F2942] to-blue-900 text-white rounded-[24px] sm:rounded-[35px] p-6 sm:p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right_bottom,rgba(56,189,248,0.15),transparent)] pointer-events-none" />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="bg-blue-800 text-[#38BDF8] border border-blue-700/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Wholesale &amp; Retail Supplier</span>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl leading-tight">Are You Looking For Bulk Powder Purchase?</h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto md:mx-0 font-light">
              As a direct manufacturer, NVKM GROUP supplies bulk orders to food processing brands, bakeries, juice centers, cosmetics makers, and retailers worldwide. We provide custom packaging, special wholesale tier pricing, and guaranteed fresh supply batches.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <a href={`https://wa.me/9014274293?text=${encodeURIComponent('Hello NVKM GROUP, I am interested in bulk wholesale rates. Please share your catalog.')}`} target="_blank" rel="noreferrer" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-base" /> Get Wholesale Quote
              </a>
              <button onClick={() => navigate('/contact')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors">
                Contact Sales Team
              </button>
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shrink-0 text-left">
            <h3 className="font-heading font-bold text-sm border-b border-white/10 pb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-truck-fast text-[#38BDF8]" /> Bulk Order Specs
            </h3>
            <ul className="space-y-2 text-xs font-light text-slate-200">
              {['Min Order: 5 kg', 'Custom bag / label size', 'Up to 40% bulk discount', 'Lab purity test reports', 'PAN India shipping'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <i className="fa-solid fa-circle text-[6px] text-[#38BDF8]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Our Commitment</span>
          <h2 className="font-heading font-extrabold text-3xl text-[#111827]">Why Choose NVKM GROUP</h2>
          <p className="text-sm text-slate-500 leading-relaxed">We maintain the highest purity benchmarks and strive to create a seamless delivery process for healthy lifestyle seekers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: 'fa-seedling', title: '100% Organic', desc: 'Purity direct from green farm harvests.' },
            { icon: 'fa-award', title: 'Premium Quality', desc: 'Processed under certified hygiene guidelines.' },
            { icon: 'fa-tags', title: 'Best Rates', desc: 'Dynamic wholesale discounts available.' },
            { icon: 'fa-truck', title: 'Fast Delivery', desc: 'Express door shipping across towns.' },
            { icon: 'fa-handshake-angle', title: 'Secure Support', desc: 'Instant personal support via WhatsApp.' }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F2942] flex items-center justify-center text-lg mb-4">
                <i className={`fa-solid ${icon}`} />
              </div>
              <h4 className="font-heading font-bold text-sm text-[#111827]">{title}</h4>
              <p className="text-[11px] text-slate-400 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Verified Reviews</span>
          <h2 className="font-heading font-extrabold text-3xl text-[#111827]">Customer Testimonials</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Here is what health-minded families and business buyers say about NVKM powders.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { q: "NVKM's Banana Powder has become a staple for my baby's daily meals. Completely natural and very easy to prepare. Excellent texture and great aroma!", name: 'Priya Madhav', role: 'Mother of 10-month-old', initial: 'P' },
            { q: "We order Moringa powder in bulk batches of 20 kg for our energy bar brand. The color is bright green, indicating premium freshness. Naveen's service is top notch.", name: 'Ramesh Reddy', role: 'B2B Health Foods Maker', initial: 'R' },
            { q: "The Ashwagandha vitality mix is incredibly pure. I feel very active and immune from normal seasonal colds. Highly recommended daily supplement.", name: 'Kiran Prasad', role: 'Retail Customer', initial: 'K' }
          ].map(({ q, name, role, initial }) => (
            <div key={name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-0.5 mb-4 text-amber-400 text-sm">
                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{q}"</p>
              <div className="mt-4 border-t pt-3 border-slate-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0F2942] text-xs">{initial}</div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">{name}</h4>
                  <span className="text-[10px] text-slate-400">{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <section className="py-4 mb-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase">Healthy Inspirations</span>
          <h2 className="font-heading font-extrabold text-3xl text-[#111827]">Social Proof &amp; Lifestyle</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Follow our organic manufacturing steps and see how health experts use natural powders.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: '/products images/moringa_main.png', label: 'Moringa Powder' },
            { src: '/products images/banana_main.png', label: 'Raw Banana Powder' },
            { src: '/products images/beetroot_main.png', label: 'Beetroot Powder' },
            { src: '/products images/carrot_main.png', label: 'Carrot Powder' }
          ].map(({ src, label }, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group">
              <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#0F2942]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                <i className="fa-solid fa-leaf text-2xl" />
                <span className="text-xs font-bold text-center px-2">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
