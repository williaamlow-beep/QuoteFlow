import React, { useState } from 'react';
import {
  FileText,
  Receipt,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  ChevronRight,
  Briefcase,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  AppView,
  BusinessProfile,
  Customer,
  Invoice,
  Quote,
} from '../types';

interface DashboardViewProps {
  profile: BusinessProfile;
  quotes: Quote[];
  invoices: Invoice[];
  customers: Customer[];
  setCurrentView: (view: AppView) => void;
  onNewQuoteClick: () => void;
  onNewInvoiceClick: () => void;
  onNewCustomerClick: () => void;
  onSelectQuote: (quote: Quote) => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onWhatsAppShare: (doc: Quote | Invoice, type: 'quote' | 'invoice') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  quotes,
  invoices,
  customers,
  setCurrentView,
  onNewQuoteClick,
  onNewInvoiceClick,
  onNewCustomerClick,
  onSelectQuote,
  onSelectInvoice,
  onWhatsAppShare,
}) => {
  const currency = profile.currencySymbol || '$';

  // Compute stats
  const sentQuotes = quotes.filter((q) => q.status === 'sent' || q.status === 'viewed');
  const acceptedQuotes = quotes.filter((q) => q.status === 'accepted' || q.status === 'converted');
  const unpaidInvoices = invoices.filter((i) => i.status === 'unpaid' || i.status === 'partial');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  const totalQuotesSentValue = sentQuotes.reduce((acc, q) => acc + q.total, 0);
  const totalUnpaidValue = unpaidInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

  // Revenue this month
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const revenueThisMonth = invoices.reduce((sum, inv) => {
    const paidInMonth = inv.payments
      .filter((p) => p.date && p.date.startsWith(currentMonthStr))
      .reduce((pSum, p) => pSum + p.amount, 0);
    return sum + paidInMonth;
  }, 0);

  const getQuoteStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
      case 'converted':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {status === 'converted' ? 'Converted to Invoice' : 'Accepted'}
          </span>
        );
      case 'sent':
      case 'viewed':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Send className="w-3 h-3 text-blue-600" />
            {status === 'viewed' ? 'Viewed' : 'Sent'}
          </span>
        );
      case 'draft':
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Draft
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getInvoiceStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
          </span>
        );
      case 'partial':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Deposit Paid
          </span>
        );
      case 'overdue':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Overdue
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8 bg-slate-50">
      {/* Business Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Business Overview</h1>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wide">
            {profile.city || profile.businessType || 'Active Field'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewQuoteClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Quote</span>
          </button>
          <button
            onClick={() => setCurrentView('templates')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trade Templates</span>
          </button>
        </div>
      </div>

      {/* 4-Column Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">MONTHLY REVENUE</div>
          <div className="text-2xl font-bold text-slate-900">
            {currency}{revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Collected payments</div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setCurrentView('quotes_list')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">QUOTES SENT</div>
          <div className="text-2xl font-bold text-slate-900">{sentQuotes.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Valued at {currency}{totalQuotesSentValue.toLocaleString()}
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => setCurrentView('invoices_list')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">UNPAID INVOICES</div>
          <div className="text-2xl font-bold text-indigo-600">
            {currency}{totalUnpaidValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{unpaidInvoices.length} pending / {overdueInvoices.length} overdue</div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => setCurrentView('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">ACTIVE CUSTOMERS</div>
          <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Client directory</div>
        </div>
      </div>

      {/* Main Grid: 8-col Recent Documents Table + 4-col Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section: Recent Quotations Table (col-span-8) */}
        <section className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">Recent Quotations & Jobs</h2>
            <button
              onClick={() => setCurrentView('quotes_list')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider cursor-pointer"
            >
              View All ({quotes.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <th className="px-6 py-3 border-b border-slate-100">Quote #</th>
                  <th className="px-6 py-3 border-b border-slate-100">Customer</th>
                  <th className="px-6 py-3 border-b border-slate-100">Job Category</th>
                  <th className="px-6 py-3 border-b border-slate-100">Amount</th>
                  <th className="px-6 py-3 border-b border-slate-100">Status</th>
                  <th className="px-6 py-3 border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {quotes.slice(0, 5).map((quote) => (
                  <tr
                    key={quote.id}
                    onClick={() => onSelectQuote(quote)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3.5 border-b border-slate-100 font-mono text-xs font-bold text-slate-900">
                      {quote.quoteNumber}
                    </td>
                    <td className="px-6 py-3.5 border-b border-slate-100 font-medium text-xs text-slate-800">
                      {quote.customerName}
                    </td>
                    <td className="px-6 py-3.5 border-b border-slate-100 text-xs text-slate-600">
                      {quote.professionCategory || 'General Service'}
                    </td>
                    <td className="px-6 py-3.5 border-b border-slate-100 font-semibold text-xs text-slate-900">
                      {currency}{quote.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 border-b border-slate-100">
                      {getQuoteStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-3.5 border-b border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onWhatsAppShare(quote, 'quote');
                        }}
                        className="p-1.5 bg-green-50 text-green-600 rounded border border-green-200 hover:bg-green-100 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Share via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-400">
                      No quotes created yet. Click "New Quote" to create your first quote.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing top recent quotes
            </span>
            <button
              onClick={onNewQuoteClick}
              className="text-xs text-indigo-600 font-bold uppercase tracking-wider hover:underline cursor-pointer"
            >
              + Create New Quote
            </button>
          </div>
        </section>

        {/* Aside: Quick Job Templates & Photo Quoting (col-span-4) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Job Templates Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Quick Job Templates
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setCurrentView('templates')}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="text-xl mb-1">🔧</div>
                <div className="text-xs font-bold text-slate-800">Handyman</div>
              </div>
              <div
                onClick={() => setCurrentView('templates')}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="text-xl mb-1">💧</div>
                <div className="text-xs font-bold text-slate-800">Plumber</div>
              </div>
              <div
                onClick={() => setCurrentView('templates')}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="text-xl mb-1">🚗</div>
                <div className="text-xs font-bold text-slate-800">Panel Beater</div>
              </div>
              <div
                onClick={() => setCurrentView('templates')}
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="text-xl mb-1">❄️</div>
                <div className="text-xs font-bold text-slate-800">Aircon Servicing</div>
              </div>
            </div>
          </div>

          {/* Photo Quoting Dark Box */}
          <div className="bg-indigo-900 rounded-xl shadow-lg p-5 text-white flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-200">Photo Quoting Engine</h3>
                <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">PRO</span>
              </div>
              <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                Snap or upload job site photos, add red pinpoint annotation callout tags, and attach them directly to your customer quotes.
              </p>
              <div
                onClick={onNewQuoteClick}
                className="aspect-video bg-indigo-800 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-indigo-400 cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <div className="text-center p-3">
                  <div className="text-2xl mb-1">📷</div>
                  <div className="text-[11px] font-semibold text-indigo-100">Tap to Start Photo Quote</div>
                </div>
              </div>
            </div>

            <button
              onClick={onNewQuoteClick}
              className="w-full mt-2 py-2.5 bg-white text-indigo-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Start New Photo Quote
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
