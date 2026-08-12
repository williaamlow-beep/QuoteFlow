/**
 * QuoteFlow Data Models & Types
 */

export type AppView =
  | 'splash'
  | 'onboarding'
  | 'dashboard'
  | 'customers'
  | 'customer_detail'
  | 'quotes_list'
  | 'quote_builder'
  | 'quote_detail'
  | 'invoices_list'
  | 'invoice_detail'
  | 'templates'
  | 'settings';

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted';

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

export type ItemCategory =
  | 'labor'
  | 'materials'
  | 'callout'
  | 'travel'
  | 'urgency'
  | 'other';

export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'card'
  | 'e_wallet'
  | 'other';

export interface BusinessProfile {
  id: string;
  name: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  currencySymbol: string;
  currencyCode: string;
  taxName: string; // e.g. "VAT", "GST", "Sales Tax"
  defaultTaxRate: number; // e.g. 10
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  swiftBsbCode?: string;
  paymentInstructions?: string;
  defaultTerms: string;
  primaryTrade: string;
  onboardingCompleted: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoAnnotation {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label: string;
  color?: string;
}

export interface PhotoAttachment {
  id: string;
  url: string;
  caption: string;
  isCustomerVisible: boolean; // if false, internal-only
  damageArea?: string; // e.g. "Front Bumper", "Kitchen Sink"
  category?: 'before' | 'after' | 'during' | 'inspection';
  annotations?: PhotoAnnotation[];
  createdAt: string;
}

export interface PanelBeaterDamageTag {
  id: string;
  area: 'front_bumper' | 'rear_bumper' | 'fender_left' | 'fender_right' | 'door_front' | 'door_rear' | 'hood' | 'roof' | 'windshield' | 'other';
  areaName: string;
  repairType: 'dent_repair' | 'paint_touchup' | 'panel_replacement' | 'polishing' | 'realignment';
  partsCost: number;
  laborHours: number;
  laborRate: number;
  notes?: string;
}

export interface PricingRule {
  id: string;
  ruleName: string;
  triggerCondition: string; // e.g. "after_hours == true", "travel_distance > 15"
  adjustmentType: 'fixed_surcharge' | 'percentage_markup' | 'percentage_discount' | 'multiplier' | 'formula';
  adjustmentValue: number;
  appliesToCategory?: ItemCategory | 'total' | 'subtotal';
  formulaExpression?: string; // e.g. "baseCallout + (distanceKm * 1.5)"
}

export interface PricingFormula {
  id: string;
  formulaName: string;
  description: string;
  expression: string; // e.g. "hours * hourlyRate + (distance * 0.85)"
  targetField: string;
}

export interface LineItemTemplate {
  id: string;
  tradeId: string;
  title: string;
  category: ItemCategory;
  defaultUnit: string;
  defaultUnitPrice: number;
  formulaExpression?: string;
}

export interface CustomFieldDefinition {
  key: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean' | 'formula';
  options?: string[];
  defaultValue?: any;
  unit?: string;
  required?: boolean;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  category: ItemCategory;
  quantity: number;
  unitPrice: number;
  unit?: string; // e.g. "hrs", "units", "sq ft", "pax", "photos"
  amount: number;
  templateId?: string;
  formulaUsed?: string;
  pricingRuleId?: string;
}

export interface PricingRuleSummary {
  ruleId: string;
  ruleName: string;
  amount: number;
  appliedReason: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceAddress: string;
  issueDate: string;
  expiryDate: string;
  status: QuoteStatus;
  professionCategory?: string; // e.g., 'Aircon Technicians'
  
  // Dynamic trade-specific custom inputs
  customFields?: Record<string, any>;
  
  lineItems: QuoteLineItem[];
  photos: PhotoAttachment[];
  damageTags?: PanelBeaterDamageTag[];
  
  // Applied pricing rules & formulas
  appliedPricingRules?: PricingRuleSummary[];
  
  // Financial breakdown
  subtotal: number;
  calloutFee: number;
  travelFee: number;
  urgencyFee: number;
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  depositRequired: boolean;
  depositType: 'amount' | 'percentage';
  depositValue: number;
  depositAmount: number;

  internalNotes?: string;
  customerNotes?: string;
  termsAndConditions?: string;

  customerSignatureUrl?: string;
  customerSignedAt?: string;
  convertedInvoiceId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  proofAttachmentUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  quoteNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceAddress: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  professionCategory?: string;
  
  lineItems: QuoteLineItem[];
  photos: PhotoAttachment[];
  damageTags?: PanelBeaterDamageTag[];

  subtotal: number;
  calloutFee?: number;
  travelFee?: number;
  urgencyFee?: number;
  discountType?: 'amount' | 'percentage';
  discountValue?: number;
  discountAmount: number;
  taxRate?: number;
  taxAmount: number;
  total: number;
  
  depositAmountPaid?: number;
  amountPaid: number;
  balanceDue: number;

  payments: Payment[];

  internalNotes?: string;
  customerNotes?: string;
  termsAndConditions?: string;
  paymentInstructions?: string;

  createdAt: string;
  updatedAt: string;
}

export interface TradeTemplate {
  id: string;
  professionName: string;
  categoryGroup: string;
  iconName: string;
  description: string;
  defaultLineItems: Omit<QuoteLineItem, 'id' | 'amount'>[];
  defaultNotes: string;
  defaultTerms: string;
  customInputsSchema?: CustomFieldDefinition[];
  pricingRules?: PricingRule[];
  formulas?: PricingFormula[];
  lineItemTemplates?: LineItemTemplate[];
}

export interface MessageTemplate {
  id: string;
  title: string;
  type: 'quote_send' | 'quote_followup' | 'invoice_send' | 'payment_reminder';
  templateText: string;
}
