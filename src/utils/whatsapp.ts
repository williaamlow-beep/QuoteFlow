import { BusinessProfile, Invoice, Quote } from '../types';

export function formatPhoneNumberForWhatsApp(phone: string): string {
  // Strip all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  return cleaned;
}

// Generate printable PDF link string
export function getPdfShareUrl(docNumber: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}?doc=${encodeURIComponent(docNumber)}&mode=print`;
}

export function generateQuoteWhatsAppText(
  quote: Quote,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  const pdfUrl = getPdfShareUrl(quote.quoteNumber);
  
  const depositText = quote.depositRequired
    ? `\n📌 *Deposit Required:* ${currency}${quote.depositAmount.toFixed(2)} (${quote.depositType === 'percentage' ? quote.depositValue + '%' : 'Upfront'})`
    : '';

  const categoryNote = quote.professionCategory
    ? `\n🛠️ *Trade Service:* ${quote.professionCategory}`
    : '';

  return `Hi ${quote.customerName}! 👋

Here is your quote from *${profile.name}*:

📄 *Quote Ref:* ${quote.quoteNumber}${categoryNote}
📅 *Issue Date:* ${quote.issueDate}
⏳ *Valid Until:* ${quote.expiryDate}
💵 *Total Amount:* *${currency}${quote.total.toFixed(2)}*${depositText}

*Included Services:*
${quote.lineItems
  .slice(0, 4)
  .map((item) => `• ${item.description} (${currency}${item.amount.toFixed(2)})`)
  .join('\n')}${quote.lineItems.length > 4 ? `\n• ...and ${quote.lineItems.length - 4} more items` : ''}

🔗 *View Full PDF & Photos:* ${pdfUrl}

Reply *'ACCEPT'* to approve or let us know if you need any changes. Thank you!

Best regards,
*${profile.name}*
📞 ${profile.phone}`;
}

export function generateQuoteFollowupWhatsAppText(
  quote: Quote,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  return `Hi ${quote.customerName}! 👋

Following up on Quotation *${quote.quoteNumber}* for *${currency}${quote.total.toFixed(2)}* sent on ${quote.issueDate}.

It is scheduled to expire on *${quote.expiryDate}*.

Would you like us to lock in this date for you or adjust any line items?

Warm regards,
*${profile.name}*
📞 ${profile.phone}`;
}

export function generateQuoteAcceptedThankYouWhatsAppText(
  quote: Quote,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  const depositInfo = quote.depositRequired
    ? `\n\n📌 *Deposit Received:* ${currency}${quote.depositAmount.toFixed(2)}\n💳 *Remaining Balance Due Upon Completion:* ${currency}${(quote.total - quote.depositAmount).toFixed(2)}`
    : '';

  return `Hi ${quote.customerName}! 🎉

Thank you for accepting Quotation *${quote.quoteNumber}* (${currency}${quote.total.toFixed(2)})!

We have confirmed your job on our calendar.${depositInfo}

Our team will see you at *${quote.serviceAddress || 'the job site'}*. Please reach out if you have any questions prior to arrival!

Best regards,
*${profile.name}*
📞 ${profile.phone}`;
}

export function generateDepositRequestWhatsAppText(
  quote: Quote,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  return `Hi ${quote.customerName}! 👋

To confirm Quotation *${quote.quoteNumber}* and reserve your job date, please arrange the upfront deposit:

💵 *Deposit Amount:* *${currency}${quote.depositAmount.toFixed(2)}*
💳 *Total Quote Value:* ${currency}${quote.total.toFixed(2)}

*Payment Details:*
${profile.paymentInstructions || 'Bank transfer / Zelle to ' + profile.phone}

Please share a screenshot of the confirmation once sent. Thank you!

Best regards,
*${profile.name}*`;
}

export function generateInvoiceWhatsAppText(
  invoice: Invoice,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  const balanceText = `${currency}${invoice.balanceDue.toFixed(2)}`;
  const pdfUrl = getPdfShareUrl(invoice.invoiceNumber);

  return `Hi ${invoice.customerName}! 👋

Here is Invoice *${invoice.invoiceNumber}* from *${profile.name}*:

📄 *Invoice Ref:* ${invoice.invoiceNumber}
📅 *Due Date:* ${invoice.dueDate}
💵 *Total Amount:* ${currency}${invoice.total.toFixed(2)}
💳 *Balance Due:* *${balanceText}*

*Payment Instructions:*
${invoice.paymentInstructions || profile.paymentInstructions || 'Bank transfer / Zelle to ' + profile.phone}

🔗 *View Invoice PDF:* ${pdfUrl}

Thank you for choosing *${profile.name}*! Please reply to confirm once payment is sent.

Best regards,
*${profile.name}*`;
}

export function generateInvoiceReminderWhatsAppText(
  invoice: Invoice,
  profile: BusinessProfile
): string {
  const currency = profile.currencySymbol || '$';
  return `Hi ${invoice.customerName},

Friendly reminder regarding Invoice *${invoice.invoiceNumber}* from *${profile.name}*.

💵 *Outstanding Balance:* *${currency}${invoice.balanceDue.toFixed(2)}*
📅 *Due Date:* ${invoice.dueDate}

Please arrange payment at your earliest convenience:
${invoice.paymentInstructions || profile.paymentInstructions || 'Bank transfer / Zelle to ' + profile.phone}

If you have already paid, please ignore this message or send the transfer receipt. Thank you!

*${profile.name}*
📞 ${profile.phone}`;
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = formatPhoneNumberForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

