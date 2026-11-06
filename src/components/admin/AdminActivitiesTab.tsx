import React, { useState } from 'react';
import {
  Plus,
  Search,
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
  X,
  Layers,
} from 'lucide-react';
import { Activity } from '../../lib/types';
import {
  createActivity,
  updateActivity,
  deleteActivity,
  uploadImage,
  BUCKET_ACTIVITY_IMAGES,
} from '../../lib/supabase';

interface ActivitiesTabProps {
  activities: Activity[];
  onRefresh: () => void;
}

export const AdminActivitiesTab: React.FC<ActivitiesTabProps> = ({
  activities,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'hidden'>('all');

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [titleEn, setTitleEn] = useState('');
  const [titleId, setTitleId] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionId, setDescriptionId] = useState('');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('kegiatan_ekspor');
  const [isPublic, setIsPublic] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Image upload handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [existingImagePath, setExistingImagePath] = useState<string>('');

  // Processing & notification states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter list
  const filtered = activities.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesVis =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && item.is_public) ||
      (visibilityFilter === 'hidden' && !item.is_public);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      (item.title_en && item.title_en.toLowerCase().includes(q)) ||
      (item.title_id && item.title_id.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q));
    return matchesCat && matchesVis && matchesQuery;
  });

  const totalCount = activities.length;
  const publicCount = activities.filter((a) => a.is_public).length;
  const hiddenCount = activities.filter((a) => !a.is_public).length;

  const resetForm = () => {
    setTitleEn('');
    setTitleId('');
    setDescriptionEn('');
    setDescriptionId('');
    setCategory('kegiatan_ekspor');
    setActivityDate(new Date().toISOString().slice(0, 10));
    setLocation('');
    setSortOrder(activities.length + 1);
    setIsPublic(true);
    setSelectedFile(null);
    setImagePreview('');
    setExistingImageUrl('');
    setExistingImagePath('');
    setFormError(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowFormModal(true);
  };

  const handleOpenEdit = (item: Activity) => {
    resetForm();
    setIsEditing(true);
    setEditingId(item.id);
    setTitleEn(item.title_en || '');
    setTitleId(item.title_id || item.title_en || '');
    setDescriptionEn(item.description_en || '');
    setDescriptionId(item.description_id || item.description_en || '');
    setCategory(item.category || 'kegiatan_ekspor');
    setActivityDate(item.activity_date);
    setLocation(item.location || '');
    setSortOrder(item.sort_order ?? 0);
    setIsPublic(item.is_public);
    setExistingImageUrl(item.image_url);
    setImagePreview(item.image_url);
    setExistingImagePath(item.image_path || '');
    setShowFormModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFormError('Format file harus berupa gambar: JPG, JPEG, PNG, atau WebP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Ukuran file maksimal 10 MB.');
        return;
      }
      setSelectedFile(file);
      setFormError(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!titleEn.trim() && !titleId.trim()) {
      setFormError('Judul kegiatan (English atau Indonesian) wajib diisi.');
      return;
    }

    if (!selectedFile && !existingImageUrl) {
      setFormError('Silakan pilih atau upload foto kegiatan.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = existingImageUrl;
      let finalImagePath = existingImagePath;

      // Upload image to Supabase Storage bucket 'activity-images'
      if (selectedFile) {
        const uploadResult = await uploadImage(BUCKET_ACTIVITY_IMAGES, selectedFile, category);
        if (!uploadResult.success) {
          setFormError('Gagal mengunggah gambar ke Supabase Storage: ' + uploadResult.error);
          setIsSubmitting(false);
          return;
        }
        finalImageUrl = uploadResult.url;
        finalImagePath = uploadResult.path;
      }

      if (isEditing && editingId) {
        const updateRes = await updateActivity(editingId, {
          title_en: titleEn.trim() || titleId.trim(),
          title_id: titleId.trim() || titleEn.trim(),
          description_en: descriptionEn.trim(),
          description_id: descriptionId.trim() || descriptionEn.trim(),
          category,
          activity_date: activityDate,
          location: location.trim(),
          image_url: finalImageUrl,
          image_path: finalImagePath,
          is_public: isPublic,
          sort_order: Number(sortOrder) || 0,
        });

        if (!updateRes.success) {
          setFormError(updateRes.error || 'Gagal memperbarui data kegiatan.');
          setIsSubmitting(false);
          return;
        }

        setSuccessToast(`Kegiatan "${titleEn || titleId}" berhasil diperbarui!`);
      } else {
        const createRes = await createActivity({
          title_en: titleEn.trim() || titleId.trim(),
          title_id: titleId.trim() || titleEn.trim(),
          description_en: descriptionEn.trim(),
          description_id: descriptionId.trim() || descriptionEn.trim(),
          category,
          activity_date: activityDate,
          location: location.trim(),
          image_url: finalImageUrl,
          image_path: finalImagePath,
          is_public: isPublic,
          sort_order: Number(sortOrder) || 0,
        });

        if (!createRes.success) {
          setFormError(createRes.error || 'Gagal menyimpan kegiatan baru.');
          setIsSubmitting(false);
          return;
        }

        setSuccessToast(`Kegiatan baru "${titleEn || titleId}" berhasil ditambahkan!`);
      }

      setTimeout(() => setSuccessToast(null), 3500);
      setShowFormModal(false);
      resetForm();
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const result = await deleteActivity(deleteTarget.id, deleteTarget.image_path);
      if (result.success) {
        setSuccessToast(`Kegiatan "${deleteTarget.title_en || deleteTarget.title_id}" berhasil dihapus dari database & storage.`);
        setTimeout(() => setSuccessToast(null), 3500);
        setDeleteTarget(null);
        onRefresh();
      } else {
        alert('Gagal menghapus kegiatan: ' + result.error);
      }
    } catch (err: any) {
      alert('Gagal menghapus kegiatan: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Activity Gallery & Trade Documentation
          </h3>
          <p className="text-xs text-slate-500">
            Kelola galeri kegiatan ekspor cengkeh, kunjungan perkebunan, sertifikasi mutu, dan dokumentasi lapangan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kegiatan</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Kegiatan</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{totalCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs bg-white">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">Publik di Web</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{publicCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs bg-white">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">Draft / Tersembunyi</span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">{hiddenCount}</div>
        </div>
        <div className="p-4 rounded-xl glass-card border border-slate-200/90 shadow-2xs bg-white">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Storage Bucket</span>
          <div className="text-xs font-bold text-slate-800 font-mono mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>bucket: activity-images</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul kegiatan atau lokasi..."
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
            <option value="kunjungan">Kunjungan Kebun</option>
            <option value="meeting">Meeting / Kemitraan</option>
            <option value="event">Pameran & Event</option>
            <option value="operasional">Aktivitas Operasional</option>
            <option value="produk">Dokumentasi Produk</option>
            <option value="lainnya">Lainnya</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="public">Publik Saja</option>
            <option value="hidden">Tersembunyi Saja</option>
          </select>
        </div>
      </div>

      {/* Activities Table */}
      <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-sm overflow-hidden bg-white">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">Belum ada kegiatan ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambahkan kegiatan baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 w-14">Urutan</th>
                  <th className="py-3 px-4 w-24">Foto</th>
                  <th className="py-3 px-4">Judul Kegiatan</th>
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
                      #{item.sort_order ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                        <img
                          src={item.image_url}
                          alt={item.title_en || item.title_id}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{item.title_en}</div>
                      <div className="text-slate-500 line-clamp-1 text-[11px] italic mt-0.5">{item.title_id}</div>
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
                          item.is_public
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.is_public ? 'Publik' : 'Tersembunyi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-600 hover:text-[#FF6B00] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Kegiatan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Kegiatan"
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
          MODAL: TAMBAH / EDIT KEGIATAN
          =================================================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Data Kegiatan Ekspor' : 'Tambah Kegiatan Ekspor Baru'}
              </h4>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
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
              {/* Image Upload Box */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto Dokumentasi Kegiatan (Supabase Storage: bucket <code>activity-images</code>) *
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[16/9] max-h-56 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-semibold cursor-pointer shadow-sm hover:bg-slate-100">
                        Ganti Foto
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
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
                      Klik untuk memilih file foto kegiatan
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      JPG, JPEG, PNG, WebP (Maksimal 10 MB)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Title Dual-Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul Kegiatan (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. 20ft Container Export Loading"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul Kegiatan (Indonesian) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleId}
                    onChange={(e) => setTitleId(e.target.value)}
                    placeholder="Contoh: Persiapan Ekspor Cengkeh Lal Pari"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-semibold"
                  />
                </div>
              </div>

              {/* Description Dual-Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Deskripsi / Caption (English)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Brief description of the activity in English..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Deskripsi / Caption (Indonesian)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionId}
                    onChange={(e) => setDescriptionId(e.target.value)}
                    placeholder="Deskripsi kegiatan dalam Bahasa Indonesia..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Category, Date, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Kegiatan *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none font-medium"
                  >
                    <option value="kegiatan_ekspor">Kegiatan Ekspor</option>
                    <option value="kunjungan">Kunjungan Kebun</option>
                    <option value="meeting">Meeting / Kemitraan</option>
                    <option value="event">Pameran & Event</option>
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

              {/* Sort Order & Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Urutan Tampilan (Sort Order)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={isPublic ? 'true' : 'false'}
                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="true">Publik (Langsung Tampil di Galeri Web)</option>
                    <option value="false">Tersembunyi (Draft Internal)</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan ke Supabase...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          CONFIRMATION MODAL: HAPUS KEGIATAN
          =================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Hapus Dokumentasi Kegiatan Ini?
              </h4>
              <p className="text-xs text-slate-700 mt-2 font-semibold">
                "{deleteTarget.title_en || deleteTarget.title_id}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Data akan dihapus dari tabel <code>activities</code> dan file gambar terkait akan dihapus dari bucket <code>activity-images</code>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
