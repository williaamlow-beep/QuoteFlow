import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/quote.dart';
import '../models/invoice.dart';
import '../repositories/quote_repository.dart';
import '../repositories/invoice_repository.dart';
import '../services/quote_to_invoice_converter.dart';
import '../data/seed_data.dart';

final quoteRepositoryProvider = Provider<IQuoteRepository>((ref) {
  return LocalQuoteRepository(initialQuotes: SeedData.quotes);
});

final invoiceRepositoryProvider = Provider<IInvoiceRepository>((ref) {
  return LocalInvoiceRepository(initialInvoices: SeedData.invoices);
});

final quotesNotifierProvider = StateNotifierProvider<QuotesNotifier, List<Quote>>((ref) {
  final repo = ref.watch(quoteRepositoryProvider);
  return QuotesNotifier(repo);
});

class QuotesNotifier extends StateNotifier<List<Quote>> {
  final IQuoteRepository _repository;

  QuotesNotifier(this._repository) : super([]) {
    _loadQuotes();
  }

  Future<void> _loadQuotes() async {
    state = await _repository.getAllQuotes();
  }

  Future<void> addQuote(Quote quote) async {
    await _repository.saveQuote(quote);
    state = await _repository.getAllQuotes();
  }

  Future<void> updateStatus(String quoteId, QuoteStatus status) async {
    await _repository.updateQuoteStatus(quoteId, status);
    state = await _repository.getAllQuotes();
  }

  /// Converts an accepted quote to invoice and returns the created Invoice instance
  Future<Invoice> convertQuoteToInvoice(Quote quote, WidgetRef ref) async {
    await updateStatus(quote.id, QuoteStatus.converted);
    final invoice = QuoteToInvoiceConverter.convert(quote);
    await ref.read(invoiceRepositoryProvider).saveInvoice(invoice);
    return invoice;
  }
}
