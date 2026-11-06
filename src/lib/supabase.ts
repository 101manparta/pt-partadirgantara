import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RFQInquiry, Product, ProductSpec, DocumentItem, Buyer, SiteSettings, DocumentationActivity, MediaAsset } from './types';

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

export const DEFAULT_DOCUMENTATION_ACTIVITIES: DocumentationActivity[] = [
  {
    id: 'act-1',
    title: 'Persiapan Ekspor & Muat Kontainer Lal Pari',
    caption: 'Persiapan dan koordinasi operasional sebelum proses pengapalan kontainer 20ft FCL.',
    description: 'Pemeriksaan akhir kondisi fisik karung goni 50kg, kebersihan wadah, dan penerapan segel kontainer surveyor untuk tujuan pelabuhan internasional.',
    category: 'kegiatan_ekspor',
    activity_date: '2026-11-06',
    location: 'Tanjung Priok Export Hub, Jakarta',
    image_url: '/src/assets/images/export_quality_sorting_1793940754934.jpg',
    storage_path: 'documentation/2026/november/export_quality_sorting_initial.jpg',
    display_order: 1,
    status: 'published',
    created_at: new Date('2026-11-06T08:30:00Z').toISOString(),
  },
  {
    id: 'act-2',
    title: 'Kunjungan Lapangan & Pengawasan Panen Sulawesi',
    caption: 'Inspeksi langsung ke sentra perkebunan cengkeh rakyat bersama mitra petani.',
    description: 'Memantau kematangan kuncup bunga cengkeh sebelum petik untuk memastikan kandungan eugenol dan keutuhan mahkota kuntum memenuhi standar ekspor.',
    category: 'kunjungan',
    activity_date: '2026-10-24',
    location: 'Sentra Perkebunan Sulawesi Selatan',
    image_url: '/src/assets/images/clove_spice_plantation_1793940755065.jpg',
    storage_path: 'documentation/2026/october/clove_spice_plantation_initial.jpg',
    display_order: 2,
    status: 'published',
    created_at: new Date('2026-10-24T09:15:00Z').toISOString(),
  },
  {
    id: 'act-3',
    title: 'Sortasi Kuntum & Verifikasi Kadar Air Laboratorium',
    caption: 'Pengujian kadar air menggunakan moisture meter digital tersertifikasi.',
    description: 'Proses penapisan mekanis dan sortasi manual oleh tim pengendali mutu guna memastikan kadar air konsisten pada batas maksimum 12.0%.',
    category: 'operasional',
    activity_date: '2026-10-18',
    location: 'Laboratorium QC PT PARTA DIRGANTARA',
    image_url: '/src/assets/images/hero_indonesian_cloves_1793940752489.jpg',
    storage_path: 'documentation/2026/october/hero_indonesian_cloves_initial.jpg',
    display_order: 3,
    status: 'published',
    created_at: new Date('2026-10-18T14:00:00Z').toISOString(),
  },
  {
    id: 'act-4',
    title: 'Verifikasi Fisik Sampel Cengkeh Kering Utuh',
    caption: 'Verifikasi visual warna cokelat kemerahan alami dan kepadatan kuntum.',
    description: 'Pengemasan sampel representatif untuk pengujian independen pra-pengapalan oleh surveyor Sucofindo / SGS.',
    category: 'produk',
    activity_date: '2026-10-10',
    location: 'Fasilitas Pengemasan & Gudang Jakarta',
    image_url: '/src/assets/images/product_whole_cloves_1793940753160.jpg',
    storage_path: 'documentation/2026/october/product_whole_cloves_initial.jpg',
    display_order: 4,
    status: 'published',
    created_at: new Date('2026-10-10T11:20:00Z').toISOString(),
  },
];

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-1',
    file_name: 'export_quality_sorting_initial.jpg',
    file_size: '2.4 MB',
    file_type: 'image/jpeg',
    image_url: '/src/assets/images/export_quality_sorting_1793940754934.jpg',
    storage_path: 'documentation/2026/november/export_quality_sorting_initial.jpg',
    category: 'kegiatan_ekspor',
    created_at: new Date('2026-11-06T08:30:00Z').toISOString(),
  },
  {
    id: 'med-2',
    file_name: 'clove_spice_plantation_initial.jpg',
    file_size: '3.1 MB',
    file_type: 'image/jpeg',
    image_url: '/src/assets/images/clove_spice_plantation_1793940755065.jpg',
    storage_path: 'documentation/2026/october/clove_spice_plantation_initial.jpg',
    category: 'kunjungan',
    created_at: new Date('2026-10-24T09:15:00Z').toISOString(),
  },
  {
    id: 'med-3',
    file_name: 'hero_indonesian_cloves_initial.jpg',
    file_size: '1.9 MB',
    file_type: 'image/jpeg',
    image_url: '/src/assets/images/hero_indonesian_cloves_1793940752489.jpg',
    storage_path: 'documentation/2026/october/hero_indonesian_cloves_initial.jpg',
    category: 'operasional',
    created_at: new Date('2026-10-18T14:00:00Z').toISOString(),
  },
  {
    id: 'med-4',
    file_name: 'product_whole_cloves_initial.jpg',
    file_size: '2.2 MB',
    file_type: 'image/jpeg',
    image_url: '/src/assets/images/product_whole_cloves_1793940753160.jpg',
    storage_path: 'documentation/2026/october/product_whole_cloves_initial.jpg',
    category: 'produk',
    created_at: new Date('2026-10-10T11:20:00Z').toISOString(),
  },
];

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

// ==========================================
// DATA ACCESS LAYER: DOCUMENTATION ACTIVITIES
// ==========================================

export async function fetchDocumentationActivities(onlyPublished = false): Promise<DocumentationActivity[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase
        .from('documentation_activities')
        .select('*')
        .order('display_order', { ascending: true })
        .order('activity_date', { ascending: false });

      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as DocumentationActivity[];
      }
    } catch (e) {
      console.warn('Supabase fetch documentation error:', e);
    }
  }

  // Fallback local persistence
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_documentation_activities');
    if (raw) {
      try {
        const list: DocumentationActivity[] = JSON.parse(raw);
        if (onlyPublished) {
          return list.filter((i) => i.status === 'published');
        }
        return list;
      } catch (e) {}
    }
  }

  return onlyPublished
    ? DEFAULT_DOCUMENTATION_ACTIVITIES.filter((i) => i.status === 'published')
    : DEFAULT_DOCUMENTATION_ACTIVITIES;
}

export async function saveDocumentationActivity(
  activity: Partial<DocumentationActivity> & { title: string; image_url: string }
): Promise<{ success: boolean; data?: DocumentationActivity; error?: string }> {
  const supabase = getSupabase();
  const id = activity.id || 'act-' + Date.now();
  const now = new Date().toISOString();

  const record: DocumentationActivity = {
    id,
    title: activity.title.trim(),
    caption: activity.caption?.trim() || '',
    description: activity.description?.trim() || '',
    category: activity.category || 'kegiatan_ekspor',
    activity_date: activity.activity_date || new Date().toISOString().slice(0, 10),
    location: activity.location?.trim() || '',
    image_url: activity.image_url,
    storage_path: activity.storage_path || '',
    display_order: typeof activity.display_order === 'number' ? activity.display_order : 0,
    status: activity.status || 'published',
    created_at: activity.created_at || now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('documentation_activities')
        .upsert(record)
        .select()
        .single();

      if (!error && data) {
        syncLocalDocumentation(record);
        return { success: true, data: data as DocumentationActivity };
      } else if (error) {
        console.warn('Supabase upsert documentation error, falling back locally:', error);
      }
    } catch (e: any) {
      console.warn('Supabase network error during documentation save:', e);
    }
  }

  // Local fallback
  syncLocalDocumentation(record);
  return { success: true, data: record };
}

function syncLocalDocumentation(record: DocumentationActivity) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_documentation_activities');
    let list: DocumentationActivity[] = raw ? JSON.parse(raw) : [...DEFAULT_DOCUMENTATION_ACTIVITIES];
    const index = list.findIndex((x) => x.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem('ptpd_documentation_activities', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ptpd_documentation_updated'));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
  } catch (e) {
    console.error('Error saving documentation locally:', e);
  }
}

export async function deleteDocumentationActivity(id: string, storagePath?: string): Promise<boolean> {
  const supabase = getSupabase();

  // 1. If storagePath exists, remove file from Supabase Storage bucket
  if (storagePath) {
    await deleteImageFromStorage(storagePath);
  }

  // 2. Delete database record
  if (supabase) {
    try {
      const { error } = await supabase.from('documentation_activities').delete().eq('id', id);
      if (!error) {
        removeLocalDocumentation(id);
        return true;
      }
    } catch (e) {
      console.warn('Supabase delete documentation error:', e);
    }
  }

  // Local fallback
  removeLocalDocumentation(id);
  return true;
}

function removeLocalDocumentation(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_documentation_activities');
    const list: DocumentationActivity[] = raw ? JSON.parse(raw) : [...DEFAULT_DOCUMENTATION_ACTIVITIES];
    const updated = list.filter((x) => x.id !== id);
    localStorage.setItem('ptpd_documentation_activities', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ptpd_documentation_updated'));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
  } catch (e) {
    console.error('Error deleting documentation locally:', e);
  }
}

// ==========================================
// SUPABASE STORAGE: UPLOAD & DELETE
// ==========================================

export async function uploadImageToStorage(
  file: File,
  category = 'kegiatan_ekspor'
): Promise<{ url: string; path: string; error?: string }> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const cleanName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filePath = `documentation/${year}/${month}/${cleanName}_${randomSuffix}.${fileExt}`;

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('documentation')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage upload error:', error);
      } else if (data) {
        const { data: publicUrlData } = supabase.storage
          .from('documentation')
          .getPublicUrl(data.path);

        const url = publicUrlData.publicUrl;

        // Also record in media_assets table
        await registerMediaAsset({
          file_name: file.name,
          file_size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          file_type: file.type || 'image/jpeg',
          image_url: url,
          storage_path: data.path,
          category,
        });

        return { url, path: data.path };
      }
    } catch (e: any) {
      console.warn('Supabase storage upload network error:', e);
    }
  }

  // Fallback / Instant preview: create object URL or base64 reader for offline/bridge mode
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const resultUrl = reader.result as string;
      const mockPath = `documentation/${year}/${month}/${cleanName}_${randomSuffix}.${fileExt}`;
      await registerMediaAsset({
        file_name: file.name,
        file_size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        file_type: file.type || 'image/jpeg',
        image_url: resultUrl,
        storage_path: mockPath,
        category,
      });
      resolve({ url: resultUrl, path: mockPath });
    };
    reader.onerror = () => {
      resolve({ url: '', path: '', error: 'Failed to read file' });
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteImageFromStorage(path: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase && path) {
    try {
      const { error } = await supabase.storage.from('documentation').remove([path]);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete storage file error:', e);
    }
  }
  return true;
}

// ==========================================
// MEDIA ASSETS LIBRARY
// ==========================================

export async function registerMediaAsset(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
  const supabase = getSupabase();
  const id = 'med-' + Date.now();
  const record: MediaAsset = {
    ...asset,
    id,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('media_assets').upsert(record);
    } catch (e) {
      console.warn('Supabase register media asset error:', e);
    }
  }

  // Local sync
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('ptpd_media_assets');
      const list: MediaAsset[] = raw ? JSON.parse(raw) : [...DEFAULT_MEDIA_ASSETS];
      list.unshift(record);
      localStorage.setItem('ptpd_media_assets', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('ptpd_media_updated'));
    } catch (e) {}
  }

  return record;
}

export async function fetchMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as MediaAsset[];
      }
    } catch (e) {
      console.warn('Supabase fetch media error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_media_assets');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
  }

  return DEFAULT_MEDIA_ASSETS;
}

export async function deleteMediaAsset(id: string, path: string): Promise<boolean> {
  const supabase = getSupabase();
  if (path) {
    await deleteImageFromStorage(path);
  }

  if (supabase) {
    try {
      await supabase.from('media_assets').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete media asset error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('ptpd_media_assets');
      const list: MediaAsset[] = raw ? JSON.parse(raw) : [...DEFAULT_MEDIA_ASSETS];
      const updated = list.filter((m) => m.id !== id);
      localStorage.setItem('ptpd_media_assets', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptpd_media_updated'));
      return true;
    } catch (e) {}
  }

  return true;
}

