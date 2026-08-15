import React, { useState } from 'react';
import {
  History,
  X,
  Trash2,
  Share2,
  Search,
  MessageSquare,
  Sparkles,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { HistoricalQuote } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyLogs: HistoricalQuote[];
  currencySymbol: string;
  onDeleteLog: (id: string) => void;
  onReopenQuote: (quote: HistoricalQuote) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyLogs,
  currencySymbol,
  onDeleteLog,
  onReopenQuote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLogs = historyLogs.filter(
    (log) =>
      log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.vehicleOrJobDetails &&
        log.vehicleOrJobDetails.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    if (historyLogs.length === 0) return;
    const headers = ['ID', 'Date', 'Customer', 'Vehicle/Site', 'Total', 'Delivery Method', 'Items Count'];
    const rows = historyLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.customerName}"`,
      `"${log.vehicleOrJobDetails || ''}"`,
      log.totalPrice,
      log.deliveryMethod,
      log.items.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quoteflow_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-white">
      <div
        id="history-audit-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <History className="w-4 h-4 text-blue-300" />
            </div>
            <h3 className="font-semibold text-sm tracking-wide text-white">Sent Quotation Audit Logs</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Export Bar */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, vehicle or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/10 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-white/40 font-medium text-xs border border-dashed border-white/15 rounded-2xl">
            {searchTerm ? 'No quotes matching your search.' : 'No sent quote logs yet. All generated quotes will register here automatically!'}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-0.5">
            {filteredLogs.map((quote) => (
              <div
                key={quote.id}
                className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/10 shadow-sm space-y-2 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-xs text-white flex items-center space-x-1.5">
                      <span>{quote.customerName}</span>
                      {quote.deliveryMethod === 'whatsapp_cloud_api' ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                          Cloud API
                        </span>
                      ) : (
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-400/30">
                          WhatsApp
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-medium text-white/50 flex items-center space-x-2 mt-0.5">
                      <span>{quote.timestamp}</span>
                      {quote.vehicleOrJobDetails && <span>• {quote.vehicleOrJobDetails}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-emerald-400 block">
                      {currencySymbol}{quote.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-white/40 font-medium">
                      {quote.items.length} item(s)
                    </span>
                  </div>
                </div>

                {/* Spoken Transcript Preview if Available */}
                {quote.transcript && (
                  <div className="p-2.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 text-[10px] text-white/70 italic line-clamp-1">
                    <span className="font-semibold not-italic text-white/40">Voice Note:</span> "{quote.transcript}"
                  </div>
                )}

                {/* Log Item Actions */}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                  <button
                    onClick={() => {
                      onReopenQuote(quote);
                      onClose();
                    }}
                    className="font-semibold text-[10px] uppercase tracking-wider text-blue-300 hover:text-blue-200 underline flex items-center space-x-1 transition-colors"
                  >
                    <span>Load into Slate</span>
                  </button>

                  <button
                    onClick={() => onDeleteLog(quote.id)}
                    className="p-1 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
