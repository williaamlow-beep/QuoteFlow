import React, { useState } from 'react';
import {
  FileText,
  User,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Car,
  Wrench,
  DollarSign,
  Calendar,
  MapPin,
  Check,
  ChevronDown,
  ArrowLeft,
  AlertCircle,
  Tag,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';
import {
  BusinessProfile,
  Customer,
  ItemCategory,
  PanelBeaterDamageTag,
  PhotoAttachment,
  Quote,
  QuoteLineItem,
  TradeTemplate,
} from '../types';
import { PhotoAnnotationModal } from './PhotoAnnotationModal';

interface QuoteBuilderViewProps {
  profile: BusinessProfile;
  customers: Customer[];
  tradeTemplates: TradeTemplate[];
  onSaveQuote: (quote: Quote) => void;
  onCancel: () => void;
  quoteToEdit?: Quote | null;
  initialCustomer?: Customer | null;
}

export const QuoteBuilderView: React.FC<QuoteBuilderViewProps> = ({
  profile,
  customers,
  tradeTemplates,
  onSaveQuote,
  onCancel,
  quoteToEdit,
  initialCustomer,
}) => {
  const currency = profile.currencySymbol || '$';

  // State
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    quoteToEdit?.customerId || initialCustomer?.id || (customers[0]?.id || '')
  );

  // Quote numbers
  const [quoteNumber, setQuoteNumber] = useState(
    quoteToEdit?.quoteNumber || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const [issueDate, setIssueDate] = useState(
    quoteToEdit?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    quoteToEdit?.expiryDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  const [selectedProfession, setSelectedProfession] = useState(
    quoteToEdit?.professionCategory || profile.primaryTrade || 'Handymen'
  );

  const [serviceAddress, setServiceAddress] = useState(
    quoteToEdit?.serviceAddress ||
      customers.find((c) => c.id === selectedCustomerId)?.address ||
      ''
  );

  // Line items
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(
    quoteToEdit?.lineItems || [
      {
        id: 'item_1',
        description: 'Standard Service & Labor',
        category: 'labor',
        quantity: 2,
        unitPrice: 85,
        unit: 'hrs',
        amount: 170,
      },
      {
        id: 'item_2',
        description: 'Call-Out & Site Inspection Fee',
        category: 'callout',
        quantity: 1,
        unitPrice: 50,
        unit: 'visit',
        amount: 50,
      },
    ]
  );

  // Fees & Discounts
  const [calloutFee, setCalloutFee] = useState(quoteToEdit?.calloutFee || 0);
  const [travelFee, setTravelFee] = useState(quoteToEdit?.travelFee || 0);
  const [urgencyFee, setUrgencyFee] = useState(quoteToEdit?.urgencyFee || 0);

  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>(
    quoteToEdit?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState(
    quoteToEdit?.discountValue || 0
  );

  const [taxRate, setTaxRate] = useState(
    quoteToEdit?.taxRate ?? profile.defaultTaxRate
  );

  const [depositRequired, setDepositRequired] = useState(
    quoteToEdit?.depositRequired ?? true
  );
  const [depositType, setDepositType] = useState<'amount' | 'percentage'>(
    quoteToEdit?.depositType || 'percentage'
  );
  const [depositValue, setDepositValue] = useState(
    quoteToEdit?.depositValue || 50
  );

  const [internalNotes, setInternalNotes] = useState(
    quoteToEdit?.internalNotes || ''
  );
  const [customerNotes, setCustomerNotes] = useState(
    quoteToEdit?.customerNotes || 'Thank you for considering our services!'
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    quoteToEdit?.termsAndConditions || profile.defaultTerms
  );

  // Photos & Panel Beater Damage Tags
  const [photos, setPhotos] = useState<PhotoAttachment[]>(
    quoteToEdit?.photos || []
  );
  const [damageTags, setDamageTags] = useState<PanelBeaterDamageTag[]>(
    quoteToEdit?.damageTags || []
  );

  // Modals & AI Loading
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<PhotoAttachment | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiJobDescription, setAiJobDescription] = useState('');

  // Handle customer change
  const handleCustomerChange = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found && found.address) {
      setServiceAddress(found.address);
    }
  };

  // Load Template preset
  const handleLoadTemplate = (templateId: string) => {
    const template = tradeTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setSelectedProfession(template.professionName);

    const mappedItems: QuoteLineItem[] = template.defaultLineItems.map((item, idx) => ({
      ...item,
      id: `item_tpl_${Date.now()}_${idx}`,
      amount: item.quantity * item.unitPrice,
    }));

    setLineItems(mappedItems);
    if (template.defaultNotes) setCustomerNotes(template.defaultNotes);
    if (template.defaultTerms) setTermsAndConditions(template.defaultTerms);
  };

  // AI Suggest Line Items
  const handleAiSuggestLineItems = async () => {
    if (!aiJobDescription.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/suggest-line-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: selectedProfession,
          jobDescription: aiJobDescription,
          notes: internalNotes,
        }),
      });

      const data = await res.json();
      if (data.lineItems && Array.isArray(data.lineItems)) {
        const generated: QuoteLineItem[] = data.lineItems.map((item: any, idx: number) => ({
          id: `item_ai_${Date.now()}_${idx}`,
          description: item.description || 'Service item',
          category: (item.category as ItemCategory) || 'labor',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 80,
          unit: item.unit || 'hrs',
          amount: (item.quantity || 1) * (item.unitPrice || 80),
        }));

        setLineItems(generated);
      }
      if (data.suggestedTerms) {
        setCustomerNotes(data.suggestedTerms);
      }
    } catch (err) {
      console.error('Failed to generate line items:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Line item manipulation
  const handleUpdateLineItem = (
    id: string,
    field: keyof QuoteLineItem,
    value: any
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
          updated.amount = Number((qty * price).toFixed(2));
        }
        return updated;
      })
    );
  };

  const handleAddLineItem = () => {
    const newItem: QuoteLineItem = {
      id: `item_${Date.now()}`,
      description: 'Additional Service / Material',
      category: 'labor',
      quantity: 1,
      unitPrice: 65,
      unit: 'hrs',
      amount: 65,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleDeleteLineItem = (id: string) => {
    setLineItems(lineItems.filter((i) => i.id !== id));
  };

  // Add Panel Beater Damage Tag
  const handleAddDamageTag = (areaKey: PanelBeaterDamageTag['area'], areaName: string) => {
    const newTag: PanelBeaterDamageTag = {
      id: `dmg_${Date.now()}`,
      area: areaKey,
      areaName,
      repairType: 'dent_repair',
      partsCost: 120,
      laborHours: 2.5,
      laborRate: 95,
      notes: `${areaName} dent repair & refinish`,
    };

    setDamageTags([...damageTags, newTag]);

    // Also auto-add line item for this damage
    const autoLineItem: QuoteLineItem = {
      id: `item_dmg_${Date.now()}`,
      description: `${areaName} - Dent Repair & Refinish Labor`,
      category: 'labor',
      quantity: 2.5,
      unitPrice: 95,
      unit: 'hrs',
      amount: 237.5,
    };
    setLineItems([...lineItems, autoLineItem]);
  };

  // Financial Calculations
  const subtotal = lineItems.reduce((acc, i) => acc + i.amount, 0) + calloutFee + travelFee + urgencyFee;

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = Number(((subtotal * discountValue) / 100).toFixed(2));
  } else {
    discountAmount = Number(discountValue);
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));
  const total = Number((taxableAmount + taxAmount).toFixed(2));

  let depositAmount = 0;
  if (depositRequired) {
    if (depositType === 'percentage') {
      depositAmount = Number(((total * depositValue) / 100).toFixed(2));
    } else {
      depositAmount = Number(depositValue);
    }
  }

  // Save Handler
  const handleSave = (status: Quote['status'] = 'sent') => {
    const selectedCust = customers.find((c) => c.id === selectedCustomerId);

    const quote: Quote = {
      id: quoteToEdit?.id || `quote_${Date.now()}`,
      quoteNumber,
      customerId: selectedCustomerId,
      customerName: selectedCust?.name || 'Customer',
      customerPhone: selectedCust?.phone || '',
      customerEmail: selectedCust?.email || '',
      serviceAddress,
      issueDate,
      expiryDate,
      status: quoteToEdit?.status || status,
      professionCategory: selectedProfession,
      lineItems,
      photos,
      damageTags,
      subtotal,
      calloutFee,
      travelFee,
      urgencyFee,
      discountType,
      discountValue,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      depositRequired,
      depositType,
      depositValue,
      depositAmount,
      internalNotes,
      customerNotes,
      termsAndConditions,
      createdAt: quoteToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveQuote(quote);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-28 md:pb-12">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {quoteToEdit ? 'Edit Quotation' : 'New Fast Quotation'}
            </h1>
            <p className="text-xs text-slate-500">
              Create professional quote for WhatsApp & PDF sharing in under 2 mins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('sent')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save & Preview Quote</span>
          </button>
        </div>
      </div>

      {/* 1. Customer & Template Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Picker */}
          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Select Customer *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone || c.email || 'Client'})
                </option>
              ))}
            </select>
          </div>

          {/* Trade Template Picker */}
          <div>
            <label className="block font-bold text-slate-800 text-xs mb-1 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              Load Trade Profession Template
            </label>
            <select
              onChange={(e) => handleLoadTemplate(e.target.value)}
              defaultValue=""
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none font-medium"
            >
              <option value="" disabled>
                -- Choose profession preset (Handyman, Cleaner, Panel Beater...) --
              </option>
              {tradeTemplates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.professionName} ({tpl.categoryGroup})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates & Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Quote Ref Number
            </label>
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Issue Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Service Address */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 text-xs flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Job Site / Service Address
          </label>
          <input
            type="text"
            value={serviceAddress}
            onChange={(e) => setServiceAddress(e.target.value)}
            placeholder="Property or site address for this quote..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none"
          />
        </div>
      </div>

      {/* Special Panel Beater Vehicle Damage Tag Picker if trade is Panel Beater */}
      {selectedProfession.includes('Panel') && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-3 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">
                Panel Beater Vehicle Damage Tagging
              </h3>
            </div>
            <span className="text-[10px] uppercase font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Auto Body
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Tap vehicle damage areas to instantly add repair labor & parts estimates to this quote:
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'front_bumper', name: 'Front Bumper' },
              { key: 'fender_left', name: 'Left Fender' },
              { key: 'fender_right', name: 'Right Fender' },
              { key: 'door_front', name: 'Front Door' },
              { key: 'door_rear', name: 'Rear Door' },
              { key: 'hood', name: 'Hood Panel' },
              { key: 'roof', name: 'Roof Panel' },
              { key: 'rear_bumper', name: 'Rear Bumper' },
            ].map((area) => (
              <button
                key={area.key}
                type="button"
                onClick={() =>
                  handleAddDamageTag(area.key as any, area.name)
                }
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{area.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Smart AI Line Item Generator Bar */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              AI Smart Estimator
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Auto-generate itemized pricing
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiJobDescription}
            onChange={(e) => setAiJobDescription(e.target.value)}
            placeholder="Describe job (e.g. 3 bedroom wall painting, 2 aircon chemical wash, bumper dent touchup)..."
            className="flex-1 bg-white border border-emerald-300 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 outline-none"
          />
          <button
            type="button"
            disabled={isAiLoading || !aiJobDescription.trim()}
            onClick={handleAiSuggestLineItems}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            {isAiLoading ? (
              <span>Generating...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Suggest Line Items</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Line Items Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            Quote Line Items ({lineItems.length})
          </h3>
          <button
            type="button"
            onClick={handleAddLineItem}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Description */}
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Item Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateLineItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Task or material name..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium outline-none"
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleUpdateLineItem(item.id, 'category', e.target.value)
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 text-xs outline-none"
                  >
                    <option value="labor">Labor</option>
                    <option value="materials">Materials</option>
                    <option value="callout">Call-out</option>
                    <option value="travel">Travel</option>
                    <option value="urgency">Urgency</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Qty / Unit ({item.unit || 'units'})
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateLineItem(item.id, 'quantity', e.target.value)
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-semibold outline-none"
                  />
                </div>

                {/* Unit Price */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                    Unit Price ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUpdateLineItem(item.id, 'unitPrice', e.target.value)
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-semibold outline-none"
                  />
                </div>

                {/* Delete */}
                <div className="md:col-span-1 flex items-center justify-end pt-4 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteLineItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/60">
                Subtotal: {currency}{item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Additional Fees, Discount, Tax & Deposit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
          Adjustments & Deposit Requirements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Call-Out Fee ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={calloutFee}
              onChange={(e) => setCalloutFee(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Travel Fee ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={travelFee}
              onChange={(e) => setTravelFee(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Urgency Surcharge ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={urgencyFee}
              onChange={(e) => setUrgencyFee(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Discount */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Discount
            </label>
            <div className="flex gap-1">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="bg-slate-100 border border-slate-300 rounded-l-xl px-2 py-2 text-slate-700 font-bold outline-none"
              >
                <option value="percentage">%</option>
                <option value="amount">{currency}</option>
              </select>
              <input
                type="number"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-r-xl px-3 py-2 text-slate-800 outline-none font-semibold"
              />
            </div>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none font-semibold"
            />
          </div>

          {/* Deposit required */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Require Upfront Deposit
              </label>
              <input
                type="checkbox"
                checked={depositRequired}
                onChange={(e) => setDepositRequired(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            {depositRequired && (
              <div className="flex gap-1">
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value as any)}
                  className="bg-slate-100 border border-slate-300 rounded-l-xl px-2 py-2 text-slate-700 font-bold outline-none"
                >
                  <option value="percentage">%</option>
                  <option value="amount">{currency}</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={depositValue}
                  onChange={(e) => setDepositValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-r-xl px-3 py-2 text-slate-800 outline-none font-semibold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary Box */}
        <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal:</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Discount:</span>
              <span>-{currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Tax ({taxRate}%):</span>
              <span>+{currency}{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
            <span>Total Quote Value:</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>

          {depositRequired && (
            <div className="flex justify-between text-amber-300 font-semibold pt-1">
              <span>Upfront Deposit Required:</span>
              <span>{currency}{depositAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Job Photos Attachments Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Job Inspection Photos ({photos.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhotoToEdit(null);
              setIsPhotoModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Add / Annotate Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => {
                setPhotoToEdit(photo);
                setIsPhotoModalOpen(true);
              }}
              className="relative rounded-xl overflow-hidden border border-slate-200 group cursor-pointer aspect-square bg-slate-900"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      photo.isCustomerVisible
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {photo.isCustomerVisible ? 'Customer Visible' : 'Internal'}
                  </span>
                </div>
                <p className="text-[11px] text-white font-semibold line-clamp-1">
                  {photo.caption || photo.damageArea || 'Job Photo'}
                </p>
              </div>
            </div>
          ))}

          {photos.length === 0 && (
            <div className="col-span-full py-6 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
              No photos attached. Click "Add / Annotate Photo" to attach photos of site or vehicle damage.
            </div>
          )}
        </div>
      </div>

      {/* 6. Notes & Terms */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <label className="block font-semibold text-slate-700 text-xs mb-1">
            Customer Facing Notes
          </label>
          <textarea
            rows={2}
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 text-xs mb-1">
            Terms & Conditions
          </label>
          <textarea
            rows={2}
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 text-xs mb-1">
            Internal Notes (Hidden from Client)
          </label>
          <textarea
            rows={2}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Subcontractor codes, cost of materials, supplier details..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs outline-none resize-none"
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 flex items-center justify-between max-w-5xl mx-auto shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 text-base">
            Total: {currency}{total.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('sent')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Preview Quote</span>
          </button>
        </div>
      </div>

      {/* Photo Annotator Modal */}
      <PhotoAnnotationModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSavePhoto={(p) => setPhotos([...photos, p])}
        initialPhoto={photoToEdit}
        tradeProfession={selectedProfession}
      />
    </div>
  );
};
