import React from 'react';
import { Inbox, Clock, CheckCircle2, TrendingUp, AlertCircle, Scale, ArrowUpRight, Globe, Layers } from 'lucide-react';
import { RFQInquiry } from '../../lib/types';

interface DashboardTabProps {
  rfqs: RFQInquiry[];
  onNavigateToTab: (tabId: string) => void;
}

export const AdminDashboardTab: React.FC<DashboardTabProps> = ({ rfqs, onNavigateToTab }) => {
  const totalInquiries = rfqs.length;
  const newInquiries = rfqs.filter((r) => r.status === 'NEW').length;
  const quotesSent = rfqs.filter((r) => r.status === 'QUOTATION_SENT' || r.status === 'NEGOTIATION').length;
  const convertedCount = rfqs.filter((r) => r.status === 'CONVERTED').length;

  const totalVolumeMT = rfqs.reduce((acc, curr) => {
    const qty = typeof curr.quantity === 'number' ? curr.quantity : parseFloat(curr.quantity as any) || 0;
    return acc + qty;
  }, 0);

  const conversionRate = totalInquiries > 0 ? ((convertedCount / totalInquiries) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total RFQs */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total RFQs</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalInquiries}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Cumulative buyer inquiries
            </span>
          </div>
        </div>

        {/* New / Action Required */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">New Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
              {newInquiries}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Awaiting quotation response
            </span>
          </div>
        </div>

        {/* In Negotiation / Quoted */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Deals</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
              {quotesSent}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Quotation sent or in negotiation
            </span>
          </div>
        </div>

        {/* Volume Requested */}
        <div className="p-5 rounded-2xl glass-card border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Volume Inquired</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalVolumeMT} <span className="text-sm font-normal text-slate-500">MT</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Conversion rate: {conversionRate}%
            </span>
          </div>
        </div>

      </div>

      {/* Recent RFQs Section with Real Empty State */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-slate-200/90 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Recent Trade Inquiries
            </h3>
            <p className="text-xs text-slate-500">
              Real-time records logged directly from buyer RFQ submissions
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('inquiries')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] hover:text-[#E65100]"
          >
            <span>Manage All RFQs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {rfqs.length === 0 ? (
          /* Real Clean Empty State as required by Section 47 */
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No buyer inquiries recorded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Inquiries submitted through the public website RFQ form will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rfqs.slice(0, 5).map((rfq) => (
              <div
                key={rfq.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rfq.company_name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({rfq.id})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                        rfq.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800'
                          : rfq.status === 'CONVERTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rfq.status === 'QUOTATION_SENT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </div>
                  <div className="text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Contact: {rfq.full_name}</span>
                    <span>·</span>
                    <span className="font-mono">{rfq.quantity} {rfq.unit}</span>
                    <span>·</span>
                    <span>Destination: {rfq.destination_port}, {rfq.destination_country}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onNavigateToTab('inquiries')}
                    className="text-xs font-semibold text-[#FF6B00] hover:underline mt-1 inline-block"
                  >
                    Review Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
