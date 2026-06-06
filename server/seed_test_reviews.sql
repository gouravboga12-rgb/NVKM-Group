-- ============================================================
-- NVKM GROUP — Seed 3rd dummy reviews for testing View More option
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run"
-- ============================================================

-- 1. Add 3rd review for long-cotton-wicks
INSERT INTO product_reviews (product_id, name, rating, comment, date)
VALUES (
  (SELECT id FROM products WHERE slug = 'long-cotton-wicks' LIMIT 1),
  'Gopal V.',
  5,
  'Exceptional wicks, very long burning time. Highly satisfied!',
  '2026-05-20'
);

-- 2. Add 3rd review for tomato-powder-250g
INSERT INTO product_reviews (product_id, name, rating, comment, date)
VALUES (
  (SELECT id FROM products WHERE slug = 'tomato-powder-250g' LIMIT 1),
  'Rajesh K.',
  5,
  'Absolutely pure and natural. Highly recommended!',
  '2026-05-20'
);

-- 3. Add 3rd review for raw-banana-powder-250g
INSERT INTO product_reviews (product_id, name, rating, comment, date)
VALUES (
  (SELECT id FROM products WHERE slug = 'raw-banana-powder-250g' LIMIT 1),
  'Nandini P.',
  4,
  'Very good for health. Mixes well in baby food.',
  '2026-05-18'
);

-- 4. Update the products table reviews_count and avg rating dynamically
UPDATE products p
SET 
  reviews_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id),
  rating = COALESCE(ROUND((SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id)::numeric, 1), 0.0);

-- 5. Verify the updates
SELECT slug, reviews_count, rating FROM products WHERE slug IN ('long-cotton-wicks', 'tomato-powder-250g', 'raw-banana-powder-250g');
