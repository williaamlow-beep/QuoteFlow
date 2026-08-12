import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Copy,
  ExternalLink,
  Sparkles,
  Check,
  Send,
} from 'lucide-react';
import { BusinessProfile, Invoice, Quote } from '../types';
import {
  buildWhatsAppUrl,
  generateDepositRequestWhatsAppText,
  generateInvoiceReminderWhatsAppText,
  generateInvoiceWhatsAppText,
  generateQuoteAcceptedThankYouWhatsAppText,
  generateQuoteFollowupWhatsAppText,
  generateQuoteWhatsAppText,
} from '../utils/whatsapp';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Quote | Invoice | null;
  type: 'quote' | 'invoice';
  profile: BusinessProfile;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  type,
  profile,
}) => {
  if (!isOpen || !doc) return null;

  const currency = profile.currencySymbol || '$';
  const isQuote = type === 'quote';
  const quote = isQuote ? (doc as Quote) : null;
  const invoice = !isQuote ? (doc as Invoice) : null;

  const [msgType, setMsgType] = useState<
    'quote_send' | 'quote_followup' | 'quote_accepted' | 'deposit_request' | 'invoice_send' | 'payment_reminder'
  >(isQuote ? 'quote_send' : 'invoice_send');

  const getDefaultText = () => {
    if (isQuote && quote) {
      if (msgType === 'quote_followup') {
        return generateQuoteFollowupWhatsAppText(quote, profile);
      }
      if (msgType === 'quote_accepted') {
        return generateQuoteAcceptedThankYouWhatsAppText(quote, profile);
      }
      if (msgType === 'deposit_request') {
        return generateDepositRequestWhatsAppText(quote, profile);
      }
      return generateQuoteWhatsAppText(quote, profile);
    } else if (invoice) {
      if (msgType === 'payment_reminder') {
        return generateInvoiceReminderWhatsAppText(invoice, profile);
      }
      return generateInvoiceWhatsAppText(invoice, profile);
    }
    return '';
  };

  const [messageText, setMessageText] = useState(getDefaultText());
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const phone = doc.customerPhone || '';
    const url = buildWhatsAppUrl(phone, messageText);
    window.open(url, '_blank');
  };

  const handleAiRefineText = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/generate-whatsapp-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: msgType,
          customerName: doc.customerName,
          docNumber: isQuote ? quote?.quoteNumber : invoice?.invoiceNumber,
          total: `${currency}${doc.total.toFixed(2)}`,
          deposit: quote?.depositRequired ? `${currency}${quote.depositAmount.toFixed(2)}` : undefined,
          dueDate: isQuote ? quote?.expiryDate : invoice?.dueDate,
          businessName: profile.name,
          trade: profile.primaryTrade,
        }),
      });

      const data = await res.json();
      if (data.messageText) {
        setMessageText(data.messageText);
      }
    } catch (err) {
      console.error('Failed to generate WhatsApp copy:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <h3 className="font-bold text-lg">Send via WhatsApp</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {/* Preset Message Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Message Preset:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {isQuote ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('quote_send');
                      if (quote) setMessageText(generateQuoteWhatsAppText(quote, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'quote_send'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Send Quotation
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('quote_followup');
                      if (quote) setMessageText(generateQuoteFollowupWhatsAppText(quote, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'quote_followup'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Quote Follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('quote_accepted');
                      if (quote) setMessageText(generateQuoteAcceptedThankYouWhatsAppText(quote, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'quote_accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Thank You (Accepted)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('deposit_request');
                      if (quote) setMessageText(generateDepositRequestWhatsAppText(quote, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'deposit_request'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Deposit Request
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('invoice_send');
                      if (invoice) setMessageText(generateInvoiceWhatsAppText(invoice, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'invoice_send'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Send Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMsgType('payment_reminder');
                      if (invoice) setMessageText(generateInvoiceReminderWhatsAppText(invoice, profile));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border cursor-pointer transition-colors ${
                      msgType === 'payment_reminder'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Payment Reminder
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Refine Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Customer: <span className="font-bold text-slate-900">{doc.customerName}</span> ({doc.customerPhone || 'No Phone'})
            </span>
            <button
              onClick={handleAiRefineText}
              disabled={isAiLoading}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAiLoading ? 'Writing...' : 'AI Refine Copy'}</span>
            </button>
          </div>

          {/* Message Textarea */}
          <textarea
            rows={8}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-xs font-mono outline-none resize-none"
          />

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Open WhatsApp & Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
