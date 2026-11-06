-- ========================================================
-- PT PARTA DIRGANTARA - B2B EXPORT SUPABASE DATABASE SCHEMA
-- PostgreSQL Schema & Row Level Security (RLS) Configuration
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ADMIN ROLES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RFQ INQUIRIES (Buyer Requests for Quotation)
CREATE TABLE IF NOT EXISTS public.rfq_inquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  preferred_packaging TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'CONVERTED', 'REJECTED')),
  admin_notes TEXT
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  botanical_name TEXT,
  origin TEXT,
  form TEXT,
  grade TEXT,
  description_en TEXT,
  description_id TEXT,
  packaging TEXT,
  moq TEXT,
  availability TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DOCUMENTS & DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_id TEXT NOT NULL,
  category TEXT CHECK (category IN ('profile', 'catalog', 'spec_sheet', 'certification')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE SETTINGS & COMPANY INFO
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  company_name TEXT,
  hero_title_en TEXT,
  hero_title_id TEXT,
  hero_subtitle_en TEXT,
  hero_subtitle_id TEXT,
  about_text_en TEXT,
  about_text_id TEXT,
  email TEXT,
  phone_whatsapp TEXT,
  office_address TEXT,
  operating_hours TEXT,
  primary_port TEXT,
  incoterms_supported TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BUYERS DIRECTORY
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'prospect',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. DOCUMENTATION ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.documentation_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'kegiatan_ekspor',
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. MEDIA ASSETS LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_type TEXT,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- RFQ INQUIRIES POLICIES
CREATE POLICY "Public can insert RFQ inquiries" 
  ON public.rfq_inquiries 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage RFQs" 
  ON public.rfq_inquiries 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- PRODUCTS POLICIES
CREATE POLICY "Public can view active products" 
  ON public.products 
  FOR SELECT 
  TO anon, authenticated 
  USING (is_active = true);

CREATE POLICY "Admins can manage products" 
  ON public.products 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- DOCUMENTS POLICIES
CREATE POLICY "Public can view public documents" 
  ON public.documents 
  FOR SELECT 
  TO anon, authenticated 
  USING (is_public = true);

CREATE POLICY "Admins can manage documents" 
  ON public.documents 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- SITE SETTINGS POLICIES
CREATE POLICY "Public can view site settings" 
  ON public.site_settings 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Admins can update site settings" 
  ON public.site_settings 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- BUYERS POLICIES
CREATE POLICY "Admins only for buyers directory" 
  ON public.buyers 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- DOCUMENTATION ACTIVITIES POLICIES
CREATE POLICY "Public can read published activities" 
  ON public.documentation_activities 
  FOR SELECT 
  TO anon, authenticated 
  USING (status = 'published');

CREATE POLICY "Admins can manage all activities" 
  ON public.documentation_activities 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- MEDIA ASSETS POLICIES
CREATE POLICY "Public can view media assets" 
  ON public.media_assets 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Admins can manage media assets" 
  ON public.media_assets 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- ========================================================
-- STORAGE BUCKET CONFIGURATION & POLICIES
-- ========================================================
-- Insert storage bucket for documentation
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documentation', 'documentation', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public read access on documentation bucket
CREATE POLICY "Public can view documentation images" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated 
  USING (bucket_id = 'documentation');

-- Allow authenticated admins to upload and delete documentation images
CREATE POLICY "Admins can upload documentation images" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'documentation');

CREATE POLICY "Admins can update documentation images" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'documentation');

CREATE POLICY "Admins can delete documentation images" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'documentation');

