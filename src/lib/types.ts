export type Language = 'en' | 'id';
export type VisualEffectMode = 'full-glass' | 'reduced' | 'readable';

export interface RFQInquiry {
  id: string;
  created_at: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  unit: string;
  destination_country: string;
  destination_port: string;
  preferred_packaging: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTATION_SENT' | 'NEGOTIATION' | 'CONVERTED' | 'REJECTED';
  admin_notes?: string;
}

export interface ProductSpec {
  id: string;
  parameter_en: string;
  parameter_id: string;
  standard_value: string;
  test_method: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  botanical_name: string;
  origin: string;
  form: string;
  grade: string;
  description_en: string;
  description_id: string;
  packaging: string;
  moq: string;
  availability: string;
  image_url: string;
  is_active: boolean;
  specs: ProductSpec[];
}

export interface DocumentItem {
  id: string;
  title_en: string;
  title_id: string;
  category: 'profile' | 'catalog' | 'spec_sheet' | 'certification';
  file_name: string;
  file_url: string;
  file_size: string;
  is_public: boolean;
  created_at: string;
}

export interface Buyer {
  id: string;
  company_name: string;
  contact_name: string;
  country: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'active' | 'prospect' | 'negotiation' | 'inactive';
  created_at: string;
}

export interface SiteSettings {
  company_name: string;
  hero_title_en: string;
  hero_title_id: string;
  hero_subtitle_en: string;
  hero_subtitle_id: string;
  about_text_en: string;
  about_text_id: string;
  email: string;
  phone_whatsapp: string;
  office_address: string;
  operating_hours: string;
  primary_port: string;
  incoterms_supported: string;
  supabase_url?: string;
  supabase_anon_key?: string;
}
