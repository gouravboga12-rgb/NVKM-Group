// ==========================================
// NVKM GROUP Component Render Templates
// ==========================================

function getCategoryGroup(category) {
  if (!category) return "All";
  const cat = category.toLowerCase();
  if (cat === "pooja accessories") {
    return "Pooja Accessories";
  }
  if (cat === "all") {
    return "All";
  }
  return "Fruits and Vegetable powder";
}

// --- Utility: Star Ratings HTML ---
function getStarsHtml(rating) {
  return `
    <div class="star-rating text-sm">
      <div class="star-rating-lower">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <div class="star-rating-upper" style="width: ${(rating / 5) * 100}%">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
    </div>
  `;
}

// --- Component: Product Card ---
function createProductCardHtml(product) {
  // Use first variation for default pricing
  const defaultVar = product.variations[0];
  const isWishlisted = state.wishlist.includes(product.id);
  const savePercent = Math.round(((defaultVar.price - defaultVar.discountPrice) / defaultVar.price) * 100);

  return `
    <div class="product-card bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between" data-aos="fade-up">
      <div class="relative product-card-img-container aspect-square bg-slate-50 flex items-center justify-center">
        <!-- Badges -->
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
          <span class="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">${product.badge}</span>
          <span class="bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">Save ${savePercent}%</span>
        </div>

        <!-- Wishlist Button -->
        <button onclick="toggleWishlist('${product.id}')" class="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 hover:bg-white text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90" aria-label="Add to Wishlist">
          <i class="${isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'} text-base"></i>
        </button>

        <!-- Product Image -->
        <img src="${product.image}" alt="${product.name}" class="product-card-img cursor-pointer" onclick="navigate('product-detail', '${product.id}')">
        
        <!-- Quick View Overlay -->
        <div class="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button onclick="toggleQuickViewModal(true, '${product.id}')" class="bg-white hover:bg-slate-50 text-primary font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg transition-transform translate-y-4 group-hover:translate-y-0 duration-300">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[10px] font-bold text-accent tracking-widest uppercase">${product.category}</span>
          <h3 onclick="navigate('product-detail', '${product.id}')" class="font-heading font-bold text-base text-darkText mt-1 hover:text-primary cursor-pointer line-clamp-1 transition-colors">${product.name}</h3>
          
          <div class="flex items-center space-x-1.5 mt-1.5">
            ${getStarsHtml(product.rating)}
            <span class="text-xs font-semibold text-slate-500">${product.rating}</span>
          </div>

          <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">${product.shortDesc}</p>
        </div>

        <div>
          <!-- Dynamic price / Weight standard -->
          <div class="mt-4 flex items-baseline gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
            <span class="text-lg font-heading font-extrabold text-primary">₹${defaultVar.discountPrice}</span>
            <span class="text-xs text-slate-400 line-through font-medium">₹${defaultVar.price}</span>
            <span class="text-[10px] text-slate-500 font-semibold ml-auto bg-slate-200/60 px-2 py-0.5 rounded">${defaultVar.weight} Pack</span>
          </div>

          <!-- CTAs -->
          <div class="mt-4 space-y-2">
            <button onclick="addToCart('${product.id}', '${defaultVar.weight}')" class="w-full bg-[#0F2942] hover:bg-[#1D4ED8] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="addToCart('${product.id}', '${defaultVar.weight}', 1, true); toggleCartDrawer(true);" class="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-accent/10">
                <i class="fa-solid fa-bolt"></i> Buy Now
              </button>
              <button onclick="window.open('https://wa.me/9014274293?text=Hello%20NVKM%20GROUP,%20I%20am%20interested%20in%2520purchasing%2520your%2520natural%2520powder:%20${encodeURIComponent(product.name)}%2520(${defaultVar.weight}%2520size).%20Please%20provide%20rates.', '_blank')" class="bg-blue-50/60 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-100 hover:border-transparent font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5">
                <i class="fa-brands fa-whatsapp text-sm"></i> Inquire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Render: Home View ---
function renderHomeView() {
  // Select Banana and Moringa as Featured Products
  const featured = PRODUCTS_DATA.filter(p => p.id === "banana-powder" || p.id === "moringa-powder");
  let featuredHtml = "";
  featured.forEach(p => {
    featuredHtml += createProductCardHtml(p);
  });

  // Unique category listing
  const categories = [
    { name: "Banana Powder", icon: "fa-solid fa-banana", color: "from-amber-100 to-yellow-100", text: "Rich in energy & nutrients, ideal for infants & baking." },
    { name: "Moringa Powder", icon: "fa-solid fa-leaf", color: "from-blue-100 to-sky-100", text: "Organic leaves superfood filled with minerals & antioxidants." },
    { name: "Fruit Powders", icon: "fa-solid fa-lemon", color: "from-orange-100 to-red-100", text: "100% natural fruit powders for refreshments & culinary." },
    { name: "Vegetable Powders", icon: "fa-solid fa-carrot", color: "from-sky-100 to-blue-100", text: "Nutrient-packed dehydrated vegetables for healthy cooking." },
    { name: "Health Powders", icon: "fa-solid fa-mortar-pestle", color: "from-blue-100 to-cyan-100", text: "Immunity adaptogens designed for vitality and active life." },
    { name: "Natural Powders", icon: "fa-solid fa-spa", color: "from-blue-50 to-blue-100", text: "Preservative-free botanical powders for wellness & body care." }
  ];

  let categoriesHtml = "";
  categories.forEach(cat => {
    categoriesHtml += `
      <div onclick="handleCategoryFilter('${cat.name}')" class="group bg-white border border-slate-100 p-6 rounded-3xl hover:border-secondary hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between" data-aos="zoom-in">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-primary text-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <i class="${cat.icon}"></i>
        </div>
        <div class="mt-4">
          <h3 class="font-heading font-bold text-base text-darkText group-hover:text-primary transition-colors">${cat.name}</h3>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">${cat.text}</p>
        </div>
        <span class="text-xs font-bold text-primary flex items-center gap-1 mt-4 group-hover:translate-x-1.5 transition-transform">
          Shop Now <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </span>
      </div>
    `;
  });

  return `
    <!-- Premium Hero Section -->
    <section class="relative overflow-hidden py-16 lg:py-28 bg-gradient-to-br from-[#0F2942] via-[#0b1d2e] to-[#050e17] rounded-[40px] text-white shadow-2xl mt-4">
      <!-- Subtle Background Farm Image Overlay -->
      <div class="absolute inset-0 bg-cover bg-center pointer-events-none" style="background-image: linear-gradient(to bottom right, rgba(15, 41, 66, 0.85), rgba(11, 29, 46, 0.88), rgba(5, 14, 23, 0.92)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&amp;fit=crop&amp;w=1920&amp;q=80')"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.15),transparent)] pointer-events-none"></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 px-6 sm:px-12 lg:px-16">
        
        <div class="lg:col-span-7 space-y-6 text-left" data-aos="fade-right">
          <span class="inline-flex items-center gap-2 bg-blue-800/60 border border-blue-700/50 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-secondary shadow-sm">
            <i class="fa-solid fa-leaf"></i> 100% Pure, Organic & Chemical-Free
          </span>
          <h1 class="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
            Premium Natural Fruit & <span class="text-gradient bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Vegetable Powders</span>
          </h1>
          <p class="text-sm sm:text-base text-slate-200 max-w-xl font-light leading-relaxed">
            NVKM GROUP manufactures nutrient-rich powders for daily wellness. Sourced from natural harvests and processed under strict hygienic standards. Healthy, organic, and preservative-free nutrition for retail & wholesale buyers.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <button onclick="navigate('shop')" class="bg-accent hover:bg-accentHover text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-accent/25 hover:shadow-accent/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm">
              <i class="fa-solid fa-cart-shopping"></i> Shop Our Powders
            </button>
            <a href="https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}" target="_blank" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm">
              <i class="fa-brands fa-whatsapp text-lg text-sky-400"></i> Contact on WhatsApp
            </a>
          </div>
        </div>

        <div class="lg:col-span-5 relative" data-aos="zoom-in">
          <!-- Premium Floating visual card -->
          <div class="relative max-w-sm mx-auto bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-[35px] shadow-2xl animate-float">
            <img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80" alt="Moringa powder visual" class="w-full h-56 object-cover rounded-2xl shadow-md bg-white">
            <div class="mt-4 flex items-center justify-between">
              <div>
                <h3 class="font-heading font-bold text-lg text-white">Organic Moringa Powder</h3>
                <span class="text-xs text-secondary font-semibold">Bestseller Leaf Powder</span>
              </div>
              <div class="bg-secondary/20 border border-secondary/30 px-3 py-1 rounded-xl text-secondary text-sm font-extrabold shadow-sm">
                ₹150.00 <span class="text-[10px] font-normal">/ 100g</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Natural Benefits Section -->
    <section class="py-12 mt-8">
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Healthy & Nutritious</span>
        <h2 class="font-heading font-extrabold text-3xl text-darkText">Benefits of Natural Powders</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">Our powders are produced from chosen natural produce, containing high nutrition concentration to enrich your daily diet.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="100">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center text-xl mb-6"><i class="fa-solid fa-certificate"></i></div>
          <h3 class="font-heading font-bold text-lg text-darkText">100% Pure & Natural</h3>
          <p class="text-xs text-slate-500 mt-2.5 leading-relaxed">No added preservatives, artificial flavorings, MSG, colorants, or binding fillers. You experience only pure organic nutrients directly from nature.</p>
        </div>
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="200">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center text-xl mb-6"><i class="fa-solid fa-dna"></i></div>
          <h3 class="font-heading font-bold text-lg text-darkText">Nutrient Lock-in System</h3>
          <p class="text-xs text-slate-500 mt-2.5 leading-relaxed">Our low-temperature dehydration process preserves high vitamins, dietary fibers, enzymes, and active mineral profiles of fresh raw ingredients.</p>
        </div>
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up" data-aos-delay="300">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center text-xl mb-6"><i class="fa-solid fa-box-tissue"></i></div>
          <h3 class="font-heading font-bold text-lg text-darkText">Food-Grade Packaging</h3>
          <p class="text-xs text-slate-500 mt-2.5 leading-relaxed">Packaged in food-safe standup ziplock bags that block UV rays, keeping powders moisture-free with a long shelf life of up to 12 months.</p>
        </div>
      </div>
    </section>

    <!-- Product Categories Section -->
    <section class="py-12">
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Explore Range</span>
        <h2 class="font-heading font-extrabold text-3xl text-darkText">Product Categories</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">We manufacture a diverse range of fruit, vegetable, health, and botanical powders catering to all nutritional needs.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        ${categoriesHtml}
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-12">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10" data-aos="fade-up">
        <div>
          <span class="text-xs font-bold text-accent tracking-widest uppercase">Best Sellers</span>
          <h2 class="font-heading font-extrabold text-3xl text-darkText mt-1">Featured Products</h2>
        </div>
        <button onclick="navigate('shop')" class="text-sm font-bold text-primary hover:text-accent flex items-center gap-1.5 mt-4 sm:mt-0 transition-colors">
          View All Products <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        ${featuredHtml}
      </div>
    </section>

    <!-- Wholesale & Retail Section -->
    <section class="py-12" data-aos="fade-up">
      <div class="bg-gradient-to-tr from-primary to-blue-900 text-white rounded-[35px] p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div class="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right_bottom,rgba(56,189,248,0.15),transparent)] pointer-events-none"></div>
        <div class="flex-1 space-y-4">
          <span class="bg-blue-800 text-secondary border border-blue-700/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Wholesale & Retail Supplier</span>
          <h2 class="font-heading font-extrabold text-2xl md:text-3xl leading-tight">Are You Looking For Bulk Powder Purchase?</h2>
          <p class="text-xs md:text-sm text-slate-200 leading-relaxed max-w-2xl font-light">
            As a direct manufacturer, NVKM GROUP supplies bulk orders to food processing brands, bakeries, juice centers, cosmetics makers, and retailers worldwide. We provide custom packaging options, special wholesale tier pricing, and guaranteed fresh supply batches.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/9014274293?text=Hello%20NVKM%20GROUP,%20I%20am%20interested%20in%20bulk%20wholesale%20rates%20for%20your%20powders.%20Please%20share%20your%20catalog." target="_blank" class="bg-accent hover:bg-accentHover text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
              <i class="fa-brands fa-whatsapp text-base"></i> Get Wholesale Quote
            </a>
            <button onclick="navigate('contact')" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors">
              Contact Sales Team
            </button>
          </div>
        </div>
        <div class="w-full md:w-64 flex flex-col gap-3 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <h3 class="font-heading font-bold text-sm border-b border-white/10 pb-2 flex items-center gap-1.5"><i class="fa-solid fa-truck-fast text-secondary"></i> Bulk Order Specs</h3>
          <ul class="space-y-2 text-xs font-light text-slate-200">
            <li class="flex items-center gap-2"><i class="fa-solid fa-circle text-[6px] text-secondary"></i> Min Order: 5 kg</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-circle text-[6px] text-secondary"></i> Custom bag / bag size</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-circle text-[6px] text-secondary"></i> Up to 40% bulk discount</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-circle text-[6px] text-secondary"></i> Lab test purity reports</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-12">
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Our Commitment</span>
        <h2 class="font-heading font-extrabold text-3xl text-darkText">Why Choose NVKM GROUP</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">We maintain the highest purity benchmarks and strive to create a seamless delivery process for healthy lifestyle seekers.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm" data-aos="fade-up" data-aos-delay="100">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg mb-4"><i class="fa-solid fa-seedling"></i></div>
          <h4 class="font-heading font-bold text-sm text-darkText">100% Organic</h4>
          <p class="text-[11px] text-slate-400 mt-2">Purity direct from green farm harvests.</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm" data-aos="fade-up" data-aos-delay="200">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg mb-4"><i class="fa-solid fa-award"></i></div>
          <h4 class="font-heading font-bold text-sm text-darkText">Premium Quality</h4>
          <p class="text-[11px] text-slate-400 mt-2">Processed under certified hygiene guidelines.</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm" data-aos="fade-up" data-aos-delay="300">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg mb-4"><i class="fa-solid fa-tags"></i></div>
          <h4 class="font-heading font-bold text-sm text-darkText">Best Rates</h4>
          <p class="text-[11px] text-slate-400 mt-2">Dynamic wholesale discounts available.</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm" data-aos="fade-up" data-aos-delay="400">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg mb-4"><i class="fa-solid fa-truck"></i></div>
          <h4 class="font-heading font-bold text-sm text-darkText">Fast Delivery</h4>
          <p class="text-[11px] text-slate-400 mt-2">Express door shipping across towns.</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center shadow-sm" data-aos="fade-up" data-aos-delay="500">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-lg mb-4"><i class="fa-solid fa-handshake-angle"></i></div>
          <h4 class="font-heading font-bold text-sm text-darkText">Secure Support</h4>
          <p class="text-[11px] text-slate-400 mt-2">Instant personal support via WhatsApp.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12">
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Verified Reviews</span>
        <h2 class="font-heading font-extrabold text-3xl text-darkText">Customer Testimonials</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">Here is what health-minded families and business buyers say about NVKM powders.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative" data-aos="fade-up">
          <div class="flex items-center space-x-1 mb-4 text-amber-400">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed italic">"NVKM's Banana Powder has become a staple for my baby's daily meals. It's completely natural and is very easy to prepare. Excellent texture!"</p>
          <div class="mt-4 border-t pt-3 border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary text-xs">P</div>
            <div>
              <h4 class="text-xs font-bold text-darkText">Priya Madhav</h4>
              <span class="text-[10px] text-slate-400">Mother of 10-month-old</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative" data-aos="fade-up" data-aos-delay="100">
          <div class="flex items-center space-x-1 mb-4 text-amber-400">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed italic">"We order Moringa powder in bulk batches of 20 kg for our energy bar brand. The color is bright green, indicating premium freshness. Naveen's service is top notch."</p>
          <div class="mt-4 border-t pt-3 border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary text-xs">R</div>
            <div>
              <h4 class="text-xs font-bold text-darkText">Ramesh Reddy</h4>
              <span class="text-[10px] text-slate-400">B2B Health Foods Maker</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative" data-aos="fade-up" data-aos-delay="200">
          <div class="flex items-center space-x-1 mb-4 text-amber-400">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed italic">"The Ashwagandha vitality mix is incredibly pure. I feel very active and immune from normal seasonal colds. Highly recommended daily supplement."</p>
          <div class="mt-4 border-t pt-3 border-slate-50 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-primary text-xs">K</div>
            <div>
              <h4 class="text-xs font-bold text-darkText">Kiran Prasad</h4>
              <span class="text-[10px] text-slate-400">Retail Customer</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram / Social Proof section -->
    <section class="py-12 mb-6">
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Healthy Inspirations</span>
        <h2 class="font-heading font-extrabold text-3xl text-darkText">Social Proof & Lifestyle</h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">Follow our organic manufacturing steps and see how health experts use natural powders.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group" data-aos="zoom-in">
          <img src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80" alt="Insta 1" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><i class="fa-brands fa-instagram text-2xl"></i></div>
        </div>
        <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group" data-aos="zoom-in" data-aos-delay="100">
          <img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=80" alt="Insta 2" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><i class="fa-brands fa-instagram text-2xl"></i></div>
        </div>
        <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group" data-aos="zoom-in" data-aos-delay="200">
          <img src="https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=300&q=80" alt="Insta 3" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><i class="fa-brands fa-instagram text-2xl"></i></div>
        </div>
        <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group" data-aos="zoom-in" data-aos-delay="300">
          <img src="https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=300&q=80" alt="Insta 4" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><i class="fa-brands fa-instagram text-2xl"></i></div>
        </div>
      </div>
    </section>
  `;
}

// --- Render: Shop View ---
function renderShopView() {
  const categoryFilters = ["All", "Fruits and Vegetable powder", "Pooja Accessories"];
  let filtersHtml = "";
  let selectOptionsHtml = "";
  categoryFilters.forEach(cat => {
    const isActive = state.selectedCategory === cat || (cat === getCategoryGroup(state.selectedCategory));
    filtersHtml += `
      <button onclick="handleCategoryFilter('${cat}')" class="px-4 py-2 text-xs font-bold rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'bg-white hover:bg-slate-100 text-slate-600 border'}" id="filter-btn-${cat.replace(/\s+/g, '-')}">
        ${cat}
      </button>
    `;
    selectOptionsHtml += `
      <option value="${cat}" ${isActive ? 'selected' : ''}>
        ${cat === 'All' ? 'Show All Categories' : cat}
      </option>
    `;
  });

  // Schedule Grid loading (renders on the next microtask after the view is inserted)
  setTimeout(() => {
    renderShopGrid();
  }, 10);

  return `
    <div class="py-6">
      <div class="text-left space-y-1 mb-8" data-aos="fade-right">
        <h1 class="font-heading font-extrabold text-3xl text-darkText">Shop Organic Powders</h1>
        <p class="text-xs text-slate-500">Search and filter our natural, nutrient-dense manufacturing powder stock.</p>
      </div>

      <!-- Search, Sorting & Categories Toolbar -->
      <div class="bg-white border rounded-3xl p-5 shadow-sm space-y-4 mb-8" data-aos="fade-up">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Text Search -->
          <div class="relative flex-1">
            <input type="text" id="shop-search" placeholder="Search product name, ingredients, categories..." oninput="handleSearch(this.value)" class="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-accent transition-colors">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-sm"></i>
          </div>

          <!-- Sorting selection -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort By:</span>
            <select id="shop-sorting" onchange="renderShopGrid()" class="bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-sm text-darkText focus:outline-none focus:border-accent">
              <option value="default">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating Score</option>
            </select>
          </div>
        </div>

        <!-- Category filters -->
        <div class="border-t border-slate-100 pt-4">
          <span class="block text-xs font-bold text-darkText mb-2.5">Filter by Category:</span>
          
          <!-- Dropdown for mobile -->
          <div class="block sm:hidden relative">
            <select onchange="handleCategoryFilter(this.value)" class="w-full bg-slate-50 border border-slate-200 py-3.5 pl-4 pr-10 rounded-2xl text-xs font-bold text-darkText focus:outline-none focus:border-accent appearance-none cursor-pointer">
              ${selectOptionsHtml}
            </select>
            <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
          </div>

          <!-- Horizontal buttons for desktop/tablet -->
          <div class="hidden sm:flex flex-wrap gap-2">
            ${filtersHtml}
          </div>
        </div>

      </div>

      <!-- Shop Products Grid -->
      <div id="shop-products-grid" class="product-card-grid">
        <!-- Rendered by JavaScript -->
      </div>
      
      <!-- No products found state -->
      <div id="shop-empty-state" class="hidden flex-col items-center justify-center py-20 text-center">
        <i class="fa-solid fa-hourglass-empty text-5xl text-slate-300 mb-4"></i>
        <h3 class="font-heading font-bold text-lg text-slate-500">No Powders Match Your Query!</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm">Try clearing your filters or checking your spelling to explore other categories.</p>
        <button onclick="handleCategoryFilter('All'); handleSearch('');" class="mt-6 bg-primary hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-sm">
          Reset Filters
        </button>
      </div>

    </div>
  `;
}

function renderShopGrid() {
  const grid = document.getElementById("shop-products-grid");
  const emptyState = document.getElementById("shop-empty-state");
  if (!grid) return;

  let filtered = [...PRODUCTS_DATA];

  // Apply search query
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortDesc.toLowerCase().includes(q) || 
      p.ingredients.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Apply category filter
  if (state.selectedCategory !== "All") {
    filtered = filtered.filter(p => {
      if (state.selectedCategory !== "Fruits and Vegetable powder" && state.selectedCategory !== "Pooja Accessories") {
        return p.category === state.selectedCategory;
      }
      return getCategoryGroup(p.category) === state.selectedCategory;
    });
  }

  // Apply Sorting
  const sortingVal = document.getElementById("shop-sorting").value;
  if (sortingVal === "price-asc") {
    // Sort by default variation price low to high
    filtered.sort((a, b) => a.variations[0].discountPrice - b.variations[0].discountPrice);
  } else if (sortingVal === "price-desc") {
    filtered.sort((a, b) => b.variations[0].discountPrice - a.variations[0].discountPrice);
  } else if (sortingVal === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Render cards
  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex");
  } else {
    emptyState.classList.remove("flex");
    emptyState.classList.add("hidden");
    
    let html = "";
    filtered.forEach(p => {
      html += createProductCardHtml(p);
    });
    grid.innerHTML = html;
  }
}

// --- Render: Product Details View ---
function renderProductDetailView(product) {
  currentVanillaRating = 5;
  const defaultVar = product.variations[0];
  const isWishlisted = state.wishlist.includes(product.id);
  const savePercent = Math.round(((defaultVar.price - defaultVar.discountPrice) / defaultVar.price) * 100);

  // Generate benefits list items
  let benefitsHtml = "";
  product.benefits.forEach(b => {
    benefitsHtml += `
      <li class="flex items-start gap-2.5 text-sm text-lightText leading-relaxed">
        <i class="fa-solid fa-circle-check text-accent text-base mt-0.5"></i>
        <span>${b}</span>
      </li>
    `;
  });

  // Generate weights select options
  let weightsHtml = "";
  product.variations.forEach((v, index) => {
    weightsHtml += `
      <label class="flex-1 cursor-pointer">
        <input type="radio" name="pd-weight" value="${v.weight}" ${index === 0 ? 'checked' : ''} onchange="updateProductDetailPrice('${product.id}', this.value)" class="sr-only peer">
        <div class="border border-slate-200 peer-checked:border-primary peer-checked:bg-blue-50 rounded-2xl py-3 px-4 text-center transition-all shadow-sm hover:border-slate-300">
          <span class="block text-sm font-bold text-darkText">${v.weight}</span>
          <span class="block text-xs text-slate-500 font-medium mt-0.5">₹${v.discountPrice}</span>
        </div>
      </label>
    `;
  });

  // Generate related products
  const related = PRODUCTS_DATA.filter(p => p.id !== product.id).slice(0, 3);
  let relatedHtml = "";
  related.forEach(p => {
    relatedHtml += createProductCardHtml(p);
  });

  // Generate reviews list
  let reviewsHtml = "";
  if (product.reviews && product.reviews.length > 0) {
    product.reviews.forEach(rev => {
      reviewsHtml += `
        <div class="border-b border-slate-100 pb-5">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-darkText text-sm">${rev.name}</h4>
            <span class="text-xs text-slate-400 font-medium">${rev.date}</span>
          </div>
          <div class="flex items-center space-x-1.5 mt-1 text-amber-400">
            ${getStarsHtml(rev.rating)}
          </div>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed italic">"${rev.comment}"</p>
        </div>
      `;
    });
  } else {
    reviewsHtml = `<p class="text-xs text-slate-400 text-center py-6">No customer reviews yet. Be the first to review!</p>`;
  }

  // Return standard details template
  return `
    <div class="py-6">
      
      <!-- Breadcrumb navigation -->
      <nav class="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-semibold">
        <a href="#" onclick="navigate('home'); return false;" class="hover:text-primary transition-colors">Home</a>
        <i class="fa-solid fa-chevron-right text-[8px]"></i>
        <a href="#" onclick="navigate('shop'); return false;" class="hover:text-primary transition-colors">Shop</a>
        <i class="fa-solid fa-chevron-right text-[8px]"></i>
        <span class="text-slate-400 truncate">${product.name}</span>
      </nav>

      <!-- Main Product Details Frame -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 bg-white border border-slate-100 rounded-[35px] p-6 md:p-10 shadow-sm" data-aos="fade-up">
        
        <!-- Left Column: Product Gallery -->
        <div class="md:col-span-5 space-y-4">
          <div class="bg-slate-50 border rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative shadow-sm">
            <span class="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md z-10">${product.badge}</span>
            <img src="${product.image}" id="pd-main-image" alt="${product.name}" class="w-full h-full object-cover">
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="border-2 border-primary bg-blue-50 rounded-2xl overflow-hidden aspect-square cursor-pointer">
              <img src="${product.image}" alt="View 1" class="w-full h-full object-cover">
            </div>
            <div class="border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden aspect-square cursor-pointer bg-slate-50 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-box-open text-slate-400 text-xl"></i>
            </div>
            <div class="border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden aspect-square cursor-pointer bg-slate-50 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-shield-halved text-slate-400 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Right Column: Product Meta and buying -->
        <div class="md:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <span class="text-xs font-bold text-accent tracking-widest uppercase">${product.category}</span>
            <h1 class="font-heading font-extrabold text-3xl text-darkText mt-1">${product.name}</h1>
            
            <div class="flex items-center space-x-2 mt-2">
              ${getStarsHtml(product.rating)}
              <span class="text-xs font-bold text-darkText">${product.rating}</span>
              <span class="text-xs text-slate-400 font-semibold">(${product.reviewsCount} verified customer reviews)</span>
            </div>

            <!-- Price banner -->
            <div class="mt-5 flex items-baseline gap-3 p-4 bg-slate-50 border rounded-2xl shadow-inner">
              <span class="text-3xl font-heading font-extrabold text-primary" id="pd-discount-price">₹${defaultVar.discountPrice}</span>
              <span class="text-sm text-slate-400 line-through font-semibold" id="pd-original-price">M.R.P: ₹${defaultVar.price}</span>
              <span class="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded shadow-sm" id="pd-saving-badge">Save ${savePercent}%</span>
            </div>

            <p class="text-sm text-lightText mt-5 leading-relaxed">${product.longDesc}</p>
            
            <!-- Weight variations -->
            <div class="mt-6">
              <span class="block text-xs font-bold text-darkText mb-2.5"><i class="fa-solid fa-weight-hanging"></i> Available Weights / Sizes:</span>
              <div class="flex gap-2">
                ${weightsHtml}
              </div>
            </div>

            <!-- Qty selection -->
            <div class="mt-6 flex items-center gap-4">
              <span class="text-xs font-bold text-darkText">Quantity:</span>
              <div class="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button onclick="adjustPdQuantity(-1)" class="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-minus text-xs"></i></button>
                <span id="pd-qty-label" class="px-5 font-bold text-sm text-darkText">1</span>
                <button onclick="adjustPdQuantity(1)" class="px-3.5 py-2 text-slate-600 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-plus text-xs"></i></button>
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button onclick="submitPdAddToCart('${product.id}')" class="flex-1 bg-slate-100 hover:bg-primary hover:text-white text-primary border border-transparent hover:border-primary/20 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]">
              <i class="fa-solid fa-basket-shopping"></i> Add to Basket
            </button>
            <button onclick="submitPdBuyNow('${product.id}')" class="flex-1 bg-accent hover:bg-accentHover text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all hover:scale-[1.01]">
              <i class="fa-solid fa-bolt"></i> Buy It Now
            </button>
            <button onclick="submitPdWhatsAppInquiry('${product.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-5 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01]" title="Inquire on WhatsApp">
              <i class="fa-brands fa-whatsapp text-2xl"></i>
            </button>
          </div>

        </div>
      </div>

      <!-- Accordion tabs for description/benefits/usage -->
      <div class="mt-8 bg-white border border-slate-100 rounded-[35px] overflow-hidden shadow-sm" data-aos="fade-up">
        
        <!-- Tab triggers -->
        <div class="flex border-b text-sm font-bold bg-slate-50/50">
          <button onclick="togglePdTab('benefits')" id="tab-btn-benefits" class="flex-1 py-4 text-center border-b-2 border-primary text-primary transition-colors">Key Benefits</button>
          <button onclick="togglePdTab('ingredients')" id="tab-btn-ingredients" class="flex-1 py-4 text-center border-b-2 border-transparent text-slate-500 hover:text-darkText transition-colors">Ingredients Info</button>
          <button onclick="togglePdTab('usage')" id="tab-btn-usage" class="flex-1 py-4 text-center border-b-2 border-transparent text-slate-500 hover:text-darkText transition-colors">Usage Instructions</button>
        </div>

        <!-- Tab contents -->
        <div class="p-6 md:p-8">
          <div id="tab-content-benefits" class="space-y-4">
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${benefitsHtml}
            </ul>
          </div>
          <div id="tab-content-ingredients" class="hidden space-y-2">
            <h3 class="font-heading font-bold text-darkText text-base">Pure Content Formula</h3>
            <p class="text-sm text-lightText leading-relaxed">${product.ingredients}</p>
            <p class="text-xs text-slate-400 mt-4 leading-relaxed"><i class="fa-solid fa-shield-heart text-accent"></i> Free from preservatives, fillers, starches, chemical anti-caking compounds, or sugars.</p>
          </div>
          <div id="tab-content-usage" class="hidden space-y-2">
            <h3 class="font-heading font-bold text-darkText text-base">How to Consume</h3>
            <p class="text-sm text-lightText leading-relaxed">${product.usage}</p>
            <p class="text-xs text-slate-400 mt-4"><i class="fa-solid fa-clock text-accent"></i> Recommended shelf life: Store in airtight container in dry, cool cabinet shelf environment.</p>
          </div>
        </div>

      </div>

      <!-- Customer Reviews and Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8" data-aos="fade-up">
        
        <!-- Review List -->
        <div class="lg:col-span-2 bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm space-y-6">
          <h2 class="font-heading font-extrabold text-xl text-darkText border-b border-slate-100 pb-4"><i class="fa-solid fa-comments"></i> Customer Reviews (${product.reviewsCount})</h2>
          <div class="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            ${reviewsHtml}
          </div>
        </div>

        <!-- Add Review Form -->
        <div class="bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm">
          <h2 class="font-heading font-extrabold text-xl text-darkText border-b border-slate-100 pb-4"><i class="fa-solid fa-pen-clip"></i> Submit Review</h2>
          <form onsubmit="handleReviewSubmit(event, '${product.id}')" class="space-y-4 mt-4">
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Your Name</label>
              <input type="text" id="review-name" required class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Star Rating</label>
              <input type="hidden" id="review-rating" value="5">
              <div class="flex items-center gap-2 py-1">
                <div class="flex items-center gap-1" id="review-stars-container">
                  <button type="button" onclick="setVanillaReviewRating(1)" onmouseenter="previewVanillaReviewRating(1)" onmouseleave="clearVanillaReviewRatingPreview()" class="text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-none">
                    <i class="fa-star fa-solid text-amber-400" id="vanilla-star-1"></i>
                  </button>
                  <button type="button" onclick="setVanillaReviewRating(2)" onmouseenter="previewVanillaReviewRating(2)" onmouseleave="clearVanillaReviewRatingPreview()" class="text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-none">
                    <i class="fa-star fa-solid text-amber-400" id="vanilla-star-2"></i>
                  </button>
                  <button type="button" onclick="setVanillaReviewRating(3)" onmouseenter="previewVanillaReviewRating(3)" onmouseleave="clearVanillaReviewRatingPreview()" class="text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-none">
                    <i class="fa-star fa-solid text-amber-400" id="vanilla-star-3"></i>
                  </button>
                  <button type="button" onclick="setVanillaReviewRating(4)" onmouseenter="previewVanillaReviewRating(4)" onmouseleave="clearVanillaReviewRatingPreview()" class="text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-none">
                    <i class="fa-star fa-solid text-amber-400" id="vanilla-star-4"></i>
                  </button>
                  <button type="button" onclick="setVanillaReviewRating(5)" onmouseenter="previewVanillaReviewRating(5)" onmouseleave="clearVanillaReviewRatingPreview()" class="text-2xl transition-all duration-150 transform hover:scale-110 active:scale-95 focus:outline-none">
                    <i class="fa-star fa-solid text-amber-400" id="vanilla-star-5"></i>
                  </button>
                </div>
                <span class="text-xs font-bold text-slate-500 ml-2" id="vanilla-rating-text">5 Stars (Excellent)</span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Comments / Review Text</label>
              <textarea id="review-comment" rows="4" required class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-accent" placeholder="How is the mixability, aroma, taste, and freshness?"></textarea>
            </div>
            <button type="submit" class="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm">
              Submit My Review
            </button>
          </form>
        </div>

      </div>

      <!-- Related Products Grid -->
      <div class="mt-12" data-aos="fade-up">
        <h2 class="font-heading font-extrabold text-2xl text-darkText mb-6 text-center">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          ${relatedHtml}
        </div>
      </div>

    </div>
  `;
}

function updateProductDetailPrice(productId, selectedWeight) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const variation = product.variations.find(v => v.weight === selectedWeight);
  if (!variation) return;

  document.getElementById("pd-discount-price").textContent = `₹${variation.discountPrice}`;
  document.getElementById("pd-original-price").textContent = `M.R.P: ₹${variation.price}`;
  
  const percentage = Math.round(((variation.price - variation.discountPrice) / variation.price) * 100);
  document.getElementById("pd-saving-badge").textContent = `Save ${percentage}%`;
}

function adjustPdQuantity(change) {
  const qtyLabel = document.getElementById("pd-qty-label");
  let currentVal = parseInt(qtyLabel.textContent);
  currentVal += change;
  if (currentVal < 1) currentVal = 1;
  qtyLabel.textContent = currentVal;
}

function submitPdAddToCart(productId) {
  const selectedWeight = document.querySelector('input[name="pd-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("pd-qty-label").textContent);
  
  addToCart(productId, selectedWeight, quantity);
}

function submitPdBuyNow(productId) {
  const selectedWeight = document.querySelector('input[name="pd-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("pd-qty-label").textContent);
  
  addToCart(productId, selectedWeight, quantity, true);
  toggleCartDrawer(true);
}

function submitPdWhatsAppInquiry(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const selectedWeight = document.querySelector('input[name="pd-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("pd-qty-label").textContent);
  
  const textMsg = `Hello NVKM GROUP, I am interested in purchasing your natural powder:\n- Product: ${product.name}\n- Packaging Weight: ${selectedWeight}\n- Quantity: ${quantity}\nCould you please provide bulk wholesale rates and retail delivery details for my pincode?`;
  const encText = encodeURIComponent(textMsg);
  
  window.open(`https://wa.me/9014274293?text=${encText}`, "_blank");
}

function togglePdTab(tabName) {
  // Hide all contents
  document.getElementById("tab-content-benefits").classList.add("hidden");
  document.getElementById("tab-content-ingredients").classList.add("hidden");
  document.getElementById("tab-content-usage").classList.add("hidden");

  // Show selected content
  document.getElementById(`tab-content-${tabName}`).classList.remove("hidden");

  // Reset active classes on tab buttons
  const tabs = ["benefits", "ingredients", "usage"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    if (t === tabName) {
      btn.className = "flex-1 py-4 text-center border-b-2 border-primary text-primary transition-colors font-bold";
    } else {
      btn.className = "flex-1 py-4 text-center border-b-2 border-transparent text-slate-500 hover:text-darkText transition-colors font-semibold";
    }
  });
}

let currentVanillaRating = 5;

const RATING_TEXTS = {
  5: '5 Stars (Excellent)',
  4: '4 Stars (Very Good)',
  3: '3 Stars (Good)',
  2: '2 Stars (Average)',
  1: '1 Star (Poor)'
};

function updateVanillaStarsDisplay(rating) {
  for (let i = 1; i <= 5; i++) {
    const starIcon = document.getElementById(`vanilla-star-${i}`);
    if (starIcon) {
      if (i <= rating) {
        starIcon.className = "fa-star fa-solid text-amber-400";
      } else {
        starIcon.className = "fa-star fa-regular text-slate-300";
      }
    }
  }
  const ratingText = document.getElementById("vanilla-rating-text");
  if (ratingText) {
    ratingText.textContent = RATING_TEXTS[rating] || `${rating} Stars`;
  }
}

function setVanillaReviewRating(rating) {
  currentVanillaRating = rating;
  const ratingInput = document.getElementById("review-rating");
  if (ratingInput) {
    ratingInput.value = rating;
  }
  updateVanillaStarsDisplay(rating);
}

function previewVanillaReviewRating(rating) {
  updateVanillaStarsDisplay(rating);
}

function clearVanillaReviewRatingPreview() {
  updateVanillaStarsDisplay(currentVanillaRating);
}

function handleReviewSubmit(event, productId) {
  event.preventDefault();
  const name = document.getElementById("review-name").value.trim();
  const rating = parseInt(document.getElementById("review-rating").value);
  const comment = document.getElementById("review-comment").value.trim();

  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (product) {
    if (!product.reviews) product.reviews = [];
    
    product.reviews.unshift({
      name,
      rating,
      date: new Date().toLocaleDateString(),
      comment
    });
    product.reviewsCount += 1;
    
    showToast("Review submitted successfully! Thank you for your feedback.");
    navigate("product-detail", productId);
  }
}

// --- Render: About View ---
function renderAboutView() {
  return `
    <div class="py-6 space-y-12">
      
      <!-- Header Banner -->
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Our Heritage</span>
        <h1 class="font-heading font-extrabold text-3xl sm:text-4xl text-darkText">About NVKM GROUP</h1>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">Providing high-quality natural fruit and vegetable nutrition powders for retail & wholesale wellness customers.</p>
      </div>

      <!-- Founder & Story Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white border border-slate-100 rounded-[35px] p-6 md:p-10 shadow-sm" data-aos="fade-up">
        <div class="md:col-span-5 aspect-[4/5] bg-blue-50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center relative">
          <!-- Real mockup image of founder or store -->
          <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" alt="NVKM GROUP founder profile" class="w-full h-full object-cover">
          <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-slate-100 p-4 rounded-2xl shadow-lg">
            <h3 class="font-heading font-bold text-base text-darkText">Janagonda Naveen</h3>
            <span class="text-xs text-primary font-semibold">Founder & Owner, NVKM GROUP</span>
          </div>
        </div>

        <div class="md:col-span-7 space-y-6">
          <span class="inline-block bg-blue-50 border border-blue-200 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Manufacturing Business</span>
          <h2 class="font-heading font-extrabold text-2xl md:text-3xl text-darkText leading-tight">Our Roots & Commitment</h2>
          <p class="text-sm text-lightText leading-relaxed">
            Established under the visionary leadership of **Janagonda Naveen**, **NVKM GROUP** was founded to address the lack of fresh, preservative-free nutritional powders in the market. Operating from Bathalapalli, Sri Sathya Sai district, our manufacturing plant sources fresh seasonal fruits and green harvests directly from local farms.
          </p>
          <p class="text-sm text-lightText leading-relaxed">
            By avoiding any artificial preservatives, colorants, starch fillers, or sugars, we ensure that every spoonful of our Banana and Moringa powders contains wholesome, raw biological energy. We serve customers in both **Retail and Wholesale markets**, with physical store pick-up and express door delivery.
          </p>
          
          <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div>
              <span class="text-xs text-slate-400 font-semibold block uppercase">Sales Options</span>
              <span class="text-sm font-bold text-primary flex items-center gap-1.5 mt-1"><i class="fa-solid fa-circle-check text-accent"></i> Retail & Wholesale</span>
            </div>
            <div>
              <span class="text-xs text-slate-400 font-semibold block uppercase">Store Availability</span>
              <span class="text-sm font-bold text-primary flex items-center gap-1.5 mt-1"><i class="fa-solid fa-store text-accent"></i> Physical Store Pick-up</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vision & Mission -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-tr from-primary to-blue-900 text-white p-8 md:p-10 rounded-[35px] shadow-sm relative overflow-hidden" data-aos="fade-up">
          <div class="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_right_bottom,rgba(56,189,248,0.1),transparent)] pointer-events-none"></div>
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-secondary mb-6"><i class="fa-solid fa-eye text-lg"></i></div>
          <h3 class="font-heading font-bold text-xl mb-3">Our Vision</h3>
          <p class="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
            To provide healthy and natural nutrition products to customers worldwide through premium quality fruit, vegetable, and herbal powders, cultivating a toxicant-free natural lifestyle.
          </p>
        </div>
        
        <div class="bg-white border border-slate-100 text-darkText p-8 md:p-10 rounded-[35px] shadow-sm relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary mb-6"><i class="fa-solid fa-bullseye text-lg"></i></div>
          <h3 class="font-heading font-bold text-xl mb-3">Our Mission</h3>
          <p class="text-xs md:text-sm text-slate-500 leading-relaxed">
            To manufacture and deliver high-quality, pure natural powders while maintaining complete freshness, high nutrition value, affordable retail-wholesale pricing, and total customer satisfaction.
          </p>
        </div>
      </div>

      <!-- Core Values -->
      <div class="py-6">
        <h2 class="font-heading font-extrabold text-2xl text-darkText text-center mb-8" data-aos="fade-up">Our Core Values</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="100">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base mb-4 mx-auto"><i class="fa-solid fa-award"></i></div>
            <h4 class="font-heading font-bold text-sm text-darkText">Quality First</h4>
            <p class="text-[10px] text-slate-400 mt-2">Zero compromises on raw harvest selection.</p>
          </div>
          <div class="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="200">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base mb-4 mx-auto"><i class="fa-solid fa-seedling"></i></div>
            <h4 class="font-heading font-bold text-sm text-darkText">Natural Content</h4>
            <p class="text-[10px] text-slate-400 mt-2">100% preservative-free powders.</p>
          </div>
          <div class="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="300">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base mb-4 mx-auto"><i class="fa-solid fa-heart-pulse"></i></div>
            <h4 class="font-heading font-bold text-sm text-darkText">Daily Nutrition</h4>
            <p class="text-[10px] text-slate-400 mt-2">Formulated to enrich bodily health.</p>
          </div>
          <div class="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="400">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base mb-4 mx-auto"><i class="fa-solid fa-shield-check"></i></div>
            <h4 class="font-heading font-bold text-sm text-darkText">Total Trust</h4>
            <p class="text-[10px] text-slate-400 mt-2">Transparency in origins and labeling.</p>
          </div>
          <div class="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm" data-aos="fade-up" data-aos-delay="500">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-base mb-4 mx-auto"><i class="fa-solid fa-face-smile-wink"></i></div>
            <h4 class="font-heading font-bold text-sm text-darkText">Satisfaction</h4>
            <p class="text-[10px] text-slate-400 mt-2">Reliable logistics and fast customer response.</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

// --- Render: Contact View ---
function renderContactView() {
  setTimeout(() => {
    // Add form submit listener
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Thank you for contacting NVKM GROUP! We will respond shortly.");
        contactForm.reset();
      });
    }
  }, 10);

  return `
    <div class="py-6 space-y-12">
      
      <!-- Contact Banner -->
      <div class="text-center max-w-2xl mx-auto space-y-2 mb-10" data-aos="fade-up">
        <span class="text-xs font-bold text-accent tracking-widest uppercase">Get In Touch</span>
        <h1 class="font-heading font-extrabold text-3xl sm:text-4xl text-darkText">Contact NVKM GROUP</h1>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">Reach out to us directly for retail orders, dealer queries, wholesale quotations, or store pickups.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Contact Form Card -->
        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm" data-aos="fade-right">
          <h2 class="font-heading font-extrabold text-xl text-darkText border-b border-slate-100 pb-4 mb-6"><i class="fa-regular fa-envelope"></i> Send Us A Message</h2>
          
          <form id="contact-form" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-darkText mb-1.5">Your Name *</label>
                <input type="text" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
              </div>
              <div>
                <label class="block text-xs font-bold text-darkText mb-1.5">Phone Number *</label>
                <input type="tel" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1.5">Email Address (Optional)</label>
              <input type="email" class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1.5">Message / Inquiry Details *</label>
              <textarea rows="5" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent" placeholder="Please list the powders (Banana, Moringa, etc.) and quantities (Retail/Wholesale) you are interested in."></textarea>
            </div>
            <button type="submit" class="w-full sm:w-auto bg-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl text-xs transition-colors shadow-md">
              Send Message
            </button>
          </form>
        </div>

        <!-- Contact details Panel -->
        <div class="lg:col-span-5 space-y-6" data-aos="fade-left">
          
          <div class="bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm space-y-6">
            <h2 class="font-heading font-extrabold text-xl text-darkText border-b border-slate-100 pb-4"><i class="fa-solid fa-address-book"></i> Connect Directly</h2>
            
            <div class="space-y-4 text-sm">
              <div class="flex items-start gap-4">
                <div class="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><i class="fa-solid fa-phone text-sm"></i></div>
                <div>
                  <span class="text-xs text-slate-400 font-semibold block uppercase">Call Support</span>
                  <a href="tel:9014274293" class="font-bold text-darkText hover:text-accent transition-colors block mt-0.5">+91 9014274293</a>
                  <a href="tel:7075604700" class="font-bold text-darkText hover:text-accent transition-colors block">+91 7075604700</a>
                </div>
              </div>

              <div class="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div class="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><i class="fa-brands fa-whatsapp text-lg"></i></div>
                <div>
                  <span class="text-xs text-slate-400 font-semibold block uppercase">WhatsApp Chats</span>
                  <a href="https://wa.me/9014274293?text=${encodeURIComponent(GENERAL_WA_MSG)}" target="_blank" class="font-bold text-blue-600 hover:text-accent transition-colors block mt-0.5">+91 9014274293</a>
                  <a href="https://wa.me/7075604700?text=${encodeURIComponent(GENERAL_WA_MSG)}" target="_blank" class="font-bold text-blue-600 hover:text-accent transition-colors block">+91 7075604700</a>
                </div>
              </div>

              <div class="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div class="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><i class="fa-regular fa-envelope"></i></div>
                <div>
                  <span class="text-xs text-slate-400 font-semibold block uppercase">Email Support</span>
                  <a href="mailto:Navakiranamgroup@gmail.com" class="font-bold text-darkText hover:text-accent transition-colors block mt-0.5">Navakiranamgroup@gmail.com</a>
                </div>
              </div>

              <div class="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div class="w-9 h-9 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><i class="fa-solid fa-map-location-dot"></i></div>
                <div>
                  <span class="text-xs text-slate-400 font-semibold block uppercase">Factory Store Address</span>
                  <p class="font-bold text-darkText leading-relaxed mt-0.5 text-xs">
                    Near bypass Anantapur Road, Bathalapalli,<br>Sri Sathya Sai Dist, Andhra Pradesh 515661
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="bg-gradient-to-tr from-primary to-blue-900 text-white rounded-[30px] p-6 shadow-sm">
            <h3 class="font-heading font-bold text-sm border-b border-white/10 pb-2 mb-3"><i class="fa-solid fa-clock text-secondary"></i> Business & Store Hours</h3>
            <ul class="space-y-1.5 text-xs text-slate-200">
              <li class="flex justify-between"><span>Monday - Friday:</span> <span class="font-bold text-secondary">9:00 AM - 7:00 PM</span></li>
              <li class="flex justify-between"><span>Saturday:</span> <span class="font-bold text-secondary">9:00 AM - 5:00 PM</span></li>
              <li class="flex justify-between"><span>Sunday:</span> <span class="text-slate-300">Store Closed (Online orders open)</span></li>
            </ul>
          </div>

        </div>

      </div>

      <!-- Google Maps Location Frame -->
      <div class="bg-white border border-slate-100 rounded-[35px] p-4 shadow-sm overflow-hidden" data-aos="fade-up">
        <h3 class="font-heading font-bold text-base text-darkText mb-3 pl-2"><i class="fa-solid fa-map-location-dot text-primary"></i> Factory Location Map</h3>
        <div class="map-responsive rounded-2xl overflow-hidden">
          <!-- Embed of Bathalapalli, Anantapur district area map -->
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15447.886026945038!2d77.7845700779774!3d14.543598715878345!2m3!1f0!2f0!3f0!3m2!1i1020!2i768!4f13.1!3m3!1m2!1s0x3bb3dfcaec9a531f%3A0xe54ef92c10b7b15a!2sBathalapalli%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

    </div>
  `;
}

// --- Render: Login / Registration System ---
function renderLoginView() {
  setTimeout(() => {
    // Add Form bindings
    const loginForm = document.getElementById("login-form-el");
    const regForm = document.getElementById("register-form-el");
    const fpForm = document.getElementById("fp-form-el");

    if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);
    if (regForm) regForm.addEventListener("submit", handleRegisterSubmit);
    if (fpForm) fpForm.addEventListener("submit", handleForgotPasswordSubmit);
  }, 10);

  return `
    <div class="py-8 flex justify-center items-center">
      <div class="bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-xl w-full max-w-md" data-aos="zoom-in">
        
        <!-- Auth Form Tabs -->
        <div class="flex border-b pb-4 mb-6 text-sm font-bold text-center" id="auth-tab-headers">
          <button onclick="toggleAuthForm('login')" id="auth-tab-login" class="flex-1 text-primary border-b-2 border-primary pb-2 font-bold transition-all">Sign In</button>
          <button onclick="toggleAuthForm('register')" id="auth-tab-register" class="flex-1 text-slate-400 hover:text-darkText pb-2 font-semibold transition-all">Register</button>
        </div>

        <!-- 1. SIGN IN FORM -->
        <div id="auth-form-login" class="space-y-4">
          <h2 class="font-heading font-extrabold text-lg text-darkText">Sign In To Your Account</h2>
          <p class="text-xs text-slate-500">Access your dashboard, checkout speeds, and track orders.</p>
          
          <form id="login-form-el" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Email Address</label>
              <input type="email" id="login-email" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <label class="text-xs font-bold text-darkText">Password</label>
                <button type="button" onclick="toggleAuthForm('forgot')" class="text-[10px] text-accent hover:text-hover-color font-semibold">Forgot Password?</button>
              </div>
              <input type="password" id="login-password" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
             <button type="submit" class="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md">
              Sign In
            </button>
          </form>
          
          <div class="text-center pt-2 text-xs text-slate-500 font-light">
            New to NVKM Group? <button onclick="toggleAuthForm('register')" class="text-accent hover:underline font-bold">Register Now</button>
          </div>
        </div>

        <!-- 2. REGISTRATION FORM -->
        <div id="auth-form-register" class="hidden space-y-4">
          <h2 class="font-heading font-extrabold text-lg text-darkText">Create An Account</h2>
          <p class="text-xs text-slate-500">Sign up in seconds to start shopping and tracking your natural powders.</p>
          
          <form id="register-form-el" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Full Name</label>
              <input type="text" id="register-name" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Phone Number</label>
              <input type="tel" id="register-phone" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Email Address</label>
              <input type="email" id="register-email" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-darkText mb-1">Password</label>
                <input type="password" id="register-password" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
              </div>
              <div>
                <label class="block text-xs font-bold text-darkText mb-1">Confirm Password</label>
                <input type="password" id="register-password-confirm" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
              </div>
            </div>
            <button type="submit" class="w-full bg-accent hover:bg-accentHover text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md">
              Create Account
            </button>
          </form>
          
          <div class="text-center pt-2 text-xs text-slate-500 font-light">
            Already have an account? <button onclick="toggleAuthForm('login')" class="text-primary hover:underline font-bold">Sign In</button>
          </div>
        </div>

        <!-- 3. FORGOT PASSWORD FORM -->
        <div id="auth-form-forgot" class="hidden space-y-4">
          <h2 class="font-heading font-extrabold text-lg text-darkText">Recover Password</h2>
          <p class="text-xs text-slate-500">Provide your registered email address below, and we will send password reset links.</p>
          
          <form id="fp-form-el" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-darkText mb-1">Email Address</label>
              <input type="email" id="fp-email" required class="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-accent">
            </div>
            <button type="submit" class="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md">
              Send Reset Link
            </button>
          </form>
          
          <div class="text-center pt-2">
            <button onclick="toggleAuthForm('login')" class="text-xs text-slate-500 hover:text-primary font-semibold flex items-center gap-1 mx-auto"><i class="fa-solid fa-arrow-left text-[10px]"></i> Back to Sign In</button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function toggleAuthForm(formName) {
  const loginForm = document.getElementById("auth-form-login");
  const regForm = document.getElementById("auth-form-register");
  const fpForm = document.getElementById("auth-form-forgot");
  
  const loginTab = document.getElementById("auth-tab-login");
  const regTab = document.getElementById("auth-tab-register");
  const headers = document.getElementById("auth-tab-headers");

  // Hide forms
  loginForm.classList.add("hidden");
  regForm.classList.add("hidden");
  fpForm.classList.add("hidden");

  // Show selected
  if (formName === "login") {
    loginForm.classList.remove("hidden");
    headers.classList.remove("hidden");
    loginTab.className = "flex-1 text-primary border-b-2 border-primary pb-2 font-bold transition-all";
    regTab.className = "flex-1 text-slate-400 hover:text-darkText pb-2 font-semibold transition-all";
  } else if (formName === "register") {
    regForm.classList.remove("hidden");
    headers.classList.remove("hidden");
    regTab.className = "flex-1 text-primary border-b-2 border-primary pb-2 font-bold transition-all";
    loginTab.className = "flex-1 text-slate-400 hover:text-darkText pb-2 font-semibold transition-all";
  } else if (formName === "forgot") {
    fpForm.classList.remove("hidden");
    headers.classList.add("hidden");
  }
}

// --- Render: User Dashboard View ---
function renderDashboardView() {
  const user = state.currentUser;
  
  // Render order history HTML list
  let ordersListHtml = "";
  if (state.orderHistory && state.orderHistory.length > 0) {
    state.orderHistory.forEach(ord => {
      let statusColor = "bg-amber-100 text-amber-800 border-amber-200";
      if (ord.status === "Processing") statusColor = "bg-blue-100 text-blue-800 border-blue-200";
      if (ord.status === "Shipped") statusColor = "bg-purple-100 text-purple-800 border-purple-200";
      if (ord.status === "Delivered") statusColor = "bg-green-100 text-green-800 border-green-200";

      // Stepper visual widths
      let stepPercent = "w-1/4";
      if (ord.status === "Processing") stepPercent = "w-1/2";
      if (ord.status === "Shipped") stepPercent = "w-3/4";
      if (ord.status === "Delivered") stepPercent = "w-full";

      let itemsSummary = "";
      ord.items.forEach(itm => {
        itemsSummary += `<div class="text-xs text-slate-500 font-medium">${itm.name} (${itm.weight}) x ${itm.quantity}</div>`;
      });

      ordersListHtml += `
        <div class="border rounded-2xl p-4 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-colors">
          <div class="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-3">
            <div>
              <span class="text-xs font-bold text-slate-400">Order ID:</span>
              <span class="text-sm font-extrabold text-primary ml-1">${ord.orderId}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400 font-semibold">${ord.date}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}">${ord.status}</span>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <span class="text-[10px] font-bold text-darkText block uppercase mb-1">Purchased Powders</span>
              ${itemsSummary}
            </div>
            <div class="text-right sm:text-right">
              <span class="text-[10px] font-bold text-darkText block uppercase mb-1">Total Payable</span>
              <span class="text-base font-extrabold text-primary">₹${ord.totalPayable.toFixed(2)}</span>
            </div>
          </div>

          <!-- Progress Stepper -->
          <div class="pt-3 border-t border-slate-100">
            <span class="text-[9px] font-bold text-darkText block uppercase mb-2">Live Delivery Tracker</span>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
              <div class="bg-gradient-to-r from-secondary to-accent h-full rounded-full ${stepPercent}"></div>
            </div>
            <div class="flex justify-between text-[9px] font-bold text-slate-400 mt-2">
              <span class="${ord.status === 'Order Placed' ? 'text-primary' : ''}">Order Placed</span>
              <span class="${ord.status === 'Processing' ? 'text-primary' : ''}">Processing</span>
              <span class="${ord.status === 'Shipped' ? 'text-primary' : ''}">Shipped</span>
              <span class="${ord.status === 'Delivered' ? 'text-primary' : ''}">Delivered</span>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    ordersListHtml = `
      <div class="text-center py-10 border border-dashed rounded-2xl bg-slate-50/50">
        <i class="fa-solid fa-box-open text-4xl text-slate-300 mb-3"></i>
        <h4 class="font-heading font-bold text-sm text-slate-500">No Orders Placed Yet!</h4>
        <p class="text-[10px] text-slate-400 mt-0.5">Explore our powder collections to submit your first purchase.</p>
        <button onclick="navigate('shop')" class="mt-4 bg-primary hover:bg-blue-800 text-white font-bold py-2 px-5 rounded-xl text-xs shadow-sm">
          Shop Powders
        </button>
      </div>
    `;
  }

  return `
    <div class="py-6 space-y-8">
      
      <!-- Dashboard Title Banner -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6" data-aos="fade-down">
        <div>
          <h1 class="font-heading font-extrabold text-3xl text-darkText">User Dashboard</h1>
          <p class="text-xs text-slate-500">Welcome back, ${user.name}! Access profile and delivery statuses.</p>
        </div>
        <button onclick="handleLogout()" class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs py-2 px-5 rounded-xl transition-colors">
          <i class="fa-solid fa-power-off"></i> Log Out
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- User Profile details Card -->
        <div class="lg:col-span-4 bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm space-y-6" data-aos="fade-right">
          <div class="text-center space-y-2">
            <div class="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center font-heading font-bold text-2xl mx-auto shadow-inner border border-primary/10">
              ${user.name.charAt(0)}
            </div>
            <h3 class="font-heading font-bold text-lg text-darkText">${user.name}</h3>
            <span class="inline-block bg-blue-50 border border-blue-200 text-primary text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">Premium Customer</span>
          </div>

          <div class="space-y-4 border-t border-slate-100 pt-6 text-xs leading-relaxed">
            <div>
              <span class="text-slate-400 font-semibold block uppercase">Phone Number</span>
              <span class="font-bold text-darkText block mt-0.5">${user.phone}</span>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block uppercase">Email Address</span>
              <span class="font-bold text-darkText block mt-0.5">${user.email}</span>
            </div>
            <div>
              <span class="text-slate-400 font-semibold block uppercase">Physical Store Access</span>
              <span class="font-bold text-primary block mt-0.5 flex items-center gap-1"><i class="fa-solid fa-circle-check text-accent"></i> Available (Bathalapalli Location)</span>
            </div>
          </div>
        </div>

        <!-- Orders History Card -->
        <div class="lg:col-span-8 bg-white border border-slate-100 rounded-[35px] p-6 md:p-8 shadow-sm space-y-6" data-aos="fade-left">
          <h2 class="font-heading font-extrabold text-xl text-darkText border-b border-slate-100 pb-4 flex items-center gap-2"><i class="fa-solid fa-clock-rotate-left"></i> Order Tracking & History</h2>
          <div class="space-y-4 pr-1 max-h-[500px] overflow-y-auto">
            ${ordersListHtml}
          </div>
        </div>

      </div>

    </div>
  `;
}

// --- Render: Reusable Footer ---
function renderFooter() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        <!-- Company description -->
        <div class="md:col-span-5 space-y-5">
          <a href="#" onclick="navigate('home'); return false;" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <i class="fa-solid fa-leaf text-lg"></i>
            </div>
            <span class="font-heading font-extrabold text-2xl tracking-tight text-white">NVKM <span class="text-secondary">GROUP</span></span>
          </a>
          <p class="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
            NVKM GROUP manufactures healthy, natural, nutrient-rich fruit and vegetable powders under modern hygiene standards. Experience premium wellness food supplements for both retail and wholesale volumes.
          </p>
          <div class="flex items-center space-x-3 text-sm">
            <a href="https://wa.me/9014274293" target="_blank" class="w-8 h-8 rounded-full bg-[#0B253F] border border-blue-800 text-slate-300 hover:text-white hover:bg-blue-850 flex items-center justify-center transition-colors"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="tel:9014274293" class="w-8 h-8 rounded-full bg-[#0B253F] border border-blue-800 text-slate-300 hover:text-white hover:bg-blue-850 flex items-center justify-center transition-colors"><i class="fa-solid fa-phone"></i></a>
            <a href="mailto:Navakiranamgroup@gmail.com" class="w-8 h-8 rounded-full bg-[#0B253F] border border-blue-800 text-slate-300 hover:text-white hover:bg-blue-850 flex items-center justify-center transition-colors"><i class="fa-regular fa-envelope"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="md:col-span-3 space-y-4">
          <h3 class="font-heading font-bold text-sm text-white tracking-widest uppercase">Quick Links</h3>
          <ul class="space-y-2 text-xs font-light text-slate-400">
            <li><a href="#" onclick="navigate('home'); return false;" class="hover:text-secondary transition-colors">Home Page</a></li>
            <li><a href="#" onclick="navigate('shop'); return false;" class="hover:text-secondary transition-colors">Shop Powders</a></li>
            <li><a href="#" onclick="navigate('about'); return false;" class="hover:text-secondary transition-colors">About Company</a></li>
            <li><a href="#" onclick="navigate('contact'); return false;" class="hover:text-secondary transition-colors">Contact Support</a></li>
            <li><a href="#" onclick="navigate('login'); return false;" class="hover:text-secondary transition-colors">User Sign In</a></li>
          </ul>
        </div>

        <!-- Factory and store address -->
        <div class="md:col-span-4 space-y-4">
          <h3 class="font-heading font-bold text-sm text-white tracking-widest uppercase">Store Information</h3>
          <ul class="space-y-3.5 text-xs font-light text-slate-400">
            <li class="flex items-start gap-2.5">
              <i class="fa-solid fa-location-dot text-secondary mt-0.5 text-sm"></i>
              <span>Near bypass Anantapur Road, Bathalapalli,<br>Sri Sathya Sai Dist, Andhra Pradesh 515661</span>
            </li>
            <li class="flex items-center gap-2.5">
              <i class="fa-solid fa-phone text-secondary text-sm"></i>
              <span>+91 9014274293 / +91 7075604700</span>
            </li>
            <li class="flex items-center gap-2.5">
              <i class="fa-solid fa-envelope text-secondary text-sm"></i>
              <span>Navakiranamgroup@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright bottom -->
      <div class="border-t border-[#0B253F] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-light">
        <div>&copy; 2026 NVKM GROUP Manufacturing. All Rights Reserved.</div>
        <div class="flex items-center gap-4">
          <span>Owner: Janagonda Naveen</span>
          <span class="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
          <span>Retail & Wholesale Powders</span>
        </div>
      </div>
    </div>
  `;
}
