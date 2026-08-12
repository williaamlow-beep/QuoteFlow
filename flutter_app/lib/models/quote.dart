import 'package:hive/hive.dart';
import 'photo_attachment.dart';

@HiveType(typeId: 4)
class QuoteLineItem {
  final String id;
  final String description;
  final String category; // 'callout', 'labor', 'materials', 'travel'
  final double quantity;
  final double unitPrice;
  final String unit;
  final double amount;

  QuoteLineItem({
    required this.id,
    required this.description,
    this.category = 'labor',
    this.quantity = 1.0,
    this.unitPrice = 0.0,
    this.unit = 'unit',
    required this.amount,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description,
        'category': category,
        'quantity': quantity,
        'unitPrice': unitPrice,
        'unit': unit,
        'amount': amount,
      };

  factory QuoteLineItem.fromJson(Map<String, dynamic> json) => QuoteLineItem(
        id: json['id'] ?? '',
        description: json['description'] ?? '',
        category: json['category'] ?? 'labor',
        quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
        unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? 0.0,
        unit: json['unit'] ?? 'unit',
        amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      );
}

@HiveType(typeId: 5)
enum QuoteStatus { draft, sent, viewed, accepted, rejected, converted }

@HiveType(typeId: 6)
class Quote extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String quoteNumber;

  @HiveField(2)
  final String customerId;

  @HiveField(3)
  final String customerName;

  @HiveField(4)
  final String serviceAddress;

  @HiveField(5)
  final String issueDate;

  @HiveField(6)
  final String expiryDate;

  @HiveField(7)
  final QuoteStatus status;

  @HiveField(8)
  final String professionCategory;

  @HiveField(9)
  final List<QuoteLineItem> lineItems;

  @HiveField(10)
  final List<PhotoAttachment> photos;

  @HiveField(11)
  final double subtotal;

  @HiveField(12)
  final double calloutFee;

  @HiveField(13)
  final double travelFee;

  @HiveField(14)
  final double taxRate;

  @HiveField(15)
  final double taxAmount;

  @HiveField(16)
  final double total;

  @HiveField(17)
  final bool depositRequired;

  @HiveField(18)
  final double depositAmount;

  @HiveField(19)
  final String customerNotes;

  Quote({
    required this.id,
    required this.quoteNumber,
    required this.customerId,
    required this.customerName,
    required this.serviceAddress,
    required this.issueDate,
    required this.expiryDate,
    this.status = QuoteStatus.draft,
    this.professionCategory = 'General',
    this.lineItems = const [],
    this.photos = const [],
    this.subtotal = 0.0,
    this.calloutFee = 0.0,
    this.travelFee = 0.0,
    this.taxRate = 8.25,
    this.taxAmount = 0.0,
    this.total = 0.0,
    this.depositRequired = false,
    this.depositAmount = 0.0,
    this.customerNotes = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'quoteNumber': quoteNumber,
        'customerId': customerId,
        'customerName': customerName,
        'serviceAddress': serviceAddress,
        'issueDate': issueDate,
        'expiryDate': expiryDate,
        'status': status.name,
        'professionCategory': professionCategory,
        'lineItems': lineItems.map((i) => i.toJson()).toList(),
        'photos': photos.map((p) => p.toJson()).toList(),
        'subtotal': subtotal,
        'calloutFee': calloutFee,
        'travelFee': travelFee,
        'taxRate': taxRate,
        'taxAmount': taxAmount,
        'total': total,
        'depositRequired': depositRequired,
        'depositAmount': depositAmount,
        'customerNotes': customerNotes,
      };
}
