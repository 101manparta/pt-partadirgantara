import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Scale, Layers } from 'lucide-react';
import { Language } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface HeroProps {
  currentLang: Language;
  onExploreCloves: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onExploreCloves, onRequestQuote }) => {
  const t = translations[currentLang];

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F8F9FA] to-[#F1F3F5]">
      {/* Subtle background Vector: Global trade routes & connection lines */}
      <SectionVector type="globe" className="right-[-8%] top-[10%] w-[550px] h-[550px] lg:w-[720px] lg:h-[720px]" opacity={0.06} />

      {/* Subtle Warm Orange Glow Refraction behind glass */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#FF6B00]/10 via-[#FF9E40]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-7">
            {/* Unboxed Metadata Tag (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase">
              <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
              <span>{t.hero.badge}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium normal-case tracking-normal">B2B Bulk Export Desk</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#12151A] leading-[1.12] tracking-tight text-balance">
              {t.hero.title}
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onExploreCloves}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#FF6B00] via-[#FF7A1A] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-md hover:shadow-lg shadow-orange-500/15 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRequestQuote}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold tracking-wide text-slate-800 bg-white/80 hover:bg-white border border-slate-200/90 rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Trust & Commodity Attributes Grid */}
            <div className="pt-4 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">{t.hero.metricOrigin}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{t.hero.metricOriginVal}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">{t.hero.metricBotanical}</span>
                <span className="text-sm font-bold text-slate-800 italic mt-0.5 block">S. aromaticum</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">{t.hero.metricMoisture}</span>
                <span className="text-sm font-bold text-slate-800 tabular-nums mt-0.5 block">{t.hero.metricMoistureVal}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">{t.hero.metricPackaging}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">Jute / PP Bags</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Liquid Glass Spec Layer */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/80 p-2 glass-panel glass-glow-orange group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="/images/hero_indonesian_cloves.jpg"
                  alt="Premium Indonesian Whole Dried Cloves (Syzygium aromaticum) by PT PARTA DIRGANTARA"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Quiet In-Image Caption */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/95 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    <span className="font-semibold tracking-wide">Lal Pari Export Quality</span>
                  </div>
                  <span className="text-white/70 text-[11px] font-mono tabular-nums">Grade A · Whole Bud</span>
                </div>
              </div>

              {/* Liquid Glass Floating Specifications Card */}
              <div className="mt-2.5 p-3.5 rounded-xl glass-card border border-white/90 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100/80 flex items-center justify-center text-[#E65100] shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Bulk Container Supply</span>
                    <span className="text-[11px] text-slate-500">20ft FCL (~11 MT) · 40ft FCL (~25 MT)</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wide">Inspection</span>
                  <span className="font-semibold text-emerald-700">Sucofindo / SGS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
