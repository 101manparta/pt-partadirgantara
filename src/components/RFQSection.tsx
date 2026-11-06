import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Building2, Globe2, Phone, Mail, User, Package, ShieldCheck } from 'lucide-react';
import { Language, RFQInquiry } from '../lib/types';
import { translations } from '../lib/translations';
import { submitRFQ } from '../lib/supabase';
import { SectionVector } from './SectionVectors';

interface RFQProps {
  currentLang: Language;
  preselectedProduct?: string;
  onSubmissionSuccess?: (inquiry: RFQInquiry) => void;
}

export const RFQSection: React.FC<RFQProps> = ({
  currentLang,
  preselectedProduct = 'Indonesian Whole Dried Cloves (Syzygium aromaticum)',
  onSubmissionSuccess,
}) => {
  const t = translations[currentLang];

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    country: '',
    email: '',
    phone: '',
    product: preselectedProduct,
    quantity: '24',
    unit: 'Metric Tons (MT)',
    destinationCountry: '',
    destinationPort: '',
    preferredPackaging: '50kg Jute Bags with inner poly liner',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<RFQInquiry | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = t.rfq.errors.required;
    if (!formData.companyName.trim()) errs.companyName = t.rfq.errors.required;
    if (!formData.country.trim()) errs.country = t.rfq.errors.required;

    if (!formData.email.trim()) {
      errs.email = t.rfq.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = t.rfq.errors.invalidEmail;
    }

    if (!formData.phone.trim()) {
      errs.phone = t.rfq.errors.required;
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errs.quantity = t.rfq.errors.invalidQty;
    }

    if (!formData.destinationCountry.trim()) errs.destinationCountry = t.rfq.errors.required;
    if (!formData.destinationPort.trim()) errs.destinationPort = t.rfq.errors.required;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRFQ({
        full_name: formData.fullName.trim(),
        company_name: formData.companyName.trim(),
        country: formData.country.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        product: formData.product,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        destination_country: formData.destinationCountry.trim(),
        destination_port: formData.destinationPort.trim(),
        preferred_packaging: formData.preferredPackaging,
        message: formData.message.trim(),
      });

      if (res.success && res.data) {
        setSubmittedInquiry(res.data);
        if (onSubmissionSuccess) {
          onSubmissionSuccess(res.data);
        }
      } else {
        setSubmissionError(res.error || 'Failed to submit RFQ. Please check your connection.');
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedInquiry(null);
    setSubmissionError(null);
    setFormData({
      fullName: '',
      companyName: '',
      country: '',
      email: '',
      phone: '',
      product: 'Indonesian Whole Dried Cloves (Syzygium aromaticum)',
      quantity: '24',
      unit: 'Metric Tons (MT)',
      destinationCountry: '',
      destinationPort: '',
      preferredPackaging: '50kg Jute Bags with inner poly liner',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="rfq" className="relative py-20 lg:py-28 bg-[#FFFFFF] overflow-hidden">
      {/* Background Vector: Cargo Aircraft */}
      <SectionVector type="plane" className="left-[-5%] top-[10%] w-[480px] h-[300px] lg:w-[600px] lg:h-[380px]" opacity={0.05} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E65100] uppercase mb-2">
            <span className="w-2 h-0.5 bg-[#FF6B00] rounded-full inline-block" />
            <span>Direct Commercial Desk</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-medium normal-case tracking-normal">B2B Purchase Inquiry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#12151A] tracking-tight text-balance">
            {t.rfq.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {t.rfq.desc}
          </p>
        </div>

        {/* Liquid Glass Form Card */}
        <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-xl p-6 sm:p-10 lg:p-12 relative glass-glow-orange">
          
          {submittedInquiry ? (
            /* Success State */
            <div className="text-center py-10 px-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {t.rfq.successTitle}
              </h3>
              <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                {t.rfq.successMsg}
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded mx-1">
                  {submittedInquiry.id}
                </span>
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-md mx-auto text-xs text-left space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Buyer:</span>
                  <span className="font-semibold">{submittedInquiry.company_name} ({submittedInquiry.full_name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commodity:</span>
                  <span className="font-semibold">{submittedInquiry.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume:</span>
                  <span className="font-semibold font-mono">{submittedInquiry.quantity} {submittedInquiry.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-semibold">{submittedInquiry.destination_port}, {submittedInquiry.destination_country}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
                {t.rfq.successSub}
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  {t.rfq.sendAnother}
                </button>
              </div>
            </div>
          ) : (
            /* RFQ Input Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {submissionError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Grid: Buyer Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.fullName}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Michael Henderson"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 transition-all ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.companyName}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Henderson Spice Imports Ltd"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 transition-all ${
                      errors.companyName ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.companyName && <p className="text-red-500 text-[11px] mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. procurement@henderson.com"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +44 20 7946 0912"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Grid: Commodity & Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.product}
                  </label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.rfq.quantity}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.rfq.unit}
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-2 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                    >
                      <option value="Metric Tons (MT)">MT</option>
                      <option value="20ft FCL (~11 MT)">20ft FCL</option>
                      <option value="40ft FCL (~25 MT)">40ft FCL</option>
                      <option value="Kilograms (KG)">KG</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid: Destination & Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.country}
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 ${
                      errors.country ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.country && <p className="text-red-500 text-[11px] mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.destCountry}
                  </label>
                  <input
                    type="text"
                    value={formData.destinationCountry}
                    onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                    placeholder="e.g. United Kingdom"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 ${
                      errors.destinationCountry ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.destinationCountry && <p className="text-red-500 text-[11px] mt-1">{errors.destinationCountry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.rfq.destPort}
                  </label>
                  <input
                    type="text"
                    value={formData.destinationPort}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    placeholder="e.g. Port of Felixstowe / London Gateway"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 ${
                      errors.destinationPort ? 'border-red-400 bg-red-50/20' : 'border-slate-300/80'
                    }`}
                  />
                  {errors.destinationPort && <p className="text-red-500 text-[11px] mt-1">{errors.destinationPort}</p>}
                </div>
              </div>

              {/* Packaging */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.rfq.packaging}
                </label>
                <select
                  value={formData.preferredPackaging}
                  onChange={(e) => setFormData({ ...formData, preferredPackaging: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                >
                  <option value="50kg Jute Bags with inner poly liner">50kg Heavy-Duty Jute Bags with food-grade inner poly liner</option>
                  <option value="25kg Woven PP Bags with inner poly liner">25kg Woven Polypropylene (PP) Bags with inner liner</option>
                  <option value="10kg Vacuum Carton Boxes">10kg Vacuum Foil Packs in Master Carton Boxes (High Barrier)</option>
                  <option value="Custom Buyer Packing Specification">Custom Buyer Specification (Discuss during quotation)</option>
                </select>
              </div>

              {/* Message / Specifications */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.rfq.message}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify target Incoterms (FOB/CIF), desired shipping timeframe, or specific analytical limits (e.g. maximum moisture, eugenol content)."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted B2B database storage & trade inquiry logging</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-[#FF6B00] via-[#FF7A1A] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-70 rounded-xl shadow-md hover:shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span>{t.rfq.submitting}</span>
                  ) : (
                    <>
                      <span>{t.rfq.submitBtn}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
