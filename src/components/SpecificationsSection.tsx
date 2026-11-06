import React, { useState } from 'react';
import { Download, Printer, CheckCircle, FileText, Info } from 'lucide-react';
import { Language, ProductSpec } from '../lib/types';
import { translations } from '../lib/translations';

interface SpecificationsProps {
  currentLang: Language;
  specs: ProductSpec[];
}

export const SpecificationsSection: React.FC<SpecificationsProps> = ({ currentLang, specs }) => {
  const t = translations[currentLang];
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="specifications" className="relative py-20 lg:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
              <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
              <span>Technical Data</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium normal-case tracking-normal">Export Grade Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
              {t.specs.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              {t.specs.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <FileText className="w-4 h-4 text-[#FF6B00]" />
              <span>{t.specs.downloadButton}</span>
            </button>
          </div>
        </div>

        {/* Specifications Table with Liquid Glass Styling */}
        <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6 sm:px-8 w-1/3">{t.specs.tableHeaderParam}</th>
                  <th className="py-4 px-6 sm:px-8 w-1/3">{t.specs.tableHeaderStandard}</th>
                  <th className="py-4 px-6 sm:px-8 w-1/3">{t.specs.tableHeaderMethod}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {specs.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-orange-50/20 transition-colors"
                  >
                    <td className="py-3.5 px-6 sm:px-8 font-semibold text-slate-900">
                      {currentLang === 'id' ? item.parameter_id : item.parameter_en}
                    </td>
                    <td className="py-3.5 px-6 sm:px-8 font-medium text-slate-700 font-mono tabular-nums">
                      {item.standard_value}
                    </td>
                    <td className="py-3.5 px-6 sm:px-8 text-slate-500 font-mono text-xs">
                      {item.test_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200/70 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.specs.note}
            </p>
          </div>
        </div>

      </div>

      {/* Printable Technical Spec Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/image_c7cccf24.png"
                  alt="PT PARTA DIRGANTARA"
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Technical Data Sheet</h3>
                  <p className="text-xs text-slate-500">Ref: PTPD-SPEC-CLV-2026</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="py-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Commodity</span>
                  <span className="font-bold text-slate-900">Indonesian Whole Dried Cloves</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Botanical Verification</span>
                  <span className="italic font-bold text-slate-900">Syzygium aromaticum</span>
                </div>
              </div>

              <table className="w-full text-left border text-xs">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b">
                    <th className="p-2">Parameter</th>
                    <th className="p-2">Specification Limit</th>
                    <th className="p-2">Standard Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {specs.map((s, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-sans font-semibold text-slate-800">{currentLang === 'id' ? s.parameter_id : s.parameter_en}</td>
                      <td className="p-2 text-slate-700">{s.standard_value}</td>
                      <td className="p-2 text-slate-500 text-[11px]">{s.test_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-[11px] text-slate-500 pt-2">
                This document is certified by the Technical & Export Quality Division of PT PARTA DIRGANTARA for international sales contracting.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
