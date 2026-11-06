import React from 'react';
import { Ship, Anchor, FileCheck, CheckCircle2, PackageCheck, Box } from 'lucide-react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface LogisticsProps {
  currentLang: Language;
}

export const LogisticsSection: React.FC<LogisticsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="logistics" className="relative py-20 lg:py-28 bg-[#FFFFFF] overflow-hidden">
      {/* Background Vector: Container Ship */}
      <SectionVector type="ship" className="right-[-5%] top-[12%] w-[480px] h-[280px] lg:w-[620px] lg:h-[360px]" opacity={0.06} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Commercial Execution</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Global Ocean Freight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.logistics.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.logistics.subtitle}
          </p>
        </div>

        {/* 8-Step Export Flow List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.logistics.steps.map((stepStr, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl glass-card border border-slate-200/80 shadow-xs hover:border-[#FF6B00]/40 transition-colors flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[#E65100] text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {stepStr.replace(/^\d+\.\s*/, '')}
              </p>
            </div>
          ))}
        </div>

        {/* Container Loading & Documentation Bento Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Container Specifications */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#E65100]">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.logistics.containerInfo.title}
                </h3>
                <span className="text-xs text-slate-500 font-mono">FCL Ocean Shipping</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                <Box className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">20ft Dry Container (FCL)</strong>
                  <span className="text-slate-600 font-mono text-xs tabular-nums">11.0 to 12.0 Metric Tons (~220–240 bags of 50kg)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                <Box className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">40ft Dry High Cube (FCL)</strong>
                  <span className="text-slate-600 font-mono text-xs tabular-nums">24.0 to 26.0 Metric Tons (~480–520 bags of 50kg)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
                <Anchor className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Primary Loading Ports</strong>
                  <span className="text-slate-600 font-mono text-xs">Port of Tanjung Priok (Jakarta) / Tanjung Perak (Surabaya)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Documentation Accompanying Shipments */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Standard Export Documentation
                </h3>
                <span className="text-xs text-slate-500 font-mono">Customs & Regulatory Clearances</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Government Phytosanitary Certificate (Indonesian Quarantine Agency)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Certificate of Origin (Form A / COO / ICC)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Official Fumigation Certificate (Phosphine / Methyl Bromide)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Clean on Board Ocean Bill of Lading (B/L)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Commercial Invoice, Packing List & Weight Verification</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Independent Surveyor Inspection (SGS / Sucofindo) upon contract</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
