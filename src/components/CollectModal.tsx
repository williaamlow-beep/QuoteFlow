import React, { useState } from 'react';
import {
  QrCode,
  X,
  Copy,
  Check,
  CreditCard,
  Smartphone,
  Banknote,
  Share2
} from 'lucide-react';

interface CollectModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  agreedPrice: number;
  currencySymbol: string;
  customerName: string;
}

export const CollectModal: React.FC<CollectModalProps> = ({
  isOpen,
  onClose,
  businessName,
  agreedPrice,
  currencySymbol,
  customerName,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'paynow_duitnow' | 'bank_transfer' | 'cash'>('paynow_duitnow');

  if (!isOpen) return null;

  const paymentText = `Payment Request from ${businessName}\nAmount Due: ${currencySymbol}${agreedPrice.toFixed(2)}\nCustomer: ${customerName || 'Valued Customer'}\nRef: ${Date.now().toString().slice(-6)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 text-white">
      <div
        id="collect-payment-modal"
        className="bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl shadow-indigo-950/50 text-center max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
              <QrCode className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-sm tracking-wide text-white">Instant Digital Collect</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Hero */}
        <div className="p-4 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl space-y-1 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
            Payment Due for {customerName || 'Current Quote'}
          </span>
          <div className="font-bold text-2xl text-white">
            {currencySymbol}{agreedPrice.toFixed(2)}
          </div>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl text-[10px] font-semibold uppercase tracking-wider">
          <button
            onClick={() => setSelectedMethod('paynow_duitnow')}
            className={`py-2 rounded-lg border transition-all ${
              selectedMethod === 'paynow_duitnow'
                ? 'bg-blue-600 border-blue-400/40 shadow-sm text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            QR / PayNow
          </button>
          <button
            onClick={() => setSelectedMethod('bank_transfer')}
            className={`py-2 rounded-lg border transition-all ${
              selectedMethod === 'bank_transfer'
                ? 'bg-blue-600 border-blue-400/40 shadow-sm text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Bank Transfer
          </button>
          <button
            onClick={() => setSelectedMethod('cash')}
            className={`py-2 rounded-lg border transition-all ${
              selectedMethod === 'cash'
                ? 'bg-blue-600 border-blue-400/40 shadow-sm text-white'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Cash / POS
          </button>
        </div>

        {/* Visual Payment Code Area */}
        <div className="p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl space-y-2">
          {selectedMethod === 'paynow_duitnow' && (
            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl shadow-md text-black">
                {/* SVG Mock of Crisp High Contrast QR Code */}
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                  <rect x="40" y="10" width="8" height="8" />
                  <rect x="52" y="10" width="8" height="8" />
                  <rect x="40" y="24" width="20" height="8" />
                  <rect x="10" y="40" width="12" height="12" />
                  <rect x="30" y="40" width="10" height="10" />
                  <rect x="50" y="40" width="10" height="10" />
                  <rect x="70" y="40" width="20" height="8" />
                  <rect x="40" y="60" width="12" height="12" />
                  <rect x="60" y="60" width="8" height="20" />
                  <rect x="75" y="60" width="15" height="10" />
                  <rect x="75" y="78" width="15" height="15" />
                  <rect x="40" y="80" width="12" height="12" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold text-white/80">
                Scan to Pay (DuitNow / PayNow / UPI)
              </span>
            </div>
          )}

          {selectedMethod === 'bank_transfer' && (
            <div className="text-left space-y-1.5 font-mono text-xs p-2">
              <div className="font-semibold text-white/40 uppercase text-[10px] tracking-wider">Bank Details</div>
              <div className="font-bold text-white">{businessName}</div>
              <div className="text-white/80">DBS / Maybank Account: <span className="font-semibold text-blue-400">128-492-0192</span></div>
              <div className="text-white/40 text-[10px]">Reference: Quotation Ref #{Date.now().toString().slice(-4)}</div>
            </div>
          )}

          {selectedMethod === 'cash' && (
            <div className="space-y-1 py-3 text-center">
              <Banknote className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="font-semibold text-xs text-white">Accept Exact Cash or Card Terminal</div>
              <div className="text-[11px] text-white/50">Collect {currencySymbol}{agreedPrice.toFixed(2)} and issue digital receipt</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopyLink}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-semibold text-xs rounded-xl border border-blue-400/30 shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-[0.98]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Payment Details Copied!' : 'Copy Payment Link & Details'}</span>
        </button>
      </div>
    </div>
  );
};
