import React from 'react';
import { ShieldCheck, Compass, CheckCircle2, Trees } from 'lucide-react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface AboutProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section id="about" className="relative py-20 lg:py-28 bg-[#F8F9FA] overflow-hidden">
      {/* Background Vector: Clove Botanical Silhouette */}
      <SectionVector type="clove" className="left-[-5%] top-[15%] w-[380px] h-[380px] lg:w-[480px] lg:h-[480px]" opacity={0.06} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-18">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Corporate Profile</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">PT PARTA DIRGANTARA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.about.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.about.subtitle}
          </p>
        </div>

        {/* Narrative & Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Narrative text */}
          <div className="lg:col-span-6 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p className="p-4 rounded-xl glass-card border border-white/80">
              {t.about.p1}
            </p>
            <p>
              {t.about.p2}
            </p>
            <p className="text-slate-600">
              {t.about.p3}
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Verified Regional Farmer Cooperatives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Transparent Batch Specifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Full Export Customs Clearance</span>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/80 p-2 glass-panel group">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src="/src/assets/images/clove_spice_plantation_1793940755065.jpg"
                  alt="Indonesian Clove Tree Plantation Terroir"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs uppercase tracking-wider text-orange-300 font-semibold mb-0.5">Origin Terroir</div>
                  <div className="text-sm sm:text-base font-bold">Volcanic Soil & Solar Curing Corridors</div>
                  <div className="text-xs text-white/80 mt-0.5">Sulawesi · Maluku (Spice Islands) · Java</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Strategic Operational Pillars Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.about.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl glass-card border border-white/80 hover:border-[#FF6B00]/40 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#FF6B00] block mb-2">
                  0{idx + 1}.
                </span>
                <h3 className="text-base font-bold text-[#12151A] tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
