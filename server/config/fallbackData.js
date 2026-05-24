const PRODUCTS_DATA = [
  // 1. Tomato Powder
  {
    slug: "tomato-powder-250g",
    name: "Tomato Powder 250 Grams",
    category: "Tomato Powder",
    short_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Tomato Powder — crafted for health-conscious consumers and professional culinary applications.",
    long_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Tomato Powder, crafted for health-conscious consumers and professional culinary applications. Our premium powder is derived from high-quality, farm-fresh Tomato, utilizing advanced dehydration technology to lock in essential nutrients, natural sweetness, and authentic flavor.",
    benefits: [
      "100% Pure & Natural Farm-Fresh Tomatoes",
      "Rich in Lycopene, Vitamin C, and Antioxidants",
      "No artificial preservatives, colors, or additives",
      "Ideal for soups, gravies, sauces, and culinary use"
    ],
    ingredients: "100% Pure Dehydrated Farm-Fresh Tomatoes",
    usage_info: "Add 1-2 teaspoons to soups, curries, pasta sauces, or gravies. Dissolve in warm water as a quick tomato base. Ideal for instant cooking and bulk food preparation.",
    image: "/products images/tomato_main.png",
    images: [
      "/products images/tomato_main.png",
      "/products images/tomato_2.png",
      "/products images/tomato_3.png",
      "/products images/tomato_4.png"
    ],
    rating: 4.7,
    reviews_count: 22,
    badge: "New",
    variations: [
      { weight: "250g", price: 150, discount_price: 150 }
    ],
    reviews: [
      { name: "Lakshmi R.", rating: 5, date: "2026-05-10", comment: "Very fresh aroma and rich tomato color. Excellent for daily cooking!" },
      { name: "Venkat S.", rating: 4, date: "2026-05-14", comment: "Great quality tomato powder. Mixes well in gravies without lumps." }
    ]
  },

  // 2. Raw Banana Powder
  {
    slug: "raw-banana-powder-250g",
    name: "Raw Banana Powder 250 Grams",
    category: "Banana Powder",
    short_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Banana Powder — crafted for health-conscious consumers and professional culinary applications.",
    long_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Banana Powder, crafted for health-conscious consumers and professional culinary applications. Our premium powder is derived from high-quality, farm-fresh Raw Banana, utilizing advanced dehydration technology to lock in essential nutrients, natural sweetness, and authentic flavor.",
    benefits: [
      "100% Pure & Natural Farm-Fresh Raw Banana",
      "Rich in Resistant Starch, Potassium, and Dietary Fiber",
      "Supports digestion, gut health, and natural energy",
      "Gluten-free, vegan-friendly, zero artificial preservatives"
    ],
    ingredients: "100% Pure Dehydrated Farm-Fresh Raw Banana",
    usage_info: "Add 1-2 tablespoons to baby food, porridge, smoothies, or baking recipes. Ideal for health-conscious recipes and natural energy boosting.",
    image: "/products images/banana_main.png",
    images: [
      "/products images/banana_main.png",
      "/products images/banana_2.png",
      "/products images/banana_3.png"
    ],
    rating: 4.8,
    reviews_count: 31,
    badge: "Bestseller",
    variations: [
      { weight: "250g", price: 180, discount_price: 150 }
    ],
    reviews: [
      { name: "Priya M.", rating: 5, date: "2026-05-02", comment: "Very natural sweetness, no artificial smell. Highly recommend for infants as a healthy porridge mix." },
      { name: "Suresh K.", rating: 5, date: "2026-04-12", comment: "Excellent product! Smells so fresh and mixability is perfect. My kids love it in their milkshakes." }
    ]
  },

  // 3. Carrot Powder
  {
    slug: "carrot-powder-250g",
    name: "Carrot Powder 250 Grams",
    category: "Carrot Powder",
    short_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Carrot Powder — crafted for health-conscious consumers and professional culinary applications.",
    long_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Carrot Powder, crafted for health-conscious consumers and professional culinary applications. Our premium powder is derived from high-quality, farm-fresh Carrot, utilizing advanced dehydration technology to lock in essential nutrients, natural sweetness, and authentic flavor.",
    benefits: [
      "100% Pure & Natural Farm-Fresh Carrots",
      "Rich in Beta-Carotene, Vitamin A, and Antioxidants",
      "Supports eye health, immunity, and natural skin glow",
      "No artificial colors, preservatives, or fillers"
    ],
    ingredients: "100% Pure Dehydrated Farm-Fresh Carrots",
    usage_info: "Blend 1-2 teaspoons into soups, juices, smoothies, baby food, or baked goods. Adds natural color and nutrition to your daily meals.",
    image: "/products images/carrot_main.png",
    images: [
      "/products images/carrot_main.png",
      "/products images/carrot_2.png",
      "/products images/carrot_3.png"
    ],
    rating: 4.6,
    reviews_count: 18,
    badge: "New",
    variations: [
      { weight: "250g", price: 150, discount_price: 150 }
    ],
    reviews: [
      { name: "Anitha B.", rating: 5, date: "2026-05-08", comment: "Bright orange color and fresh carrot taste. Great for baby food!" },
      { name: "Rajan K.", rating: 4, date: "2026-05-15", comment: "Good quality, dissolves well in soups and gravies." }
    ]
  },

  // 4. Beetroot Powder
  {
    slug: "beetroot-powder-250g",
    name: "Beetroot Powder 250 Grams",
    category: "Beetroot Powder",
    short_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Beetroot Powder — crafted for health-conscious consumers and professional culinary applications.",
    long_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Beetroot Powder, crafted for health-conscious consumers and professional culinary applications. Our premium powder is derived from high-quality, farm-fresh Beetroot, utilizing advanced dehydration technology to lock in essential nutrients, natural sweetness, and authentic flavor.",
    benefits: [
      "100% Pure & Natural Farm-Fresh Beetroot",
      "Rich in Natural Nitrates, Iron, Folate, and Antioxidants",
      "Supports healthy blood pressure, stamina, and detox",
      "Vibrant natural color — no artificial dyes added"
    ],
    ingredients: "100% Pure Dehydrated Farm-Fresh Beetroot",
    usage_info: "Mix 1 teaspoon in water, smoothies, or juices. Use as a natural food color for rotis and cakes. Excellent pre-workout natural energy drink.",
    image: "/products images/beetroot_main.png",
    images: [
      "/products images/beetroot_main.png",
      "/products images/beetroot_2.png",
      "/products images/beetroot_3.png"
    ],
    rating: 4.7,
    reviews_count: 25,
    badge: "Superfood",
    variations: [
      { weight: "250g", price: 150, discount_price: 150 }
    ],
    reviews: [
      { name: "Divya P.", rating: 5, date: "2026-05-05", comment: "Amazing beetroot powder! Rich deep red color and great taste in smoothies." },
      { name: "Mohan T.", rating: 4, date: "2026-05-18", comment: "Good quality. I use it as a pre-workout drink every morning." }
    ]
  },

  // 5. Moringa Powder
  {
    slug: "moringa-powder-250g",
    name: "Moringa Powder 250 Grams",
    category: "Moringa Powder",
    short_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Moringa Leaves Powder — crafted for health-conscious consumers and professional culinary applications.",
    long_desc: "Experience the pure, natural goodness of NVKM Dry-Fresh Moringa Leaves Powder, crafted for health-conscious consumers and professional culinary applications. Our premium powder is derived from high-quality, farm-fresh Moringa Leaves, utilizing advanced dehydration technology to lock in essential nutrients, natural sweetness, and authentic flavor.",
    benefits: [
      "100% Pure Organic Moringa Oleifera Leaf Powder",
      "Rich in Antioxidants, Vitamin A, Vitamin C, Iron, and Calcium",
      "Supports immune defense, skin health, and energy levels",
      "Natural anti-inflammatory and detoxifying properties"
    ],
    ingredients: "100% Pure Organic Dried Moringa Leaves (Moringa Oleifera)",
    usage_info: "Take 1 teaspoon (approx 3-5g) daily. Mix in warm water, herbal teas, smoothies, fruit juices, or stir into soups and salad dressings.",
    image: "/products images/moringa_main.png",
    images: [
      "/products images/moringa_main.png",
      "/products images/moringa_2.png",
      "/products images/moringa_3.png"
    ],
    rating: 4.9,
    reviews_count: 38,
    badge: "Bestseller",
    variations: [
      { weight: "250g", price: 180, discount_price: 150 }
    ],
    reviews: [
      { name: "Ramesh Reddy", rating: 5, date: "2026-04-20", comment: "Truly organic, very fine powder. I drink it with warm water every morning, definitely boosts my stamina." },
      { name: "Anjali J.", rating: 5, date: "2026-05-10", comment: "Top quality packaging, and the leaf powder smells genuine and grassy. Great natural supplement." }
    ]
  },

  // 6. Hand Made Full White Round Wicks
  {
    slug: "hand-made-white-round-wicks",
    name: "Hand Made Full White Round Wicks",
    category: "Pooja Accessories",
    short_desc: "Premium hand-crafted full white round cotton wicks, ideal for daily puja rituals, oil lamps, and religious ceremonies.",
    long_desc: "Our Hand Made Full White Round Wicks are crafted with pure cotton, hand-rolled by skilled artisans for consistent shape and superior burn quality. Designed for all types of oil lamps (diyas) and religious rituals, these wicks deliver a clean, steady flame with minimal smoke. Perfect for daily puja, festivals, and temple use.",
    benefits: [
      "100% Pure White Cotton, hand-rolled for consistent quality",
      "Clean, steady burn with minimal smoke",
      "Suitable for all oil lamps, diyas, and religious ceremonies",
      "Perfect for daily puja and festive rituals"
    ],
    ingredients: "100% Pure White Cotton",
    usage_info: "Place the wick in your oil lamp or diya. Soak in ghee or oil before lighting for best results. Suitable for coconut oil, sesame oil, and pure ghee lamps.",
    image: "/products images/wicks_round_main.png",
    images: [
      "/products images/wicks_round_main.png",
      "/products images/wicks_round_2.png",
      "/products images/wicks_round_3.png"
    ],
    rating: 4.8,
    reviews_count: 45,
    badge: "Traditional",
    variations: [
      { weight: "Pack", price: 5.50, discount_price: 5.50 }
    ],
    reviews: [
      { name: "Saraswathi D.", rating: 5, date: "2026-05-01", comment: "Excellent quality wicks! Burns very clean and lasts longer than regular wicks." },
      { name: "Kamala N.", rating: 5, date: "2026-05-12", comment: "Perfect for daily puja. White and clean cotton, no smell." }
    ]
  },

  // 7. Long Cotton
  {
    slug: "long-cotton-wicks",
    name: "Long Cotton",
    category: "Pooja Accessories",
    short_desc: "Premium long cotton wicks for oil lamps and religious ceremonies. Made from pure white cotton for a clean, long-lasting flame.",
    long_desc: "Our Long Cotton wicks are made from premium quality pure white cotton, specially designed for tall diyas and larger oil lamps. The elongated design ensures a consistent, long-lasting flame ideal for extended puja rituals, arati, and festival celebrations. Hand-crafted with care for superior burn quality.",
    benefits: [
      "100% Pure White Cotton for clean, smokeless burn",
      "Extra length designed for tall diyas and larger lamps",
      "Consistent flame for extended puja and arati rituals",
      "Suitable for all types of oils and pure ghee"
    ],
    ingredients: "100% Pure White Cotton",
    usage_info: "Place the long cotton wick in tall diyas or oil lamps. Soak in oil or ghee before lighting. Ideal for arati lamps and festival celebrations.",
    image: "/products images/long_cotton_main.png",
    images: [
      "/products images/long_cotton_main.png",
      "/products images/long_cotton_2.png"
    ],
    rating: 4.7,
    reviews_count: 32,
    badge: "",
    variations: [
      { weight: "Pack", price: 5.00, discount_price: 5.00 }
    ],
    reviews: [
      { name: "Padmavathi R.", rating: 5, date: "2026-05-03", comment: "Very good quality long cotton wicks. Burns evenly throughout the entire wick." },
      { name: "Subramanian K.", rating: 4, date: "2026-05-16", comment: "Good for festival use. Lasts longer than regular wicks." }
    ]
  },

  // 8. 4 inch Long Cotton Wicks
  {
    slug: "4-inch-long-cotton-wicks",
    name: "4 inch Long Cotton Wicks",
    category: "Pooja Accessories",
    short_desc: "Pure white 4-inch long cotton wicks, pack of 100 count. Premium 1st quality cotton for oil lamps and religious puja ceremonies.",
    long_desc: "We use Pure White And 1st quality of cotton for Wicks, and each pack contains 100 Wicks. Our 4-inch Long Cotton Wicks are crafted from the finest quality pure white cotton, ensuring a clean and steady flame for your oil lamps and diyas. The precise 4-inch length is ideal for standard puja lamps and decorative diyas, providing consistent burn time for your daily and festive rituals.",
    benefits: [
      "100% Pure White First Quality Cotton",
      "Pack of 100 wicks — excellent value for daily use",
      "Precise 4-inch length for standard oil lamps",
      "Clean, steady burn with no black smoke"
    ],
    ingredients: "100% Pure White Cotton",
    usage_info: "Insert one wick into your oil lamp or diya. Soak tip in oil or ghee before lighting. Suitable for sesame oil, coconut oil, and pure ghee lamps. Pack contains 100 wicks.",
    image: "/products images/cotton_wicks_main.png",
    images: [
      "/products images/cotton_wicks_main.png",
      "/products images/cotton_wicks_2.png",
      "/products images/cotton_wicks_3.png",
      "/products images/cotton_wicks_4.png"
    ],
    rating: 4.9,
    reviews_count: 56,
    badge: "100 Count",
    variations: [
      { weight: "100 Wicks", price: 6.00, discount_price: 6.00 }
    ],
    reviews: [
      { name: "Vijaya L.", rating: 5, date: "2026-05-06", comment: "Best quality wicks I have used! Very clean white cotton, burns perfectly." },
      { name: "Krishnamurthy S.", rating: 5, date: "2026-05-19", comment: "Excellent pack of 100 wicks at a great price. Highly recommended for daily puja!" }
    ]
  }
];

module.exports = { PRODUCTS_DATA };
