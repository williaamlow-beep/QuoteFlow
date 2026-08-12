import {
  BusinessProfile,
  Customer,
  Invoice,
  Payment,
  Quote,
  TradeTemplate,
} from '../types';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_INVOICES,
  INITIAL_QUOTES,
  SEEDED_CUSTOMERS,
  TRADE_TEMPLATES,
} from '../data/seedData';

const KEYS = {
  PROFILE: 'quoteflow_profile_v1',
  CUSTOMERS: 'quoteflow_customers_v1',
  QUOTES: 'quoteflow_quotes_v1',
  INVOICES: 'quoteflow_invoices_v1',
  TEMPLATES: 'quoteflow_templates_v1',
};

// Safe JSON loader
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// PROFILE
export function getBusinessProfile(): BusinessProfile {
  return loadStorage<BusinessProfile>(KEYS.PROFILE, INITIAL_BUSINESS_PROFILE);
}

export function saveBusinessProfile(profile: BusinessProfile): void {
  saveStorage(KEYS.PROFILE, profile);
}

// CUSTOMERS
export function getCustomers(): Customer[] {
  return loadStorage<Customer[]>(KEYS.CUSTOMERS, SEEDED_CUSTOMERS);
}

export function saveCustomer(customer: Customer): Customer[] {
  const list = getCustomers();
  const idx = list.findIndex((c) => c.id === customer.id);
  let updated: Customer[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = { ...customer, updatedAt: new Date().toISOString() };
  } else {
    updated = [customer, ...list];
  }
  saveStorage(KEYS.CUSTOMERS, updated);
  return updated;
}

export function deleteCustomer(id: string): Customer[] {
  const list = getCustomers().filter((c) => c.id !== id);
  saveStorage(KEYS.CUSTOMERS, list);
  return list;
}

// QUOTES
export function getQuotes(): Quote[] {
  return loadStorage<Quote[]>(KEYS.QUOTES, INITIAL_QUOTES);
}

export function saveQuote(quote: Quote): Quote[] {
  const list = getQuotes();
  const idx = list.findIndex((q) => q.id === quote.id);
  let updated: Quote[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = { ...quote, updatedAt: new Date().toISOString() };
  } else {
    updated = [quote, ...list];
  }
  saveStorage(KEYS.QUOTES, updated);
  return updated;
}

export function deleteQuote(id: string): Quote[] {
  const list = getQuotes().filter((q) => q.id !== id);
  saveStorage(KEYS.QUOTES, list);
  return list;
}

// INVOICES
export function getInvoices(): Invoice[] {
  return loadStorage<Invoice[]>(KEYS.INVOICES, INITIAL_INVOICES);
}

export function saveInvoice(invoice: Invoice): Invoice[] {
  const list = getInvoices();
  const idx = list.findIndex((i) => i.id === invoice.id);
  let updated: Invoice[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    updated = [invoice, ...list];
  }
  saveStorage(KEYS.INVOICES, updated);
  return updated;
}

// RECORD PAYMENT
export function recordInvoicePayment(
  invoiceId: string,
  paymentData: Omit<Payment, 'id' | 'invoiceId'>
): Invoice | null {
  const list = getInvoices();
  const idx = list.findIndex((i) => i.id === invoiceId);
  if (idx < 0) return null;

  const inv = list[idx];
  const newPayment: Payment = {
    ...paymentData,
    id: `pay_${Date.now()}`,
    invoiceId,
  };

  const updatedPayments = [...inv.payments, newPayment];
  const totalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
  const balanceDue = Math.max(0, Number((inv.total - totalPaid).toFixed(2)));

  let newStatus = inv.status;
  if (balanceDue <= 0) {
    newStatus = 'paid';
  } else if (totalPaid > 0) {
    newStatus = 'partial';
  }

  const updatedInv: Invoice = {
    ...inv,
    payments: updatedPayments,
    amountPaid: totalPaid,
    balanceDue,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updatedInv;
  saveStorage(KEYS.INVOICES, list);
  return updatedInv;
}

// CONVERT QUOTE TO INVOICE
export function convertQuoteToInvoice(quote: Quote): Invoice {
  const profile = getBusinessProfile();
  const invoices = getInvoices();
  
  // Calculate unique invoice number
  const invSeq = invoices.length + 2001;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${invSeq}`;

  const depositPaid = quote.depositRequired ? quote.depositAmount : 0;
  const balance = Math.max(0, Number((quote.total - depositPaid).toFixed(2)));

  const initialPayments: Payment[] = [];
  if (depositPaid > 0) {
    initialPayments.push({
      id: `pay_dep_${Date.now()}`,
      invoiceId: `inv_${Date.now()}`,
      amount: depositPaid,
      date: new Date().toISOString().split('T')[0],
      method: 'bank_transfer',
      notes: `Deposit payment transferred from Quote ${quote.quoteNumber}`,
    });
  }

  const newInvoice: Invoice = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    quoteId: quote.id,
    quoteNumber: quote.quoteNumber,
    customerId: quote.customerId,
    customerName: quote.customerName,
    customerPhone: quote.customerPhone,
    customerEmail: quote.customerEmail,
    serviceAddress: quote.serviceAddress,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: balance === 0 ? 'paid' : depositPaid > 0 ? 'partial' : 'unpaid',
    lineItems: [...quote.lineItems],
    photos: quote.photos ? [...quote.photos] : [],
    subtotal: quote.subtotal,
    discountAmount: quote.discountAmount,
    taxAmount: quote.taxAmount,
    total: quote.total,
    depositAmountPaid: depositPaid,
    amountPaid: depositPaid,
    balanceDue: balance,
    payments: initialPayments,
    customerNotes: quote.customerNotes || 'Converted from accepted quotation.',
    termsAndConditions: quote.termsAndConditions || profile.defaultTerms,
    paymentInstructions: profile.paymentInstructions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mark quote as converted
  const updatedQuote: Quote = {
    ...quote,
    status: 'converted',
    convertedInvoiceId: newInvoice.id,
    updatedAt: new Date().toISOString(),
  };

  saveQuote(updatedQuote);
  saveInvoice(newInvoice);

  return newInvoice;
}

// RESET DEMO DATA
export function resetDemoData(): void {
  saveStorage(KEYS.PROFILE, INITIAL_BUSINESS_PROFILE);
  saveStorage(KEYS.CUSTOMERS, SEEDED_CUSTOMERS);
  saveStorage(KEYS.QUOTES, INITIAL_QUOTES);
  saveStorage(KEYS.INVOICES, INITIAL_INVOICES);
  saveStorage(KEYS.TEMPLATES, TRADE_TEMPLATES);
}

// TEMPLATES
export function getTradeTemplates(): TradeTemplate[] {
  return loadStorage<TradeTemplate[]>(KEYS.TEMPLATES, TRADE_TEMPLATES);
}

export const storage = {
  getProfile: getBusinessProfile,
  saveProfile: saveBusinessProfile,
  getCustomers,
  saveCustomer,
  deleteCustomer,
  getQuotes,
  saveQuote,
  deleteQuote,
  getInvoices,
  saveInvoice,
  recordInvoicePayment,
  convertQuoteToInvoice,
  getTradeTemplates,
  resetDemoData,
  exportBackupJSON: () =>
    JSON.stringify({
      profile: getBusinessProfile(),
      customers: getCustomers(),
      quotes: getQuotes(),
      invoices: getInvoices(),
      templates: getTradeTemplates(),
    }),
  importBackupJSON: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) saveStorage(KEYS.PROFILE, parsed.profile);
      if (parsed.customers) saveStorage(KEYS.CUSTOMERS, parsed.customers);
      if (parsed.quotes) saveStorage(KEYS.QUOTES, parsed.quotes);
      if (parsed.invoices) saveStorage(KEYS.INVOICES, parsed.invoices);
      if (parsed.templates) saveStorage(KEYS.TEMPLATES, parsed.templates);
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },
};
