import 'package:hive/hive.dart';

@HiveType(typeId: 1)
class Customer extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String email;

  @HiveField(3)
  final String phone;

  @HiveField(4)
  final String address;

  @HiveField(5)
  final String defaultTradeCategory;

  @HiveField(6)
  final String notes;

  Customer({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.address,
    this.defaultTradeCategory = 'General',
    this.notes = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
        'defaultTradeCategory': defaultTradeCategory,
        'notes': notes,
      };

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        address: json['address'] ?? '',
        defaultTradeCategory: json['defaultTradeCategory'] ?? 'General',
        notes: json['notes'] ?? '',
      );
}
