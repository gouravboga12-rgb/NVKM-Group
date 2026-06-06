-- ============================================================
-- NVKM GROUP — Update Products Schema for Custom Fields and Delivery
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run"
-- ============================================================

-- Step 1: Make ingredients and usage_info optional
ALTER TABLE products ALTER COLUMN ingredients DROP NOT NULL;
ALTER TABLE products ALTER COLUMN usage_info DROP NOT NULL;
ALTER TABLE products ALTER COLUMN ingredients SET DEFAULT '';
ALTER TABLE products ALTER COLUMN usage_info SET DEFAULT '';

-- Step 2: Add delivery_charges column (default is 0.00)
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC(10,2) DEFAULT 0.00;

-- Step 3: Add custom_fields column to store key-value specifications as JSON
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Step 4: Verify updates
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products';
