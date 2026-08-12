import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Send,
  Clock,
  Receipt,
} from 'lucide-react';
import { BusinessProfile, Quote } from '../types';

interface QuotesListViewProps {
  quotes: Quote[];
  profile: BusinessProfile;
  onNewQuoteClick: () => void;
  onSelectQuote: (quote: Quote) => void;
  onWhatsAppShare: (quote: Quote) => void;
}

export const QuotesListView: React.FC<QuotesListViewProps> = ({
  quotes,
  profile,
  onNewQuoteClick,
  onSelectQuote,
  onWhatsAppShare,
}) => {
  const currency = profile.currencySymbol || '$';
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = quotes.filter((q) => {
    const matchesSearch =
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (q.professionCategory && q.professionCategory.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  const totalValue = filtered.reduce((acc, q) => acc + q.total, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8 bg-slate-50">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Quotations</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage custom estimates, convert accepted quotes, and share via WhatsApp.
          </p>
        </div>

        <button
          onClick={onNewQuoteClick}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto border border-slate-200">
          {[
            { id: 'all', label: 'All Quotes' },
            { id: 'sent', label: 'Sent / Pending' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'converted', label: 'Converted' },
            { id: 'draft', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quote # or customer..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Total value info */}
      <div className="text-xs font-semibold text-slate-500">
        Showing {filtered.length} quotes • Total Pipeline Value: {' '}
        <span className="font-extrabold text-slate-900">{currency}{totalValue.toLocaleString()}</span>
      </div>

      {/* Quote Cards List */}
      <div className="space-y-3">
        {filtered.map((quote) => (
          <div
            key={quote.id}
            onClick={() => onSelectQuote(quote)}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {quote.quoteNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      quote.status === 'accepted' || quote.status === 'converted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quote.status === 'sent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {quote.customerName} • {quote.professionCategory || 'Service'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Issued: {quote.issueDate} • Expires: {quote.expiryDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <div className="font-bold text-slate-900 text-base">
                  {currency}{quote.total.toFixed(2)}
                </div>
                {quote.depositRequired && (
                  <div className="text-[11px] font-semibold text-amber-600">
                    Deposit: {currency}{quote.depositAmount.toFixed(2)}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsAppShare(quote);
                }}
                className="p-1.5 bg-green-50 text-green-600 rounded border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No quotations found matching filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
