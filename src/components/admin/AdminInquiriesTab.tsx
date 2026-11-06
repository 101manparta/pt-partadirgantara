import React, { useState } from 'react';
import { Search, Filter, Download, MessageSquare, Phone, Mail, ExternalLink, Trash2, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { RFQInquiry } from '../../lib/types';
import { updateRFQStatus, deleteRFQ } from '../../lib/supabase';

interface InquiriesTabProps {
  rfqs: RFQInquiry[];
  onRefresh: () => void;
}

export const AdminInquiriesTab: React.FC<InquiriesTabProps> = ({ rfqs, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQInquiry | null>(null);
  const [editStatus, setEditStatus] = useState<RFQInquiry['status']>('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const filtered = rfqs.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.company_name.toLowerCase().includes(q) ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.destination_port.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (rfq: RFQInquiry) => {
    setSelectedRFQ(rfq);
    setEditStatus(rfq.status);
    setAdminNotes(rfq.admin_notes || '');
    setSaveSuccessMsg(null);
  };

  const handleSaveStatus = async () => {
    if (!selectedRFQ) return;
    setIsUpdating(true);
    setSaveSuccessMsg(null);

    const ok = await updateRFQStatus(selectedRFQ.id, editStatus, adminNotes);
    setIsUpdating(false);

    if (ok) {
      setSaveSuccessMsg('Status & notes updated successfully.');
      setSelectedRFQ({ ...selectedRFQ, status: editStatus, admin_notes: adminNotes });
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete inquiry ${id}? This action cannot be undone.`)) {
      await deleteRFQ(id);
      setSelectedRFQ(null);
      onRefresh();
    }
  };

  const exportToCSV = () => {
    if (rfqs.length === 0) return;
    const headers = [
      'ID',
      'Date',
      'Status',
      'Company Name',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Commodity',
      'Quantity',
      'Unit',
      'Destination Country',
      'Destination Port',
      'Packaging',
      'Message',
      'Admin Notes',
    ];

    const rows = rfqs.map((r) => [
      r.id,
      r.created_at,
      r.status,
      `"${r.company_name.replace(/"/g, '""')}"`,
      `"${r.full_name.replace(/"/g, '""')}"`,
      r.email,
      `"${r.phone}"`,
      r.country,
      `"${r.product}"`,
      r.quantity,
      r.unit,
      r.destination_country,
      `"${r.destination_port}"`,
      `"${r.preferred_packaging}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${(r.admin_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PT_Parta_Dirgantara_RFQs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Search, Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, buyer, country, port, or RFQ ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'NEW', 'QUOTATION_SENT', 'NEGOTIATION', 'CONVERTED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={exportToCSV}
            disabled={rfqs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl glass-panel border border-slate-200/90 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-sm font-semibold text-slate-700">No trade inquiries found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Inquiry Ref & Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Buyer & Company</th>
                  <th className="py-3.5 px-4 sm:px-6">Commodity & Volume</th>
                  <th className="py-3.5 px-4 sm:px-6">Destination</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rfq) => (
                  <tr
                    key={rfq.id}
                    onClick={() => handleOpenDetail(rfq)}
                    className="hover:bg-orange-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-mono font-bold text-slate-900 block">{rfq.id}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rfq.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-bold text-slate-900 block">{rfq.company_name}</span>
                      <span className="text-slate-500">{rfq.full_name} · {rfq.country}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-semibold text-slate-800 block truncate max-w-[180px]">{rfq.product}</span>
                      <span className="font-mono font-bold text-[#E65100]">
                        {rfq.quantity} {rfq.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="font-semibold text-slate-800 block">{rfq.destination_port}</span>
                      <span className="text-slate-500">{rfq.destination_country}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                          rfq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800'
                            : rfq.status === 'CONVERTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rfq.status === 'QUOTATION_SENT'
                            ? 'bg-blue-100 text-blue-800'
                            : rfq.status === 'NEGOTIATION'
                            ? 'bg-purple-100 text-purple-800'
                            : rfq.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(rfq);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#FF6B00] bg-slate-100 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RFQ Detail & Action Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">RFQ REFERENCE</span>
                <h3 className="text-lg font-bold text-slate-900 font-mono">{selectedRFQ.id}</h3>
              </div>
              <button
                onClick={() => setSelectedRFQ(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Direct Communication Quick Bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-700">Direct Buyer Channels:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedRFQ.email}?subject=PT PARTA DIRGANTARA - Official Quotation for RFQ ${selectedRFQ.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#FF6B00] font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>Send Quotation Email</span>
                </a>
                <a
                  href={`https://wa.me/${selectedRFQ.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedRFQ.full_name}, thank you for contacting PT PARTA DIRGANTARA regarding your Indonesian Clove inquiry (${selectedRFQ.id}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Buyer</span>
                </a>
              </div>
            </div>

            {/* In-depth details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Company Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedRFQ.company_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Contact Person</span>
                <span className="font-bold text-slate-900">{selectedRFQ.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Buyer Country</span>
                <span className="text-slate-800">{selectedRFQ.country}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Email Address</span>
                <span className="text-slate-800 font-mono">{selectedRFQ.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Phone / WhatsApp</span>
                <span className="text-slate-800 font-mono">{selectedRFQ.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Inquiry Timestamp</span>
                <span className="text-slate-800 font-mono">{new Date(selectedRFQ.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Order specifications */}
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-orange-900 font-semibold">Commodity:</span>
                <span className="font-bold text-slate-900">{selectedRFQ.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-900 font-semibold">Volume Requested:</span>
                <span className="font-mono font-bold text-slate-900">{selectedRFQ.quantity} {selectedRFQ.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-900 font-semibold">Discharge Destination:</span>
                <span className="font-semibold text-slate-900">{selectedRFQ.destination_port}, {selectedRFQ.destination_country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-900 font-semibold">Packaging Preference:</span>
                <span className="font-semibold text-slate-900">{selectedRFQ.preferred_packaging}</span>
              </div>
            </div>

            {selectedRFQ.message && (
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Buyer Notes & Terms</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                  "{selectedRFQ.message}"
                </div>
              </div>
            )}

            {/* Status & Admin Notes Form */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUOTATION_SENT">QUOTATION SENT</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="CONVERTED">CONVERTED (ORDER CONFIRMED)</option>
                    <option value="REJECTED">REJECTED / UNQUALIFIED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Trade Notes
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Sent CIF Felixstowe quote $7,850/MT"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedRFQ.id)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRFQ(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleSaveStatus}
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                  >
                    {isUpdating ? 'Saving...' : 'Save Updates to Database'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
