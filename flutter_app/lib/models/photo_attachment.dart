import 'package:hive/hive.dart';

@HiveType(typeId: 2)
class PhotoAnnotation {
  final String id;
  final double x;
  final double y;
  final String label;
  final String colorHex;

  PhotoAnnotation({
    required this.id,
    required this.x,
    required this.y,
    required this.label,
    this.colorHex = '#ef4444',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'x': x,
        'y': y,
        'label': label,
        'colorHex': colorHex,
      };

  factory PhotoAnnotation.fromJson(Map<String, dynamic> json) => PhotoAnnotation(
        id: json['id'] ?? '',
        x: (json['x'] as num).toDouble(),
        y: (json['y'] as num).toDouble(),
        label: json['label'] ?? '',
        colorHex: json['colorHex'] ?? '#ef4444',
      );
}

@HiveType(typeId: 3)
class PhotoAttachment extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String url;

  @HiveField(2)
  final String caption;

  @HiveField(3)
  final bool isCustomerVisible;

  @HiveField(4)
  final String damageArea;

  @HiveField(5)
  final String category; // 'before', 'after', 'during', 'inspection'

  @HiveField(6)
  final List<PhotoAnnotation> annotations;

  PhotoAttachment({
    required this.id,
    required this.url,
    this.caption = '',
    this.isCustomerVisible = true,
    this.damageArea = 'General',
    this.category = 'inspection',
    this.annotations = const [],
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'url': url,
        'caption': caption,
        'isCustomerVisible': isCustomerVisible,
        'damageArea': damageArea,
        'category': category,
        'annotations': annotations.map((a) => a.toJson()).toList(),
      };

  factory PhotoAttachment.fromJson(Map<String, dynamic> json) => PhotoAttachment(
        id: json['id'] ?? '',
        url: json['url'] ?? '',
        caption: json['caption'] ?? '',
        isCustomerVisible: json['isCustomerVisible'] ?? true,
        damageArea: json['damageArea'] ?? 'General',
        category: json['category'] ?? 'inspection',
        annotations: (json['annotations'] as List<dynamic>?)
                ?.map((a) => PhotoAnnotation.fromJson(a))
                .toList() ??
            [],
      );
}
