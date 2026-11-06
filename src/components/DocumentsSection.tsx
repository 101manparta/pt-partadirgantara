import React, { useState } from 'react';
import { Download, FileText, ExternalLink, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Language, DocumentItem } from '../lib/types';
import { translations } from '../lib/translations';

interface DocumentsProps {
  currentLang: Language;
  documents: DocumentItem[];
}

export const DocumentsSection: React.FC<DocumentsProps> = ({ currentLang, documents }) => {
  const t = translations[currentLang];
  const [activeDocModal, setActiveDocModal] = useState<DocumentItem | null>(null);

  const publicDocs = documents.filter((d) => d.is_public);

  return (
    <section id="documents" className="relative py-20 lg:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Buyer Resources</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Technical & Corporate Literature</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.downloads.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.downloads.subtitle}
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-6 rounded-2xl glass-card border border-white/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded">
                    {doc.file_size}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {currentLang === 'id' ? doc.title_id : doc.title_en}
                </h3>
                <p className="text-xs text-slate-500 mt-2 font-mono truncate">
                  {doc.file_name}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setActiveDocModal(doc)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>{t.downloads.downloadBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Document Preview / Download Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
                <h4 className="text-sm font-bold text-slate-900">Document Dispatch</h4>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-3">
              <h5 className="font-bold text-slate-900 text-sm leading-snug">
                {currentLang === 'id' ? activeDocModal.title_id : activeDocModal.title_en}
              </h5>
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 font-mono">
                <div>File: {activeDocModal.file_name}</div>
                <div>Size: {activeDocModal.file_size}</div>
                <div>Format: Adobe PDF (Export Certified)</div>
              </div>
              <p className="text-xs text-slate-500">
                You are downloading an official publication from PT PARTA DIRGANTARA. Please direct commercial procurement inquiries to our export desk.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveDocModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#E65100] rounded-lg shadow-sm"
              >
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
