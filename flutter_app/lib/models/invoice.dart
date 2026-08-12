import 'package:hive/hive.dart';
import 'quote.dart';
import 'photo_attachment.dart';

@HiveType(typeId: 7)
enum InvoiceStatus { unpaid, partiallyPaid, paid, overdue, cancelled }

@HiveType(typeId: 8)
class Invoice extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String invoiceNumber;

  @HiveField(2)
  final String convertedFromQuoteId;

  @HiveField(3)
  final String customerId;

  @HiveField(4)
  final String customerName;

  @HiveField(5)
  final String issueDate;

  @HiveField(6)
  final String dueDate;

  @HiveField(7)
  final InvoiceStatus status;

  @HiveField(8)
  final String professionCategory;

  @HiveField(9)
  final List<QuoteLineItem> lineItems;

  @HiveField(10)
  final List<PhotoAttachment> photos;

  @HiveField(11)
  final double subtotal;

  @HiveField(12)
  final double taxAmount;

  @HiveField(13)
  final double total;

  @HiveField(14)
  final double depositAmountPaid;

  @HiveField(15)
  final double amountPaid;

  @HiveField(16)
  final double balanceDue;

  Invoice({
    required this.id,
    required this.invoiceNumber,
    this.convertedFromQuoteId = '',
    required this.customerId,
    required this.customerName,
    required this.issueDate,
    required this.dueDate,
    this.status = InvoiceStatus.unpaid,
    this.professionCategory = 'General',
    this.lineItems = const [],
    this.photos = const [],
    this.subtotal = 0.0,
    this.taxAmount = 0.0,
    this.total = 0.0,
    this.depositAmountPaid = 0.0,
    this.amountPaid = 0.0,
    required this.balanceDue,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'invoiceNumber': invoiceNumber,
        'convertedFromQuoteId': convertedFromQuoteId,
        'customerId': customerId,
        'customerName': customerName,
        'issueDate': issueDate,
        'dueDate': dueDate,
        'status': status.name,
        'professionCategory': professionCategory,
        'lineItems': lineItems.map((i) => i.toJson()).toList(),
        'photos': photos.map((p) => p.toJson()).toList(),
        'subtotal': subtotal,
        'taxAmount': taxAmount,
        'total': total,
        'depositAmountPaid': depositAmountPaid,
        'amountPaid': amountPaid,
        'balanceDue': balanceDue,
      };
}
