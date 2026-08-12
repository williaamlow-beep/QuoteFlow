import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../models/quote.dart';
import '../models/invoice.dart';

class QuoteToInvoiceConverter {
  static const Uuid _uuid = Uuid();

  /// Converts an accepted [Quote] into a new [Invoice] instance.
  static Invoice convert(Quote quote, {int paymentTermsDays = 14}) {
    final now = DateTime.now();
    final dueDateObj = now.add(Duration(days: paymentTermsDays));
    final dateFormat = DateFormat('yyyy-MM-dd');

    final invoiceNumber = quote.quoteNumber.replaceAll('QT-', 'INV-');
    final double initialPaid = quote.depositRequired ? quote.depositAmount : 0.0;
    final double balance = (quote.total - initialPaid).clamp(0.0, double.infinity);

    return Invoice(
      id: _uuid.v4(),
      invoiceNumber: invoiceNumber,
      convertedFromQuoteId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      issueDate: dateFormat.format(now),
      dueDate: dateFormat.format(dueDateObj),
      status: balance == 0.0 ? InvoiceStatus.paid : InvoiceStatus.unpaid,
      professionCategory: quote.professionCategory,
      lineItems: List.from(quote.lineItems),
      photos: List.from(quote.photos),
      subtotal: quote.subtotal,
      taxAmount: quote.taxAmount,
      total: quote.total,
      depositAmountPaid: initialPaid,
      amountPaid: initialPaid,
      balanceDue: balance,
    );
  }
}
