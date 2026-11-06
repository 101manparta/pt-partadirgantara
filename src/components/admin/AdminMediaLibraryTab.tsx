import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  FileImage,
  Calendar,
  Layers,
  HardDrive,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { MediaAsset } from '../../lib/types';
import { fetchMediaAssets, deleteMediaAsset, uploadImageToStorage } from '../../lib/supabase';

export const AdminMediaLibraryTab: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaAsset | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMediaAssets();
      setMediaList(data);
    } catch (e) {
      console.warn('Error loading media assets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setUploadError('File harus berupa gambar (JPG, PNG, WebP).');
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const res = await uploadImageToStorage(file, 'general');
        if (res.error) {
          setUploadError(res.error);
        } else {
          await loadMedia();
        }
      } catch (err: any) {
        setUploadError(err.message || 'Gagal mengunggah media.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (window.confirm(`Hapus media "${asset.file_name}" dari Supabase Storage?`)) {
      await deleteMediaAsset(asset.id, asset.storage_path);
      await loadMedia();
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.image_url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = mediaList.filter((m) => {
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesSearch =
      m.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and Direct Upload */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Media Library & Storage Assets
          </h3>
          <p className="text-xs text-slate-500">
            Manajemen file aset visual, storage bucket, dan reusable media links
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-sm hover:shadow transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Mengunggah ke Storage...' : 'Upload Media Baru'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <span>{uploadError}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama file media atau kategori..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Kategori Media</option>
            <option value="kegiatan_ekspor">Kegiatan Ekspor</option>
            <option value="kunjungan">Kunjungan</option>
            <option value="operasional">Operasional</option>
            <option value="produk">Produk</option>
            <option value="general">Umum / General</option>
          </select>

          <button
            onClick={loadMedia}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
            title="Refresh Media List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-7 h-7 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">Memuat aset media...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl glass-panel border border-slate-200">
          <FileImage className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Tidak ada media ditemukan</h4>
          <p className="text-xs text-slate-400 mt-1">Upload gambar baru menggunakan tombol di atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl glass-panel border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div>
                <div
                  onClick={() => setPreviewMedia(asset)}
                  className="aspect-[4/3] bg-slate-900 relative cursor-pointer overflow-hidden"
                >
                  <img
                    src={asset.image_url}
                    alt={asset.file_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-900">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono">
                    {asset.file_size}
                  </div>
                </div>

                <div className="p-3">
                  <div className="font-bold text-slate-900 text-xs truncate" title={asset.file_name}>
                    {asset.file_name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                    <span className="capitalize">{asset.category.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="px-3 pb-3 pt-1 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#FF6B00] py-1 px-2 rounded hover:bg-orange-50 transition-colors"
                  title="Salin URL Gambar"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === asset.id ? 'Tersalin' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(asset)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Hapus Media dari Storage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-900 text-sm truncate max-w-md">{previewMedia.file_name}</h4>
              <button onClick={() => setPreviewMedia(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={previewMedia.image_url}
                alt={previewMedia.file_name}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 font-mono text-slate-600">
              <div className="flex justify-between">
                <span>Storage Path:</span>
                <span className="font-semibold text-slate-800 truncate max-w-xs">{previewMedia.storage_path}</span>
              </div>
              <div className="flex justify-between">
                <span>Ukuran File:</span>
                <span>{previewMedia.file_size}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Upload:</span>
                <span>{new Date(previewMedia.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleCopyUrl(previewMedia);
                  setPreviewMedia(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E65100] rounded-xl"
              >
                Copy URL Gambar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
