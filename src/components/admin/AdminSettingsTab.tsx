import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Database, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { SiteSettings } from '../../lib/types';
import { saveSettings, getSupabaseConfig, updateSupabaseConfig, getSupabase } from '../../lib/supabase';

interface SettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

const SUPABASE_SCHEMA_SQL = `-- PT PARTA DIRGANTARA - B2B EXPORT SUPABASE DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ADMIN ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RFQ INQUIRIES
CREATE TABLE IF NOT EXISTS public.rfq_inquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  preferred_packaging TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'CONVERTED', 'REJECTED')),
  admin_notes TEXT
);

-- 3. PRODUCTS & SPECIFICATIONS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  botanical_name TEXT,
  origin TEXT,
  form TEXT,
  grade TEXT,
  description_en TEXT,
  description_id TEXT,
  packaging TEXT,
  moq TEXT,
  availability TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_id TEXT NOT NULL,
  category TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  company_name TEXT,
  email TEXT,
  phone_whatsapp TEXT,
  office_address TEXT,
  operating_hours TEXT,
  primary_port TEXT,
  incoterms_supported TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert RFQ inquiries" ON public.rfq_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage RFQs" ON public.rfq_inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view public documents" ON public.documents FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Admins can manage documents" ON public.documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR ALL TO authenticated USING (true);`;

export const AdminSettingsTab: React.FC<SettingsTabProps> = ({ settings, onRefresh }) => {
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key);

  const [companyName, setCompanyName] = useState(settings.company_name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone_whatsapp);
  const [address, setAddress] = useState(settings.office_address);
  const [hours, setHours] = useState(settings.operating_hours);
  const [port, setPort] = useState(settings.primary_port);
  const [incoterms, setIncoterms] = useState(settings.incoterms_supported);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveAll = async () => {
    // 1. Update Supabase keys
    updateSupabaseConfig(supabaseUrl, supabaseKey);

    // 2. Save site settings
    const updated: SiteSettings = {
      ...settings,
      company_name: companyName,
      email,
      phone_whatsapp: phone,
      office_address: address,
      operating_hours: hours,
      primary_port: port,
      incoterms_supported: incoterms,
    };

    await saveSettings(updated);
    setSaveStatus('Settings and Supabase credentials saved successfully.');
    onRefresh();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Save configuration first
    updateSupabaseConfig(supabaseUrl, supabaseKey);
    const supabase = getSupabase();

    if (!supabase) {
      setIsTesting(false);
      setTestResult({
        ok: false,
        msg: 'Please enter a valid Supabase Project URL (https://...) and Anon Key.',
      });
      return;
    }

    try {
      const { data, error } = await supabase.from('rfq_inquiries').select('id').limit(1);
      setIsTesting(false);
      if (error) {
        if (error.code === '42P01') {
          setTestResult({
            ok: false,
            msg: `Connected to Supabase, but the "rfq_inquiries" table is missing. Please run the SQL schema migration script below in your Supabase SQL Editor.`,
          });
        } else {
          setTestResult({
            ok: false,
            msg: `Supabase responded: ${error.message}`,
          });
        }
      } else {
        setTestResult({
          ok: true,
          msg: 'Connection verified! Your live Supabase PostgreSQL database is online and communicating.',
        });
      }
    } catch (err: any) {
      setIsTesting(false);
      setTestResult({
        ok: false,
        msg: `Connection failed: ${err.message || 'Network error'}`,
      });
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Settings & Supabase Integration
          </h3>
          <p className="text-xs text-slate-500">
            Configure company trade desk information, database connection, and security
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] rounded-xl shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Supabase Connection Setup Box */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Supabase PostgreSQL & Auth Credentials
              </h4>
              <p className="text-xs text-slate-500">
                Connect your live Supabase project for persistent cloud records and authentication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold ${
                currentConfig.isConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {currentConfig.isConfigured ? 'Supabase Configured' : 'Using Local Persistence Bridge'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Supabase Public Anon Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Keys are safely read client-side. Service role key is NEVER requested or exposed.</span>
          </div>

          <button
            type="button"
            disabled={isTesting}
            onClick={handleTestConnection}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Connection...' : 'Test Database Connection'}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              testResult.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <span>{testResult.msg}</span>
          </div>
        )}

        {/* Database Migration SQL Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Supabase Database SQL Schema & RLS Policies (PostgreSQL)
            </span>
            <button
              type="button"
              onClick={handleCopySQL}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#FF6B00] bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Paste this script into the <strong>SQL Editor</strong> in your Supabase dashboard to instantiate tables (rfq_inquiries, products, documents, settings) and enforce secure Row Level Security policies.
          </p>
          <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto max-h-40 leading-relaxed">
            {SUPABASE_SCHEMA_SQL}
          </pre>
        </div>

      </div>

      {/* Company Contact & Operational Settings */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Company Commercial Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Registered Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Inquiry Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Commercial WhatsApp Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Export Loading Ports</label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Supported Incoterms</label>
            <input
              type="text"
              value={incoterms}
              onChange={(e) => setIncoterms(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
