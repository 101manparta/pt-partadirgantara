import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  RFQInquiry,
  Product,
  ProductSpec,
  DocumentItem,
  SiteSettings,
  Activity,
  DocumentationActivity,
  MediaAsset,
} from './types';

// ==========================================
// STORAGE BUCKET CONSTANTS
// ==========================================
export const BUCKET_ACTIVITY_IMAGES = 'activity-images';
export const BUCKET_PRODUCT_IMAGES = 'product-images';
export const BUCKET_DOCUMENTS = 'documents';

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
  image_url: '/images/hero_indonesian_cloves.jpg',
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
    file_url: '/documents/PT_Parta_Dirgantara_Company_Profile.pdf',
    storage_path: 'documents/PT_Parta_Dirgantara_Company_Profile.pdf',
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
    file_url: '/documents/SpecSheet_Indonesian_Whole_Cloves_PT_Parta_Dirgantara.pdf',
    storage_path: 'documents/SpecSheet_Indonesian_Whole_Cloves_PT_Parta_Dirgantara.pdf',
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
    file_url: '/documents/PT_Parta_Dirgantara_Export_Shipping_Guide.pdf',
    storage_path: 'documents/PT_Parta_Dirgantara_Export_Shipping_Guide.pdf',
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

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title_en: 'Export Loading & 20ft Container Stuffing for Lal Pari Cloves',
    title_id: 'Persiapan Ekspor & Muat Kontainer Lal Pari',
    description_en: 'Final physical inspection of 50kg jute bags, container desiccants, and surveyor sealing for international destination ports.',
    description_id: 'Pemeriksaan akhir kondisi fisik karung goni 50kg, kebersihan wadah, dan penerapan segel kontainer surveyor untuk tujuan pelabuhan internasional.',
    category: 'kegiatan_ekspor',
    activity_date: '2026-11-06',
    location: 'Tanjung Priok Export Hub, Jakarta',
    image_url: '/images/export_quality_sorting.jpg',
    image_path: 'activity-images/2026/november/export_quality_sorting.jpg',
    sort_order: 1,
    is_public: true,
    created_at: new Date('2026-11-06T08:30:00Z').toISOString(),
  },
  {
    id: 'act-2',
    title_en: 'Harvest Quality Control & Direct Agro-Cooperative Field Visit',
    title_id: 'Kunjungan Lapangan & Pengawasan Panen Sulawesi',
    description_en: 'Monitoring flower bud maturity before picking to ensure peak eugenol content and whole-crown retention.',
    description_id: 'Memantau kematangan kuncup bunga cengkeh sebelum petik untuk memastikan kandungan eugenol dan keutuhan mahkota kuntum memenuhi standar ekspor.',
    category: 'kunjungan',
    activity_date: '2026-10-24',
    location: 'Sentra Perkebunan Sulawesi Selatan',
    image_url: '/images/clove_spice_plantation.jpg',
    image_path: 'activity-images/2026/october/clove_spice_plantation.jpg',
    sort_order: 2,
    is_public: true,
    created_at: new Date('2026-10-24T09:15:00Z').toISOString(),
  },
  {
    id: 'act-3',
    title_en: 'Mechanical Sorting & Laboratory Halogen Moisture Verification',
    title_id: 'Sortasi Kuntum & Verifikasi Kadar Air Laboratorium',
    description_en: 'Mechanical sifting and manual sortation by QC specialists, maintaining moisture strictly below 12.0%.',
    description_id: 'Proses penapisan mekanis dan sortasi manual oleh tim pengendali mutu guna memastikan kadar air konsisten pada batas maksimum 12.0%.',
    category: 'operasional',
    activity_date: '2026-10-18',
    location: 'Laboratorium QC PT PARTA DIRGANTARA',
    image_url: '/images/hero_indonesian_cloves.jpg',
    image_path: 'activity-images/2026/october/hero_indonesian_cloves.jpg',
    sort_order: 3,
    is_public: true,
    created_at: new Date('2026-10-18T14:00:00Z').toISOString(),
  },
  {
    id: 'act-4',
    title_en: 'Representative Whole Clove Pre-Shipment Sample Inspection',
    title_id: 'Verifikasi Fisik Sampel Cengkeh Kering Utuh',
    description_en: 'Verification of reddish-brown tone and bud density for independent surveyor certificate of quality.',
    description_id: 'Pengemasan sampel representatif untuk pengujian independen pra-pengapalan oleh surveyor Sucofindo / SGS.',
    category: 'produk',
    activity_date: '2026-10-10',
    location: 'Fasilitas Pengemasan & Gudang Jakarta',
    image_url: '/images/product_whole_cloves.jpg',
    image_path: 'activity-images/2026/october/product_whole_cloves.jpg',
    sort_order: 4,
    is_public: true,
    created_at: new Date('2026-10-10T11:20:00Z').toISOString(),
  },
];

// Backward-compatible alias
export const DEFAULT_DOCUMENTATION_ACTIVITIES: DocumentationActivity[] = DEFAULT_ACTIVITIES.map((a) => ({
  id: a.id,
  title: a.title_id || a.title_en,
  caption: a.description_id || a.description_en,
  description: a.description_en,
  category: a.category,
  activity_date: a.activity_date,
  location: a.location,
  image_url: a.image_url,
  storage_path: a.image_path || '',
  display_order: a.sort_order,
  status: a.is_public ? 'published' : 'draft',
  created_at: a.created_at,
}));

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-1',
    file_name: 'export_quality_sorting.jpg',
    file_size: '977 KB',
    file_type: 'image/jpeg',
    image_url: '/images/export_quality_sorting.jpg',
    storage_path: 'activity-images/2026/november/export_quality_sorting.jpg',
    category: 'kegiatan_ekspor',
    created_at: new Date('2026-11-06T08:30:00Z').toISOString(),
  },
  {
    id: 'med-2',
    file_name: 'clove_spice_plantation.jpg',
    file_size: '1.1 MB',
    file_type: 'image/jpeg',
    image_url: '/images/clove_spice_plantation.jpg',
    storage_path: 'activity-images/2026/october/clove_spice_plantation.jpg',
    category: 'kunjungan',
    created_at: new Date('2026-10-24T09:15:00Z').toISOString(),
  },
  {
    id: 'med-3',
    file_name: 'hero_indonesian_cloves.jpg',
    file_size: '682 KB',
    file_type: 'image/jpeg',
    image_url: '/images/hero_indonesian_cloves.jpg',
    storage_path: 'activity-images/2026/october/hero_indonesian_cloves.jpg',
    category: 'operasional',
    created_at: new Date('2026-10-18T14:00:00Z').toISOString(),
  },
  {
    id: 'med-4',
    file_name: 'product_whole_cloves.jpg',
    file_size: '843 KB',
    file_type: 'image/jpeg',
    image_url: '/images/product_whole_cloves.jpg',
    storage_path: 'activity-images/2026/october/product_whole_cloves.jpg',
    category: 'produk',
    created_at: new Date('2026-10-10T11:20:00Z').toISOString(),
  },
];

// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================
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

export function updateSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ptpd_supabase_url', url.trim());
    localStorage.setItem('ptpd_supabase_key', key.trim());
    supabaseInstance = null;
  }
}

// Helper to verify admin auth session
async function ensureAuthenticated(supabase: SupabaseClient): Promise<{ authenticated: boolean; error?: string }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return { authenticated: false, error: 'Unauthorized: Sesi admin tidak ditemukan. Silakan login terlebih dahulu.' };
    }
    return { authenticated: true };
  } catch (err: any) {
    return { authenticated: false, error: err.message || 'Gagal memvalidasi otorisasi admin.' };
  }
}

// Format file size
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Sanitize filename
function sanitizeFileName(fileName: string): { cleanName: string; ext: string } {
  const parts = fileName.split('.');
  const ext = (parts.length > 1 ? parts.pop() : '')?.toLowerCase() || '';
  const base = parts.join('.');
  const cleanName = base.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
  return { cleanName, ext };
}

// ==========================================
// 1. SUPABASE STORAGE FUNCTIONS
// ==========================================

export async function uploadImage(
  bucket: string,
  file: File,
  folder = ''
): Promise<{ success: boolean; url: string; path: string; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  // Validate format
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return { success: false, url: '', path: '', error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' };
  }

  // Validate size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, url: '', path: '', error: 'Ukuran file terlalu besar. Maksimum 10 MB.' };
  }

  const { cleanName, ext } = sanitizeFileName(file.name);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const folderPrefix = folder ? `${folder}/` : '';
  const filePath = `${folderPrefix}${year}/${month}/${cleanName}_${Date.now()}_${randomSuffix}.${ext}`;

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, url: '', path: '', error: authCheck.error };
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Supabase storage upload error in bucket "${bucket}":`, error);
        return { success: false, url: '', path: '', error: `Gagal upload ke bucket ${bucket}: ${error.message}` };
      }

      if (!data) {
        return { success: false, url: '', path: '', error: 'Gagal mendapatkan metadata upload.' };
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { success: true, url: publicUrlData.publicUrl, path: data.path };
    } catch (err: any) {
      console.error('Supabase storage upload exception:', err);
      return { success: false, url: '', path: '', error: err.message || 'Kesalahan jaringan saat upload.' };
    }
  }

  // Local development fallback (ONLY when Supabase is not configured)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ success: true, url: reader.result as string, path: filePath });
    };
    reader.onerror = () => {
      resolve({ success: false, url: '', path: '', error: 'Gagal membaca file gambar.' });
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadDocument(
  file: File
): Promise<{ success: boolean; url: string; path: string; fileName: string; fileSize: string; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const formattedSize = formatBytes(file.size);

  const { cleanName, ext } = sanitizeFileName(file.name);
  const now = new Date();
  const year = now.getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filePath = `trade_documents/${year}/${cleanName}_${Date.now()}_${randomSuffix}.${ext}`;

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, url: '', path: '', fileName: file.name, fileSize: formattedSize, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_DOCUMENTS)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase document upload error:', error);
        return { success: false, url: '', path: '', fileName: file.name, fileSize: formattedSize, error: error.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_DOCUMENTS)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: publicUrlData.publicUrl,
        path: data.path,
        fileName: file.name,
        fileSize: formattedSize,
      };
    } catch (err: any) {
      console.error('Supabase document upload exception:', err);
      return { success: false, url: '', path: '', fileName: file.name, fileSize: formattedSize, error: err.message };
    }
  }

  // Local fallback ONLY when Supabase is unconfigured
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result as string,
        path: filePath,
        fileName: file.name,
        fileSize: formattedSize,
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        url: '',
        path: '',
        fileName: file.name,
        fileSize: formattedSize,
        error: 'Gagal membaca file dokumen.',
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function deleteStorageFile(
  bucket: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  if (!filePath || filePath.startsWith('http') || filePath.startsWith('/')) {
    return { success: true };
  }

  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.warn(`Supabase delete storage file error in bucket "${bucket}":`, error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase storage delete exception:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

// Backward-compatible image upload wrapper
export async function uploadImageToStorage(
  file: File,
  category = 'kegiatan_ekspor'
): Promise<{ url: string; path: string; error?: string }> {
  const result = await uploadImage(BUCKET_ACTIVITY_IMAGES, file, category);
  if (result.success) {
    // Also record in media_assets table
    await registerMediaAsset({
      file_name: file.name,
      file_size: formatBytes(file.size),
      file_type: file.type || 'image/jpeg',
      image_url: result.url,
      storage_path: result.path,
      category,
    });
    return { url: result.url, path: result.path };
  }
  return { url: '', path: '', error: result.error };
}

export async function deleteImageFromStorage(path: string): Promise<boolean> {
  const res = await deleteStorageFile(BUCKET_ACTIVITY_IMAGES, path);
  return res.success;
}

// ==========================================
// 2. DATA ACCESS LAYER: DOCUMENTS CRUD
// ==========================================

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch documents error:', error);
      } else if (data && data.length > 0) {
        return data as DocumentItem[];
      }
    } catch (e) {
      console.error('Supabase fetch documents exception:', e);
    }
  }

  // Local storage fallback
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

export async function createDocument(
  doc: Omit<DocumentItem, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: DocumentItem; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'doc-' + Date.now();
  const timestamp = new Date().toISOString();

  const record: DocumentItem = {
    ...doc,
    id: newId,
    created_at: timestamp,
  };

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createDocument error:', error);
        return { success: false, error: error.message };
      }

      // Sync local storage as backup cache
      syncLocalDocument(data || record);
      return { success: true, data: data || record };
    } catch (err: any) {
      console.error('Supabase createDocument exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  syncLocalDocument(record);
  return { success: true, data: record };
}

export async function updateDocument(
  id: string,
  updates: Partial<DocumentItem>
): Promise<{ success: boolean; data?: DocumentItem; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateDocument error:', error);
        return { success: false, error: error.message };
      }

      if (data) {
        syncLocalDocument(data as DocumentItem);
        return { success: true, data: data as DocumentItem };
      }
    } catch (err: any) {
      console.error('Supabase updateDocument exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_documents');
    const list: DocumentItem[] = raw ? JSON.parse(raw) : [...DEFAULT_DOCUMENTS];
    const idx = list.findIndex((d) => d.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('ptpd_documents', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
      return { success: true, data: list[idx] };
    }
  }
  return { success: false, error: 'Document not found.' };
}

export async function deleteDocument(
  id: string,
  storagePath?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  // 1. Delete from Supabase Storage bucket if storagePath is provided
  if (storagePath) {
    await deleteStorageFile(BUCKET_DOCUMENTS, storagePath);
  }

  // 2. Delete database record
  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteDocument error:', error);
        return { success: false, error: error.message };
      }
      removeLocalDocument(id);
      return { success: true };
    } catch (err: any) {
      console.error('Supabase deleteDocument exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  removeLocalDocument(id);
  return { success: true };
}

function syncLocalDocument(item: DocumentItem) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_documents');
    const list: DocumentItem[] = raw ? JSON.parse(raw) : [...DEFAULT_DOCUMENTS];
    const idx = list.findIndex((d) => d.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem('ptpd_documents', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
  } catch (e) {}
}

function removeLocalDocument(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_documents');
    const list: DocumentItem[] = raw ? JSON.parse(raw) : [...DEFAULT_DOCUMENTS];
    const updated = list.filter((d) => d.id !== id);
    localStorage.setItem('ptpd_documents', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
  } catch (e) {}
}

// Backward compatible helper for existing callers
export async function saveDocuments(docs: DocumentItem[]): Promise<boolean> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase.from('documents').upsert(docs);
      if (error) {
        console.error('saveDocuments error:', error);
        return false;
      }
    } catch (e) {
      return false;
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
// 3. DATA ACCESS LAYER: ACTIVITIES CRUD
// ==========================================

export async function fetchActivities(onlyPublic = false): Promise<Activity[]> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      let query = supabase
        .from('activities')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('activity_date', { ascending: false });

      if (onlyPublic) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase fetchActivities error:', error);
      } else if (data && data.length > 0) {
        return data as Activity[];
      }
    } catch (e) {
      console.error('Supabase fetchActivities exception:', e);
    }
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_activities');
    if (raw) {
      try {
        const list: Activity[] = JSON.parse(raw);
        return onlyPublic ? list.filter((a) => a.is_public) : list;
      } catch (e) {}
    }
  }

  return onlyPublic
    ? DEFAULT_ACTIVITIES.filter((a) => a.is_public)
    : DEFAULT_ACTIVITIES;
}

export async function createActivity(
  activity: Omit<Activity, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: Activity; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const newId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'act-' + Date.now();
  const timestamp = new Date().toISOString();

  const record: Activity = {
    ...activity,
    id: newId,
    created_at: timestamp,
  };

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createActivity error:', error);
        return { success: false, error: error.message };
      }

      syncLocalActivity(data || record);
      return { success: true, data: data || record };
    } catch (err: any) {
      console.error('Supabase createActivity exception:', err);
      return { success: false, error: err.message };
    }
  }

  syncLocalActivity(record);
  return { success: true, data: record };
}

export async function updateActivity(
  id: string,
  updates: Partial<Activity>
): Promise<{ success: boolean; data?: Activity; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateActivity error:', error);
        return { success: false, error: error.message };
      }

      if (data) {
        syncLocalActivity(data as Activity);
        return { success: true, data: data as Activity };
      }
    } catch (err: any) {
      console.error('Supabase updateActivity exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_activities');
    const list: Activity[] = raw ? JSON.parse(raw) : [...DEFAULT_ACTIVITIES];
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('ptpd_activities', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
      window.dispatchEvent(new CustomEvent('ptpd_activities_updated'));
      return { success: true, data: list[idx] };
    }
  }
  return { success: false, error: 'Activity not found.' };
}

export async function deleteActivity(
  id: string,
  imagePath?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  // 1. Delete image from Storage
  if (imagePath) {
    await deleteStorageFile(BUCKET_ACTIVITY_IMAGES, imagePath);
  }

  // 2. Delete database row
  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteActivity error:', error);
        return { success: false, error: error.message };
      }
      removeLocalActivity(id);
      return { success: true };
    } catch (err: any) {
      console.error('Supabase deleteActivity exception:', err);
      return { success: false, error: err.message };
    }
  }

  removeLocalActivity(id);
  return { success: true };
}

function syncLocalActivity(item: Activity) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_activities');
    const list: Activity[] = raw ? JSON.parse(raw) : [...DEFAULT_ACTIVITIES];
    const idx = list.findIndex((a) => a.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem('ptpd_activities', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
    window.dispatchEvent(new CustomEvent('ptpd_activities_updated'));
  } catch (e) {}
}

function removeLocalActivity(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('ptpd_activities');
    const list: Activity[] = raw ? JSON.parse(raw) : [...DEFAULT_ACTIVITIES];
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem('ptpd_activities', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ptpd_data_updated'));
    window.dispatchEvent(new CustomEvent('ptpd_activities_updated'));
  } catch (e) {}
}

// Backward-compatible wrappers for documentation_activities
export async function fetchDocumentationActivities(onlyPublished = false): Promise<DocumentationActivity[]> {
  const acts = await fetchActivities(onlyPublished);
  return acts.map((a) => ({
    id: a.id,
    title: a.title_id || a.title_en,
    caption: a.description_id || a.description_en,
    description: a.description_en,
    category: a.category,
    activity_date: a.activity_date,
    location: a.location,
    image_url: a.image_url,
    storage_path: a.image_path || '',
    display_order: a.sort_order,
    status: a.is_public ? 'published' : 'draft',
    created_at: a.created_at,
  }));
}

export async function saveDocumentationActivity(
  activity: Partial<DocumentationActivity> & { title: string; image_url: string }
): Promise<{ success: boolean; data?: DocumentationActivity; error?: string }> {
  if (activity.id && !activity.id.startsWith('act-')) {
    // update
    const result = await updateActivity(activity.id, {
      title_en: activity.title,
      title_id: activity.title,
      description_en: activity.description,
      description_id: activity.caption,
      activity_date: activity.activity_date,
      location: activity.location,
      category: activity.category,
      image_url: activity.image_url,
      image_path: activity.storage_path,
      is_public: activity.status === 'published',
      sort_order: activity.display_order,
    });
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          id: result.data.id,
          title: result.data.title_id || result.data.title_en,
          caption: result.data.description_id || result.data.description_en,
          description: result.data.description_en,
          category: result.data.category,
          activity_date: result.data.activity_date,
          location: result.data.location,
          image_url: result.data.image_url,
          storage_path: result.data.image_path || '',
          display_order: result.data.sort_order,
          status: result.data.is_public ? 'published' : 'draft',
          created_at: result.data.created_at,
        },
      };
    }
    return { success: false, error: result.error };
  } else {
    // create
    const result = await createActivity({
      title_en: activity.title,
      title_id: activity.title,
      description_en: activity.description || '',
      description_id: activity.caption || '',
      activity_date: activity.activity_date || new Date().toISOString().slice(0, 10),
      location: activity.location || '',
      category: activity.category || 'kegiatan_ekspor',
      image_url: activity.image_url,
      image_path: activity.storage_path || '',
      is_public: activity.status !== 'draft',
      sort_order: activity.display_order || 0,
    });
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          id: result.data.id,
          title: result.data.title_id || result.data.title_en,
          caption: result.data.description_id || result.data.description_en,
          description: result.data.description_en,
          category: result.data.category,
          activity_date: result.data.activity_date,
          location: result.data.location,
          image_url: result.data.image_url,
          storage_path: result.data.image_path || '',
          display_order: result.data.sort_order,
          status: result.data.is_public ? 'published' : 'draft',
          created_at: result.data.created_at,
        },
      };
    }
    return { success: false, error: result.error };
  }
}

export async function deleteDocumentationActivity(id: string, storagePath?: string): Promise<boolean> {
  const res = await deleteActivity(id, storagePath);
  return res.success;
}

// ==========================================
// 4. DATA ACCESS LAYER: PRODUCTS CRUD
// ==========================================

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Supabase fetchProducts error:', error);
      } else if (data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.error('Supabase fetch products exception:', e);
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

export async function createProduct(
  product: Omit<Product, 'id'>
): Promise<{ success: boolean; data?: Product; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const newId = 'prod-' + Date.now();

  const record: Product = {
    ...product,
    id: newId,
  };

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createProduct error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data: data || record };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, data: record };
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ success: boolean; data?: Product; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateProduct error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data: data as Product };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

export async function deleteProduct(
  id: string,
  imagePath?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (imagePath) {
    await deleteStorageFile(BUCKET_PRODUCT_IMAGES, imagePath);
  }

  if (supabase && isConfigured) {
    const authCheck = await ensureAuthenticated(supabase);
    if (!authCheck.authenticated) {
      return { success: false, error: authCheck.error };
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase.from('products').upsert(products);
      if (error) {
        console.error('saveProducts error:', error);
        return false;
      }
    } catch (e) {
      return false;
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
// 5. DATA ACCESS LAYER: RFQ INQUIRIES
// ==========================================

export async function submitRFQ(
  inquiryData: Omit<RFQInquiry, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; data?: RFQInquiry; error?: string }> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const newId = 'rfq-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const timestamp = new Date().toISOString();

  const record: RFQInquiry = {
    ...inquiryData,
    id: newId,
    created_at: timestamp,
    status: 'NEW',
    admin_notes: '',
  };

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase RFQ insert error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data: data || record };
    } catch (err: any) {
      console.error('Supabase network error during RFQ:', err);
      return { success: false, error: err.message || 'Gagal mengirim formulir RFQ.' };
    }
  }

  // Local storage fallback for dev/demo mode
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
  } catch (e) {}
}

export async function fetchRFQs(): Promise<RFQInquiry[]> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch RFQs error:', error);
      } else if (data) {
        return data as RFQInquiry[];
      }
    } catch (e) {
      console.warn('Supabase fetch RFQs exception:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    return raw ? JSON.parse(raw) : [];
  }
  return [];
}

export async function updateRFQStatus(
  id: string,
  status: RFQInquiry['status'],
  notes?: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase
        .from('rfq_inquiries')
        .update({ status, ...(notes !== undefined ? { admin_notes: notes } : {}) })
        .eq('id', id);

      if (!error) return true;
      console.error('Supabase update RFQ error:', error);
    } catch (e) {
      console.warn('Supabase update RFQ exception:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    if (raw) {
      const list: RFQInquiry[] = JSON.parse(raw);
      const updated = list.map((item) =>
        item.id === id ? { ...item, status, ...(notes !== undefined ? { admin_notes: notes } : {}) } : item
      );
      localStorage.setItem('ptpd_rfq_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptpd_rfq_updated'));
      return true;
    }
  }
  return false;
}

export async function deleteRFQ(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase.from('rfq_inquiries').delete().eq('id', id);
      if (!error) return true;
      console.error('Supabase delete RFQ error:', error);
    } catch (e) {
      console.warn('Supabase delete RFQ exception:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('ptpd_rfq_inquiries');
    if (raw) {
      const list: RFQInquiry[] = JSON.parse(raw);
      const updated = list.filter((item) => item.id !== id);
      localStorage.setItem('ptpd_rfq_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ptpd_rfq_updated'));
      return true;
    }
  }
  return false;
}

// ==========================================
// 6. DATA ACCESS LAYER: SITE SETTINGS
// ==========================================

export async function fetchSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        return { ...DEFAULT_SETTINGS, ...data };
      }
    } catch (e) {
      console.warn('Supabase fetch settings exception:', e);
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
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 'main', ...settings });
      if (!error) return true;
      console.error('Supabase save settings error:', error);
    } catch (e) {
      console.warn('Supabase save settings exception:', e);
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
// 7. DATA ACCESS LAYER: MEDIA ASSETS
// ==========================================

export async function registerMediaAsset(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
  const supabase = getSupabase();
  const { isConfigured } = getSupabaseConfig();
  const id = 'med-' + Date.now();
  const record: MediaAsset = {
    ...asset,
    id,
    created_at: new Date().toISOString(),
  };

  if (supabase && isConfigured) {
    try {
      await supabase.from('media_assets').upsert(record);
    } catch (e) {
      console.warn('Supabase register media asset exception:', e);
    }
  }

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
  const { isConfigured } = getSupabaseConfig();

  if (supabase && isConfigured) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as MediaAsset[];
      }
    } catch (e) {
      console.warn('Supabase fetch media exception:', e);
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
    await deleteStorageFile(BUCKET_ACTIVITY_IMAGES, path);
  }

  if (supabase) {
    try {
      await supabase.from('media_assets').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete media asset exception:', e);
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
