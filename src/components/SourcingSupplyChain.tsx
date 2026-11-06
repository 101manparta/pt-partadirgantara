import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Info } from 'lucide-react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface SourcingProps {
  currentLang: Language;
}

export const SourcingSupplyChain: React.FC<SourcingProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="sourcing" className="relative py-20 lg:py-28 bg-[#F8F9FA] overflow-hidden">
      {/* Background Vector: Container Truck */}
      <SectionVector type="truck" className="right-[-5%] top-[10%] w-[450px] h-[260px] lg:w-[560px] lg:h-[320px]" opacity={0.06} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Traceability Framework</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Direct Farm Gate to Port</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.sourcing.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.sourcing.subtitle}
          </p>
        </div>

        {/* 6-Step Visual Supply Chain Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {t.sourcing.steps.map((st, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl glass-card border border-white/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#FF6B00] px-2 py-0.5 rounded bg-orange-50 border border-orange-100">
                    STEP {st.step}
                  </span>
                  {idx < 5 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#12151A] tracking-tight">
                  {st.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Processing & Inspection Facility Photo Spotlight */}
        <div className="mt-12 rounded-2xl glass-panel border border-slate-200/90 p-5 sm:p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-slate-100">
                <img
                  src="/images/export_quality_sorting.jpg"
                  alt="Quality control and export packing facility"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
                Food-Grade Inspection Standards
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Controlled Post-Harvest Moisture & Extraneous Sifting
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Prior to container stuffing, our whole cloves undergo mechanical separation to eradicate debris, field sand, and defective buds. Moisture readings are logged using calibrated testing probes, ensuring each lot meets contract parameters.
              </p>

              {/* Verified Careful Language Disclaimer as required by Section 18 */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-100/90 flex items-start gap-3 text-xs text-slate-700">
                <Info className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <p className="italic font-medium">
                  "{t.sourcing.notice}"
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
