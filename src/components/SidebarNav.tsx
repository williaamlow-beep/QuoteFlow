import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Briefcase,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onNewQuoteClick: () => void;
  unpaidCount: number;
  quotesCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentView,
  setCurrentView,
  onNewQuoteClick,
  unpaidCount,
  quotesCount,
}) => {
  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'quotes_list' as AppView,
      label: 'Quotes',
      icon: FileText,
      badge: quotesCount > 0 ? quotesCount : undefined,
    },
    {
      id: 'invoices_list' as AppView,
      label: 'Invoices',
      icon: Receipt,
      badge: unpaidCount > 0 ? unpaidCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    { id: 'customers' as AppView, label: 'Customers', icon: Users },
    { id: 'templates' as AppView, label: 'Templates', icon: Briefcase },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left side) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4 shrink-0">
        <div className="space-y-1 mb-6">
          <button
            onClick={onNewQuoteClick}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer mb-4 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Quote</span>
          </button>

          <p className="px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'quotes_list' &&
                (currentView === 'quote_builder' || currentView === 'quote_detail')) ||
              (item.id === 'invoices_list' && currentView === 'invoice_detail');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Pro Plan Box */}
        <div className="p-4 mt-auto">
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
              Pro Plan
            </div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full mb-3">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
            <div className="text-[10px] text-slate-300">
              {quotesCount}/60 Quotes this month
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'quotes_list' &&
              (currentView === 'quote_builder' || currentView === 'quote_detail')) ||
            (item.id === 'invoices_list' && currentView === 'invoice_detail');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-md relative cursor-pointer ${
                isActive ? 'text-indigo-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-none">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-md cursor-pointer ${
            currentView === 'settings' ? 'text-indigo-400 font-semibold bg-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none">Settings</span>
        </button>
      </nav>
    </>
  );
};
