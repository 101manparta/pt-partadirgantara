import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Images,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  ShieldCheck,
  Inbox,
  Package,
  FileEdit,
  Layers,
} from 'lucide-react';
import { RFQInquiry, Product, DocumentItem, SiteSettings, Activity } from '../../lib/types';
import {
  getSupabaseConfig,
  fetchRFQs,
  fetchProducts,
  fetchDocuments,
  fetchSettings,
  fetchActivities,
} from '../../lib/supabase';
import { AdminAuth } from './AdminAuth';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminActivitiesTab } from './AdminActivitiesTab';
import { AdminMediaLibraryTab } from './AdminMediaLibraryTab';
import { AdminInquiriesTab } from './AdminInquiriesTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminDocumentsTab } from './AdminDocumentsTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminPortalProps {
  onExitToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitToWebsite }) => {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documentation' | 'media' | 'content' | 'settings'>('documentation');
  const [contentSubTab, setContentSubTab] = useState<'inquiries' | 'products' | 'documents' | 'editorial'>('inquiries');

  const [rfqs, setRfqs] = useState<RFQInquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session (strictly manparta0101@gmail.com)
  useEffect(() => {
    const raw = sessionStorage.getItem('ptpd_admin_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.email?.toLowerCase() === 'manparta0101@gmail.com') {
          setAdminUser(parsed);
        } else {
          sessionStorage.removeItem('ptpd_admin_session');
          setAdminUser(null);
        }
      } catch (e) {
        sessionStorage.removeItem('ptpd_admin_session');
      }
    }
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [r, p, d, s, act] = await Promise.all([
        fetchRFQs(),
        fetchProducts(),
        fetchDocuments(),
        fetchSettings(),
        fetchActivities(false),
      ]);
      setRfqs(r);
      setProducts(p);
      setDocuments(d);
      setSettings(s);
      setActivities(act);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadAllData();
    }
  }, [adminUser]);

  const handleAuthenticated = (user: { email: string; role: string }) => {
    sessionStorage.setItem('ptpd_admin_session', JSON.stringify(user));
    setAdminUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ptpd_admin_session');
    setAdminUser(null);
  };

  if (!adminUser) {
    return <AdminAuth onAuthenticated={handleAuthenticated} onExitToWebsite={onExitToWebsite} />;
  }

  const { isConfigured } = getSupabaseConfig();
  const newRFQsCount = rfqs.filter((r) => r.status === 'NEW').length;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1E2229] flex flex-col font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_c7cccf24.png"
                alt="PT PARTA DIRGANTARA"
                className="h-9 sm:h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  CMS Admin Portal & Trade Desk
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  PT PARTA DIRGANTARA B2B Platform
                </span>
              </div>
            </div>

            {/* Status Pills & Actions */}
            <div className="flex items-center gap-3">
              {/* Supabase Status Pill */}
              <div
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                  isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                title="Supabase Database & Storage Status"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isConfigured ? 'Supabase Connected' : 'Local Storage Sync'}</span>
              </div>

              {/* User Email Pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-mono">
                <ShieldCheck className="w-3 h-3 text-[#FF6B00]" />
                <span className="truncate max-w-[150px]">{adminUser.email}</span>
              </div>

              {/* Return to Public Website */}
              <button
                onClick={onExitToWebsite}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
                title="Lihat Website Publik"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website Publik</span>
              </button>

              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                title="Keluar / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>

          </div>

          {/* 5 Main Admin Tabs Bar as specified in Section 4 */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs font-semibold no-scrollbar">
            
            {/* 1. DASHBOARD */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>DASHBOARD</span>
            </button>

            {/* 2. GALERI & DOKUMENTASI (Fokus Utama CMS) */}
            <button
              onClick={() => setActiveTab('documentation')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'documentation'
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#E65100] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-orange-50/60 font-bold'
              }`}
            >
              <Images className="w-3.5 h-3.5" />
              <span>GALERI & DOKUMENTASI</span>
              {activities.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'documentation' ? 'bg-white/20 text-white' : 'bg-orange-100 text-[#E65100]'
                }`}>
                  {activities.length}
                </span>
              )}
            </button>

            {/* 3. MEDIA LIBRARY */}
            <button
              onClick={() => setActiveTab('media')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'media'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>MEDIA LIBRARY</span>
            </button>

            {/* 4. CONTENT MANAGEMENT */}
            <button
              onClick={() => setActiveTab('content')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CONTENT MANAGEMENT</span>
              {newRFQsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF6B00] text-white font-mono">
                  {newRFQsCount} RFQ
                </span>
              )}
            </button>

            {/* 5. WEBSITE SETTINGS */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>WEBSITE SETTINGS</span>
            </button>

          </nav>

        </div>
      </header>

      {/* Main Admin Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-mono">Menyelaraskan data dari database Supabase...</p>
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <AdminDashboardTab
                rfqs={rfqs}
                onNavigateToTab={(tabId) => {
                  if (tabId === 'inquiries') {
                    setActiveTab('content');
                    setContentSubTab('inquiries');
                  } else {
                    setActiveTab(tabId as any);
                  }
                }}
              />
            )}

            {/* 2. GALERI & DOKUMENTASI (Fokus utama CMS) */}
            {activeTab === 'documentation' && (
              <AdminActivitiesTab activities={activities} onRefresh={loadAllData} />
            )}

            {/* 3. MEDIA LIBRARY */}
            {activeTab === 'media' && <AdminMediaLibraryTab />}

            {/* 4. CONTENT MANAGEMENT (Suite for RFQs, Products, Documents, Editorial) */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Content Sub-tab Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold">
                  <button
                    onClick={() => setContentSubTab('inquiries')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      contentSubTab === 'inquiries'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Inquiries & RFQ ({rfqs.length})</span>
                  </button>

                  <button
                    onClick={() => setContentSubTab('products')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      contentSubTab === 'products'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Produk & Spesifikasi</span>
                  </button>

                  <button
                    onClick={() => setContentSubTab('documents')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      contentSubTab === 'documents'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dokumen Unduhan ({documents.length})</span>
                  </button>

                  <button
                    onClick={() => setContentSubTab('editorial')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      contentSubTab === 'editorial'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Konten Teks Website</span>
                  </button>
                </div>

                {/* Subtab contents */}
                {contentSubTab === 'inquiries' && (
                  <AdminInquiriesTab rfqs={rfqs} onRefresh={loadAllData} />
                )}
                {contentSubTab === 'products' && (
                  <AdminProductsTab products={products} onRefresh={loadAllData} />
                )}
                {contentSubTab === 'documents' && (
                  <AdminDocumentsTab documents={documents} onRefresh={loadAllData} />
                )}
                {contentSubTab === 'editorial' && settings && (
                  <AdminContentTab settings={settings} onRefresh={loadAllData} />
                )}
              </div>
            )}

            {/* 5. WEBSITE SETTINGS */}
            {activeTab === 'settings' && settings && (
              <AdminSettingsTab settings={settings} onRefresh={loadAllData} />
            )}
          </>
        )}
      </main>

    </div>
  );
};
