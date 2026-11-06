import React, { useState } from 'react';
import { Save, CheckCircle2, Globe } from 'lucide-react';
import { SiteSettings } from '../../lib/types';
import { saveSettings } from '../../lib/supabase';

interface ContentTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminContentTab: React.FC<ContentTabProps> = ({ settings, onRefresh }) => {
  const [heroTitleEn, setHeroTitleEn] = useState(settings.hero_title_en);
  const [heroTitleId, setHeroTitleId] = useState(settings.hero_title_id);
  const [heroSubEn, setHeroSubEn] = useState(settings.hero_subtitle_en);
  const [heroSubId, setHeroSubId] = useState(settings.hero_subtitle_id);
  const [aboutEn, setAboutEn] = useState(settings.about_text_en);
  const [aboutId, setAboutId] = useState(settings.about_text_id);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMsg(null);

    const updated: SiteSettings = {
      ...settings,
      hero_title_en: heroTitleEn,
      hero_title_id: heroTitleId,
      hero_subtitle_en: heroSubEn,
      hero_subtitle_id: heroSubId,
      about_text_en: aboutEn,
      about_text_id: aboutId,
    };

    const ok = await saveSettings(updated);
    setIsSaving(false);

    if (ok) {
      setStatusMsg('Public website editorial content updated successfully.');
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Website Content & Editorial Copy
          </h3>
          <p className="text-xs text-slate-500">
            Edit public headlines and narrative text for English and Indonesian languages
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Publish Content Changes'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Hero Section Copy */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Hero Section Copy (Bilingual)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Headline (English)
            </label>
            <input
              type="text"
              value={heroTitleEn}
              onChange={(e) => setHeroTitleEn(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Headline (Bahasa Indonesia)
            </label>
            <input
              type="text"
              value={heroTitleId}
              onChange={(e) => setHeroTitleId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supporting Value Proposition (English)
            </label>
            <textarea
              rows={3}
              value={heroSubEn}
              onChange={(e) => setHeroSubEn(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supporting Value Proposition (Bahasa Indonesia)
            </label>
            <textarea
              rows={3}
              value={heroSubId}
              onChange={(e) => setHeroSubId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* About Company Copy */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          About Company Overview
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              About Description (English)
            </label>
            <textarea
              rows={4}
              value={aboutEn}
              onChange={(e) => setAboutEn(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              About Description (Bahasa Indonesia)
            </label>
            <textarea
              rows={4}
              value={aboutId}
              onChange={(e) => setAboutId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
