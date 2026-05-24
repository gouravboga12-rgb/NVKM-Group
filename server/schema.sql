-- =============================================
-- NVKM GROUP E-Commerce — Supabase SQL Schema
-- Run this in the Supabase SQL Editor to create all tables.
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,             -- e.g. "banana-powder"
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL,
  benefits TEXT[] DEFAULT '{}',
  ingredients TEXT NOT NULL,
  usage_info TEXT NOT NULL,
  image TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  badge TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variations (weight/price options)
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  weight TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2) NOT NULL
);

-- Product reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,          -- e.g. "NVKM-123456"
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_email TEXT DEFAULT '',
  shipping_address TEXT NOT NULL,
  total_payable NUMERIC(10,2) NOT NULL,
  savings NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  payment_method TEXT DEFAULT 'COD',
  payment_status TEXT DEFAULT 'Pending',
  payment_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  image TEXT,
  quantity INT NOT NULL DEFAULT 1
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_product_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
