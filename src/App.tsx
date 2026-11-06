import React, { useState, useEffect } from 'react';
import { Language, VisualEffectMode, Product, DocumentItem, SiteSettings, DocumentationActivity } from './lib/types';
import {
  fetchProducts,
  fetchDocuments,
  fetchSettings,
  fetchDocumentationActivities,
  DEFAULT_PRODUCT,
  DEFAULT_DOCUMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_DOCUMENTATION_ACTIVITIES,
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExportMarquee } from './components/ExportMarquee';
import { AboutSection } from './components/AboutSection';
import { ClovesSection } from './components/ClovesSection';
import { SpecificationsSection } from './components/SpecificationsSection';
import { WhyIndonesianCloves } from './components/WhyIndonesianCloves';
import { SourcingSupplyChain } from './components/SourcingSupplyChain';
import { LogisticsSection } from './components/LogisticsSection';
import { DocumentationGallery } from './components/DocumentationGallery';
import { DocumentsSection } from './components/DocumentsSection';
import { RFQSection } from './components/RFQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  // Routing: Public vs Admin (/admin or #admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.startsWith('/admin') || hash === '#admin' || search.includes('admin=true');
  });

  // Language state (persisted)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ptpd_lang') as Language;
      if (saved === 'en' || saved === 'id') return saved;
    }
    return 'en';
  });

  // Accessibility / Visual Mode state (persisted)
  const [visualMode, setVisualMode] = useState<VisualEffectMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ptpd_visual_mode') as VisualEffectMode;
      if (saved === 'full-glass' || saved === 'reduced' || saved === 'readable') return saved;
    }
    return 'full-glass';
  });

  // Core Data
  const [product, setProduct] = useState<Product>(DEFAULT_PRODUCT);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activities, setActivities] = useState<DocumentationActivity[]>(DEFAULT_DOCUMENTATION_ACTIVITIES);
  const [selectedRFQProduct, setSelectedRFQProduct] = useState<string>('Indonesian Whole Dried Cloves (Syzygium aromaticum)');

  // Sync route on popstate/hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminRoute(path.startsWith('/admin') || hash === '#admin' || search.includes('admin=true'));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Load public data from Supabase / data layer
  const loadPublicData = async () => {
    try {
      const [prods, docs, sett, acts] = await Promise.all([
        fetchProducts(),
        fetchDocuments(),
        fetchSettings(),
        fetchDocumentationActivities(true),
      ]);
      if (prods && prods.length > 0) setProduct(prods[0]);
      if (docs && docs.length > 0) setDocuments(docs);
      if (sett) setSettings(sett);
      if (acts) setActivities(acts);
    } catch (e) {
      console.warn('Error loading public data:', e);
    }
  };

  useEffect(() => {
    loadPublicData();

    // Listen for custom broadcast updates from admin operations
    const handleDataUpdated = () => {
      loadPublicData();
    };
    window.addEventListener('ptpd_data_updated', handleDataUpdated);
    window.addEventListener('ptpd_documentation_updated', handleDataUpdated);
    return () => {
      window.removeEventListener('ptpd_data_updated', handleDataUpdated);
      window.removeEventListener('ptpd_documentation_updated', handleDataUpdated);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ptpd_lang', lang);
    }
  };

  const handleVisualModeChange = (mode: VisualEffectMode) => {
    setVisualMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ptpd_visual_mode', mode);
    }
  };

  const navigateToRFQ = () => {
    const el = document.getElementById('rfq');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToCloves = () => {
    const el = document.getElementById('cloves');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProductForRFQ = (productName: string) => {
    setSelectedRFQProduct(productName);
    navigateToRFQ();
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
  };

  // If user navigated to /admin (directly accessed URL)
  if (isAdminRoute) {
    return <AdminPortal onExitToWebsite={handleExitAdmin} />;
  }

  // Visual mode container class
  const modeClass =
    visualMode === 'full-glass'
      ? 'mode-full-glass'
      : visualMode === 'reduced'
      ? 'mode-reduced-effects'
      : 'mode-high-readability';

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#1E2229] antialiased ${modeClass}`}>
      {/* Liquid Glass Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        visualMode={visualMode}
        onVisualModeChange={handleVisualModeChange}
        onNavigateToRFQ={navigateToRFQ}
      />

      <main>
        {/* 1. Hero Section */}
        <Hero
          currentLang={currentLang}
          onExploreCloves={navigateToCloves}
          onRequestQuote={navigateToRFQ}
        />

        {/* 2. Seamless Right-to-Left Animated Export Marquee */}
        <ExportMarquee currentLang={currentLang} />

        {/* 3. About Us Section */}
        <AboutSection currentLang={currentLang} />

        {/* 4. Our Cloves Section */}
        <ClovesSection
          currentLang={currentLang}
          product={product}
          onSelectProductForRFQ={handleSelectProductForRFQ}
        />

        {/* 5. Product Specifications Table */}
        <SpecificationsSection
          currentLang={currentLang}
          specs={product.specs || []}
        />

        {/* 6. Why Indonesian Cloves */}
        <WhyIndonesianCloves currentLang={currentLang} />

        {/* 7. Sourcing & Supply Chain */}
        <SourcingSupplyChain currentLang={currentLang} />

        {/* 8. Export & Logistics Workflow */}
        <LogisticsSection currentLang={currentLang} />

        {/* 9. Dokumentasi & Galeri Kegiatan PT PARTA DIRGANTARA */}
        <DocumentationGallery
          currentLang={currentLang}
          activities={activities}
        />

        {/* 10. Documents & Download Center */}
        <DocumentsSection
          currentLang={currentLang}
          documents={documents}
        />

        {/* 10. Request a Quote (RFQ) Form */}
        <RFQSection
          currentLang={currentLang}
          preselectedProduct={selectedRFQProduct}
        />

        {/* 11. Contact Section */}
        <ContactSection
          currentLang={currentLang}
          settings={settings}
        />
      </main>

      {/* Corporate Footer (NO visible admin link) */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        settings={settings}
      />
    </div>
  );
}
