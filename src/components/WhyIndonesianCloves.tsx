import React from 'react';
import { Mountain, Sun, Globe2, Compass } from 'lucide-react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface WhyProps {
  currentLang: Language;
}

export const WhyIndonesianCloves: React.FC<WhyProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const icons = [Mountain, Sun, Globe2];

  return (
    <section className="relative py-20 lg:py-28 bg-[#FFFFFF] overflow-hidden">
      {/* Background Vector: Agricultural Clove */}
      <SectionVector type="clove" className="left-[-8%] top-[10%] w-[380px] h-[380px]" opacity={0.05} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Origin Heritage</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Indonesian Terroir</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.whyIndo.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.whyIndo.subtitle}
          </p>
        </div>

        {/* 3 Origin Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {t.whyIndo.points.map((pt, idx) => {
            const IconComp = icons[idx] || Mountain;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl glass-card border border-slate-200/80 hover:border-[#FF6B00]/40 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-5">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#12151A] tracking-tight">
                    {pt.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-slate-400">
                  <span>Spice Origin Corridor #{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
