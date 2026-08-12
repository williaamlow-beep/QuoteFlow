import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Download,
  Printer,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { BusinessProfile, Invoice, PaymentMethod } from '../types';
import { DocumentPrintPreview } from './DocumentPrintPreview';
import { generateImageFromElement, generatePdfFromElement, triggerPrintWindow } from '../utils/pdfGenerator';

interface InvoiceDetailViewProps {
  invoice: Invoice;
  profile: BusinessProfile;
  onBack: () => void;
  onRecordPayment: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    reference?: string,
    notes?: string
  ) => void;
  onWhatsAppShare: (invoice: Invoice) => void;
}

export const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({
  invoice,
  profile,
  onBack,
  onRecordPayment,
  onWhatsAppShare,
}) => {
  const currency = profile.currencySymbol || '$';
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(invoice.balanceDue || 0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank_transfer');
  const [payReference, setPayReference] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await generatePdfFromElement('invoice-printable-doc', `${invoice.invoiceNumber}`);
    setIsExporting(false);
  };

  const handleDownloadImage = async () => {
    setIsExporting(true);
    await generateImageFromElement('invoice-printable-doc', `${invoice.invoiceNumber}`);
    setIsExporting(false);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    onRecordPayment(
      invoice.id,
      Number(payAmount),
      payMethod,
      payReference,
      payNotes
    );
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-28 md:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  invoice.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : invoice.status === 'partial'
                    ? 'bg-amber-100 text-amber-800'
                    : invoice.status === 'overdue'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: {invoice.customerName} • Total: {currency}{invoice.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex flex-wrap items-center gap-2">
          {invoice.balanceDue > 0 && (
            <button
              onClick={() => {
                setPayAmount(invoice.balanceDue);
                setIsPaymentModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          )}

          <button
            onClick={() => onWhatsAppShare(invoice)}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2.5 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Reminder</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <span>Image</span>
          </button>

          <button
            onClick={triggerPrintWindow}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balance Summary Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Payment Summary
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-black text-white">
              Total: {currency}{invoice.total.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Paid: {currency}{invoice.amountPaid.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="text-right sm:text-right">
          <p className="text-xs text-slate-400">Balance Due</p>
          <p className="text-2xl font-black text-amber-400">
            {currency}{invoice.balanceDue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Ledger History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Payment Transaction History ({invoice.payments.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {invoice.payments.map((pay) => (
              <div key={pay.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">
                    {currency}{pay.amount.toFixed(2)} ({pay.method.replace('_', ' ')})
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Date: {pay.date} {pay.reference ? `• Ref: ${pay.reference}` : ''}
                  </p>
                </div>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Received
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Document Canvas */}
      <DocumentPrintPreview
        document={invoice}
        type="invoice"
        profile={profile}
        elementId="invoice-printable-doc"
      />

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                Record Payment Received
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Amount ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={invoice.balanceDue}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-extrabold text-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium outline-none"
                >
                  <option value="bank_transfer">Bank Transfer / Zelle</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="e_wallet">E-Wallet (PayPal, Venmo, CashApp)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  placeholder="e.g. TXN-984210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
