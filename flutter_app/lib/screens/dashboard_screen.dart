import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/quote_provider.dart';
import '../models/quote.dart';
import '../services/whatsapp_sharing_service.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quotes = ref.watch(quotesNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('QuoteFlow Mobile', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.indigo[900],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () {
              Navigator.pushNamed(context, '/quote-builder');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Metrics
            Card(
              color: Colors.indigo[50],
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Active Quotes', style: TextStyle(color: Colors.indigo, fontSize: 12, fontWeight: FontWeight.bold)),
                        Text('${quotes.length}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.indigo)),
                      ],
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.indigo[700],
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () => Navigator.pushNamed(context, '/quote-builder'),
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('New Quote'),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            const Text('Recent Quotations', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),

            if (quotes.isEmpty)
              const Center(child: Text('No quotes created yet.'))
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: quotes.length,
                itemBuilder: (context, index) {
                  final quote = quotes[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      title: Text(quote.customerName, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${quote.quoteNumber} • ${quote.professionCategory}'),
                      trailing: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('\$${quote.total.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
                          Chip(
                            label: Text(quote.status.name.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.white)),
                            backgroundColor: quote.status == QuoteStatus.accepted ? Colors.emerald : Colors.amber[700],
                            padding: EdgeInsets.zero,
                          ),
                        ],
                      ),
                      onTap: () {
                        WhatsAppSharingService.sendQuote(
                          quote: quote,
                          phone: '+15550192831',
                          businessName: 'Apex Trades',
                        );
                      },
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
