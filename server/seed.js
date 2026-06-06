// =============================================
// NVKM GROUP — Seed script for Supabase
// Run: node server/seed.js
// =============================================
require('dotenv').config();
const supabase = require('./config/db');

const { PRODUCTS_DATA } = require('./config/fallbackData');

async function seed() {
  console.log('🌱 Starting database seed...\n');

  console.log('🧹 Clearing old products from Supabase...');
  const { error: clearErr } = await supabase
    .from('products')
    .delete()
    .neq('slug', 'safeguard-delete-all');

  if (clearErr) {
    console.error('  ❌ Failed to clear old products:', clearErr.message);
  } else {
    console.log('  ✅ Cleared old products table successfully.');
  }

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

  // --- SEED ADMIN ACCOUNT ---
  console.log('\n🌱 Seeding default administrator account...');
  const adminEmail = 'janagondanaveen@gmail.com';
  
  try {
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .maybeSingle();

    if (existingAdmin) {
      console.log('  ⏭️  Skipping admin creation (janagondanaveen@gmail.com already exists)');
    } else {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Akhil@1433', salt);

      const { error: adminErr } = await supabase
        .from('users')
        .insert({
          name: 'Janagonda Naveen',
          phone: '9014274293',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });

      if (adminErr) {
        console.error('  ❌ Failed to seed admin user:', adminErr.message);
      } else {
        console.log('  ✅ Seeded admin user: janagondanaveen@gmail.com (Password: Akhil@1433)');
      }
    }
  } catch (err) {
    console.error('  ❌ Error seeding admin user:', err.message);
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
