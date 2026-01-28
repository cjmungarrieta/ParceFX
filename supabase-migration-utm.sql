-- Migration: Add UTM tracking fields to leads table
-- Run this if you already have the leads table created

-- Add UTM columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='utm_source') THEN
    ALTER TABLE public.leads ADD COLUMN utm_source TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='utm_campaign') THEN
    ALTER TABLE public.leads ADD COLUMN utm_campaign TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='utm_medium') THEN
    ALTER TABLE public.leads ADD COLUMN utm_medium TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='utm_content') THEN
    ALTER TABLE public.leads ADD COLUMN utm_content TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='utm_term') THEN
    ALTER TABLE public.leads ADD COLUMN utm_term TEXT;
  END IF;
END $$;
