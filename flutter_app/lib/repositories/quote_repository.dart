import '../models/quote.dart';

abstract class IQuoteRepository {
  Future<List<Quote>> getAllQuotes();
  Future<Quote?> getQuoteById(String id);
  Future<void> saveQuote(Quote quote);
  Future<void> updateQuoteStatus(String id, QuoteStatus status);
  Future<void> deleteQuote(String id);
}

class LocalQuoteRepository implements IQuoteRepository {
  final Map<String, Quote> _inMemoryStore = {};

  LocalQuoteRepository({List<Quote>? initialQuotes}) {
    if (initialQuotes != null) {
      for (final q in initialQuotes) {
        _inMemoryStore[q.id] = q;
      }
    }
  }

  @override
  Future<List<Quote>> getAllQuotes() async {
    return _inMemoryStore.values.toList();
  }

  @override
  Future<Quote?> getQuoteById(String id) async {
    return _inMemoryStore[id];
  }

  @override
  Future<void> saveQuote(Quote quote) async {
    _inMemoryStore[quote.id] = quote;
  }

  @override
  Future<void> updateQuoteStatus(String id, QuoteStatus status) async {
    final existing = _inMemoryStore[id];
    if (existing != null) {
      _inMemoryStore[id] = Quote(
        id: existing.id,
        quoteNumber: existing.quoteNumber,
        customerId: existing.customerId,
        customerName: existing.customerName,
        serviceAddress: existing.serviceAddress,
        issueDate: existing.issueDate,
        expiryDate: existing.expiryDate,
        status: status,
        professionCategory: existing.professionCategory,
        lineItems: existing.lineItems,
        photos: existing.photos,
        subtotal: existing.subtotal,
        calloutFee: existing.calloutFee,
        travelFee: existing.travelFee,
        taxRate: existing.taxRate,
        taxAmount: existing.taxAmount,
        total: existing.total,
        depositRequired: existing.depositRequired,
        depositAmount: existing.depositAmount,
        customerNotes: existing.customerNotes,
      );
    }
  }

  @override
  Future<void> deleteQuote(String id) async {
    _inMemoryStore.remove(id);
  }
}
