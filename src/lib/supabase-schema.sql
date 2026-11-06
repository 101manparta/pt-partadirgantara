-- ========================================================
-- PT PARTA DIRGANTARA - B2B EXPORT SUPABASE DATABASE SCHEMA
-- Production PostgreSQL Schema, Row Level Security (RLS) & Storage
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- 1. STORAGE BUCKETS SETUP
-- Required Buckets: activity-images, product-images, documents
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('activity-images', 'activity-images', true),
  ('product-images', 'product-images', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ========================================================
-- 2. CORE DATABASE TABLES
-- ========================================================

-- A. ACTIVITIES TABLE (Official Company Activities & Clove Export Operations)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_id TEXT,
  description_en TEXT,
  description_id TEXT,
  activity_date DATE DEFAULT CURRENT_DATE,
  location TEXT,
  category TEXT DEFAULT 'kegiatan_ekspor',
  image_url TEXT NOT NULL,
  image_path TEXT,
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering activities
CREATE INDEX IF NOT EXISTS idx_activities_sort ON public.activities(sort_order ASC, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_public ON public.activities(is_public);

-- B. DOCUMENTS TABLE (Trade Catalogs, Specification Sheets, Certifications)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_id TEXT,
  category TEXT DEFAULT 'spec_sheet',
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT,
  file_size TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_public ON public.documents(is_public);

-- C. PRODUCTS TABLE (Whole Dried Cloves & Specifications)
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
  image_path TEXT,
  is_active BOOLEAN DEFAULT true,
  specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. RFQ INQUIRIES (Buyer Quotation Requests)
CREATE TABLE IF NOT EXISTS public.rfq_inquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
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

-- E. SITE SETTINGS (Corporate Export Metadata & Contact Details)
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- Activities RLS Policies
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public can view public activities" ON public.activities;
CREATE POLICY "Public can view public activities"
  ON public.activities FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated admins can manage activities" ON public.activities;
CREATE POLICY "Authenticated admins can manage activities"
  ON public.activities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- Documents RLS Policies
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public can view public documents" ON public.documents;
CREATE POLICY "Public can view public documents"
  ON public.documents FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated admins can manage documents" ON public.documents;
CREATE POLICY "Authenticated admins can manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- Products RLS Policies
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated admins can manage products" ON public.products;
CREATE POLICY "Authenticated admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- RFQ Inquiries RLS Policies
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public can insert RFQ inquiries" ON public.rfq_inquiries;
CREATE POLICY "Public can insert RFQ inquiries"
  ON public.rfq_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can view and manage RFQs" ON public.rfq_inquiries;
CREATE POLICY "Authenticated admins can view and manage RFQs"
  ON public.rfq_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------
-- Site Settings RLS Policies
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated admins can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ========================================================
-- 4. STORAGE OBJECTS RLS POLICIES
-- ========================================================

-- Public read access for images and documents in the 3 buckets
DROP POLICY IF EXISTS "Public read storage access" ON storage.objects;
CREATE POLICY "Public read storage access"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('activity-images', 'product-images', 'documents'));

-- Authenticated admins can upload files
DROP POLICY IF EXISTS "Authenticated admin upload storage access" ON storage.objects;
CREATE POLICY "Authenticated admin upload storage access"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('activity-images', 'product-images', 'documents'));

-- Authenticated admins can update files
DROP POLICY IF EXISTS "Authenticated admin update storage access" ON storage.objects;
CREATE POLICY "Authenticated admin update storage access"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('activity-images', 'product-images', 'documents'));

-- Authenticated admins can delete files
DROP POLICY IF EXISTS "Authenticated admin delete storage access" ON storage.objects;
CREATE POLICY "Authenticated admin delete storage access"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('activity-images', 'product-images', 'documents'));

-- ========================================================
-- 5. INITIAL SEED DATA (If tables are empty)
-- ========================================================

INSERT INTO public.products (id, name, botanical_name, origin, form, grade, description_en, description_id, packaging, moq, availability, image_url, is_active, specs)
VALUES (
  'indonesian-whole-cloves',
  'Indonesian Whole Dried Cloves',
  'Syzygium aromaticum',
  'Sulawesi, Maluku, & Java, Indonesia',
  'Whole Dried Flower Buds',
  'Export Grade Lal Pari / Hand-Picked',
  'Premium sun-dried whole cloves sourced directly from Indonesian smallholder agro-cooperatives. Rich in eugenol essential oils, exhibiting uniform reddish-brown hue and high whole-bud crown retention.',
  'Cengkeh kering utuh kualitas ekspor pilihan dari sentra perkebunan nusantara. Mengandung minyak atsiri eugenol pekat, warna cokelat kemerahan alami, dan mahkota kuntum utuh.',
  '50kg Heavy-Duty Jute Bags or 25kg PP bags with food-grade inner poly liner',
  '11 Metric Tons (1 x 20ft FCL)',
  'Year-Round Harvest Availability (Peak July – November)',
  '/images/hero_indonesian_cloves.jpg',
  true,
  '[
    {"id":"1","parameter_en":"Botanical Name","parameter_id":"Nama Botani","standard_value":"Syzygium aromaticum","test_method":"Botanical Verification","sort_order":1},
    {"id":"2","parameter_en":"Grade / Classification","parameter_id":"Grade / Klasifikasi","standard_value":"Export Grade Lal Pari / Hand-Picked","test_method":"Visual & Mechanical Sort","sort_order":2},
    {"id":"3","parameter_en":"Moisture Content","parameter_id":"Kadar Air","standard_value":"10.0% – 12.0% Maximum","test_method":"Halogen Moisture Analyzer / ISO 939","sort_order":3},
    {"id":"4","parameter_en":"Extraneous Matter / Foreign Matter","parameter_id":"Benda Asing","standard_value":"≤ 0.5% – 1.0%","test_method":"ISO 927 Laboratory Sieve","sort_order":4},
    {"id":"5","parameter_en":"Stems / Stalks Ratio","parameter_id":"Kadar Tangkai","standard_value":"≤ 2.0% – 3.0%","test_method":"Manual Separation / ASTM","sort_order":5},
    {"id":"6","parameter_en":"Headless Cloves","parameter_id":"Cengkeh Tanpa Kepala","standard_value":"≤ 5.0%","test_method":"Physical Count / 100g","sort_order":6},
    {"id":"7","parameter_en":"Essential / Volatile Oil Content","parameter_id":"Kadar Minyak Atsiri","standard_value":"17.0% – 20.0% Minimum (Dry Basis)","test_method":"Clevenger Distillation / ISO 6571","sort_order":7},
    {"id":"8","parameter_en":"Color & Appearance","parameter_id":"Warna & Kenampakan","standard_value":"Natural Deep Reddish Brown to Dark Brown","test_method":"Sensory / Organoleptic","sort_order":8},
    {"id":"9","parameter_en":"Minimum Order Quantity (MOQ)","parameter_id":"Minimal Pesanan (MOQ)","standard_value":"1 x 20ft FCL (~11–12 Metric Tons)","test_method":"Commercial Contract","sort_order":9},
    {"id":"10","parameter_en":"Export Packaging","parameter_id":"Kemasan Ekspor","standard_value":"50kg Heavy-Duty Jute / PP Bags with inner liner","test_method":"Food Grade Standard","sort_order":10}
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, company_name, hero_title_en, hero_title_id, hero_subtitle_en, hero_subtitle_id, about_text_en, about_text_id, email, phone_whatsapp, office_address, operating_hours, primary_port, incoterms_supported)
VALUES (
  'main',
  'PT PARTA DIRGANTARA',
  'PREMIUM INDONESIAN CLOVES FOR GLOBAL MARKETS',
  'CENGKEH INDONESIA BERKUALITAS UNTUK PASAR GLOBAL',
  'PT PARTA DIRGANTARA connects quality Indonesian cloves with international buyers through professional sourcing and export-oriented partnerships.',
  'PT PARTA DIRGANTARA menghubungkan cengkeh pilihan Indonesia dengan pembeli internasional melalui pengadaan profesional dan kemitraan ekspor berkelanjutan.',
  'PT PARTA DIRGANTARA is an Indonesian export-oriented enterprise founded to deliver authentic, high-grade cloves from indigenous Indonesian cultivation regions to industrial buyers, spice extractors, and wholesale distributors worldwide.',
  'PT PARTA DIRGANTARA adalah perusahaan Indonesia berorientasi ekspor yang berdedikasi memasok cengkeh kering utuh berkualitas tinggi dari sentra perkebunan nusantara ke pembeli industri global.',
  'trade@partadirgantara.com',
  '+62 812-8900-2456',
  'Wisma Kodel, 9th Floor, Jl. H.R. Rasuna Said Kav. B-4, Jakarta Selatan 12920, Indonesia',
  'Mon – Fri: 08:30 – 17:30 WIB (UTC+7)',
  'Tanjung Priok (Jakarta) / Tanjung Perak (Surabaya)',
  'FOB, CFR, CIF (Incoterms 2020)'
)
ON CONFLICT (id) DO NOTHING;
