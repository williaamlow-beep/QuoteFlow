import React, { useState } from 'react';
import { SignaturePad } from './SignaturePad';

interface InteractiveQuoteAcceptanceProps {
  quoteId: string;
  quoteNumber: string;
  depositAmount: number;
  currencySymbol?: string;
  onAcceptAndPay: (signatureDataUrl: string) => Promise<void>;
}

export const InteractiveQuoteAcceptance: React.FC<InteractiveQuoteAcceptanceProps> = ({
  quoteId,
  quoteNumber,
  depositAmount,
  currencySymbol = '$',
  onAcceptAndPay,
}) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptance = async () => {
    if (!signature) {
      alert('Please provide a signature to accept the quotation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAcceptAndPay(signature);
    } catch (err) {
      console.error(err);
      alert('Failed to process approval. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-base font-bold text-gray-900 mb-1">Approve Quotation</h3>
      <p className="text-xs text-gray-500 mb-4">
        Review the terms and sign below to accept Quote #{quoteNumber}.
      </p>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Customer Digital Signature
        </label>
        <SignaturePad
          onSave={(dataUrl) => setSignature(dataUrl)}
          onClear={() => setSignature(null)}
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-blue-800 uppercase block">Required Deposit</span>
            <span className="text-xs text-blue-600">Confirms schedule & job materials</span>
          </div>
          <span className="text-xl font-bold text-blue-900">
            {currencySymbol}{depositAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={!signature || isSubmitting}
        onClick={handleAcceptance}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
          !signature || isSubmitting
            ? 'bg-gray-300 cursor-not-allowed shadow-none'
            : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
        }`}
      >
        {isSubmitting ? (
          <span>Processing Approval...</span>
        ) : (
          <span>Sign & Pay Deposit ({currencySymbol}{depositAmount.toFixed(2)})</span>
        )}
      </button>
    </div>
  );
};
