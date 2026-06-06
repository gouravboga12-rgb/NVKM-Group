-- ============================================================
-- NVKM GROUP — Update Reviews Table to support User Ownership
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run"
-- ============================================================

-- Step 1: Add user_id column referencing the users table
ALTER TABLE product_reviews 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Step 2: Create index on user_id for fast queries
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Step 3: Verify the schema update
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_reviews';
