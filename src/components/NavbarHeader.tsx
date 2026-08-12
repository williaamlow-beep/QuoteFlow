import React from 'react';
import {
  FileText,
  Plus,
  Receipt,
  Search,
  UserPlus,
  Smartphone,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { AppView, BusinessProfile } from '../types';

interface NavbarHeaderProps {
  profile: BusinessProfile;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onNewQuoteClick: () => void;
  onNewInvoiceClick: () => void;
  onNewCustomerClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  profile,
  currentView,
  setCurrentView,
  onNewQuoteClick,
  onNewInvoiceClick,
  onNewCustomerClick,
  searchQuery,
  setSearchQuery,
  isMobileFrame,
  setIsMobileFrame,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'quotes_list':
        return 'Quotations';
      case 'quote_builder':
        return 'Create Quotation';
      case 'quote_detail':
        return 'Quotation Details';
      case 'invoices_list':
        return 'Invoices';
      case 'invoice_detail':
        return 'Invoice Details';
      case 'customers':
        return 'Customers Directory';
      case 'templates':
        return 'Service Profession Templates';
      case 'settings':
        return 'Business Profile & Settings';
      default:
        return 'QuoteFlow';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:bg-indigo-600 transition-colors">
              Q
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">
                  QuoteFlow
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[160px] sm:max-w-xs font-medium">
                {profile.name || 'Service Business'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotes, invoices, customers..."
            className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        {/* Right: Quick actions & View switcher */}
        <div className="flex items-center gap-2.5">
          {/* Layout Frame Switcher toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Phone Simulator View'}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span>Desktop View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mobile Preview</span>
              </>
            )}
          </button>

          {/* Quick Create Quote Button */}
          <button
            onClick={onNewQuoteClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Quote</span>
            <span className="sm:hidden">Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
};
