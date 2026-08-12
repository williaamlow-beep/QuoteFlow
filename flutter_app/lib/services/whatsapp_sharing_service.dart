import 'package:url_launcher/url_launcher.dart';
import '../models/quote.dart';
import '../models/invoice.dart';

class WhatsAppSharingService {
  /// Strips non-digit characters and ensures E.164 phone format
  static String formatPhone(String rawPhone) {
    String cleaned = rawPhone.replaceAll(RegExp(r'\D'), '');
    if (cleaned.length == 10) {
      cleaned = '1$cleaned'; // Default US/Canada country code if 10 digits
    }
    return cleaned;
  }

  /// One-tap dispatch for Quotation via WhatsApp wa.me deep link
  static Future<bool> sendQuote({
    required Quote quote,
    required String phone,
    required String businessName,
    String? pdfLink,
  }) async {
    final cleanNumber = formatPhone(phone);
    final link = pdfLink ?? 'https://quoteflow.app/doc/${quote.quoteNumber}';
    final depositMsg = quote.depositRequired
        ? '\n📌 *Deposit Required:* \$${quote.depositAmount.toStringAsFixed(2)}'
        : '';

    final text = '''
Hi ${quote.customerName}! 👋

Here is your quote from *$businessName*:

📄 *Quote Ref:* ${quote.quoteNumber}
🛠️ *Service Category:* ${quote.professionCategory}
💵 *Total:* *\$${quote.total.toStringAsFixed(2)}*$depositMsg

*Included Line Items:*
${quote.lineItems.take(4).map((i) => '• ${i.description} (\$${i.amount.toStringAsFixed(2)})').join('\n')}

🔗 *View Full PDF & Photos:* $link

Reply *'ACCEPT'* to lock in your job date. Thank you!
''';

    final uri = Uri.parse('https://wa.me/$cleanNumber?text=${Uri.encodeComponent(text)}');
    return await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  /// Dispatch Invoice Reminder via WhatsApp
  static Future<bool> sendInvoiceReminder({
    required Invoice invoice,
    required String phone,
    required String businessName,
  }) async {
    final cleanNumber = formatPhone(phone);
    final text = '''
Hi ${invoice.customerName},

Friendly reminder regarding Invoice *${invoice.invoiceNumber}* from *$businessName*.

💵 *Outstanding Balance:* *\$${invoice.balanceDue.toStringAsFixed(2)}*
📅 *Due Date:* ${invoice.dueDate}

Please arrange payment at your earliest convenience. If already paid, please ignore this notice. Thank you!
''';

    final uri = Uri.parse('https://wa.me/$cleanNumber?text=${Uri.encodeComponent(text)}');
    return await launchUrl(uri, mode: LaunchMode.externalApplication);
  }
}
