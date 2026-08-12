import 'package:hive_flutter/hive_flutter.dart';
import '../models/customer.dart';
import '../models/quote.dart';
import '../models/invoice.dart';

class LocalStorageService {
  static const String quotesBoxName = 'quotes_box';
  static const String invoicesBoxName = 'invoices_box';
  static const String customersBoxName = 'customers_box';

  /// Initializes Hive local boxes for offline-first persistence
  static Future<void> initHive() async {
    await Hive.initFlutter();
    
    // Register adapters
    // Hive.registerAdapter(CustomerAdapter());
    // Hive.registerAdapter(QuoteAdapter());
    // Hive.registerAdapter(InvoiceAdapter());

    await Hive.openBox<Quote>(quotesBoxName);
    await Hive.openBox<Invoice>(invoicesBoxName);
    await Hive.openBox<Customer>(customersBoxName);
  }

  Box<Quote> get quotesBox => Hive.box<Quote>(quotesBoxName);
  Box<Invoice> get invoicesBox => Hive.box<Invoice>(invoicesBoxName);
  Box<Customer> get customersBox => Hive.box<Customer>(customersBoxName);
}
