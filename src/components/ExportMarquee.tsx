import React from 'react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';

interface ExportMarqueeProps {
  currentLang: Language;
}

export const ExportMarquee: React.FC<ExportMarqueeProps> = ({ currentLang }) => {
  const items = translations[currentLang].marquee;

  return (
    <div
      className="relative w-full overflow-hidden py-3.5 bg-gradient-to-r from-[#1E2229] via-[#2A303C] to-[#1E2229] border-y border-white/10 text-white select-none z-20"
      aria-label="Export capabilities marquee"
    >
      {/* Left/Right Edge Gradient Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#1E2229] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#1E2229] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track moving Right to Left */}
      <div className="flex animate-marquee-rtl items-center">
        {/* First set */}
        <div className="flex items-center shrink-0">
          {items.map((text, idx) => (
            <React.Fragment key={`set1-${idx}`}>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase px-6 sm:px-8 text-neutral-200 hover:text-white transition-colors">
                {text}
              </span>
              <span className="text-[#FF6B00] text-sm select-none" aria-hidden="true">
                ◆
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Second duplicated set for seamless infinite loop */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {items.map((text, idx) => (
            <React.Fragment key={`set2-${idx}`}>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase px-6 sm:px-8 text-neutral-200 hover:text-white transition-colors">
                {text}
              </span>
              <span className="text-[#FF6B00] text-sm select-none" aria-hidden="true">
                ◆
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
