import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/quote.dart';
import '../providers/quote_provider.dart';

class QuoteBuilderScreen extends ConsumerStatefulWidget {
  const QuoteBuilderScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<QuoteBuilderScreen> createState() => _QuoteBuilderScreenState();
}

class _QuoteBuilderScreenState extends ConsumerState<QuoteBuilderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _customerNameController = TextEditingController(text: 'John Doe');
  final _addressController = TextEditingController(text: '123 Main Street');
  final _calloutFeeController = TextEditingController(text: '95.00');
  final _laborPriceController = TextEditingController(text: '110.00');
  final _laborQtyController = TextEditingController(text: '2.0');
  String _selectedTrade = 'Plumbers';

  void _saveQuote() {
    if (_formKey.currentState!.validate()) {
      final double callout = double.tryParse(_calloutFeeController.text) ?? 0.0;
      final double laborRate = double.tryParse(_laborPriceController.text) ?? 0.0;
      final double laborQty = double.tryParse(_laborQtyController.text) ?? 1.0;
      final double laborTotal = laborRate * laborQty;

      final double subtotal = callout + laborTotal;
      final double tax = subtotal * 0.0825;
      final double total = subtotal + tax;

      final newQuote = Quote(
        id: const Uuid().v4(),
        quoteNumber: 'QT-${DateTime.now().year}-${1000 + DateTime.now().second}',
        customerId: 'cust_${DateTime.now().millisecondsSinceEpoch}',
        customerName: _customerNameController.text,
        serviceAddress: _addressController.text,
        issueDate: DateTime.now().toString().split(' ')[0],
        expiryDate: DateTime.now().add(const Duration(days: 7)).toString().split(' ')[0],
        status: QuoteStatus.draft,
        professionCategory: _selectedTrade,
        lineItems: [
          QuoteLineItem(
            id: 'li_callout',
            description: 'Call-out & Diagnostic Fee',
            category: 'callout',
            quantity: 1,
            unitPrice: callout,
            amount: callout,
          ),
          QuoteLineItem(
            id: 'li_labor',
            description: 'Trade Repairs & Technical Labor',
            category: 'labor',
            quantity: laborQty,
            unitPrice: laborRate,
            unit: 'hrs',
            amount: laborTotal,
          ),
        ],
        subtotal: subtotal,
        taxRate: 8.25,
        taxAmount: tax,
        total: total,
        depositRequired: true,
        depositAmount: total / 2,
      );

      ref.read(quotesNotifierProvider.notifier).addQuote(newQuote);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Quotation Builder'),
        backgroundColor: Colors.indigo[900],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _customerNameController,
                decoration: const InputDecoration(labelText: 'Customer Name', border: OutlineInputBorder()),
                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(labelText: 'Service Address', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedTrade,
                decoration: const InputDecoration(labelText: 'Trade Category', border: OutlineInputBorder()),
                items: ['Plumbers', 'Private Tutors', 'Panel Beaters', 'Photographers']
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (val) => setState(() => _selectedTrade = val!),
              ),
              const SizedBox(height: 16),
              const Text('Pricing & Surcharges', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _calloutFeeController,
                      decoration: const InputDecoration(labelText: 'Call-out Fee (\$)', border: OutlineInputBorder()),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _laborPriceController,
                      decoration: const InputDecoration(labelText: 'Labor Rate (\$/hr)', border: OutlineInputBorder()),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.emerald[700], foregroundColor: Colors.white),
                  onPressed: _saveQuote,
                  icon: const Icon(Icons.check),
                  label: const Text('Save & Preview Quote'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
