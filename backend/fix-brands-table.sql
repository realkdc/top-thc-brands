-- Fix brands table by ensuring is_active column exists
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update any existing rows to have is_active=true
UPDATE public.brands SET is_active = TRUE WHERE is_active IS NULL; 