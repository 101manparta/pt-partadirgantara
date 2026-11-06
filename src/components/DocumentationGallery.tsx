import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Grid,
  ArrowUpRight,
} from 'lucide-react';
import { Language, Activity } from '../lib/types';
import { translations } from '../lib/translations';
import { SectionVector } from './SectionVectors';

interface GalleryProps {
  currentLang: Language;
  activities: Activity[];
}

export const DocumentationGallery: React.FC<GalleryProps> = ({ currentLang, activities }) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'stream' | 'grid'>('stream');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter only public activities
  const publishedList = useMemo(() => {
    return activities.filter((act) => act.is_public !== false);
  }, [activities]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return publishedList;
    return publishedList.filter((act) => act.category === selectedCategory);
  }, [publishedList, selectedCategory]);

  // Split into 2 rows for dual opposing horizontal streams
  const row1 = useMemo(() => {
    if (filtered.length <= 2) return filtered;
    return filtered.filter((_, idx) => idx % 2 === 0);
  }, [filtered]);

  const row2 = useMemo(() => {
    if (filtered.length <= 2) return filtered;
    return filtered.filter((_, idx) => idx % 2 === 1);
  }, [filtered]);

  // Handle keyboard navigation in Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filtered.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const getCategoryLabel = (cat: string) => {
    const categoriesMap: Record<string, string> = t.documentation.categories as any;
    return categoriesMap[cat] || cat.replace(/_/g, ' ');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getItemTitle = (item: Activity) => {
    if (currentLang === 'id') {
      return item.title_id || item.title_en || (item as any).title || '';
    }
    return item.title_en || item.title_id || (item as any).title || '';
  };

  const getItemDescription = (item: Activity) => {
    if (currentLang === 'id') {
      return item.description_id || item.description_en || (item as any).caption || '';
    }
    return item.description_en || item.description_id || (item as any).caption || '';
  };

  return (
    <section id="gallery" className="relative py-20 lg:py-28 bg-[#FFFFFF] overflow-hidden">
      {/* Background Vector: Cargo Aircraft / Logistics */}
      <SectionVector type="plane" className="right-[-6%] top-[8%] w-[450px] h-[280px]" opacity={0.05} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
              <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
              <span>{t.documentation.tag}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium normal-case tracking-normal">PT PARTA DIRGANTARA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
              {t.documentation.title}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
              {t.documentation.subtitle}
            </p>
          </div>

          {/* View mode toggle (Stream vs Grid) */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('stream')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'stream'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{t.documentation.scrollMode}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{t.documentation.gridMode}</span>
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#FF6B00] to-[#E65100] text-white border-transparent font-semibold shadow-xs'
                : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {t.documentation.filterAll}
          </button>
          {Object.entries(t.documentation.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === key
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#E65100] text-white border-transparent font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {label as string}
            </button>
          ))}
        </div>

      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 px-4 rounded-2xl glass-panel border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">{t.documentation.emptyState}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{t.documentation.emptySub}</p>
          </div>
        </div>
      ) : viewMode === 'stream' ? (
        /* ===================================================
           MODE A: DYNAMIC DUAL-TRACK OPPOSING SCROLL STREAM
           - Row 1: Left to Right (animate-marquee-ltr)
           - Row 2: Right to Left (animate-marquee-rtl)
           - Pauses on hover
           =================================================== */
        <div className="space-y-6 select-none">
          
          {/* Track 1: Left to Right */}
          <div className="relative w-full overflow-hidden py-2">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-ltr flex items-center gap-5">
              {[...row1, ...row1, ...row1, ...row1].map((item, idx) => (
                <div
                  key={`r1-${item.id}-${idx}`}
                  onClick={() => {
                    const originalIdx = filtered.findIndex((x) => x.id === item.id);
                    setLightboxIndex(originalIdx >= 0 ? originalIdx : 0);
                  }}
                  className={`w-[320px] sm:w-[380px] shrink-0 rounded-2xl glass-panel border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group bg-white ${
                    idx % 2 === 0 ? 'animate-float-down' : 'animate-float-up'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.image_url}
                      alt={getItemTitle(item)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold text-[#E65100] uppercase tracking-wide shadow-xs">
                      {getCategoryLabel(item.category)}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-mono mb-1">
                        <Calendar className="w-3 h-3 text-[#FF6B00]" />
                        <span>{formatDate(item.activity_date)}</span>
                      </div>
                      <h4 className="text-sm font-bold leading-snug line-clamp-1 drop-shadow-xs">
                        {getItemTitle(item)}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {getItemDescription(item)}
                    </p>
                    {item.location && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Right to Left */}
          <div className="relative w-full overflow-hidden py-2">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-rtl flex items-center gap-5">
              {[...row2, ...row2, ...row2, ...row2].map((item, idx) => (
                <div
                  key={`r2-${item.id}-${idx}`}
                  onClick={() => {
                    const originalIdx = filtered.findIndex((x) => x.id === item.id);
                    setLightboxIndex(originalIdx >= 0 ? originalIdx : 0);
                  }}
                  className={`w-[320px] sm:w-[380px] shrink-0 rounded-2xl glass-panel border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group bg-white ${
                    idx % 2 === 0 ? 'animate-float-up' : 'animate-float-down'
                  }`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.image_url}
                      alt={getItemTitle(item)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold text-[#E65100] uppercase tracking-wide shadow-xs">
                      {getCategoryLabel(item.category)}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-mono mb-1">
                        <Calendar className="w-3 h-3 text-[#FF6B00]" />
                        <span>{formatDate(item.activity_date)}</span>
                      </div>
                      <h4 className="text-sm font-bold leading-snug line-clamp-1 drop-shadow-xs">
                        {getItemTitle(item)}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {getItemDescription(item)}
                    </p>
                    {item.location && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* ===================================================
           MODE B: EDITORIAL ARCHIVE GRID VIEW
           =================================================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="rounded-2xl glass-panel border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group bg-white"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
                    <img
                      src={item.image_url}
                      alt={getItemTitle(item)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold text-[#E65100] uppercase tracking-wide">
                      {getCategoryLabel(item.category)}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>{formatDate(item.activity_date)}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {getItemTitle(item)}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {getItemDescription(item)}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {item.location ? (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[200px]">
                      <MapPin className="w-3 h-3 text-[#FF6B00] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">PT PARTA DIRGANTARA</span>
                  )}
                  <span className="inline-flex items-center gap-1 font-semibold text-[#FF6B00] group-hover:translate-x-0.5 transition-transform">
                    <span>{t.documentation.viewPhoto}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================
          LIGHTBOX MODAL
          =================================================== */}
      {currentItem && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setLightboxIndex(null)}
          />

          <div className="relative z-10 bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-white/20 flex flex-col overflow-hidden">
            {/* Top Modal Header */}
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-orange-100 text-[#E65100] font-bold uppercase text-[10px]">
                  {getCategoryLabel(currentItem.category)}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {t.documentation.lightboxCounter} {lightboxIndex + 1} {t.documentation.of} {filtered.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                  title={t.documentation.closeLightbox}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="relative bg-slate-950 flex items-center justify-center min-h-[300px] sm:min-h-[420px] max-h-[55vh]">
              <img
                src={currentItem.image_url}
                alt={getItemTitle(currentItem)}
                className="max-h-[55vh] w-auto max-w-full object-contain mx-auto"
                referrerPolicy="no-referrer"
              />

              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all focus:outline-none cursor-pointer"
                  title={t.documentation.prevPhoto}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null ? (prev + 1) % filtered.length : 0
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all focus:outline-none cursor-pointer"
                  title={t.documentation.nextPhoto}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Details Content */}
            <div className="p-6 sm:p-8 space-y-4 bg-white">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {getItemTitle(currentItem)}
                </h3>
              </div>

              {getItemDescription(currentItem) && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {getItemDescription(currentItem)}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>{formatDate(currentItem.activity_date)}</span>
                  </span>
                  {currentItem.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>{currentItem.location}</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  PT PARTA DIRGANTARA B2B ARCHIVES
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
