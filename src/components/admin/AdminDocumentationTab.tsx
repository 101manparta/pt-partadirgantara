import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  Layers,
  ArrowUpDown,
  X,
  FileImage,
} from 'lucide-react';
import { DocumentationActivity, DocumentationCategory } from '../../lib/types';
import { saveDocumentationActivity, deleteDocumentationActivity, uploadImageToStorage } from '../../lib/supabase';

interface DocumentationTabProps {
  activities: DocumentationActivity[];
  onRefresh: () => void;
}

export const AdminDocumentationTab: React.FC<DocumentationTabProps> = ({
  activities,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentationCategory>('kegiatan_ekspor');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // Image handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [existingStoragePath, setExistingStoragePath] = useState<string>('');

  // Processing & notification states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<DocumentationActivity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter list
  const filtered = activities.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.caption.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q));
    return matchesCat && matchesStatus && matchesQuery;
  });

  const totalCount = activities.length;
  const publishedCount = activities.filter((a) => a.status === 'published').length;
  const draftCount = activities.filter((a) => a.status === 'draft').length;

  const resetForm = () => {
    setTitle('');
    setCaption('');
    setDescription('');
    setCategory('kegiatan_ekspor');
    setActivityDate(new Date().toISOString().slice(0, 10));
    setLocation('');
    setDisplayOrder(activities.length + 1);
    setStatus('published');
    setSelectedFile(null);
    setImagePreview('');
    setExistingImageUrl('');
    setExistingStoragePath('');
    setFormError(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: DocumentationActivity) => {
    resetForm();
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title);
    setCaption(item.caption);
    setDescription(item.description);
    setCategory(item.category as DocumentationCategory);
    setActivityDate(item.activity_date);
    setLocation(item.location || '');
    setDisplayOrder(item.display_order);
    setStatus(item.status);
    setExistingImageUrl(item.image_url);
    setImagePreview(item.image_url);
    setExistingStoragePath(item.storage_path);
    setShowFormModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // File validation: check image type
      if (!file.type.startsWith('image/')) {
        setFormError('File harus berupa gambar (JPG, PNG, WebP).');
        return;
      }
      setSelectedFile(file);
      setFormError(null);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Judul kegiatan wajib diisi.');
      return;
    }
    if (!caption.trim()) {
      setFormError('Caption foto kegiatan wajib diisi.');
      return;
    }
    if (!selectedFile && !existingImageUrl) {
      setFormError('Silakan pilih atau upload foto dokumentasi.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl;
      let finalStoragePath = existingStoragePath;

      // If new file chosen, upload to Supabase Storage
      if (selectedFile) {
        const uploadResult = await uploadImageToStorage(selectedFile, category);
        if (uploadResult.error) {
          setFormError('Gagal mengunggah foto ke Supabase Storage: ' + uploadResult.error);
          setIsSubmitting(false);
          return;
        }
        finalImageUrl = uploadResult.url;
        finalStoragePath = uploadResult.path;
      }

      const payload: Partial<DocumentationActivity> & { title: string; image_url: string } = {
        ...(editingId ? { id: editingId } : {}),
        title,
        caption,
        description,
        category,
        activity_date: activityDate,
        location,
        image_url: finalImageUrl,
        storage_path: finalStoragePath,
        display_order: Number(displayOrder),
        status,
      };

      const result = await saveDocumentationActivity(payload);

      if (result.success) {
        setSuccessToast(isEditing ? 'Dokumentasi berhasil diperbarui!' : 'Dokumentasi baru berhasil ditambahkan!');
        setTimeout(() => setSuccessToast(null), 3500);
        setShowFormModal(false);
        resetForm();
        onRefresh();
      } else {
        setFormError(result.error || 'Gagal menyimpan dokumentasi.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await deleteDocumentationActivity(deleteTarget.id, deleteTarget.storage_path);
      setSuccessToast(`Dokumentasi "${deleteTarget.title}" berhasil dihapus dari database & storage.`);
      setTimeout(() => setSuccessToast(null), 3500);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus dokumentasi: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header & Overview KPI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Galeri & Dokumentasi Kegiatan
          </h3>
          <p className="text-xs text-slate-500">
            Sistem manajemen konten foto operasional, kegiatan ekspor, kunjungan & arsip lapangan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Dokumentasi</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Dokumentasi</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{totalCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">Published di Web</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{publishedCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">Draft Tersimpan</span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">{draftCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Supabase Storage</span>
          <div className="text-xs font-bold text-slate-800 font-mono mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>bucket: documentation</span>
          </div>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, caption, atau lokasi kegiatan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Kategori</option>
            <option value="kegiatan_ekspor">Kegiatan Ekspor</option>
            <option value="kunjungan">Kunjungan</option>
            <option value="meeting">Meeting</option>
            <option value="event">Event</option>
            <option value="operasional">Aktivitas Operasional</option>
            <option value="produk">Dokumentasi Produk</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Activities Table */}
      <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Tidak ada dokumentasi ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan pencarian atau klik "+ Tambah Dokumentasi".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 w-14">Order</th>
                  <th className="py-3 px-4 w-20">Foto</th>
                  <th className="py-3 px-4">Judul & Caption Kegiatan</th>
                  <th className="py-3 px-4">Kategori & Lokasi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{item.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 relative group">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">{item.caption}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      {item.location && (
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.location}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.activity_date}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-600 hover:text-[#FF6B00] hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Dokumentasi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Dokumentasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================
          FORM MODAL: TAMBAH / EDIT DOKUMENTASI
          =================================================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan Baru'}
              </h4>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Image Upload Box with Preview */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto Dokumentasi (Disimpan di Supabase Storage) *
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/9] max-h-56 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold cursor-pointer shadow-sm">
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#FF6B00] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="font-semibold text-slate-700">
                      Klik untuk memilih file foto atau seret ke sini
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG, WebP (Maksimal 10MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kegiatan Persiapan Ekspor Cengkeh Lal Pari"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-semibold"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Caption Ringkas (Muncul di bawah judul) *
                </label>
                <input
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Persiapan dan koordinasi operasional sebelum proses pengapalan kontainer 20ft FCL."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Kegiatan (Muncul pada Lightbox Modal)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail aktivitas operasional, pihak yang terlibat, dan hasil kegiatan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              {/* Grid: Kategori & Tanggal & Lokasi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Kegiatan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="kegiatan_ekspor">Kegiatan Ekspor</option>
                    <option value="kunjungan">Kunjungan</option>
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                    <option value="operasional">Aktivitas Operasional</option>
                    <option value="produk">Dokumentasi Produk</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan *
                  </label>
                  <input
                    type="date"
                    required
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lokasi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Tanjung Priok, Jakarta"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid: Urutan Tampilan & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Urutan Tampilan (Display Order)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Publikasi *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="published">Published (Langsung Tampil di Web)</option>
                    <option value="draft">Draft (Hanya di Dashboard Admin)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-sm transition-all"
                >
                  {isSubmitting ? 'Menyimpan ke Supabase...' : isEditing ? 'Simpan Perubahan' : 'Tambah Dokumentasi'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ===================================================
          CONFIRMATION MODAL: HAPUS DOKUMENTASI
          =================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Apakah Anda yakin ingin menghapus dokumentasi ini?
              </h4>
              <p className="text-xs text-slate-600 mt-2 font-semibold">
                "{deleteTarget.title}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Data metadata dan file gambar terkait akan dihapus secara permanen dari Supabase Storage.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl shadow-xs transition-colors"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Dokumentasi'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
