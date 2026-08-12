import '../models/invoice.dart';

abstract class IInvoiceRepository {
  Future<List<Invoice>> getAllInvoices();
  Future<Invoice?> getInvoiceById(String id);
  Future<void> saveInvoice(Invoice invoice);
  Future<void> updateInvoiceStatus(String id, InvoiceStatus status, double amountPaid);
  Future<void> deleteInvoice(String id);
}

class LocalInvoiceRepository implements IInvoiceRepository {
  final Map<String, Invoice> _inMemoryStore = {};

  LocalInvoiceRepository({List<Invoice>? initialInvoices}) {
    if (initialInvoices != null) {
      for (final inv in initialInvoices) {
        _inMemoryStore[inv.id] = inv;
      }
    }
  }

  @override
  Future<List<Invoice>> getAllInvoices() async {
    return _inMemoryStore.values.toList();
  }

  @override
  Future<Invoice?> getInvoiceById(String id) async {
    return _inMemoryStore[id];
  }

  @override
  Future<void> saveInvoice(Invoice invoice) async {
    _inMemoryStore[invoice.id] = invoice;
  }

  @override
  Future<void> updateInvoiceStatus(String id, InvoiceStatus status, double amountPaid) async {
    final existing = _inMemoryStore[id];
    if (existing != null) {
      final double totalPaid = existing.amountPaid + amountPaid;
      final double balance = (existing.total - totalPaid).clamp(0.0, double.infinity);

      _inMemoryStore[id] = Invoice(
        id: existing.id,
        invoiceNumber: existing.invoiceNumber,
        convertedFromQuoteId: existing.convertedFromQuoteId,
        customerId: existing.customerId,
        customerName: existing.customerName,
        issueDate: existing.issueDate,
        dueDate: existing.dueDate,
        status: balance == 0.0 ? InvoiceStatus.paid : status,
        professionCategory: existing.professionCategory,
        lineItems: existing.lineItems,
        photos: existing.photos,
        subtotal: existing.subtotal,
        taxAmount: existing.taxAmount,
        total: existing.total,
        depositAmountPaid: existing.depositAmountPaid,
        amountPaid: totalPaid,
        balanceDue: balance,
      );
    }
  }

  @override
  Future<void> deleteInvoice(String id) async {
    _inMemoryStore.remove(id);
  }
}
