-- Add missing confirmed column to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS confirmed BOOLEAN DEFAULT FALSE; 