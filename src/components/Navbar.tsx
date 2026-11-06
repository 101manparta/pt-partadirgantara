import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Eye, ChevronDown } from 'lucide-react';
import { Language, VisualEffectMode } from '../lib/types';
import { translations } from '../lib/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  visualMode: VisualEffectMode;
  onVisualModeChange: (mode: VisualEffectMode) => void;
  onNavigateToRFQ: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  visualMode,
  onVisualModeChange,
  onNavigateToRFQ,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [effectsDropdownOpen, setEffectsDropdownOpen] = useState(false);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-2.5 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-black/[0.04] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-12">
          {/* Zone 1: Brand Wordmark / Official Uploaded Logo */}
          <a
            href="#"
            className="flex items-center shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] rounded-lg"
            aria-label="PT PARTA DIRGANTARA - Home"
          >
            <img
              src="/assets/aistudio/image_c7cccf24.png"
              alt="PT PARTA DIRGANTARA"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a
              href="#about"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.about}
            </a>
            <a
              href="#cloves"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.cloves}
            </a>
            <a
              href="#specifications"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.specs}
            </a>
            <a
              href="#sourcing"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.sourcing}
            </a>
            <a
              href="#logistics"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.logistics}
            </a>
            <a
              href="#documents"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.documents}
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap shrink-0 hover:text-[#FF6B00] transition-colors py-1"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Zone 3: Controls & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Visual Effect Mode Selector */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setEffectsDropdownOpen(!effectsDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-black/[0.03] hover:bg-black/[0.06] rounded-md transition-colors"
                title={t.nav.effects}
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize text-[11px]">
                  {visualMode === 'full-glass'
                    ? 'Glass'
                    : visualMode === 'reduced'
                    ? 'Reduced'
                    : 'Readable'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {effectsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setEffectsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-lg shadow-lg py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        onVisualModeChange('full-glass');
                        setEffectsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                        visualMode === 'full-glass'
                          ? 'text-[#FF6B00] font-semibold bg-orange-50/60'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.nav.fullGlass}</span>
                      {visualMode === 'full-glass' && <span className="text-[10px]">●</span>}
                    </button>
                    <button
                      onClick={() => {
                        onVisualModeChange('reduced');
                        setEffectsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                        visualMode === 'reduced'
                          ? 'text-[#FF6B00] font-semibold bg-orange-50/60'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.nav.reducedEffects}</span>
                      {visualMode === 'reduced' && <span className="text-[10px]">●</span>}
                    </button>
                    <button
                      onClick={() => {
                        onVisualModeChange('readable');
                        setEffectsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                        visualMode === 'readable'
                          ? 'text-[#FF6B00] font-semibold bg-orange-50/60'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.nav.highReadability}</span>
                      {visualMode === 'readable' && <span className="text-[10px]">●</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Language Selector (EN | ID) */}
            <div className="flex items-center border border-slate-200/80 rounded-md p-0.5 bg-black/[0.02]">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  currentLang === 'en'
                    ? 'bg-white text-[#FF6B00] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <span className="text-slate-300 text-xs select-none">|</span>
              <button
                type="button"
                onClick={() => onLanguageChange('id')}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  currentLang === 'id'
                    ? 'bg-white text-[#FF6B00] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Bahasa Indonesia"
              >
                ID
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onNavigateToRFQ}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              {t.nav.rfq}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-5 pt-3 pb-6 shadow-xl space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2.5 text-sm font-medium text-slate-800">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.about}
            </a>
            <a
              href="#cloves"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.cloves}
            </a>
            <a
              href="#specifications"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.specs}
            </a>
            <a
              href="#sourcing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.sourcing}
            </a>
            <a
              href="#logistics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.logistics}
            </a>
            <a
              href="#documents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.documents}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-[#FF6B00] transition-colors"
            >
              {t.nav.contact}
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{t.nav.effects}:</span>
              <div className="flex items-center gap-1">
                {(['full-glass', 'reduced', 'readable'] as VisualEffectMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onVisualModeChange(mode)}
                    className={`px-2 py-1 rounded text-[11px] capitalize ${
                      visualMode === mode
                        ? 'bg-[#FF6B00] text-white font-medium'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {mode === 'full-glass' ? 'Glass' : mode === 'reduced' ? 'Reduced' : 'Readable'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToRFQ();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] rounded-lg shadow-sm"
            >
              {t.nav.rfq}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
