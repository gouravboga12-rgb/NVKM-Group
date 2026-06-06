-- ============================================================
-- NVKM GROUP — Update Orders Table for Delivery Details
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run"
-- ============================================================

-- Step 1: Add delivery tracking columns if they do not exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_package_id TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_link TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_tracker_status TEXT DEFAULT 'Pending';

-- Step 2: Verify columns are successfully added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders' 
  AND column_name IN ('delivery_package_id', 'tracking_link', 'delivery_tracker_status');
