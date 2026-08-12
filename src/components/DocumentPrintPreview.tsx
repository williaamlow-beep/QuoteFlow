import React from 'react';
import { BusinessProfile, Invoice, Quote } from '../types';

interface DocumentPrintPreviewProps {
  document: Quote | Invoice;
  type: 'quote' | 'invoice';
  profile: BusinessProfile;
  elementId?: string;
}

export const DocumentPrintPreview: React.FC<DocumentPrintPreviewProps> = ({
  document: doc,
  type,
  profile,
  elementId = 'printable-document',
}) => {
  const currency = profile.currencySymbol || '$';
  const isQuote = type === 'quote';
  const quote = isQuote ? (doc as Quote) : null;
  const invoice = !isQuote ? (doc as Invoice) : null;

  return (
    <div
      id={elementId}
      className="bg-white text-slate-900 p-8 sm:p-10 max-w-3xl mx-auto border border-slate-200 shadow-md rounded-2xl font-sans"
    >
      {/* 1. Company Header & Logo */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
        <div className="flex items-start gap-4">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shrink-0">
              ⚡
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">{profile.address}</p>
            <p className="text-xs text-slate-600">
              Phone: {profile.phone} | Email: {profile.email}
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right">
          <span className="inline-block text-2xl font-black uppercase tracking-wider text-slate-900">
            {isQuote ? 'QUOTATION' : 'INVOICE'}
          </span>
          <p className="text-sm font-bold text-slate-700 mt-1">
            #{isQuote ? quote?.quoteNumber : invoice?.invoiceNumber}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Issued: {doc.issueDate}
          </p>
          <p className="text-xs font-semibold text-slate-700">
            {isQuote ? `Valid Until: ${quote?.expiryDate}` : `Due Date: ${invoice?.dueDate}`}
          </p>
        </div>
      </div>

      {/* 2. Bill To & Service Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
        <div>
          <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
            CLIENT DETAILS
          </span>
          <p className="font-bold text-slate-900 text-sm">{doc.customerName}</p>
          <p className="text-slate-600">{doc.customerPhone}</p>
          <p className="text-slate-600">{doc.customerEmail}</p>
        </div>

        <div>
          <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
            SERVICE ADDRESS
          </span>
          <p className="font-medium text-slate-800 leading-relaxed">
            {doc.serviceAddress || 'Client Registered Address'}
          </p>
        </div>
      </div>

      {/* 3. Itemized Services Table */}
      <div className="my-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
              <th className="p-3 rounded-l-lg">Item / Service Description</th>
              <th className="p-3 text-center">Qty / Unit</th>
              <th className="p-3 text-right">Rate</th>
              <th className="p-3 text-right rounded-r-lg">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {doc.lineItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-3">
                  <p className="font-bold text-slate-900">{item.description}</p>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                    {item.category}
                  </span>
                </td>
                <td className="p-3 text-center font-semibold text-slate-700">
                  {item.quantity} {item.unit || ''}
                </td>
                <td className="p-3 text-right text-slate-700">
                  {currency}{item.unitPrice.toFixed(2)}
                </td>
                <td className="p-3 text-right font-extrabold text-slate-900">
                  {currency}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Financial Calculations Box */}
      <div className="flex justify-end my-6">
        <div className="w-full sm:w-72 space-y-2 text-xs border-t-2 border-slate-900 pt-3">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span>{currency}{doc.subtotal.toFixed(2)}</span>
          </div>

          {doc.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discount:</span>
              <span>-{currency}{doc.discountAmount.toFixed(2)}</span>
            </div>
          )}

          {doc.taxAmount > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({profile.taxName}):</span>
              <span>+{currency}{doc.taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-300">
            <span>Total Amount:</span>
            <span>{currency}{doc.total.toFixed(2)}</span>
          </div>

          {isQuote && quote?.depositRequired && (
            <div className="flex justify-between font-bold text-amber-700 pt-1">
              <span>Upfront Deposit Due:</span>
              <span>{currency}{quote.depositAmount.toFixed(2)}</span>
            </div>
          )}

          {!isQuote && invoice && (
            <>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Amount Paid:</span>
                <span>{currency}{invoice.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-rose-700 text-sm pt-1 border-t border-dashed border-slate-300">
                <span>Balance Due:</span>
                <span>{currency}{invoice.balanceDue.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 5. Photos Attachments (Customer Visible Only) */}
      {doc.photos && doc.photos.filter((p) => p.isCustomerVisible).length > 0 && (
        <div className="my-6 pt-4 border-t border-slate-200">
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 block mb-3">
            JOB INSPECTION PHOTOS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {doc.photos
              .filter((p) => p.isCustomerVisible)
              .map((photo, pIdx) => (
                <div
                  key={pIdx}
                  className="border border-slate-200 rounded-xl overflow-hidden text-[10px] bg-slate-50"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold text-slate-800 line-clamp-1">
                      {photo.damageArea || 'Site Area'}
                    </p>
                    <p className="text-slate-500 line-clamp-2 mt-0.5">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. Payment Instructions & Terms */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] pt-4 border-t border-slate-200">
        <div>
          <span className="font-bold uppercase tracking-wider text-slate-700 block mb-1">
            PAYMENT INSTRUCTIONS
          </span>
          <p className="text-slate-600 leading-relaxed">
            {profile.bankName && (
              <>
                Bank: {profile.bankName}
                <br />
                Account Name: {profile.accountName}
                <br />
                Account #: {profile.accountNumber}
                <br />
              </>
            )}
            {profile.paymentInstructions}
          </p>
        </div>

        <div>
          <span className="font-bold uppercase tracking-wider text-slate-700 block mb-1">
            TERMS & CONDITIONS
          </span>
          <p className="text-slate-600 leading-relaxed">
            {doc.termsAndConditions || profile.defaultTerms}
          </p>
        </div>
      </div>

      {/* 7. Customer Signature Box if signed */}
      {isQuote && quote?.customerSignatureUrl && (
        <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Customer Accepted & Signed
            </p>
            <p className="text-[10px] text-slate-500">
              Signed on: {quote.customerSignedAt || doc.issueDate}
            </p>
          </div>
          <img
            src={quote.customerSignatureUrl}
            alt="Customer Signature"
            className="h-12 max-w-[160px] object-contain border-b border-slate-900 pb-1"
          />
        </div>
      )}

      {/* Footer Thank You */}
      <div className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px]">
        Thank you for your business! Powered by QuoteFlow • {profile.name}
      </div>
    </div>
  );
};
