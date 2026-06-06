-- ============================================================
-- NVKM GROUP — Fix Categories in Supabase
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run" (or "Run without RLS")
-- ============================================================

-- Step 1: Create categories table if it does not exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Clear any existing wrong categories
DELETE FROM categories;

-- Step 3: Insert the 2 correct categories
INSERT INTO categories (name) VALUES
  ('Fruits and Vegetable Powder'),
  ('Pooja Accessories');

-- Step 4: Update all powder products to the correct category name
UPDATE products
SET category = 'Fruits and Vegetable Powder'
WHERE category IN (
  'Banana Powder',
  'Beetroot Powder',
  'Carrot Powder',
  'Moringa Powder',
  'Tomato Powder'
);

-- Step 5: Verify categories
SELECT * FROM categories ORDER BY name;

-- Step 6: Verify products updated
SELECT name, category FROM products ORDER BY category, name;
