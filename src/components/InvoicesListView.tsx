import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { BusinessProfile, Invoice } from '../types';

interface InvoicesListViewProps {
  invoices: Invoice[];
  profile: BusinessProfile;
  onNewInvoiceClick: () => void;
  onSelectInvoice: (invoice: Invoice) => void;
  onWhatsAppShare: (invoice: Invoice) => void;
}

export const InvoicesListView: React.FC<InvoicesListViewProps> = ({
  invoices,
  profile,
  onNewInvoiceClick,
  onSelectInvoice,
  onWhatsAppShare,
}) => {
  const currency = profile.currencySymbol || '$';
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unpaid') return inv.status === 'unpaid' || inv.status === 'partial';
    return inv.status === filterStatus;
  });

  const totalOutstanding = invoices
    .filter((i) => i.status === 'unpaid' || i.status === 'partial' || i.status === 'overdue')
    .reduce((acc, i) => acc + i.balanceDue, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8 bg-slate-50">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            <span>Invoices</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Track payments, partial balances, and send WhatsApp reminders.
          </p>
        </div>

        <button
          onClick={onNewInvoiceClick}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Total Outstanding Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Outstanding Receivables
          </span>
          <div className="text-2xl font-bold text-indigo-400 mt-0.5">
            {currency}{totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <p className="text-xs text-slate-300">
          Click any unpaid invoice to record payments or send 1-tap WhatsApp reminders.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto border border-slate-200">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'unpaid', label: 'Unpaid / Partial' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'paid', label: 'Paid' },
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
            placeholder="Search invoice # or customer..."
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Invoice Cards List */}
      <div className="space-y-3">
        {filtered.map((inv) => (
          <div
            key={inv.id}
            onClick={() => onSelectInvoice(inv)}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                  inv.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : inv.status === 'partial'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                <Receipt className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {inv.invoiceNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {inv.customerName}
                </p>
                <p className="text-[11px] text-slate-400">
                  Issued: {inv.issueDate} • Due: {inv.dueDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <div className="font-bold text-slate-900 text-base">
                  {currency}{inv.total.toFixed(2)}
                </div>
                {inv.balanceDue > 0 && (
                  <div className="text-xs font-bold text-amber-600">
                    Balance: {currency}{inv.balanceDue.toFixed(2)}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWhatsAppShare(inv);
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
            No invoices matching filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
