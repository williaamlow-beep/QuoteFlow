import React, { useRef } from 'react';
import {
  FileText,
  X,
  Printer,
  Copy,
  Check,
  Share2,
  DollarSign,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { QuoteItem, TradeCategory } from '../types';
import { TRADE_INFO } from '../data/tradePresets';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  customerName: string;
  trade: TradeCategory;
  items: QuoteItem[];
  agreedPrice: number;
  currencySymbol: string;
  vehicleOrJobDetails?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  businessName,
  businessPhone,
  businessAddress,
  customerName,
  trade,
  items,
  agreedPrice,
  currencySymbol,
  vehicleOrJobDetails,
}) => {
  const [copied, setCopied] = React.useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReceipt = async () => {
    let text = `==============================\n`;
    text += `       ${businessName.toUpperCase()}\n`;
    if (businessAddress) text += `       ${businessAddress}\n`;
    if (businessPhone) text += `       Tel: ${businessPhone}\n`;
    text += `==============================\n`;
    text += `RECEIPT NO: ${receiptNo}\n`;
    text += `DATE: ${dateStr}\n`;
    text += `CLIENT: ${customerName || 'Valued Customer'}\n`;
    if (vehicleOrJobDetails) text += `JOB/VEHICLE: ${vehicleOrJobDetails}\n`;
    text += `TRADE: ${TRADE_INFO[trade]?.name || 'Field Trade'}\n`;
    text += `------------------------------\n`;
    text += `ITEMS & CHARGES:\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.title.padEnd(20, ' ')} ${currencySymbol}${item.price.toFixed(2)}\n`;
    });
    text += `------------------------------\n`;
    text += `TOTAL PAID: ${currencySymbol}${agreedPrice.toFixed(2)}\n`;
    text += `STATUS: PAID IN FULL / CONFIRMED\n`;
    text += `==============================\n`;
    text += `Thank you for your business!`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-white">
      <div
        id="receipt-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl shadow-indigo-950/50 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-xl">
              <FileText className="w-4 h-4 text-blue-300" />
            </div>
            <h3 className="font-semibold text-sm tracking-wide text-white">Digital Service Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div
          ref={receiptRef}
          className="p-5 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl font-mono text-xs text-white shadow-inner space-y-3"
        >
          <div className="text-center space-y-0.5 border-b border-white/10 pb-2">
            <div className="font-semibold text-sm uppercase tracking-wider text-white">{businessName}</div>
            {businessAddress && <div className="text-[10px] text-white/60">{businessAddress}</div>}
            {businessPhone && <div className="text-[10px] text-white/60">Hotline: {businessPhone}</div>}
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 pt-1">
              • OFFICIAL WORK RECEIPT •
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div>
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Receipt No:</span>
              <span className="font-semibold text-white/90">{receiptNo}</span>
            </div>
            <div className="text-right">
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Date & Time:</span>
              <span className="font-semibold text-white/90">{dateStr}</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Customer / Client:</span>
              <span className="font-semibold text-white">{customerName || 'Walk-in Customer'}</span>
            </div>
            {vehicleOrJobDetails && (
              <div className="col-span-2">
                <span className="text-white/40 block text-[9px] uppercase tracking-wider">Job / Plate:</span>
                <span className="font-semibold text-white/90">{vehicleOrJobDetails}</span>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="border-t border-dashed border-white/20 pt-2 space-y-1.5">
            {items.length === 0 ? (
              <div className="text-white/40 text-center py-2 italic text-[11px]">No items listed</div>
            ) : (
              items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <span className="font-medium text-white/80 flex-1 pr-2">
                    {idx + 1}. {it.title}
                  </span>
                  <span className="font-semibold text-emerald-400 whitespace-nowrap">
                    {currencySymbol}{it.price.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Total & Paid Badge */}
          <div className="border-t border-white/10 pt-2 space-y-2">
            <div className="flex justify-between items-center font-bold text-sm">
              <span className="text-white/80">TOTAL BILLED:</span>
              <span className="text-base text-emerald-400 font-semibold">{currencySymbol}{agreedPrice.toFixed(2)}</span>
            </div>

            <div className="p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-center font-semibold text-[11px] uppercase tracking-wider text-emerald-300 flex items-center justify-center space-x-1.5">
              <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-400" />
              <span>PAID & RECONCILED</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyReceipt}
            className="py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/70" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-semibold text-xs rounded-xl border border-blue-400/30 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
