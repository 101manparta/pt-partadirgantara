import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Inbox, Package, FileText, FileEdit, Settings, LogOut, ExternalLink, Database, ShieldCheck } from 'lucide-react';
import { RFQInquiry, Product, DocumentItem, SiteSettings } from '../../lib/types';
import { getSupabaseConfig, fetchRFQs, fetchProducts, fetchDocuments, fetchSettings } from '../../lib/supabase';
import { AdminAuth } from './AdminAuth';
import { AdminDashboardTab } from './AdminDashboardTab';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'products' | 'documents' | 'content' | 'settings'>('dashboard');

  const [rfqs, setRfqs] = useState<RFQInquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session
  useEffect(() => {
    const raw = sessionStorage.getItem('ptpd_admin_session');
    if (raw) {
      try {
        setAdminUser(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [r, p, d, s] = await Promise.all([
        fetchRFQs(),
        fetchProducts(),
        fetchDocuments(),
        fetchSettings(),
      ]);
      setRfqs(r);
      setProducts(p);
      setDocuments(d);
      setSettings(s);
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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs">
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
                  Export Operations Portal
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  B2B Trade & RFQ Control Desk
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
                title="Database Status"
              >
                <Database className="w-3 h-3" />
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
                title="View Public Export Website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Public Website</span>
              </button>

              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inquiries & RFQs</span>
              {newRFQsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF6B00] text-white font-mono">
                  {newRFQsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products & Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Website Content</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings & Supabase</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Admin Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-mono">Synchronizing database records...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboardTab rfqs={rfqs} onNavigateToTab={(t) => setActiveTab(t as any)} />
            )}
            {activeTab === 'inquiries' && (
              <AdminInquiriesTab rfqs={rfqs} onRefresh={loadAllData} />
            )}
            {activeTab === 'products' && (
              <AdminProductsTab products={products} onRefresh={loadAllData} />
            )}
            {activeTab === 'documents' && (
              <AdminDocumentsTab documents={documents} onRefresh={loadAllData} />
            )}
            {activeTab === 'content' && settings && (
              <AdminContentTab settings={settings} onRefresh={loadAllData} />
            )}
            {activeTab === 'settings' && settings && (
              <AdminSettingsTab settings={settings} onRefresh={loadAllData} />
            )}
          </>
        )}
      </main>

    </div>
  );
};
