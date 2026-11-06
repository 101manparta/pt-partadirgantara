import React from 'react';
import { Language, SiteSettings } from '../lib/types';
import { translations } from '../lib/translations';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, settings }) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#12151A] text-slate-300 pt-16 pb-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#" className="inline-block bg-white/95 p-2 rounded-xl shadow-xs">
              <img
                src="/assets/aistudio/image_c7cccf24.png"
                alt="PT PARTA DIRGANTARA"
                className="h-10 sm:h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>
            <div className="pt-1 flex items-center gap-3 text-slate-400 text-xs">
              <span>Origin: Indonesia</span>
              <span>·</span>
              <span>Primary Port: Tanjung Priok</span>
              <span>·</span>
              <span>Syzygium aromaticum</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a href="#about" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#cloves" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.cloves}
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.specs}
                </a>
              </li>
              <li>
                <a href="#sourcing" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.sourcing}
                </a>
              </li>
              <li>
                <a href="#logistics" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.logistics}
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.documents}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF6B00] transition-colors">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Export Commercial Information */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Commercial Export Operations
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {settings.office_address}
            </p>
            <div className="pt-1 space-y-1 text-xs">
              <div className="flex gap-2">
                <span className="text-slate-500">Inquiry:</span>
                <span className="text-slate-300 font-mono">{settings.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="text-slate-300 font-mono">{settings.phone_whatsapp}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-500">Incoterms:</span>
                <span className="text-slate-300">{settings.incoterms_supported}</span>
              </div>
            </div>

            <div className="pt-3">
              <span className="text-slate-500 text-[11px] block mb-1">Language:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-1 rounded text-xs ${
                    currentLang === 'en' ? 'bg-[#FF6B00] text-white font-semibold' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  onClick={() => onLanguageChange('id')}
                  className={`px-2 py-1 rounded text-xs ${
                    currentLang === 'id' ? 'bg-[#FF6B00] text-white font-semibold' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  Bahasa Indonesia (ID)
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p className="max-w-2xl text-left">
            {t.footer.legalDisclaimer}
          </p>
          <p className="whitespace-nowrap">
            {t.footer.copyright}
          </p>
        </div>

      </div>
    </footer>
  );
};
