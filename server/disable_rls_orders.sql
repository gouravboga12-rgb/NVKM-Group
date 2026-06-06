-- ============================================================
-- NVKM GROUP — Disable RLS for Orders and Order Items
-- Run this in: https://supabase.com/dashboard/project/kuplsvigyambdqmborhi/sql
-- Click "Run"
-- ============================================================

-- Disable Row-Level Security (RLS) to allow the Node.js backend (using the anon key) to manage (edit/delete) orders.
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
