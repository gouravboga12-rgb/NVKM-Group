// =============================================
// NVKM GROUP — Seed script for Supabase
// Run: node server/seed.js
// =============================================
require('dotenv').config();
const supabase = require('./config/db');

const PRODUCTS_DATA = [
  {
    slug: "banana-powder",
    name: "Premium Banana Powder",
    category: "Banana Powder",
    short_desc: "Natural banana powder rich in nutrients and energy. Ideal for baby foods, smoothies, baking, and protein shakes.",
    long_desc: "NVKM GROUP's Premium Banana Powder is manufactured using high-grade, naturally ripened bananas. Through careful processing, we retain the natural sweetness, vitamins, and minerals without adding any artificial preservatives, sweeteners, or colors. Perfect for wellness seekers, mothers preparing nutritious baby food, or fitness enthusiasts looking for a clean, natural energy source.",
    benefits: [
      "100% Pure & Organic Cavendish Bananas",
      "Excellent source of Potassium, Dietary Fiber, and Vitamin B6",
      "Natural energy booster & highly digestible for infants",
      "Gluten-free, vegan-friendly, and zero artificial preservatives"
    ],
    ingredients: "100% Pure Dehydrated Cavendish Bananas",
    usage_info: "Add 1-2 tablespoons to milk, smoothies, oatmeal, protein shakes, or use in baking recipes (muffins, pancakes, cakes) as a natural sweetener and nutrient pack.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews_count: 34,
    badge: "Bestseller",
    variations: [
      { weight: "100g", price: 180, discount_price: 140 },
      { weight: "250g", price: 400, discount_price: 320 },
      { weight: "500g", price: 750, discount_price: 600 },
      { weight: "1kg", price: 1400, discount_price: 1100 }
    ],
    reviews: [
      { name: "Suresh K.", rating: 5, date: "2026-04-12", comment: "Excellent product! Smells so fresh and mixability is perfect. My kids love it in their milkshakes." },
      { name: "Priya M.", rating: 4, date: "2026-05-02", comment: "Very natural sweetness, no artificial smell. Highly recommend for infants as a healthy porridge mix." }
    ]
  },
  {
    slug: "moringa-powder",
    name: "Organic Moringa Powder",
    category: "Moringa Powder",
    short_desc: "Healthy moringa powder packed with vitamins and antioxidants. Perfect for daily nutrition and wellness.",
    long_desc: "Our Moringa Powder is sourced from selected organic Moringa Oleifera leaves, hand-picked and gently ground under strict quality standards. Dubbed the 'Miracle Tree', Moringa leaf powder is one of the most nutrient-dense botanicals on earth, offering a concentrated dose of vitamins, amino acids, and vital antioxidants to supercharge your health and immune system.",
    benefits: [
      "100% Pure Organic Moringa Oleifera leaf powder",
      "Rich in Antioxidants, Vitamin A, Vitamin C, Iron, and Calcium",
      "Supports immune system defense, skin health, and energy levels",
      "Natural anti-inflammatory and detoxifying properties"
    ],
    ingredients: "100% Pure Organic Dried Moringa Leaves",
    usage_info: "Take 1 teaspoon (approx 3-5g) daily. Mix in warm water, herbal teas, smoothies, fruit juices, or stir into soups and salad dressings.",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews_count: 42,
    badge: "Superfood",
    variations: [
      { weight: "100g", price: 200, discount_price: 150 },
      { weight: "250g", price: 450, discount_price: 350 },
      { weight: "500g", price: 800, discount_price: 650 },
      { weight: "1kg", price: 1500, discount_price: 1200 }
    ],
    reviews: [
      { name: "Ramesh Reddy", rating: 5, date: "2026-04-20", comment: "Truly organic, very fine powder. I drink it with warm water every morning, definitely boosts my stamina." },
      { name: "Anjali J.", rating: 5, date: "2026-05-10", comment: "Top quality packaging, and the leaf powder smells genuine and grassy. Great natural supplement." }
    ]
  },
  {
    slug: "fruit-powders-mix",
    name: "Premium Mixed Fruit Powder",
    category: "Fruit Powders",
    short_desc: "Premium fruit powders made from selected natural fruits. Suitable for healthy drinks and food products.",
    long_desc: "A vibrant blend of spray-dried natural fruit powders including Mango, Pineapple, Papaya, and Pomegranate. This natural fruit powder mix provides an incredible burst of flavor and a massive dose of Vitamin C. Perfect for food processing, ice creams, healthy juice formulations, or direct family consumption.",
    benefits: [
      "Blend of natural, fresh tropical fruits",
      "No added sugars, artificial preservatives, or chemical carriers",
      "Instant water solubility with refreshing fruity taste",
      "Packed with active enzymes and Vitamin C"
    ],
    ingredients: "Dried Mango, Pineapple, Pomegranate, and Papaya Pulp Extract",
    usage_info: "Stir 2 tablespoons in a glass of cold water or milk for an instant refreshing fruit drink, or blend into desserts, custards, and ice creams.",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews_count: 28,
    badge: "15% OFF",
    variations: [
      { weight: "250g", price: 500, discount_price: 425 },
      { weight: "500g", price: 950, discount_price: 800 },
      { weight: "1kg", price: 1800, discount_price: 1500 }
    ],
    reviews: [
      { name: "Kiran P.", rating: 5, date: "2026-03-15", comment: "So useful for summer drinks. Kids love the taste, and it has no chemical sugar taste." }
    ]
  },
  {
    slug: "vegetable-powders-mix",
    name: "Fresh Green Vegetable Powder",
    category: "Vegetable Powders",
    short_desc: "Natural vegetable powders with rich nutrients and freshness. Perfect for cooking and health supplements.",
    long_desc: "Retain your vegetable nutrition with our Green Vegetable Powder Mix. Composed of premium dehydrated Spinach, Beetroot, Carrot, and Wheatgrass. Specially processed to maintain raw chlorophyll, mineral profiles, and fiber, this powder adds nutrition and color to your culinary dishes or morning super-green smoothies.",
    benefits: [
      "Dehydrated Spinach, Carrot, Beetroot, and Wheatgrass blend",
      "High concentration of plant iron, minerals, and chlorophyll",
      "Perfect for enrichment of batters, doughs, and soup broths",
      "100% Vegan, Gluten-free, and Non-GMO"
    ],
    ingredients: "Dehydrated Spinach, Carrot, Beetroot, and Organic Wheatgrass Powders",
    usage_info: "Stir 1-2 teaspoons into your soup, gravy, chapati dough, idli batter, or blend with fruit juice for a nutritious green drink.",
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviews_count: 19,
    badge: "New",
    variations: [
      { weight: "250g", price: 480, discount_price: 400 },
      { weight: "500g", price: 900, discount_price: 750 },
      { weight: "1kg", price: 1700, discount_price: 1400 }
    ],
    reviews: [
      { name: "Veena Rao", rating: 4, date: "2026-05-18", comment: "I mix this in my wheat flour when making rotis. A great way to sneak green veggies into my kids' food!" }
    ]
  },
  {
    slug: "health-powders-wellness",
    name: "Daily Vitality Health Powder",
    category: "Health Powders",
    short_desc: "Nutritious health powders designed for active and healthy lifestyles. Helps support daily wellness.",
    long_desc: "A proprietary herbal formulation mixing Ashwagandha, Amla, and Shatavari powders. NVKM GROUP's Daily Vitality health powder is crafted to boost stamina, manage daily stress, promote metabolic wellness, and build long-term biological immunity for both men and women leading busy lives.",
    benefits: [
      "Balanced combination of Ashwagandha, Amla (Gooseberry), and Shatavari",
      "Promotes stress relief, sleep quality, and biological immunity",
      "Naturally rich in Vitamin C, Adaptogens, and energy-renewing herbs",
      "Triple tested for heavy metals and purity standards"
    ],
    ingredients: "Pure Ashwagandha Root, Dried Amla Fruit, and Shatavari Root Powders",
    usage_info: "Take 1 scoop (5g) twice daily with warm milk or honey, preferably after meals.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews_count: 31,
    badge: "Immunity Boost",
    variations: [
      { weight: "100g", price: 250, discount_price: 199 },
      { weight: "250g", price: 550, discount_price: 480 },
      { weight: "500g", price: 1000, discount_price: 850 }
    ],
    reviews: [
      { name: "Janardhan S.", rating: 5, date: "2026-04-30", comment: "Top class immunity builder. Ashwagandha quality is really authentic." }
    ]
  },
  {
    slug: "natural-powders-herbs",
    name: "Pure Neem & Tulsi Herbal Powder",
    category: "Natural Powders",
    short_desc: "Pure and natural powders without preservatives or artificial colors. Made for healthy living.",
    long_desc: "Our Neem and Tulsi Herbal Powder is an exceptional double-purified blend that acts as a natural purifier. Sourced from organic fields, it is processed at low temperatures to ensure the active bitters and healing volatile oils remain intact. Ideal for blood purification, digestive health, or external skin/hair applications.",
    benefits: [
      "Double purified Neem leaves and Sacred Tulsi leaves",
      "Promotes blood detoxification and clear, healthy skin",
      "Highly effective for both internal consumption and external face packs",
      "Zero chemicals, colorants, or fillers added"
    ],
    ingredients: "Dehydrated Neem Leaf (Azadirachta Indica) and Holy Tulsi Leaf (Ocimum Sanctum)",
    usage_info: "Internal: Take 1/2 teaspoon with warm water in the morning. External: Mix with water/rosewater to make a paste, apply on skin/scalp, wash after 15 minutes.",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviews_count: 15,
    badge: "Detox",
    variations: [
      { weight: "100g", price: 150, discount_price: 110 },
      { weight: "250g", price: 320, discount_price: 250 },
      { weight: "500g", price: 600, discount_price: 480 }
    ],
    reviews: [
      { name: "Meera K.", rating: 5, date: "2026-05-14", comment: "I use this primarily as a face pack. Works wonders for oily skin and breakouts!" }
    ]
  }
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  for (const product of PRODUCTS_DATA) {
    const { variations, reviews, ...productData } = product;

    // Check if product already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', productData.slug)
      .single();

    if (existing) {
      console.log(`  ⏭️  Skipping "${productData.name}" (already exists)`);
      continue;
    }

    // Insert product
    const { data: inserted, error: productErr } = await supabase
      .from('products')
      .insert(productData)
      .select('id')
      .single();

    if (productErr) {
      console.error(`  ❌ Failed to insert "${productData.name}":`, productErr.message);
      continue;
    }

    console.log(`  ✅ Inserted product: ${productData.name}`);

    // Insert variations
    if (variations && variations.length > 0) {
      const variationRows = variations.map(v => ({
        product_id: inserted.id,
        weight: v.weight,
        price: v.price,
        discount_price: v.discount_price
      }));

      const { error: varErr } = await supabase
        .from('product_variations')
        .insert(variationRows);

      if (varErr) {
        console.error(`     ❌ Failed to insert variations for "${productData.name}":`, varErr.message);
      } else {
        console.log(`     📦 Inserted ${variations.length} variations`);
      }
    }

    // Insert reviews
    if (reviews && reviews.length > 0) {
      const reviewRows = reviews.map(r => ({
        product_id: inserted.id,
        name: r.name,
        rating: r.rating,
        date: r.date,
        comment: r.comment
      }));

      const { error: revErr } = await supabase
        .from('product_reviews')
        .insert(reviewRows);

      if (revErr) {
        console.error(`     ❌ Failed to insert reviews for "${productData.name}":`, revErr.message);
      } else {
        console.log(`     ⭐ Inserted ${reviews.length} reviews`);
      }
    }
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
