import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  FileText,
  Receipt,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Customer, Invoice, Quote } from '../types';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface CustomerListViewProps {
  customers: Customer[];
  quotes: Quote[];
  invoices: Invoice[];
  onAddCustomerClick: () => void;
  onEditCustomerClick: (customer: Customer) => void;
  onDeleteCustomerClick: (id: string) => void;
  onCreateQuoteForCustomer: (customer: Customer) => void;
  searchQuery: string;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  quotes,
  invoices,
  onAddCustomerClick,
  onEditCustomerClick,
  onDeleteCustomerClick,
  onCreateQuoteForCustomer,
  searchQuery,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8 bg-slate-50">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Customers Directory</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage client contact information, service addresses, and document histories.
          </p>
        </div>

        <button
          onClick={onAddCustomerClick}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by customer name, phone, email..."
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none shadow-2xs"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => {
          const custQuotes = quotes.filter((q) => q.customerId === customer.id);
          const custInvoices = invoices.filter((i) => i.customerId === customer.id);
          const waUrl = buildWhatsAppUrl(
            customer.whatsappNumber || customer.phone,
            `Hi ${customer.name}, reaching out regarding your service request.`
          );

          return (
            <div
              key={customer.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-base flex items-center justify-center shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {customer.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Added {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCustomerClick(customer)}
                      title="Edit Customer"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCustomerClick(customer.id)}
                      title="Delete Customer"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}

                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}

                  {customer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                  )}

                  {customer.notes && (
                    <div className="p-2 rounded-md bg-slate-50 text-slate-500 italic text-[11px] border border-slate-100 mt-2">
                      "{customer.notes}"
                    </div>
                  )}
                </div>

                {/* Past documents counters */}
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    {custQuotes.length} Quotes
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    {custInvoices.length} Invoices
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs py-2 px-3 rounded-lg border border-green-200 transition-colors text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => onCreateQuoteForCustomer(customer)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Quote</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-600">No customers found</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first client to quickly pre-fill quotes & invoices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
