import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit2,
  Upload,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react';
import { DocumentItem } from '../../lib/types';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  uploadDocument,
  formatBytes,
} from '../../lib/supabase';

interface DocumentsTabProps {
  documents: DocumentItem[];
  onRefresh: () => void;
}

export const AdminDocumentsTab: React.FC<DocumentsTabProps> = ({ documents, onRefresh }) => {
  const [docList, setDocList] = useState<DocumentItem[]>(documents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  // Form states for Add/Edit
  const [titleEn, setTitleEn] = useState('');
  const [titleId, setTitleId] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('spec_sheet');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Action status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keep docList in sync when parent refreshes
  React.useEffect(() => {
    setDocList(documents);
  }, [documents]);

  const resetForm = () => {
    setTitleEn('');
    setTitleId('');
    setCategory('spec_sheet');
    setIsPublic(true);
    setSelectedFile(null);
    setErrorMessage(null);
    setEditingDoc(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    resetForm();
    setEditingDoc(doc);
    setTitleEn(doc.title_en);
    setTitleId(doc.title_id || doc.title_en);
    setCategory(doc.category);
    setIsPublic(doc.is_public);
    setShowEditModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExt = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      if (!validExtensions.includes(fileExt)) {
        setErrorMessage('File harus bertipe PDF, DOC, atau DOCX.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (doc: DocumentItem) => {
    const updatedStatus = !doc.is_public;
    const result = await updateDocument(doc.id, { is_public: updatedStatus });
    if (result.success) {
      setDocList((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, is_public: updatedStatus } : d))
      );
      setSuccessToast(`Visibilitas dokumen "${doc.title_en}" diubah menjadi ${updatedStatus ? 'Publik' : 'Tersembunyi'}.`);
      setTimeout(() => setSuccessToast(null), 3000);
      onRefresh();
    } else {
      alert('Gagal mengubah visibilitas dokumen: ' + result.error);
    }
  };

  // Handle Create Document
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!titleEn.trim()) {
      setErrorMessage('Judul dokumen dalam Bahasa Inggris wajib diisi.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Silakan pilih file dokumen (PDF/DOC/DOCX) untuk diunggah ke Supabase Storage.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload the real file to Supabase Storage bucket 'documents'
      const uploadRes = await uploadDocument(selectedFile);
      if (!uploadRes.success) {
        setErrorMessage(uploadRes.error || 'Gagal mengunggah file ke Supabase Storage.');
        setIsSubmitting(false);
        return;
      }

      // 2. Insert metadata into Supabase 'documents' table
      const createRes = await createDocument({
        title_en: titleEn.trim(),
        title_id: titleId.trim() || titleEn.trim(),
        category,
        file_name: uploadRes.fileName,
        file_url: uploadRes.url,
        storage_path: uploadRes.path,
        file_size: uploadRes.fileSize,
        is_public: isPublic,
      });

      if (!createRes.success) {
        setErrorMessage(createRes.error || 'Gagal menyimpan catatan dokumen ke database.');
        setIsSubmitting(false);
        return;
      }

      setSuccessToast(`Dokumen "${titleEn}" berhasil diunggah ke Supabase Storage & Database.`);
      setTimeout(() => setSuccessToast(null), 3500);
      setShowAddModal(false);
      resetForm();
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan teknis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Document
  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    setErrorMessage(null);

    if (!titleEn.trim()) {
      setErrorMessage('Judul dokumen (English) wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalUrl = editingDoc.file_url;
      let finalPath = editingDoc.storage_path;
      let finalName = editingDoc.file_name;
      let finalSize = editingDoc.file_size;

      // If a replacement file was chosen, upload to Supabase Storage
      if (selectedFile) {
        const uploadRes = await uploadDocument(selectedFile);
        if (!uploadRes.success) {
          setErrorMessage(uploadRes.error || 'Gagal mengunggah file baru.');
          setIsSubmitting(false);
          return;
        }
        finalUrl = uploadRes.url;
        finalPath = uploadRes.path;
        finalName = uploadRes.fileName;
        finalSize = uploadRes.fileSize;
      }

      const updateRes = await updateDocument(editingDoc.id, {
        title_en: titleEn.trim(),
        title_id: titleId.trim() || titleEn.trim(),
        category,
        is_public: isPublic,
        file_url: finalUrl,
        storage_path: finalPath,
        file_name: finalName,
        file_size: finalSize,
      });

      if (!updateRes.success) {
        setErrorMessage(updateRes.error || 'Gagal memperbarui dokumen.');
        setIsSubmitting(false);
        return;
      }

      setSuccessToast(`Dokumen "${titleEn}" berhasil diperbarui.`);
      setTimeout(() => setSuccessToast(null), 3500);
      setShowEditModal(false);
      resetForm();
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan teknis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Document
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const result = await deleteDocument(deleteTarget.id, deleteTarget.storage_path);
      if (result.success) {
        setSuccessToast(`Dokumen "${deleteTarget.title_en}" berhasil dihapus dari database & storage.`);
        setTimeout(() => setSuccessToast(null), 3500);
        setDeleteTarget(null);
        onRefresh();
      } else {
        alert('Gagal menghapus dokumen: ' + result.error);
      }
    } catch (err: any) {
      alert('Gagal menghapus dokumen: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Trade Documents & Buyer Downloads
          </h3>
          <p className="text-xs text-slate-500">
            Katalog ekspor, lembar spesifikasi teknis (COA), sertifikat phytosanitary, dan panduan pengapalan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Dokumen Baru</span>
        </button>
      </div>

      {/* Storage info pill */}
      <div className="flex items-center gap-2 text-xs p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-[#E65100]">
        <FileCheck className="w-4 h-4 shrink-0" />
        <span className="font-medium">
          Semua file dokumen diunggah dan disimpan secara nyata di Supabase Storage bucket <code>documents</code>.
        </span>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docList.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow bg-white"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {doc.file_size || 'PDF'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.is_public ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {doc.is_public ? 'Public' : 'Hidden'}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {doc.title_en}
              </h4>
              <p className="text-xs text-slate-500 mt-1 italic">
                {doc.title_id}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="truncate max-w-[180px]">{doc.file_name}</span>
                {doc.file_url && doc.file_url !== '#' && (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF6B00] hover:underline flex items-center gap-0.5 font-sans font-semibold shrink-0"
                  >
                    <span>Buka File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleVisibility(doc)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                {doc.is_public ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Sembunyikan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Jadikan Publik</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="text-slate-600 hover:text-[#FF6B00] p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit Dokumen"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(doc)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================================================
          MODAL: ADD DOCUMENT (REAL FILE UPLOAD)
          =================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Upload Dokumen Ekspor Baru</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              {/* File Upload Box */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  File Dokumen (.pdf, .doc, .docx) *
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#FF6B00] rounded-xl p-5 text-center bg-slate-50/50 transition-colors">
                  {selectedFile ? (
                    <div className="space-y-1">
                      <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="font-bold text-slate-800">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Ukuran: {formatBytes(selectedFile.size)}
                      </p>
                      <label className="inline-block mt-2 text-[#FF6B00] font-semibold hover:underline cursor-pointer">
                        Ganti File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="font-semibold text-slate-700 block">
                        Pilih file dokumen untuk diupload ke Supabase Storage
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        PDF, DOC, DOCX (Maksimal 25MB)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Dokumen (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Phytosanitary & Export Quality Assurance Guide"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Dokumen (Indonesian)
                </label>
                <input
                  type="text"
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="e.g. Panduan Jaminan Mutu Fitosanitari & Ekspor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="profile">Company Profile</option>
                    <option value="spec_sheet">Technical Spec Sheet</option>
                    <option value="catalog">Export Catalog / Shipping Guide</option>
                    <option value="certification">Official Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Visibilitas</label>
                  <select
                    value={isPublic ? 'true' : 'false'}
                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="true">Publik (Dapat diunduh pembeli)</option>
                    <option value="false">Tersembunyi (Hanya internal)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Mengunggah ke Supabase...' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL: EDIT DOCUMENT (WITH FILE REPLACEMENT)
          =================================================== */}
      {showEditModal && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Edit Dokumen Publikasi</h4>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateDocument} className="space-y-4 text-xs">
              {/* Existing file info & optional replacement */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-700 block">File Saat Ini:</span>
                <p className="font-mono text-slate-600 truncate">{editingDoc.file_name} ({editingDoc.file_size})</p>
                <div>
                  <label className="inline-block text-[#FF6B00] font-semibold hover:underline cursor-pointer">
                    {selectedFile ? `Ganti dengan: ${selectedFile.name}` : 'Ganti dengan File Baru...'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Dokumen (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Dokumen (Indonesian)
                </label>
                <input
                  type="text"
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="profile">Company Profile</option>
                    <option value="spec_sheet">Technical Spec Sheet</option>
                    <option value="catalog">Export Catalog / Shipping Guide</option>
                    <option value="certification">Official Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Visibilitas</label>
                  <select
                    value={isPublic ? 'true' : 'false'}
                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="true">Publik (Dapat diunduh pembeli)</option>
                    <option value="false">Tersembunyi (Hanya internal)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-xl shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          CONFIRMATION MODAL: DELETE DOCUMENT
          =================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Hapus Dokumen Ekspor Ini?
              </h4>
              <p className="text-xs text-slate-700 mt-2 font-semibold">
                "{deleteTarget.title_en}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Catatan database dan file dokumen terkait di Supabase Storage bucket <code>documents</code> akan dihapus secara permanen.
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
