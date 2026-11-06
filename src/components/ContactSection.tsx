import React from 'react';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Language, SiteSettings } from '../lib/types';
import { translations } from '../lib/translations';

interface ContactProps {
  currentLang: Language;
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactProps> = ({ currentLang, settings }) => {
  const t = translations[currentLang];

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Direct Commercial Channels</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">Jakarta Head Office</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight">
            {t.contact.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Head Office Address */}
          <div className="p-6 rounded-2xl glass-card border border-white/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t.contact.headOffice}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {settings.office_address}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-4 block">
              {t.contact.indonesia}
            </span>
          </div>

          {/* Email */}
          <div className="p-6 rounded-2xl glass-card border border-white/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t.contact.emailLabel}</h3>
              <a
                href={`mailto:${settings.email}`}
                className="text-xs sm:text-sm font-semibold text-[#E65100] hover:underline break-all"
              >
                {settings.email}
              </a>
            </div>
            <span className="text-[11px] text-slate-400 mt-4 block">
              24-hour response target
            </span>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-2xl glass-card border border-white/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t.contact.phoneLabel}</h3>
              <a
                href={`https://wa.me/${settings.phone_whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#FF6B00] transition-colors font-mono"
              >
                {settings.phone_whatsapp}
              </a>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-4 block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available for Trade Chat
            </span>
          </div>

          {/* Hours */}
          <div className="p-6 rounded-2xl glass-card border border-white/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{t.contact.hoursLabel}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                {settings.operating_hours}
              </p>
            </div>
            <span className="text-[11px] text-slate-400 mt-4 block">
              Jakarta Standard Time (WIB)
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
