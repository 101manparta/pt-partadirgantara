import React, { useState } from 'react';
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Product, ProductSpec } from '../../lib/types';
import { updateProduct } from '../../lib/supabase';

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminProductsTab: React.FC<ProductsTabProps> = ({ products, onRefresh }) => {
  const currentProduct = products[0];

  const [name, setName] = useState(currentProduct?.name || '');
  const [botanicalName, setBotanicalName] = useState(currentProduct?.botanical_name || '');
  const [origin, setOrigin] = useState(currentProduct?.origin || '');
  const [grade, setGrade] = useState(currentProduct?.grade || '');
  const [moq, setMoq] = useState(currentProduct?.moq || '');
  const [packaging, setPackaging] = useState(currentProduct?.packaging || '');
  const [descEn, setDescEn] = useState(currentProduct?.description_en || '');
  const [descId, setDescId] = useState(currentProduct?.description_id || '');
  const [specs, setSpecs] = useState<ProductSpec[]>(currentProduct?.specs || []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleAddSpecRow = () => {
    const newSpec: ProductSpec = {
      id: 'spec-' + Date.now(),
      parameter_en: 'New Parameter',
      parameter_id: 'Parameter Baru',
      standard_value: 'Specification Value',
      test_method: 'ISO / AOAC Standard',
      sort_order: specs.length + 1,
    };
    setSpecs([...specs, newSpec]);
  };

  const handleUpdateSpec = (index: number, field: keyof ProductSpec, val: any) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: val };
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!currentProduct) return;
    setIsSaving(true);
    setSaveStatus(null);

    const updatedProduct: Partial<Product> = {
      name,
      botanical_name: botanicalName,
      origin,
      grade,
      moq,
      packaging,
      description_en: descEn,
      description_id: descId,
      specs,
    };

    const res = await updateProduct(currentProduct.id, updatedProduct);
    setIsSaving(false);

    if (res.success) {
      setSaveStatus('Spesifikasi produk berhasil diperbarui di database Supabase.');
      setTimeout(() => setSaveStatus(null), 3500);
      onRefresh();
    } else {
      setSaveStatus('Gagal menyimpan perubahan: ' + (res.error || 'Silakan periksa koneksi Supabase Anda.'));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Commodity & Specifications Management
          </h3>
          <p className="text-xs text-slate-500">
            Configure technical parameters displayed on the public website and B2B spec sheet
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Database...' : 'Save Product & Specs'}</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main product attributes */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-5">
        <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Commodity General Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Botanical Classification</label>
            <input
              type="text"
              value={botanicalName}
              onChange={(e) => setBotanicalName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl italic font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Export Grade Classification</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Origin Regions</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
            <input
              type="text"
              value={moq}
              onChange={(e) => setMoq(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard Export Packaging</label>
            <input
              type="text"
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">English Product Description</label>
            <textarea
              rows={3}
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Indonesian Product Description (Bahasa)</label>
            <textarea
              rows={3}
              value={descId}
              onChange={(e) => setDescId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Specifications Table Editor */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Laboratory & Analytical Specifications
            </h4>
            <p className="text-xs text-slate-500">Live parameter rows dynamically fed into public spec table</p>
          </div>
          <button
            type="button"
            onClick={handleAddSpecRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FF6B00] bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Parameter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">Parameter (EN)</th>
                <th className="py-2.5 px-3">Parameter (ID)</th>
                <th className="py-2.5 px-3">Standard Limit / Value</th>
                <th className="py-2.5 px-3">Testing Standard</th>
                <th className="py-2.5 px-2 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {specs.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.parameter_en}
                      onChange={(e) => handleUpdateSpec(idx, 'parameter_en', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.parameter_id}
                      onChange={(e) => handleUpdateSpec(idx, 'parameter_id', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.standard_value}
                      onChange={(e) => handleUpdateSpec(idx, 'standard_value', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.test_method}
                      onChange={(e) => handleUpdateSpec(idx, 'test_method', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                      title="Remove parameter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
