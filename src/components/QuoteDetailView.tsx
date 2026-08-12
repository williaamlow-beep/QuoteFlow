import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Download,
  Printer,
  Edit2,
  Copy,
  Receipt,
  FileCheck,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { BusinessProfile, Quote } from '../types';
import { DocumentPrintPreview } from './DocumentPrintPreview';
import { SignaturePadModal } from './SignaturePadModal';
import { generateImageFromElement, generatePdfFromElement, triggerPrintWindow } from '../utils/pdfGenerator';

interface QuoteDetailViewProps {
  quote: Quote;
  profile: BusinessProfile;
  onBack: () => void;
  onEdit: (quote: Quote) => void;
  onDuplicate: (quote: Quote) => void;
  onConvertToInvoice: (quote: Quote) => void;
  onUpdateStatus: (quoteId: string, status: Quote['status']) => void;
  onWhatsAppShare: (quote: Quote) => void;
  onSaveSignature: (quoteId: string, signatureUrl: string) => void;
}

export const QuoteDetailView: React.FC<QuoteDetailViewProps> = ({
  quote,
  profile,
  onBack,
  onEdit,
  onDuplicate,
  onConvertToInvoice,
  onUpdateStatus,
  onWhatsAppShare,
  onSaveSignature,
}) => {
  const currency = profile.currencySymbol || '$';
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await generatePdfFromElement('quote-printable-doc', `${quote.quoteNumber}`);
    setIsExporting(false);
  };

  const handleDownloadImage = async () => {
    setIsExporting(true);
    await generateImageFromElement('quote-printable-doc', `${quote.quoteNumber}`);
    setIsExporting(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-28 md:pb-12">
      {/* Top Header & Actions */}
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
                {quote.quoteNumber}
              </h1>
              <select
                value={quote.status}
                onChange={(e) => onUpdateStatus(quote.id, e.target.value as any)}
                className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 outline-none cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: {quote.customerName} • Total: {currency}{quote.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Primary Action Suite */}
        <div className="flex flex-wrap items-center gap-2">
          {quote.status !== 'converted' && (
            <button
              onClick={() => onConvertToInvoice(quote)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={() => onWhatsAppShare(quote)}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2.5 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
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

          <button
            onClick={() => onEdit(quote)}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Edit Quote"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDuplicate(quote)}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Duplicate Quote"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer Signature Action Bar */}
      {!quote.customerSignatureUrl && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-amber-900 text-xs">
              Client Sign-Off Pending
            </p>
            <p className="text-[11px] text-amber-700">
              Collect on-site digital signature from {quote.customerName} to formally accept quote.
            </p>
          </div>
          <button
            onClick={() => setIsSignatureModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <FileCheck className="w-4 h-4" />
            <span>Sign & Accept</span>
          </button>
        </div>
      )}

      {/* Printable Document Canvas */}
      <DocumentPrintPreview
        document={quote}
        type="quote"
        profile={profile}
        elementId="quote-printable-doc"
      />

      {/* Signature Modal */}
      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={(sigUrl) => {
          onSaveSignature(quote.id, sigUrl);
          onUpdateStatus(quote.id, 'accepted');
        }}
        customerName={quote.customerName}
      />
    </div>
  );
};
