import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RFQInquiry, Product, ProductSpec, DocumentItem, Buyer, SiteSettings } from './types';

// Initial default product specification data for Indonesian Whole Cloves
export const DEFAULT_CLOVE_SPECS: ProductSpec[] = [
  { id: '1', parameter_en: 'Botanical Name', parameter_id: 'Nama Botani', standard_value: 'Syzygium aromaticum', test_method: 'Botanical Verification', sort_order: 1 },
  { id: '2', parameter_en: 'Grade / Classification', parameter_id: 'Grade / Klasifikasi', standard_value: 'Export Grade Lal Pari / Hand-Picked', test_method: 'Visual & Mechanical Sort', sort_order: 2 },
  { id: '3', parameter_en: 'Moisture Content', parameter_id: 'Kadar Air', standard_value: '10.0% – 12.0% Maximum', test_method: 'Halogen Moisture Analyzer / ISO 939', sort_order: 3 },
  { id: '4', parameter_en: 'Extraneous Matter / Foreign Matter', parameter_id: 'Benda Asing', standard_value: '≤ 0.5% – 1.0%', test_method: 'ISO 927 Laboratory Sieve', sort_order: 4 },
  { id: '5', parameter_en: 'Stems / Stalks Ratio', parameter_id: 'Kadar Tangkai', standard_value: '≤ 2.0% – 3.0%', test_method: 'Manual Separation / ASTM', sort_order: 5 },
  { id: '6', parameter_en: 'Headless Cloves', parameter_id: 'Cengkeh Tanpa Kepala', standard_value: '≤ 5.0% (Contract Spec Dependent)', test_method: 'Physical Count / 100g', sort_order: 6 },
  { id: '7', parameter_en: 'Essential / Volatile Oil Content', parameter_id: 'Kadar Minyak Atsiri', standard_value: '17.0% – 20.0% Minimum (Dry Basis)', test_method: 'Clevenger Distillation / ISO 6571', sort_order: 7 },
  { id: '8', parameter_en: 'Color & Appearance', parameter_id: 'Warna & Kenampakan', standard_value: 'Natural Deep Reddish Brown to Dark Brown', test_method: 'Sensory / Organoleptic', sort_order: 8 },
  { id: '9', parameter_en: 'Minimum Order Quantity (MOQ)', parameter_id: 'Minimal Pesanan (MOQ)', standard_value: '1 x 20ft FCL (~11–12 Metric Tons)', test_method: 'Commercial Contract', sort_order: 9 },
  { id: '10', parameter_en: 'Export Packaging', parameter_id: 'Kemasan Ekspor', standard_value: '50kg Heavy-Duty Jute / PP Bags with inner liner', test_method: 'Food Grade Standard', sort_order: 10 },
];

export const DEFAULT_PRODUCT: Product = {
  id: 'indonesian-whole-cloves',
  name: 'Indonesian Whole Dried Cloves',
  botanical_name: 'Syzygium aromaticum',
  origin: 'Sulawesi, Maluku, & Java, Indonesia',
  form: 'Whole Dried Flower Buds',
  grade: 'Export Grade Lal Pari / Hand-Picked',
  description_en: 'Premium sun-dried whole cloves sourced directly from Indonesian smallholder agro-cooperatives. Rich in eugenol essential oils, exhibiting uniform reddish-brown hue and high whole-bud crown retention.',
  description_id: 'Cengkeh kering utuh kualitas ekspor pilihan dari sentra perkebunan nusantara. Mengandung minyak atsiri eugenol pekat, warna cokelat kemerahan alami, dan mahkota kuntum utuh.',
  packaging: '50kg Jute bags or 25kg PP bags with food-grade inner poly liner',
  moq: '11 Metric Tons (1 x 20ft FCL)',
  availability: 'Year-Round Harvest Availability (Peak July – November)',
  image_url: '/src/assets/images/hero_indonesian_cloves_1793940752489.jpg',
  is_active: true,
  specs: DEFAULT_CLOVE_SPECS,
};

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title_en: 'PT PARTA DIRGANTARA — Corporate Export Profile 2026',
    title_id: 'PT PARTA DIRGANTARA — Profil Perusahaan Ekspor 2026',
    category: 'profile',
    file_name: 'PT_Parta_Dirgantara_Company_Profile.pdf',
    file_url: '#',
    file_size: '2.4 MB',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-2',
    title_en: 'Technical Specification Sheet — Indonesian Whole Cloves (Syzygium aromaticum)',
    title_id: 'Lembar Spesifikasi Teknis — Cengkeh Utuh Kering Indonesia',
    category: 'spec_sheet',
    file_name: 'SpecSheet_Indonesian_Whole_Cloves_PT_Parta_Dirgantara.pdf',
    file_url: '#',
    file_size: '860 KB',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'doc-3',
    title_en: 'Export Logistics, Packaging & Container Stuffing Guidelines',
    title_id: 'Panduan Logistik, Pengemasan & Stuffing Kontainer Ekspor',
    category: 'catalog',
    file_name: 'PT_Parta_Dirgantara_Export_Shipping_Guide.pdf',
    file_url: '#',
    file_size: '1.2 MB',
    is_public: true,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: 'PT PARTA DIRGANTARA',
  hero_title_en: 'PREMIUM INDONESIAN CLOVES FOR GLOBAL MARKETS',
  hero_title_id: 'CENGKEH INDONESIA BERKUALITAS UNTUK PASAR GLOBAL',
  hero_subtitle_en: 'PT PARTA DIRGANTARA connects quality Indonesian cloves with international buyers through professional sourcing and export-oriented partnerships.',
  hero_subtitle_id: 'PT PARTA DIRGANTARA menghubungkan cengkeh pilihan Indonesia dengan pembeli internasional melalui pengadaan profesional dan kemitraan ekspor berkelanjutan.',
  about_text_en: 'PT PARTA DIRGANTARA is an Indonesian export-oriented enterprise founded to deliver authentic, high-grade cloves from indigenous Indonesian cultivation regions to industrial buyers, spice extractors, and wholesale distributors worldwide.',
  about_text_id: 'PT PARTA DIRGANTARA adalah perusahaan Indonesia berorientasi ekspor yang berdedikasi memasok cengkeh kering utuh berkualitas tinggi dari sentra perkebunan nusantara ke pembeli industri global.',
  email: 'trade@partadirgantara.com',
  phone_whatsapp: '+62 812-8900-2456',
  office_address: 'Wisma Kodel, 9th Floor, Jl. H.R. Rasuna Said Kav. B-4, Jakarta Selatan 12920, Indonesia',
  operating_hours: 'Mon – Fri: 08:30 – 17:30 WIB (UTC+7)',
  primary_port: 'Tanjung Priok (Jakarta) / Tanjung Perak (Surabaya)',
  incoterms_supported: 'FOB, CFR, CIF (Incoterms 2020)',
};

// Check environment variables or local storage for Supabase configuration
export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  const savedUrl = typeof window !== 'undefined' ? localStorage.getItem('ptpd_supabase_url') || '' : '';
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem('ptpd_supabase_key') || '' : '';

  const url = (savedUrl || envUrl || '').trim();
  const key = (savedKey || envKey || '').trim();
  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Reset instance when keys change
export function updateSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ptpd_supabase_url', url.trim());
    localStorage.setItem('ptpd_supabase_key', key.trim());
    supabaseInstance = null;
  }
}

// ==========================================
// DATA ACCESS LAYER: RFQ INQUIRIES
// ==========================================

export async function submitRFQ(inquiryData: Omit<RFQInquiry, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; data?: RFQInquiry; error?: string }> {
  const supabase = getSupabase();
  const newId = 'rfq-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const timestamp = new Date().toISOString();

  const record: RFQInquiry = {
    ...inquiryData,
    id: newId,
    created_at: timestamp,
    status: 'NEW',
    admin_notes: '',
  };

  // 1. If Supabase is connected, write directly to the database
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase RFQ insert error:', error);
        // Fallback store to ensure buyer inquiry is never lost
        storeLocallyRFQ(record);
        return { success: true, data: record };
      }
      return { success: true, data: data || record };
    } catch (err: any) {
      console.error('Supabase network error during RFQ:', err);
      storeLocallyRFQ(record);
      return { success: true, data: record };
    }
  }

  // 2. Local fallback persistence
  storeLocallyRFQ(record);
  return { success: true, data: record };
}

function storeLocallyRFQ(item: RFQInquiry) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    const list: RFQInquiry[] = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem('ptpd_rfq_inquiries', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ptpd_rfq_updated'));
  } catch (e) {
    console.error('Error saving RFQ locally:', e);
  }
}

export async function fetchRFQs(): Promise<RFQInquiry[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as RFQInquiry[];
      }
    } catch (e) {
      console.warn('Supabase fetch RFQs error, using local data:', e);
    }
  }

  // Local store
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    return raw ? JSON.parse(raw) : [];
  }
  return [];
}

export async function updateRFQStatus(id: string, status: RFQInquiry['status'], notes?: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('rfq_inquiries')
        .update({ status, ...(notes !== undefined ? { admin_notes: notes } : {}) })
        .eq('id', id);

      if (!error) return true;
    } catch (e) {
      console.warn('Supabase update RFQ error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    if (raw) {
      const list: RFQInquiry[] = JSON.parse(raw);
      const updated = list.map(item => item.id === id ? { ...item, status, ...(notes !== undefined ? { admin_notes: notes } : {}) } : item);
      localStorage.setItem('ptpd_rfq_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptpd_rfq_updated'));
      return true;
    }
  }
  return false;
}

export async function deleteRFQ(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('rfq_inquiries').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete RFQ error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    if (raw) {
      const list: RFQInquiry[] = JSON.parse(raw);
      const updated = list.filter(item => item.id !== id);
      localStorage.setItem('ptpd_rfq_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptpd_rfq_updated'));
      return true;
    }
  }
  return false;
}

// ==========================================
// DATA ACCESS LAYER: PRODUCTS & SPECS
// ==========================================

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.warn('Supabase fetch products error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_products');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
  }
  return [DEFAULT_PRODUCT];
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').upsert(products);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase save product error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('ptpd_products', JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
    return true;
  }
  return false;
}

// ==========================================
// DATA ACCESS LAYER: DOCUMENTS
// ==========================================

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('documents').select('*');
      if (!error && data && data.length > 0) {
        return data as DocumentItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch documents error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_documents');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
  }
  return DEFAULT_DOCUMENTS;
}

export async function saveDocuments(docs: DocumentItem[]): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('documents').upsert(docs);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase save documents error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('ptpd_documents', JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
    return true;
  }
  return false;
}

// ==========================================
// DATA ACCESS LAYER: SITE SETTINGS
// ==========================================

export async function fetchSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        return { ...DEFAULT_SETTINGS, ...data };
      }
    } catch (e) {
      console.warn('Supabase fetch settings error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_settings');
    if (raw) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      } catch (e) {}
    }
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: SiteSettings): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 'main', ...settings });
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase save settings error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('ptpd_settings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
    return true;
  }
  return false;
}
