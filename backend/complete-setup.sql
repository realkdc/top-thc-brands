-- Complete Supabase Database Setup
-- This script creates all required tables for the Top THC Brands website

-- Create Extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- 2. Create Brands Table
DROP TABLE IF EXISTS public.brands CASCADE;
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  rating NUMERIC,
  featured BOOLEAN DEFAULT FALSE,
  website TEXT,
  product_types TEXT[],
  location TEXT,
  slug TEXT,
  rank INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  thc_percentage TEXT,
  cbd_percentage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brands_featured ON public.brands(featured);
CREATE INDEX idx_brands_category ON public.brands(category);
CREATE INDEX idx_brands_is_active ON public.brands(is_active);

-- 3. Create Contacts Table
DROP TABLE IF EXISTS public.contacts CASCADE;
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at);

-- 4. Create Brand Leaderboard Table
DROP TABLE IF EXISTS public.brand_leaderboard CASCADE;
CREATE TABLE public.brand_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  score NUMERIC,
  category TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_rank ON public.brand_leaderboard(rank);
CREATE INDEX idx_leaderboard_category ON public.brand_leaderboard(category);

-- 5. Create Subscribers Table
DROP TABLE IF EXISTS public.subscribers CASCADE;
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_is_active ON public.subscribers(is_active);

-- Insert Admin User
INSERT INTO public.users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@topthcbrands.com',
  -- Password: Thc@dmin2024 (bcrypt hashed)
  '$2a$10$h6oMN5lSNQ435/.P2NtStekaf2fVffgt3dAjkSa64H2Z7OwSHTB.S',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert a test brand
INSERT INTO public.brands (name, description, category, rating, featured, slug, is_active)
VALUES (
  'Test Premium Brand',
  'This is a premium test brand with high-quality products.',
  'Flower',
  4.8,
  TRUE,
  'test-premium-brand',
  TRUE
) ON CONFLICT DO NOTHING;

-- Insert a leaderboard entry for the test brand
INSERT INTO public.brand_leaderboard (brand_id, rank, score, category, is_featured)
SELECT id, 1, 95.5, 'Flower', TRUE 
FROM public.brands 
WHERE name = 'Test Premium Brand'
ON CONFLICT DO NOTHING;

-- Insert a test contact
INSERT INTO public.contacts (name, email, message, status)
VALUES (
  'Test Contact',
  'test@example.com',
  'This is a test contact message.',
  'pending'
) ON CONFLICT DO NOTHING;

-- Insert a test subscriber
INSERT INTO public.subscribers (email, name, source, is_active)
VALUES (
  'subscriber@example.com',
  'Test Subscriber',
  'website',
  TRUE
) ON CONFLICT DO NOTHING; 