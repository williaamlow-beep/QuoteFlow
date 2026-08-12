import '../models/customer.dart';
import '../models/quote.dart';
import '../models/invoice.dart';

class SeedData {
  static final List<Customer> customers = [
    Customer(
      id: 'cust_101',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 019-2831',
      address: '742 Evergreen Terrace, Springfield',
      defaultTradeCategory: 'Plumbers',
    ),
    Customer(
      id: 'cust_102',
      name: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 014-9922',
      address: '1048 Ocean Drive, Suite 402, Miami, FL',
      defaultTradeCategory: 'Panel Beaters & Auto Body',
    ),
  ];

  static final List<Quote> quotes = [
    Quote(
      id: 'q_1001',
      quoteNumber: 'QT-2026-1001',
      customerId: 'cust_101',
      customerName: 'Sarah Jenkins',
      serviceAddress: '742 Evergreen Terrace, Springfield',
      issueDate: '2026-08-10',
      expiryDate: '2026-08-17',
      status: QuoteStatus.accepted,
      professionCategory: 'Plumbers',
      lineItems: [
        QuoteLineItem(
          id: 'li_1',
          description: 'Standard Plumbing Call-out & Diagnostic Fee',
          category: 'callout',
          quantity: 1,
          unitPrice: 95.0,
          unit: 'visit',
          amount: 95.0,
        ),
        QuoteLineItem(
          id: 'li_2',
          description: 'Hydro-Jetting Drain Clearing & Leak Repair Labor',
          category: 'labor',
          quantity: 2.5,
          unitPrice: 110.0,
          unit: 'hrs',
          amount: 275.0,
        ),
        QuoteLineItem(
          id: 'li_3',
          description: 'High-Pressure Brass Shutoff Valve & Flex Fitting Kit',
          category: 'materials',
          quantity: 1,
          unitPrice: 85.0,
          unit: 'set',
          amount: 85.0,
        ),
      ],
      subtotal: 455.0,
      taxRate: 8.25,
      taxAmount: 37.54,
      total: 492.54,
      depositRequired: true,
      depositAmount: 246.27,
      customerNotes: 'Please call 15 minutes before arrival.',
    ),
  ];

  static final List<Invoice> invoices = [
    Invoice(
      id: 'inv_1001',
      invoiceNumber: 'INV-2026-1001',
      convertedFromQuoteId: 'q_1001',
      customerId: 'cust_101',
      customerName: 'Sarah Jenkins',
      issueDate: '2026-08-11',
      dueDate: '2026-08-25',
      status: InvoiceStatus.unpaid,
      professionCategory: 'Plumbers',
      lineItems: [
        QuoteLineItem(
          id: 'li_1',
          description: 'Standard Plumbing Call-out & Diagnostic Fee',
          category: 'callout',
          quantity: 1,
          unitPrice: 95.0,
          unit: 'visit',
          amount: 95.0,
        ),
        QuoteLineItem(
          id: 'li_2',
          description: 'Hydro-Jetting Drain Clearing & Leak Repair Labor',
          category: 'labor',
          quantity: 2.5,
          unitPrice: 110.0,
          unit: 'hrs',
          amount: 275.0,
        ),
      ],
      subtotal: 370.0,
      taxAmount: 30.525,
      total: 400.525,
      depositAmountPaid: 200.0,
      amountPaid: 200.0,
      balanceDue: 200.525,
    )
  ];
}
