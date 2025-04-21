-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  banner_url TEXT,
  rating DECIMAL(3,1),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  website TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create brand_leaderboard table
CREATE TABLE IF NOT EXISTS public.brand_leaderboard (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES public.brands(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert sample data for brands
INSERT INTO public.brands (name, slug, description, website_url, logo_url, featured, display_order)
VALUES 
('Premium THC', 'premium-thc', 'A selection of premium THC products from verified brands.', 'https://example.com/premium-thc', '/brands/premium-thc-logo.png', true, 1),
('Green Leaf', 'green-leaf', 'Quality THC products with lab-tested results.', 'https://example.com/green-leaf', '/brands/green-leaf-logo.png', true, 2),
('Golden State', 'golden-state', 'California-sourced THC products with premium quality.', 'https://example.com/golden-state', '/brands/golden-state-logo.png', false, 3);

-- Insert sample data for brand_leaderboard
INSERT INTO public.brand_leaderboard (brand_id, position, score)
VALUES
(1, 1, 95.5),
(2, 2, 92.0),
(3, 3, 88.5);

-- Create a trigger to update the "updated_at" column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
CREATE TRIGGER update_brands_modtime
BEFORE UPDATE ON public.brands
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_contacts_modtime
BEFORE UPDATE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_brand_leaderboard_modtime
BEFORE UPDATE ON public.brand_leaderboard
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscribers_modtime
BEFORE UPDATE ON public.subscribers
FOR EACH ROW EXECUTE FUNCTION update_modified_column(); 