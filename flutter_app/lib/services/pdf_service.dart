import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/quote.dart';
import '../models/invoice.dart';

abstract class IPdfService {
  Future<Uint8List> buildQuotePdf(Quote quote, String businessName);
  Future<Uint8List> buildInvoicePdf(Invoice invoice, String businessName);
  Future<void> printOrShareDocument(Uint8List pdfBytes, String filename);
}

class PdfService implements IPdfService {
  @override
  Future<Uint8List> buildQuotePdf(Quote quote, String businessName) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            cross: pw.CrossAxisAlignment.start,
            children: [
              // Header
              pw.Row(
                main: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(businessName,
                      style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                  pw.Text('QUOTATION',
                      style: pw.TextStyle(fontSize: 20, color: PdfColors.indigo900)),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Divider(),
              pw.SizedBox(height: 10),

              // Customer & Dates Info
              pw.Row(
                main: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    cross: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Prepared For:', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                      pw.Text(quote.customerName),
                      pw.Text(quote.serviceAddress),
                    ],
                  ),
                  pw.Column(
                    cross: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text('Quote Ref: ${quote.quoteNumber}', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                      pw.Text('Date: ${quote.issueDate}'),
                      pw.Text('Valid Until: ${quote.expiryDate}'),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 20),

              // Line Items Table
              pw.TableHelper.fromTextArray(
                headers: ['Description', 'Category', 'Qty', 'Unit Price', 'Total'],
                data: quote.lineItems
                    .map((item) => [
                          item.description,
                          item.category.toUpperCase(),
                          '${item.quantity} ${item.unit}',
                          '\$${item.unitPrice.toStringAsFixed(2)}',
                          '\$${item.amount.toStringAsFixed(2)}',
                        ])
                    .toList(),
              ),
              pw.SizedBox(height: 20),

              // Total Summary
              pw.Row(
                main: pw.MainAxisAlignment.end,
                children: [
                  pw.Column(
                    cross: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text('Subtotal: \$${quote.subtotal.toStringAsFixed(2)}'),
                      pw.Text('Tax (${quote.taxRate}%): \$${quote.taxAmount.toStringAsFixed(2)}'),
                      pw.Divider(),
                      pw.Text('TOTAL: \$${quote.total.toStringAsFixed(2)}',
                          style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold)),
                      if (quote.depositRequired)
                        pw.Text('Required Upfront Deposit: \$${quote.depositAmount.toStringAsFixed(2)}',
                            style: pw.TextStyle(color: PdfColors.amber900, fontWeight: pw.FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  @override
  Future<Uint8List> buildInvoicePdf(Invoice invoice, String businessName) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            cross: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                main: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(businessName, style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                  pw.Text('INVOICE', style: pw.TextStyle(fontSize: 20, color: PdfColors.emerald900)),
                ],
              ),
              pw.SizedBox(height: 10),
              pw.Divider(),
              pw.SizedBox(height: 10),
              pw.Text('Invoice Ref: ${invoice.invoiceNumber}', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
              pw.Text('Customer: ${invoice.customerName}'),
              pw.Text('Due Date: ${invoice.dueDate}'),
              pw.SizedBox(height: 20),

              pw.TableHelper.fromTextArray(
                headers: ['Description', 'Qty', 'Unit Price', 'Amount'],
                data: invoice.lineItems
                    .map((item) => [
                          item.description,
                          '${item.quantity} ${item.unit}',
                          '\$${item.unitPrice.toStringAsFixed(2)}',
                          '\$${item.amount.toStringAsFixed(2)}',
                        ])
                    .toList(),
              ),
              pw.SizedBox(height: 20),

              pw.Row(
                main: pw.MainAxisAlignment.end,
                children: [
                  pw.Column(
                    cross: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text('Total Amount: \$${invoice.total.toStringAsFixed(2)}'),
                      pw.Text('Amount Paid: \$${invoice.amountPaid.toStringAsFixed(2)}'),
                      pw.Divider(),
                      pw.Text('BALANCE DUE: \$${invoice.balanceDue.toStringAsFixed(2)}',
                          style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold, color: PdfColors.red900)),
                    ],
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  @override
  Future<void> printOrShareDocument(Uint8List pdfBytes, String filename) async {
    await Printing.sharePdf(bytes: pdfBytes, filename: filename);
  }
}
