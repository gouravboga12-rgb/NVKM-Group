// ==========================================
// NVKM GROUP E-Commerce Core Application Logic
// ==========================================

// --- Product Database ---
const PRODUCTS_DATA = [
  {
    id: "banana-powder",
    name: "Premium Banana Powder",
    category: "Banana Powder",
    shortDesc: "Natural banana powder rich in nutrients and energy. Ideal for baby foods, smoothies, baking, and protein shakes.",
    longDesc: "NVKM GROUP's Premium Banana Powder is manufactured using high-grade, naturally ripened bananas. Through careful processing, we retain the natural sweetness, vitamins, and minerals without adding any artificial preservatives, sweeteners, or colors. Perfect for wellness seekers, mothers preparing nutritious baby food, or fitness enthusiasts looking for a clean, natural energy source.",
    benefits: [
      "100% Pure & Organic Cavendish Bananas",
      "Excellent source of Potassium, Dietary Fiber, and Vitamin B6",
      "Natural energy booster & highly digestible for infants",
      "Gluten-free, vegan-friendly, and zero artificial preservatives"
    ],
    ingredients: "100% Pure Dehydrated Cavendish Bananas",
    usage: "Add 1-2 tablespoons to milk, smoothies, oatmeal, protein shakes, or use in baking recipes (muffins, pancakes, cakes) as a natural sweetener and nutrient pack.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 34,
    badge: "Bestseller",
    variations: [
      { weight: "100g", price: 180, discountPrice: 140 },
      { weight: "250g", price: 400, discountPrice: 320 },
      { weight: "500g", price: 750, discountPrice: 600 },
      { weight: "1kg", price: 1400, discountPrice: 1100 }
    ],
    reviews: [
      { name: "Suresh K.", rating: 5, date: "2026-04-12", comment: "Excellent product! Smells so fresh and mixability is perfect. My kids love it in their milkshakes." },
      { name: "Priya M.", rating: 4, date: "2026-05-02", comment: "Very natural sweetness, no artificial smell. Highly recommend for infants as a healthy porridge mix." }
    ]
  },
  {
    id: "moringa-powder",
    name: "Organic Moringa Powder",
    category: "Moringa Powder",
    shortDesc: "Healthy moringa powder packed with vitamins and antioxidants. Perfect for daily nutrition and wellness.",
    longDesc: "Our Moringa Powder is sourced from selected organic Moringa Oleifera leaves, hand-picked and gently ground under strict quality standards. Dubbed the 'Miracle Tree', Moringa leaf powder is one of the most nutrient-dense botanicals on earth, offering a concentrated dose of vitamins, amino acids, and vital antioxidants to supercharge your health and immune system.",
    benefits: [
      "100% Pure Organic Moringa Oleifera leaf powder",
      "Rich in Antioxidants, Vitamin A, Vitamin C, Iron, and Calcium",
      "Supports immune system defense, skin health, and energy levels",
      "Natural anti-inflammatory and detoxifying properties"
    ],
    ingredients: "100% Pure Organic Dried Moringa Leaves",
    usage: "Take 1 teaspoon (approx 3-5g) daily. Mix in warm water, herbal teas, smoothies, fruit juices, or stir into soups and salad dressings.",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 42,
    badge: "Superfood",
    variations: [
      { weight: "100g", price: 200, discountPrice: 150 },
      { weight: "250g", price: 450, discountPrice: 350 },
      { weight: "500g", price: 800, discountPrice: 650 },
      { weight: "1kg", price: 1500, discountPrice: 1200 }
    ],
    reviews: [
      { name: "Ramesh Reddy", rating: 5, date: "2026-04-20", comment: "Truly organic, very fine powder. I drink it with warm water every morning, definitely boosts my stamina." },
      { name: "Anjali J.", rating: 5, date: "2026-05-10", comment: "Top quality packaging, and the leaf powder smells genuine and grassy. Great natural supplement." }
    ]
  },
  {
    id: "fruit-powders-mix",
    name: "Premium Mixed Fruit Powder",
    category: "Fruit Powders",
    shortDesc: "Premium fruit powders made from selected natural fruits. Suitable for healthy drinks and food products.",
    longDesc: "A vibrant blend of spray-dried natural fruit powders including Mango, Pineapple, Papaya, and Pomegranate. This natural fruit powder mix provides an incredible burst of flavor and a massive dose of Vitamin C. Perfect for food processing, ice creams, healthy juice formulations, or direct family consumption.",
    benefits: [
      "Blend of natural, fresh tropical fruits",
      "No added sugars, artificial preservatives, or chemical carriers",
      "Instant water solubility with refreshing fruity taste",
      "Packed with active enzymes and Vitamin C"
    ],
    ingredients: "Dried Mango, Pineapple, Pomegranate, and Papaya Pulp Extract",
    usage: "Stir 2 tablespoons in a glass of cold water or milk for an instant refreshing fruit drink, or blend into desserts, custards, and ice creams.",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 28,
    badge: "15% OFF",
    variations: [
      { weight: "250g", price: 500, discountPrice: 425 },
      { weight: "500g", price: 950, discountPrice: 800 },
      { weight: "1kg", price: 1800, discountPrice: 1500 }
    ],
    reviews: [
      { name: "Kiran P.", rating: 5, date: "2026-03-15", comment: "So useful for summer drinks. Kids love the taste, and it has no chemical sugar taste." }
    ]
  },
  {
    id: "vegetable-powders-mix",
    name: "Fresh Green Vegetable Powder",
    category: "Vegetable Powders",
    shortDesc: "Natural vegetable powders with rich nutrients and freshness. Perfect for cooking and health supplements.",
    longDesc: "Retain your vegetable nutrition with our Green Vegetable Powder Mix. Composed of premium dehydrated Spinach, Beetroot, Carrot, and Wheatgrass. Specially processed to maintain raw chlorophyll, mineral profiles, and fiber, this powder adds nutrition and color to your culinary dishes or morning super-green smoothies.",
    benefits: [
      "Dehydrated Spinach, Carrot, Beetroot, and Wheatgrass blend",
      "High concentration of plant iron, minerals, and chlorophyll",
      "Perfect for enrichment of batters, doughs, and soup broths",
      "100% Vegan, Gluten-free, and Non-GMO"
    ],
    ingredients: "Dehydrated Spinach, Carrot, Beetroot, and Organic Wheatgrass Powders",
    usage: "Stir 1-2 teaspoons into your soup, gravy, chapati dough, idli batter, or blend with fruit juice for a nutritious green drink.",
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewsCount: 19,
    badge: "New",
    variations: [
      { weight: "250g", price: 480, discountPrice: 400 },
      { weight: "500g", price: 900, discountPrice: 750 },
      { weight: "1kg", price: 1700, discountPrice: 1400 }
    ],
    reviews: [
      { name: "Veena Rao", rating: 4, date: "2026-05-18", comment: "I mix this in my wheat flour when making rotis. A great way to sneak green veggies into my kids' food!" }
    ]
  },
  {
    id: "health-powders-wellness",
    name: "Daily Vitality Health Powder",
    category: "Health Powders",
    shortDesc: "Nutritious health powders designed for active and healthy lifestyles. Helps support daily wellness.",
    longDesc: "A proprietary herbal formulation mixing Ashwagandha, Amla, and Shatavari powders. NVKM GROUP's Daily Vitality health powder is crafted to boost stamina, manage daily stress, promote metabolic wellness, and build long-term biological immunity for both men and women leading busy lives.",
    benefits: [
      "Balanced combination of Ashwagandha, Amla (Gooseberry), and Shatavari",
      "Promotes stress relief, sleep quality, and biological immunity",
      "Naturally rich in Vitamin C, Adaptogens, and energy-renewing herbs",
      "Triple tested for heavy metals and purity standards"
    ],
    ingredients: "Pure Ashwagandha Root, Dried Amla Fruit, and Shatavari Root Powders",
    usage: "Take 1 scoop (5g) twice daily with warm milk or honey, preferably after meals.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 31,
    badge: "Immunity Boost",
    variations: [
      { weight: "100g", price: 250, discountPrice: 199 },
      { weight: "250g", price: 550, discountPrice: 480 },
      { weight: "500g", price: 1000, discountPrice: 850 }
    ],
    reviews: [
      { name: "Janardhan S.", rating: 5, date: "2026-04-30", comment: "Top class immunity builder. Ashwagandha quality is really authentic." }
    ]
  },
  {
    id: "natural-powders-herbs",
    name: "Pure Neem & Tulsi Herbal Powder",
    category: "Natural Powders",
    shortDesc: "Pure and natural powders without preservatives or artificial colors. Made for healthy living.",
    longDesc: "Our Neem and Tulsi Herbal Powder is an exceptional double-purified blend that acts as a natural purifier. Sourced from organic fields, it is processed at low temperatures to ensure the active bitters and healing volatile oils remain intact. Ideal for blood purification, digestive health, or external skin/hair applications.",
    benefits: [
      "Double purified Neem leaves and Sacred Tulsi leaves",
      "Promotes blood detoxification and clear, healthy skin",
      "Highly effective for both internal consumption and external face packs",
      "Zero chemicals, colorants, or fillers added"
    ],
    ingredients: "Dehydrated Neem Leaf (Azadirachta Indica) and Holy Tulsi Leaf (Ocimum Sanctum)",
    usage: "Internal: Take 1/2 teaspoon with warm water in the morning. External: Mix with water/rosewater to make a paste, apply on skin/scalp, wash after 15 minutes.",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviewsCount: 15,
    badge: "Detox",
    variations: [
      { weight: "100g", price: 150, discountPrice: 110 },
      { weight: "250g", price: 320, discountPrice: 250 },
      { weight: "500g", price: 600, discountPrice: 480 }
    ],
    reviews: [
      { name: "Meera K.", rating: 5, date: "2026-05-14", comment: "I use this primarily as a face pack. Works wonders for oily skin and breakouts!" }
    ]
  }
];

// --- Global Application State ---
let state = {
  currentView: "home",
  selectedProductId: null,
  searchQuery: "",
  selectedCategory: "All",
  cart: [],
  wishlist: [],
  users: [],
  currentUser: null,
  orderHistory: []
};

// --- WhatsApp Settings ---
const CONTACT_PHONES = ["9014274293", "7075604700"];
const WHATSAPP_PRIMARY = "9014274293";
const GENERAL_WA_MSG = "Hello, I am interested in your natural powder products.";

// --- Initialize App State from LocalStorage ---
function initAppState() {
  const localCart = localStorage.getItem("nvkm_cart");
  if (localCart) state.cart = JSON.parse(localCart);

  const localWishlist = localStorage.getItem("nvkm_wishlist");
  if (localWishlist) state.wishlist = JSON.parse(localWishlist);

  const localUsers = localStorage.getItem("nvkm_users");
  if (localUsers) state.users = JSON.parse(localUsers);

  const localCurrentUser = localStorage.getItem("nvkm_current_user");
  if (localCurrentUser) {
    state.currentUser = JSON.parse(localCurrentUser);
    // Sync order history for this user
    state.orderHistory = state.currentUser.orders || [];
  }

  updateGlobalBadges();
  renderUserMenu();
}

// --- LocalStorage Sync Utilities ---
function saveCart() {
  localStorage.setItem("nvkm_cart", JSON.stringify(state.cart));
  updateGlobalBadges();
  renderCartDrawer();
}

function saveWishlist() {
  localStorage.setItem("nvkm_wishlist", JSON.stringify(state.wishlist));
  updateGlobalBadges();
  renderWishlistDrawer();
}

function saveCurrentUser() {
  if (state.currentUser) {
    state.currentUser.orders = state.orderHistory;
    localStorage.setItem("nvkm_current_user", JSON.stringify(state.currentUser));
    
    // Update users array too
    state.users = state.users.map(u => u.email === state.currentUser.email ? state.currentUser : u);
    localStorage.setItem("nvkm_users", JSON.stringify(state.users));
  } else {
    localStorage.removeItem("nvkm_current_user");
  }
  renderUserMenu();
}

// --- Global Badges Updates ---
function updateGlobalBadges() {
  // Update Cart Badge
  const cartBadge = document.getElementById("cart-badge");
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount > 0) {
    cartBadge.textContent = cartCount;
    cartBadge.classList.remove("scale-0");
    cartBadge.classList.add("scale-100");
  } else {
    cartBadge.classList.remove("scale-100");
    cartBadge.classList.add("scale-0");
  }

  // Update Wishlist Badge
  const wishlistBadge = document.getElementById("wishlist-badge");
  const wishlistCount = state.wishlist.length;
  if (wishlistCount > 0) {
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.classList.remove("scale-0");
    wishlistBadge.classList.add("scale-100");
  } else {
    wishlistBadge.classList.remove("scale-100");
    wishlistBadge.classList.add("scale-0");
  }
}

// --- Toast Notifications ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  
  // Icon based on type
  let icon = '<i class="fa-solid fa-circle-check text-green-500 text-lg"></i>';
  if (type === "warning") icon = '<i class="fa-solid fa-triangle-exclamation text-yellow-500 text-lg"></i>';
  if (type === "error") icon = '<i class="fa-solid fa-circle-exclamation text-red-500 text-lg"></i>';
  if (type === "info") icon = '<i class="fa-solid fa-circle-info text-blue-500 text-lg"></i>';

  toast.className = `glass border flex items-center gap-3 p-4 pr-6 rounded-2xl shadow-xl transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto bg-white/90 border-slate-200`;
  toast.innerHTML = `
    ${icon}
    <span class="text-sm font-semibold text-darkText">${message}</span>
  `;

  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// --- View Router & Navigation ---
function navigate(view, productId = null) {
  state.currentView = view;
  state.selectedProductId = productId;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Update Nav Link Active Styling
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    const id = link.getAttribute("id");
    if (id === `nav-${view}`) {
      link.className = "nav-link text-primary font-bold hover:text-accent border-b-2 border-primary pb-1 transition-all duration-200";
    } else {
      link.className = "nav-link text-lightText hover:text-accent transition-colors duration-200";
    }
  });

  const appViewport = document.getElementById("app-viewport");
  appViewport.innerHTML = ""; // Clear current view
  
  // Create page container wrapper for smooth transition
  const pageWrapper = document.createElement("div");
  pageWrapper.className = "page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  
  // Populate view content based on router state
  if (view === "home") {
    pageWrapper.innerHTML = renderHomeView();
  } else if (view === "shop") {
    pageWrapper.innerHTML = renderShopView();
    // After shop renders, configure search and filter event listeners
    setTimeout(() => {
      document.getElementById("shop-search").value = state.searchQuery;
      document.getElementById("category-select").value = state.selectedCategory;
    }, 10);
  } else if (view === "product-detail") {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (product) {
      pageWrapper.innerHTML = renderProductDetailView(product);
    } else {
      navigate("shop");
      return;
    }
  } else if (view === "about") {
    pageWrapper.innerHTML = renderAboutView();
  } else if (view === "contact") {
    pageWrapper.innerHTML = renderContactView();
  } else if (view === "login") {
    if (state.currentUser) {
      navigate("dashboard");
      return;
    }
    pageWrapper.innerHTML = renderLoginView();
  } else if (view === "dashboard") {
    if (!state.currentUser) {
      navigate("login");
      return;
    }
    pageWrapper.innerHTML = renderDashboardView();
  }

  appViewport.appendChild(pageWrapper);

  // Trigger AOS refresh so scroll animations fire on dynamic elements
  setTimeout(() => {
    AOS.refresh();
  }, 100);
}

// --- Mobile Navigation ---
function toggleMobileMenu(isOpen) {
  const drawer = document.getElementById("mobile-menu-drawer");
  const overlay = drawer.querySelector(".drawer-overlay");
  const content = drawer.querySelector(".drawer-content");

  if (isOpen) {
    drawer.classList.remove("pointer-events-none");
    overlay.classList.add("opacity-100");
    content.classList.remove("translate-x-full");
  } else {
    drawer.classList.add("pointer-events-none");
    overlay.classList.remove("opacity-100");
    content.classList.add("translate-x-full");
  }
}

// --- Cart Logic & Drawer UI ---
function toggleCartDrawer(isOpen) {
  const drawer = document.getElementById("cart-drawer");
  const overlay = drawer.querySelector(".drawer-overlay");
  const content = drawer.querySelector(".drawer-content");

  if (isOpen) {
    renderCartDrawer();
    drawer.classList.remove("pointer-events-none");
    overlay.classList.add("opacity-100");
    content.classList.remove("translate-x-full");
  } else {
    drawer.classList.add("pointer-events-none");
    overlay.classList.remove("opacity-100");
    content.classList.add("translate-x-full");
  }
}

function addToCart(productId, weight, quantity = 1, silent = false) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const variation = product.variations.find(v => v.weight === weight);
  if (!variation) return;

  const existingItemIndex = state.cart.findIndex(
    item => item.productId === productId && item.weight === weight
  );

  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].quantity += quantity;
  } else {
    state.cart.push({
      productId,
      name: product.name,
      weight,
      price: variation.discountPrice,
      originalPrice: variation.price,
      image: product.image,
      quantity
    });
  }

  saveCart();
  if (!silent) {
    showToast(`Added ${quantity}x ${product.name} (${weight}) to Cart!`);
  }
}

function updateCartQuantity(productId, weight, change) {
  const itemIndex = state.cart.findIndex(
    item => item.productId === productId && item.weight === weight
  );

  if (itemIndex > -1) {
    state.cart[itemIndex].quantity += change;
    if (state.cart[itemIndex].quantity <= 0) {
      state.cart.splice(itemIndex, 1);
      showToast("Item removed from Cart.", "info");
    }
    saveCart();
  }
}

function removeFromCart(productId, weight) {
  const itemIndex = state.cart.findIndex(
    item => item.productId === productId && item.weight === weight
  );

  if (itemIndex > -1) {
    state.cart.splice(itemIndex, 1);
    saveCart();
    showToast("Item removed from Cart.", "info");
  }
}

function calculateCartTotals() {
  let subtotal = 0;
  let originalSubtotal = 0;

  state.cart.forEach(item => {
    subtotal += item.price * item.quantity;
    originalSubtotal += item.originalPrice * item.quantity;
  });

  const savings = originalSubtotal - subtotal;
  const total = subtotal;

  return { subtotal: originalSubtotal, savings, total };
}

function renderCartDrawer() {
  const container = document.getElementById("cart-drawer-items");
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12">
        <i class="fa-solid fa-basket-shopping text-6xl text-slate-200 mb-4"></i>
        <p class="font-heading font-semibold text-lg text-slate-500">Your basket is empty!</p>
        <p class="text-sm text-slate-400 mt-1 max-w-[280px]">Add organic powders to start healthy living.</p>
        <button onclick="navigate('shop'); toggleCartDrawer(false);" class="mt-6 bg-primary hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">
          Shop Now
        </button>
      </div>
    `;
    // Update labels to 0
    document.getElementById("cart-subtotal").textContent = "₹0.00";
    document.getElementById("cart-savings").textContent = "-₹0.00";
    document.getElementById("cart-total").textContent = "₹0.00";
    return;
  }

  let html = "";
  state.cart.forEach(item => {
    html += `
      <div class="flex gap-4 p-4 bg-slate-50 border rounded-2xl relative group hover:border-slate-300 transition-all duration-200">
        <!-- Delete Button -->
        <button onclick="removeFromCart('${item.productId}', '${item.weight}')" class="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 transition-colors" aria-label="Delete">
          <i class="fa-solid fa-trash-can text-sm"></i>
        </button>

        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover bg-white shadow-sm">
        <div class="flex-1 min-w-0 pr-6">
          <h4 class="font-heading font-bold text-darkText truncate text-sm leading-tight">${item.name}</h4>
          <p class="text-xs text-slate-500 font-semibold mt-0.5">Size: ${item.weight}</p>
          
          <div class="flex items-center justify-between mt-2.5">
            <!-- Quantity adjustment controls -->
            <div class="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <button onclick="updateCartQuantity('${item.productId}', '${item.weight}', -1)" class="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-minus text-[10px]"></i></button>
              <span class="px-2 text-xs font-bold text-darkText">${item.quantity}</span>
              <button onclick="updateCartQuantity('${item.productId}', '${item.weight}', 1)" class="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-plus text-[10px]"></i></button>
            </div>
            
            <div class="text-right">
              <span class="text-xs text-slate-400 line-through mr-1.5">₹${item.originalPrice * item.quantity}</span>
              <span class="text-sm font-bold text-primary">₹${item.price * item.quantity}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Calculate & Set Totals
  const { subtotal, savings, total } = calculateCartTotals();
  document.getElementById("cart-subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("cart-savings").textContent = `-₹${savings.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `₹${total.toFixed(2)}`;
}

// --- Wishlist Logic & Drawer UI ---
function toggleWishlistDrawer(isOpen) {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = drawer.querySelector(".drawer-overlay");
  const content = drawer.querySelector(".drawer-content");

  if (isOpen) {
    renderWishlistDrawer();
    drawer.classList.remove("pointer-events-none");
    overlay.classList.add("opacity-100");
    content.classList.remove("translate-x-full");
  } else {
    drawer.classList.add("pointer-events-none");
    overlay.classList.remove("opacity-100");
    content.classList.add("translate-x-full");
  }
}

function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  if (idx > -1) {
    state.wishlist.splice(idx, 1);
    showToast("Product removed from wishlist.", "info");
  } else {
    state.wishlist.push(productId);
    showToast("Added product to wishlist!");
  }
  saveWishlist();
  
  // Re-render current page to sync heart buttons (especially shop & product detail view)
  if (state.currentView === "shop") {
    renderShopGrid();
  } else if (state.currentView === "product-detail" && state.selectedProductId === productId) {
    navigate("product-detail", productId);
  }
}

function renderWishlistDrawer() {
  const container = document.getElementById("wishlist-drawer-items");
  if (state.wishlist.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-12">
        <i class="fa-regular fa-heart text-6xl text-slate-200 mb-4"></i>
        <p class="font-heading font-semibold text-lg text-slate-500">Your wishlist is empty!</p>
        <p class="text-sm text-slate-400 mt-1 max-w-[280px]">Save healthy powders to buy them later.</p>
        <button onclick="navigate('shop'); toggleWishlistDrawer(false);" class="mt-6 bg-primary hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md">
          Explore Products
        </button>
      </div>
    `;
    return;
  }

  let html = "";
  state.wishlist.forEach(id => {
    const item = PRODUCTS_DATA.find(p => p.id === id);
    if (!item) return;
    
    // Use first variation for pricing
    const defaultVar = item.variations[0];

    html += `
      <div class="flex gap-4 p-4 bg-slate-50 border rounded-2xl relative group hover:border-slate-300 transition-all duration-200">
        <!-- Delete Button -->
        <button onclick="toggleWishlist('${item.id}')" class="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 transition-colors" aria-label="Remove">
          <i class="fa-solid fa-trash-can text-sm"></i>
        </button>

        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover bg-white shadow-sm cursor-pointer" onclick="navigate('product-detail', '${item.id}'); toggleWishlistDrawer(false);">
        <div class="flex-1 min-w-0 pr-6">
          <h4 class="font-heading font-bold text-darkText truncate text-sm leading-tight cursor-pointer" onclick="navigate('product-detail', '${item.id}'); toggleWishlistDrawer(false);">${item.name}</h4>
          <p class="text-xs text-slate-500 font-semibold mt-0.5">${item.category}</p>
          
          <div class="flex items-center justify-between mt-2.5">
            <div class="flex flex-col">
              <span class="text-xs text-slate-400 line-through leading-none">₹${defaultVar.price}</span>
              <span class="text-sm font-bold text-primary">₹${defaultVar.discountPrice} (${defaultVar.weight})</span>
            </div>
            
            <button onclick="addToCart('${item.id}', '${defaultVar.weight}'); toggleWishlistDrawer(false);" class="bg-primary hover:bg-emerald-850 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm">
              <i class="fa-solid fa-cart-shopping"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// --- Quick View Modal ---
function toggleQuickViewModal(isOpen, productId = null) {
  const modal = document.getElementById("quickview-modal");
  const overlay = modal.querySelector(".drawer-overlay");
  const content = modal.querySelector(".drawer-content");

  if (isOpen && productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    renderQuickView(product);
    modal.classList.remove("pointer-events-none");
    overlay.classList.add("opacity-100");
    content.classList.remove("translate-y-12", "scale-95", "opacity-0");
  } else {
    modal.classList.add("pointer-events-none");
    overlay.classList.remove("opacity-100");
    content.classList.add("translate-y-12", "scale-95", "opacity-0");
  }
}

function renderQuickView(product) {
  const container = document.getElementById("quickview-modal-content");
  
  // Set default variation
  const defaultVar = product.variations[0];
  
  // Generate benefits list html
  let benefitsHtml = "";
  product.benefits.forEach(b => {
    benefitsHtml += `<li class="flex items-start gap-2 text-sm text-lightText"><i class="fa-solid fa-circle-check text-accent mt-0.5"></i> <span>${b}</span></li>`;
  });

  // Generate weights select options
  let weightsHtml = "";
  product.variations.forEach((v, index) => {
    weightsHtml += `
      <label class="flex-1 cursor-pointer">
        <input type="radio" name="qv-weight" value="${v.weight}" ${index === 0 ? 'checked' : ''} onchange="updateQuickViewPrice('${product.id}', this.value)" class="sr-only peer">
        <div class="border border-slate-200 peer-checked:border-primary peer-checked:bg-emerald-50 rounded-xl py-2 px-3 text-center transition-all">
          <span class="block text-xs font-bold text-darkText">${v.weight}</span>
          <span class="block text-[10px] text-slate-500 font-medium">₹${v.discountPrice}</span>
        </div>
      </label>
    `;
  });

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Product Images Grid -->
      <div class="space-y-4">
        <div class="bg-slate-50 border rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative shadow-sm">
          <span class="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md z-10">${product.badge}</span>
          <img src="${product.image}" id="qv-main-image" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="border border-primary bg-emerald-50 rounded-xl overflow-hidden aspect-square cursor-pointer">
            <img src="${product.image}" alt="view 1" class="w-full h-full object-cover">
          </div>
          <!-- Additional mock views -->
          <div class="border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden aspect-square cursor-pointer bg-slate-50 flex items-center justify-center">
            <i class="fa-solid fa-box-open text-slate-400 text-lg"></i>
          </div>
          <div class="border border-slate-200 hover:border-slate-400 rounded-xl overflow-hidden aspect-square cursor-pointer bg-slate-50 flex items-center justify-center">
            <i class="fa-solid fa-certificate text-slate-400 text-lg"></i>
          </div>
        </div>
      </div>

      <!-- Product Meta details -->
      <div class="flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold text-accent tracking-wider uppercase">${product.category}</span>
          <h3 class="font-heading font-extrabold text-2xl text-darkText mt-1">${product.name}</h3>
          
          <!-- Rating badge -->
          <div class="flex items-center space-x-2 mt-2">
            <div class="star-rating text-sm">
              <div class="star-rating-lower"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <div class="star-rating-upper" style="width:${(product.rating/5)*100}%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
            </div>
            <span class="text-xs font-bold text-darkText">${product.rating}</span>
            <span class="text-xs text-slate-400 font-semibold">(${product.reviewsCount} reviews)</span>
          </div>

          <!-- Prices -->
          <div class="mt-4 flex items-baseline gap-2.5 p-3 bg-slate-50 border rounded-2xl shadow-inner">
            <span class="text-3xl font-heading font-extrabold text-primary" id="qv-discount-price">₹${defaultVar.discountPrice}</span>
            <span class="text-sm text-slate-400 line-through font-semibold" id="qv-original-price">M.R.P: ₹${defaultVar.price}</span>
            <span class="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded" id="qv-saving-badge">Save ${Math.round(((defaultVar.price - defaultVar.discountPrice)/defaultVar.price)*100)}%</span>
          </div>

          <p class="text-sm text-lightText mt-4 leading-relaxed">${product.shortDesc}</p>
          
          <ul class="mt-4 space-y-2 border-t pt-4 border-slate-100">
            ${benefitsHtml}
          </ul>

          <!-- Weight options selector -->
          <div class="mt-5">
            <span class="block text-xs font-bold text-darkText mb-2">Available Size / Weights:</span>
            <div class="flex gap-2">
              ${weightsHtml}
            </div>
          </div>

          <!-- Quantity selection -->
          <div class="mt-5 flex items-center gap-4">
            <span class="text-xs font-bold text-darkText">Select Qty:</span>
            <div class="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <button onclick="adjustQvQuantity(-1)" class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-minus text-xs"></i></button>
              <span id="qv-qty-label" class="px-4 font-bold text-sm text-darkText">1</span>
              <button onclick="adjustQvQuantity(1)" class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"><i class="fa-solid fa-plus text-xs"></i></button>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button onclick="submitQvAddToCart('${product.id}')" class="flex-1 bg-primary hover:bg-emerald-850 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all">
            <i class="fa-solid fa-basket-shopping text-sm"></i> Add to Basket
          </button>
          <button onclick="submitQvBuyNow('${product.id}')" class="flex-1 bg-accent hover:bg-accentHover text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all">
            <i class="fa-solid fa-bolt text-sm"></i> Buy Now
          </button>
          <button onclick="submitQvWhatsAppInquiry('${product.id}')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center shadow-md transition-all" title="WhatsApp Inquiry">
            <i class="fa-brands fa-whatsapp text-xl"></i>
          </button>
        </div>
      </div>

    </div>
  `;
}

function updateQuickViewPrice(productId, selectedWeight) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const variation = product.variations.find(v => v.weight === selectedWeight);
  if (!variation) return;

  document.getElementById("qv-discount-price").textContent = `₹${variation.discountPrice}`;
  document.getElementById("qv-original-price").textContent = `M.R.P: ₹${variation.price}`;
  
  const percentage = Math.round(((variation.price - variation.discountPrice) / variation.price) * 100);
  document.getElementById("qv-saving-badge").textContent = `Save ${percentage}%`;
}

function adjustQvQuantity(change) {
  const qtyLabel = document.getElementById("qv-qty-label");
  let currentVal = parseInt(qtyLabel.textContent);
  currentVal += change;
  if (currentVal < 1) currentVal = 1;
  qtyLabel.textContent = currentVal;
}

function submitQvAddToCart(productId) {
  const selectedWeight = document.querySelector('input[name="qv-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("qv-qty-label").textContent);
  
  addToCart(productId, selectedWeight, quantity);
  toggleQuickViewModal(false);
}

function submitQvBuyNow(productId) {
  const selectedWeight = document.querySelector('input[name="qv-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("qv-qty-label").textContent);
  
  addToCart(productId, selectedWeight, quantity, true);
  toggleQuickViewModal(false);
  toggleCartDrawer(true);
}

function submitQvWhatsAppInquiry(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const selectedWeight = document.querySelector('input[name="qv-weight"]:checked').value;
  const quantity = parseInt(document.getElementById("qv-qty-label").textContent);
  
  const textMsg = `Hello NVKM GROUP, I am interested in purchasing your natural powder:\n- Product: ${product.name}\n- Packaging Weight: ${selectedWeight}\n- Quantity: ${quantity}\nCould you please provide bulk wholesale rates and retail delivery details for my pincode?`;
  const encText = encodeURIComponent(textMsg);
  
  window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${encText}`, "_blank");
}

// --- Checkout Modal UI ---
function toggleCheckoutModal(isOpen) {
  const modal = document.getElementById("checkout-modal");
  const overlay = modal.querySelector(".drawer-overlay");
  const content = modal.querySelector(".drawer-content");

  if (isOpen) {
    if (state.cart.length === 0) {
      showToast("Cannot checkout an empty basket!", "warning");
      return;
    }
    toggleCartDrawer(false); // close cart
    modal.classList.remove("pointer-events-none");
    overlay.classList.add("opacity-100");
    content.classList.remove("translate-y-12", "scale-95", "opacity-0");

    // Prepopulate name/phone if user is logged in
    if (state.currentUser) {
      document.getElementById("checkout-name").value = state.currentUser.name || "";
      document.getElementById("checkout-phone").value = state.currentUser.phone || "";
      document.getElementById("checkout-email").value = state.currentUser.email || "";
    }
  } else {
    modal.classList.add("pointer-events-none");
    overlay.classList.remove("opacity-100");
    content.classList.add("translate-y-12", "scale-95", "opacity-0");
  }
}

function openCheckoutModal() {
  toggleCheckoutModal(true);
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const email = document.getElementById("checkout-email").value.trim();
  const address = document.getElementById("checkout-address").value.trim();

  // Create order mock object
  const { subtotal, savings, total } = calculateCartTotals();
  const orderId = "NVKM-" + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    date: new Date().toLocaleDateString(),
    items: [...state.cart],
    totalPayable: total,
    shippingInfo: { name, phone, email, address },
    status: "Order Placed" // Status stepper: Order Placed -> Processing -> Shipped -> Delivered
  };

  // Add to order history
  state.orderHistory.unshift(newOrder);

  // If user logged in, update user object in local storage
  if (state.currentUser) {
    saveCurrentUser();
  }

  // Clear Cart
  state.cart = [];
  saveCart();

  toggleCheckoutModal(false);
  
  // Show order success view or alert user
  showToast(`Congratulations! Order ${orderId} has been submitted!`);

  // Redirect to Dashboard if logged in, otherwise show a congratulations alert page
  if (state.currentUser) {
    navigate("dashboard");
  } else {
    // Show a modal or visual overlay alert
    alert(`Thank you ${name}!\nYour order ${orderId} for ₹${total} has been placed successfully via Cash on Delivery.\nWe will contact you shortly at ${phone} to confirm dispatch!`);
    navigate("home");
  }
}

function checkoutViaWhatsAppDirect() {
  if (state.cart.length === 0) {
    showToast("Your basket is empty!", "warning");
    return;
  }

  const { subtotal, savings, total } = calculateCartTotals();
  
  let itemsList = "";
  state.cart.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.name} (${item.weight}) x ${item.quantity} = ₹${item.price * item.quantity}\n`;
  });

  const textMsg = `Hello NVKM GROUP, I would like to place an order directly on WhatsApp!\n\n--- Items List ---\n${itemsList}\nTotal Payable: ₹${total}\nDiscount Savings: ₹${savings}\nDelivery Type: Cash on Delivery\n\nPlease let me know the confirmation and delivery time. Thank you!`;
  const encText = encodeURIComponent(textMsg);
  
  window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${encText}`, "_blank");
}

// --- Search and Filters ---
function handleSearch(val) {
  state.searchQuery = val.trim();
  
  // Sync desktop and mobile search bars
  const dSearch = document.getElementById("desktop-search");
  const mSearch = document.getElementById("mobile-search");
  if (dSearch) dSearch.value = val;
  if (mSearch) mSearch.value = val;

  // If search value changes, ensure we navigate to shop page to view results
  if (state.currentView !== "shop") {
    navigate("shop");
  } else {
    // We are on shop page, just filter grid
    renderShopGrid();
  }
}

function handleCategoryFilter(category) {
  state.selectedCategory = category;
  
  if (state.currentView !== "shop") {
    navigate("shop");
  } else {
    // We are on shop page, render grid
    renderShopGrid();
  }
}

// --- User System Integration (Register/Login) ---
function handleUserMenuClick() {
  if (state.currentUser) {
    navigate("dashboard");
  } else {
    navigate("login");
  }
}

function renderUserMenu() {
  const userBtn = document.getElementById("user-menu-btn");
  const userNameLabel = document.getElementById("user-menu-name");

  if (state.currentUser) {
    userNameLabel.textContent = state.currentUser.name.split(" ")[0]; // short name
    userBtn.className = "flex items-center space-x-1.5 p-2 bg-emerald-50 hover:bg-emerald-100 text-primary border border-primary/20 rounded-full px-3 transition-all duration-200 focus:outline-none";
  } else {
    userNameLabel.textContent = "Sign In";
    userBtn.className = "flex items-center space-x-1.5 p-2 bg-slate-100 hover:bg-slate-200/80 text-primary rounded-full px-3 transition-all duration-200 focus:outline-none";
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value;

  const foundUser = state.users.find(u => u.email === email && u.password === pass);

  if (foundUser) {
    state.currentUser = foundUser;
    state.orderHistory = foundUser.orders || [];
    localStorage.setItem("nvkm_current_user", JSON.stringify(foundUser));
    
    showToast(`Welcome back, ${foundUser.name}!`);
    renderUserMenu();
    navigate("dashboard");
  } else {
    showToast("Invalid email or password combination.", "error");
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const phone = document.getElementById("register-phone").value.trim();
  const email = document.getElementById("register-email").value.trim().toLowerCase();
  const pass = document.getElementById("register-password").value;
  const passConfirm = document.getElementById("register-password-confirm").value;

  if (pass !== passConfirm) {
    showToast("Passwords do not match!", "error");
    return;
  }

  const userExists = state.users.some(u => u.email === email);
  if (userExists) {
    showToast("Email address is already registered.", "warning");
    return;
  }

  const newUser = {
    name,
    phone,
    email,
    password: pass,
    orders: []
  };

  state.users.push(newUser);
  localStorage.setItem("nvkm_users", JSON.stringify(state.users));

  showToast("Account created! Please sign in with your credentials.");
  toggleAuthForm('login');
}

function handleLogout() {
  state.currentUser = null;
  state.orderHistory = [];
  localStorage.removeItem("nvkm_current_user");
  renderUserMenu();
  showToast("Successfully logged out.", "info");
  navigate("home");
}

function handleForgotPasswordSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("fp-email").value.trim().toLowerCase();
  
  const userExists = state.users.some(u => u.email === email);
  if (userExists) {
    showToast("Password reset link has been dispatched to your email address!");
    toggleAuthForm('login');
  } else {
    showToast("No account exists with this email address.", "error");
  }
}

// --- App Bootstrap ---
document.addEventListener("DOMContentLoaded", () => {
  initAppState();
  
  // Render Footer dynamically to avoid duplicates
  const footerElement = document.getElementById("app-footer");
  footerElement.innerHTML = renderFooter();

  // Load the Home view immediately
  navigate("home");
});
