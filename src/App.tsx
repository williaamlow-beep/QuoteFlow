import { CreateQuoteModal } from './components/CreateQuoteModal';
import React, { useEffect, useState } from 'react';
import { AppView, BusinessProfile, Customer, Invoice, Quote } from './types';
import { TRADE_TEMPLATES } from './data/seedData';
import { storage } from './utils/storage';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { DashboardView } from './components/DashboardView';
import { CustomerListView } from './components/CustomerListView';
import { CustomerModal } from './components/CustomerModal';
import { QuoteBuilderView } from './components/QuoteBuilderView';
import { QuoteDetailView } from './components/QuoteDetailView';
import { QuotesListView } from './components/QuotesListView';
import { InvoiceDetailView } from './components/InvoiceDetailView';
import { InvoicesListView } from './components/InvoicesListView';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SettingsView } from './components/SettingsView';
import { TemplatesView } from './components/TemplatesView';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  // App state from storage
  const [profile, setProfile] = useState<BusinessProfile>(() => storage.getProfile());
  const [customers, setCustomers] = useState<Customer[]>(() => storage.getCustomers());
  const [quotes, setQuotes] = useState<Quote[]>(() => storage.getQuotes());
  const [invoices, setInvoices] = useState<Invoice[]>(() => storage.getInvoices());
  const [tradeTemplates] = useState(TRADE_TEMPLATES);

  // Active view routing
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // Selected item states
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  // Modal visibility states
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppDoc, setWhatsAppDoc] = useState<Quote | Invoice | null>(null);
  const [whatsAppDocType, setWhatsAppDocType] = useState<'quote' | 'invoice'>('quote');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Onboarding trigger on first load if name is default
  useEffect(() => {
    if (!profile.name || profile.name === 'Apex Auto Body & Detailing') {
      // Keep initial demo name or check if first time
    }
  }, []);

  // Sync helpers
  const handleSaveProfile = (updated: BusinessProfile) => {
    setProfile(updated);
    storage.saveProfile(updated);
  };

  const handleSaveCustomer = (cust: Customer) => {
    const updated = storage.saveCustomer(cust);
    setCustomers(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const updated = storage.deleteCustomer(id);
      setCustomers(updated);
    }
  };

  const handleSaveQuote = (quote: Quote) => {
    const updatedList = storage.saveQuote(quote);
    setQuotes(updatedList);
    setSelectedQuote(quote);
    setCurrentView('quote_detail');
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: Quote['status']) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    const updated = { ...quote, status, updatedAt: new Date().toISOString() };
    const list = storage.saveQuote(updated);
    setQuotes(list);
    if (selectedQuote?.id === quoteId) setSelectedQuote(updated);
  };

  const handleSaveSignature = (quoteId: string, signatureUrl: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    const updated: Quote = {
      ...quote,
      status: 'accepted',
      customerSignatureUrl: signatureUrl,
      customerSignedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    const list = storage.saveQuote(updated);
    setQuotes(list);
    if (selectedQuote?.id === quoteId) setSelectedQuote(updated);
  };

  const handleConvertToInvoice = (quote: Quote) => {
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      quoteId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      serviceAddress: quote.serviceAddress,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'unpaid',
      professionCategory: quote.professionCategory,
      lineItems: quote.lineItems,
      photos: quote.photos,
      damageTags: quote.damageTags,
      subtotal: quote.subtotal,
      calloutFee: quote.calloutFee,
      travelFee: quote.travelFee,
      urgencyFee: quote.urgencyFee,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      discountAmount: quote.discountAmount,
      taxRate: quote.taxRate,
      taxAmount: quote.taxAmount,
      total: quote.total,
      amountPaid: 0,
      balanceDue: quote.total,
      payments: [],
      internalNotes: quote.internalNotes,
      customerNotes: quote.customerNotes,
      termsAndConditions: quote.termsAndConditions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const invList = storage.saveInvoice(newInvoice);
    setInvoices(invList);

    // Mark quote converted
    handleUpdateQuoteStatus(quote.id, 'converted');

    setSelectedInvoice(newInvoice);
    setCurrentView('invoice_detail');
  };

  const handleRecordPayment = (
    invoiceId: string,
    amount: number,
    method: any,
    reference?: string,
    notes?: string
  ) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const newPayment = {
      id: `pay_${Date.now()}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      reference,
      notes,
    };

    const newPaidTotal = inv.amountPaid + amount;
    const newBalance = Math.max(0, inv.total - newPaidTotal);

    let newStatus: Invoice['status'] = 'partial';
    if (newBalance === 0) newStatus = 'paid';

    const updatedInv: Invoice = {
      ...inv,
      amountPaid: newPaidTotal,
      balanceDue: newBalance,
      status: newStatus,
      payments: [...(inv.payments || []), newPayment],
      updatedAt: new Date().toISOString(),
    };

    const invList = storage.saveInvoice(updatedInv);
    setInvoices(invList);
    if (selectedInvoice?.id === invoiceId) setSelectedInvoice(updatedInv);
  };

  const handleOpenWhatsAppShare = (doc: Quote | Invoice, type: 'quote' | 'invoice') => {
    setWhatsAppDoc(doc);
    setWhatsAppDocType(type);
    setIsWhatsAppModalOpen(true);
  };

  const handleExportData = () => {
    const dataStr = storage.exportBackupJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuoteFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (jsonStr: string) => {
    if (storage.importBackupJSON(jsonStr)) {
      setProfile(storage.getProfile());
      setCustomers(storage.getCustomers());
      setQuotes(storage.getQuotes());
      setInvoices(storage.getInvoices());
      alert('Backup restored successfully!');
    } else {
      alert('Invalid backup file.');
    }
  };

  const handleResetDemoData = () => {
    storage.resetDemoData();
    setProfile(storage.getProfile());
    setCustomers(storage.getCustomers());
    setQuotes(storage.getQuotes());
    setInvoices(storage.getInvoices());
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <NavbarHeader
        profile={profile}
        onNewQuoteClick={() => {
          setSelectedQuote(null);
          setCurrentView('quote_builder');
        }}
        onNewCustomerClick={() => {
          setCustomerToEdit(null);
          setIsCustomerModalOpen(true);
        }}
        onChangeProfessionClick={() => setIsOnboardingOpen(true)}
      />

      {/* Main Content Layout with Navigation */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <SidebarNav
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          quotesCount={quotes.length}
          invoicesCount={invoices.length}
          customersCount={customers.length}
        />

        <main className="flex-1 min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView
              profile={profile}
              quotes={quotes}
              invoices={invoices}
              customers={customers}
              onNavigate={(view) => setCurrentView(view)}
              onNewQuoteClick={() => {
                setSelectedQuote(null);
                setCurrentView('quote_builder');
              }}
              onSelectQuote={(q) => {
                setSelectedQuote(q);
                setCurrentView('quote_detail');
              }}
              onSelectInvoice={(inv) => {
                setSelectedInvoice(inv);
                setCurrentView('invoice_detail');
              }}
              onWhatsAppShareQuote={(q) => handleOpenWhatsAppShare(q, 'quote')}
              onWhatsAppShareInvoice={(inv) => handleOpenWhatsAppShare(inv, 'invoice')}
            />
          )}

          {currentView === 'quotes' && (
            <QuotesListView
              quotes={quotes}
              profile={profile}
              onNewQuoteClick={() => {
                setSelectedQuote(null);
                setCurrentView('quote_builder');
              }}
              onSelectQuote={(q) => {
                setSelectedQuote(q);
                setCurrentView('quote_detail');
              }}
              onWhatsAppShare={(q) => handleOpenWhatsAppShare(q, 'quote')}
            />
          )}

         {currentView === 'quote_builder' && (
  <QuoteBuilderView
    profile={profile}
    customers={customers}
    tradeTemplates={tradeTemplates}
    onSaveQuote={handleSaveQuote}
    onCancel={() => setCurrentView('dashboard')}
    quoteToEdit={selectedQuote}
  />
)}

          {currentView === 'quote_detail' && selectedQuote && (
            <QuoteDetailView
              quote={selectedQuote}
              profile={profile}
              onBack={() => setCurrentView('quotes')}
              onEdit={(q) => {
                setSelectedQuote(q);
                setCurrentView('quote_builder');
              }}
              onDuplicate={(q) => {
                const dup: Quote = {
                  ...q,
                  id: `quote_${Date.now()}`,
                  quoteNumber: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                };
                setSelectedQuote(dup);
                setCurrentView('quote_builder');
              }}
              onConvertToInvoice={handleConvertToInvoice}
              onUpdateStatus={handleUpdateQuoteStatus}
              onWhatsAppShare={(q) => handleOpenWhatsAppShare(q, 'quote')}
              onSaveSignature={handleSaveSignature}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesListView
              invoices={invoices}
              profile={profile}
              onNewInvoiceClick={() => {
                // Quick build quote to convert or direct
                setSelectedQuote(null);
                setCurrentView('quote_builder');
              }}
              onSelectInvoice={(inv) => {
                setSelectedInvoice(inv);
                setCurrentView('invoice_detail');
              }}
              onWhatsAppShare={(inv) => handleOpenWhatsAppShare(inv, 'invoice')}
            />
          )}

          {currentView === 'invoice_detail' && selectedInvoice && (
            <InvoiceDetailView
              invoice={selectedInvoice}
              profile={profile}
              onBack={() => setCurrentView('invoices')}
              onRecordPayment={handleRecordPayment}
              onWhatsAppShare={(inv) => handleOpenWhatsAppShare(inv, 'invoice')}
            />
          )}

          {currentView === 'customers' && (
            <CustomerListView
              customers={customers}
              quotes={quotes}
              invoices={invoices}
              onAddCustomerClick={() => {
                setCustomerToEdit(null);
                setIsCustomerModalOpen(true);
              }}
              onEditCustomerClick={(c) => {
                setCustomerToEdit(c);
                setIsCustomerModalOpen(true);
              }}
              onDeleteCustomerClick={handleDeleteCustomer}
              onCreateQuoteForCustomer={(c) => {
                setSelectedQuote(null);
                setCurrentView('quote_builder');
              }}
              searchQuery=""
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView
              tradeTemplates={tradeTemplates}
              profile={profile}
              onSelectTemplateToBuild={(template) => {
                setSelectedQuote(null);
                setCurrentView('quote_builder');
              }}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        document={whatsAppDoc}
        type={whatsAppDocType}
        profile={profile}
      />

      {/* Onboarding Profession Picker */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        tradeTemplates={tradeTemplates}
        profile={profile}
        onCompleteOnboarding={(updatedProf, templateId) => {
          handleSaveProfile(updatedProf);
        }}
      />
    </div>
  );
}
