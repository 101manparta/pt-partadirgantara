import React, { useState } from 'react';
import { Plus, Trash2, FileText, CheckCircle2, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';
import { DocumentItem } from '../../lib/types';
import { saveDocuments } from '../../lib/supabase';

interface DocumentsTabProps {
  documents: DocumentItem[];
  onRefresh: () => void;
}

export const AdminDocumentsTab: React.FC<DocumentsTabProps> = ({ documents, onRefresh }) => {
  const [docList, setDocList] = useState<DocumentItem[]>(documents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleId, setNewTitleId] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('spec_sheet');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');

  const handleToggleVisibility = async (id: string) => {
    const updated = docList.map((d) => (d.id === id ? { ...d, is_public: !d.is_public } : d));
    setDocList(updated);
    await saveDocuments(updated);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this trade document?')) {
      const updated = docList.filter((d) => d.id !== id);
      setDocList(updated);
      await saveDocuments(updated);
      onRefresh();
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleEn.trim()) return;

    setIsSaving(true);
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      title_en: newTitleEn.trim(),
      title_id: newTitleId.trim() || newTitleEn.trim(),
      category: newCategory,
      file_name: newFileName.trim() || 'PT_Parta_Dirgantara_Document.pdf',
      file_url: '#',
      file_size: newFileSize.trim(),
      is_public: true,
      created_at: new Date().toISOString(),
    };

    const updated = [...docList, newDoc];
    setDocList(updated);
    await saveDocuments(updated);
    setIsSaving(false);
    setShowAddModal(false);
    setNewTitleEn('');
    setNewTitleId('');
    setNewFileName('');
    setStatusMsg('Document added successfully.');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Trade Documents & Buyer Downloads
          </h3>
          <p className="text-xs text-slate-500">
            Manage official brochures, technical specification sheets, and certificates
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] rounded-xl shadow-xs hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document Entry</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docList.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {doc.file_size}
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
              <p className="text-[11px] text-slate-400 font-mono mt-2 truncate">
                {doc.file_name}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleVisibility(doc.id)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
              >
                {doc.is_public ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Make Public</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-4">Add Document Publication</h4>
            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title (English)</label>
                <input
                  type="text"
                  required
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="e.g. Phytosanitary & Export Quality Assurance Guide"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title (Indonesian)</label>
                <input
                  type="text"
                  value={newTitleId}
                  onChange={(e) => setNewTitleId(e.target.value)}
                  placeholder="e.g. Panduan Jaminan Mutu Fitosanitari & Ekspor"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="profile">Company Profile</option>
                  <option value="spec_sheet">Technical Spec Sheet</option>
                  <option value="catalog">Export Catalog / Shipping Guide</option>
                  <option value="certification">Official Certificate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Document_File.pdf"
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    placeholder="1.2 MB"
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
