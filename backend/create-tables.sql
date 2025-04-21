-- Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Create Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin User
INSERT INTO public.users (name, email, password, role)
VALUES (
  'Admin User',
  'admin@topthcbrands.com',
  -- Password: Thc@dmin2024 (bcrypt hashed)
  '$2a$10$Njd.1gXAXDRF39XYgS3.me6CsWCGzh.QmMvPbz8UVx37qwqyDpKhy',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert a test brand
INSERT INTO public.brands (name, description, category, rating)
VALUES (
  'Test Brand',
  'This is a test brand description.',
  'Flower',
  4.5
);

-- Insert a test contact
INSERT INTO public.contacts (name, email, message)
VALUES (
  'Test Contact',
  'test@example.com',
  'This is a test contact message.'
); 