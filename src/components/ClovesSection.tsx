import React from 'react';
import { Sparkles, ArrowRight, Check, Droplets, Box, CircleDot } from 'lucide-react';
import { Language, Product } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface ClovesSectionProps {
  currentLang: Language;
  product: Product;
  onSelectProductForRFQ: (productName: string) => void;
}

export const ClovesSection: React.FC<ClovesSectionProps> = ({
  currentLang,
  product,
  onSelectProductForRFQ,
}) => {
  const t = translations[currentLang];

  return (
    <section id="cloves" className="relative py-20 lg:py-28 bg-[#FFFFFF] overflow-hidden">
      {/* Background Vector: Clove Illustration */}
      <SectionVector type="clove" className="right-[-8%] bottom-[5%] w-[420px] h-[420px]" opacity={0.05} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Core Export Commodity</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Direct Bulk Sourcing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.cloves.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.cloves.subtitle}
          </p>
        </div>

        {/* Product Showcase Card with Liquid Glass Elements */}
        <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Product Image */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-md border border-slate-100 relative">
                <img
                  src={product.image_url || '/src/assets/images/product_whole_cloves_1793940753160.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-800 shadow-xs border border-white/60">
                  Origin: Indonesia
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-white">
                  Syzygium aromaticum
                </div>
              </div>

              {/* Quick Spec Ribbon */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-100 text-slate-700">
                  <span className="text-[10px] text-orange-800 font-semibold uppercase block">Harvest Availability</span>
                  <span className="font-semibold text-slate-900">Year-Round / July Peak</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Minimum Order</span>
                  <span className="font-semibold text-slate-900">1 x 20ft FCL (~11 MT)</span>
                </div>
              </div>
            </div>

            {/* Right: Product Narrative & Specs */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#FF6B00] uppercase tracking-wider block mb-1">
                  Grade A / Lal Pari Standard
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#12151A] tracking-tight">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500 italic">
                  Botanical: {product.botanical_name} · Family: Myrtaceae
                </p>
                <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                  {currentLang === 'id' ? product.description_id : product.description_en}
                </p>
              </div>

              {/* 4 Commodity Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {t.cloves.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onSelectProductForRFQ(product.name)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-md hover:shadow-lg shadow-orange-500/15 transition-all duration-200 active:scale-[0.98]"
                >
                  <span>{t.cloves.ctaInquire}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#specifications"
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF6B00] transition-colors"
                >
                  View Full Laboratory Testing Parameters ↓
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
