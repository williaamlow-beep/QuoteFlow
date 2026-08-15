/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  History,
  Plus,
  Check,
  Camera,
  Trash2,
  X,
  Sparkles,
  ChevronDown,
  Share2,
  DollarSign,
  FileText,
  ListPlus,
  QrCode,
  RotateCcw,
  Clock,
  Mic,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  Zap,
  Wrench,
  Car,
  Droplets,
  Key,
  Hammer,
  Truck,
  Heart,
  Smile,
  Briefcase
} from 'lucide-react';
import {
  TradeCategory,
  ScopePreset,
  QuoteItem,
  HistoricalQuote,
  BusinessSettings,
  WhatsAppConfig
} from './types';
import { TRADE_INFO, PHOTO_REQUIRED_TRADES } from './data/tradePresets';
import { VoiceAiModal } from './components/VoiceAiModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SettingsModal } from './components/SettingsModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CollectModal } from './components/CollectModal';
import { HistoryModal } from './components/HistoryModal';
import { ItemSelectorModal } from './components/ItemSelectorModal';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'APEX FIELD SERVICES',
  businessPhone: '+65 9123 4567',
  currencySymbol: '$',
  address: '12 Jalan Kilang Barat, Singapore',
  paymentInstructions: 'PayNow / DuitNow / Bank Transfer',
  whatsappConfig: {
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
    useCloudApi: false,
  },
};

export default function App() {
  // Trade Selection
  const [trade, setTrade] = useState<TradeCategory>('panel_beater');
  const [isTradeDropdownOpen, setIsTradeDropdownOpen] = useState(false);

  // Business Profile & Settings
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('quoteflow_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  // Shop & Site Photos
  const [shopPhoto, setShopPhoto] = useState<string | null>(() => {
    return localStorage.getItem('quoteflow_shop_photo') || null;
  });
  const [jobPhotos, setJobPhotos] = useState<string[]>([]);

  // Active Quote Slate
  const [customerName, setCustomerName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+65');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [useCustomPrefix, setUseCustomPrefix] = useState(false);
  const [vehicleOrJobDetails, setVehicleOrJobDetails] = useState('');
  const [activeItems, setActiveItems] = useState<QuoteItem[]>([]);
  const [agreedPrice, setAgreedPrice] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState<string | undefined>(undefined);

  // Modals
  const [isVoiceAiOpen, setIsVoiceAiOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Job History
  const [historyLogs, setHistoryLogs] = useState<HistoricalQuote[]>(() => {
    const saved = localStorage.getItem('quoteflow_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Sync Agreed Price with items sum
  useEffect(() => {
    const sum = activeItems.reduce((acc, item) => acc + item.price, 0);
    setAgreedPrice(Number(sum.toFixed(2)));
  }, [activeItems]);

  // Persist Settings
  const handleSaveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    localStorage.setItem('quoteflow_settings', JSON.stringify(newSettings));
  };

  // Shop photo handler
  const handleShopPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setShopPhoto(base64);
        localStorage.setItem('quoteflow_shop_photo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Job site photo capture
  const handleJobPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setJobPhotos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveJobPhoto = (index: number) => {
    setJobPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Voice AI parsed data handler
  const handleApplyVoiceParsedData = (data: {
    customerName?: string;
    phoneNumber?: string;
    vehicleOrJobDetails?: string;
    items: QuoteItem[];
    notes?: string;
    transcript?: string;
  }) => {
    if (data.customerName) setCustomerName(data.customerName);
    if (data.phoneNumber) {
      // Basic phone extraction
      const digits = data.phoneNumber.replace(/[^0-9]/g, '');
      if (digits.length >= 7) setPhoneNumber(digits.slice(-8));
    }
    if (data.vehicleOrJobDetails) setVehicleOrJobDetails(data.vehicleOrJobDetails);
    if (data.items && data.items.length > 0) {
      setActiveItems((prev) => [...prev, ...data.items]);
    }
    if (data.transcript) {
      setActiveTranscript(data.transcript);
    }
  };

  // Adding Preset Items
  const handleAddPresetItem = (preset: ScopePreset) => {
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: preset.title,
      price: preset.price,
    };
    setActiveItems((prev) => [...prev, newItem]);
  };

  // Adding Custom Item
  const handleAddCustomItem = (title: string, price: number, description?: string) => {
    const newItem: QuoteItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      price,
      description,
    };
    setActiveItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdjustPrice = (amount: number) => {
    setAgreedPrice((prev) => {
      const updated = Math.max(0, prev + amount);
      return Number(updated.toFixed(2));
    });
  };

  const handleResetForNewQuote = () => {
    if (activeItems.length > 0 || customerName) {
      if (!window.confirm('Clear active quote slate to start a fresh quote?')) return;
    }
    setCustomerName('');
    setPhoneNumber('');
    setCustomPrefix('');
    setUseCustomPrefix(false);
    setVehicleOrJobDetails('');
    setActiveItems([]);
    setJobPhotos([]);
    setActiveTranscript(undefined);
  };

  // Record into persistent Audit Log
  const handleRecordHistoryLog = (deliveryMethod: 'whatsapp_link' | 'whatsapp_cloud_api', messageId?: string) => {
    const newLog: HistoricalQuote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim() || 'Valued Customer',
      phoneNumber: `${useCustomPrefix ? customPrefix : phonePrefix}${phoneNumber}`,
      vehicleOrJobDetails,
      totalPrice: agreedPrice,
      items: activeItems,
      photosCount: jobPhotos.length,
      deliveryMethod,
      messageId,
      transcript: activeTranscript,
    };

    const updated = [newLog, ...historyLogs];
    setHistoryLogs(updated);
    localStorage.setItem('quoteflow_history', JSON.stringify(updated));
  };

  const handleDeleteHistoryLog = (id: string) => {
    const updated = historyLogs.filter((q) => q.id !== id);
    setHistoryLogs(updated);
    localStorage.setItem('quoteflow_history', JSON.stringify(updated));
  };

  const handleReopenHistoryQuote = (quote: HistoricalQuote) => {
    setCustomerName(quote.customerName);
    setVehicleOrJobDetails(quote.vehicleOrJobDetails || '');
    setActiveItems(quote.items || []);
    setActiveTranscript(quote.transcript);
    setAgreedPrice(quote.totalPrice);
  };

  const isPhotoTrade = PHOTO_REQUIRED_TRADES.includes(trade);
  const tradeInfo = TRADE_INFO[trade] || TRADE_INFO.panel_beater;

  return (
    <div
      className="min-h-screen bg-[#030712] text-slate-100 font-sans pb-20 relative overflow-x-hidden antialiased selection:bg-blue-500/30 selection:text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 0% 0%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 100% 100%, #312e81 0%, transparent 50%)',
      }}
    >
      {/* Ambient Frosted Glow Orbs */}
      <div className="fixed w-72 h-72 bg-blue-500/15 rounded-full blur-[100px] -top-10 -left-10 pointer-events-none" />
      <div className="fixed w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] -bottom-20 -right-20 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] top-1/3 right-1/4 pointer-events-none" />

      {/* TOP BRANDING & APP BAR */}
      <header className="sticky top-0 z-40 bg-white/[0.04] backdrop-blur-2xl border-b border-white/10 px-4 py-3 shadow-lg shadow-black/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Shop Photo / Logo Avatar */}
          <div className="relative w-12 h-12 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
            {shopPhoto ? (
              <img src={shopPhoto} alt="Shop Header" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-white/50 hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
                <span className="text-[7px] font-bold tracking-wider uppercase mt-0.5">Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleShopPhotoCapture}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Business Name & Voice AI Launcher */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="font-semibold text-xs text-white/90 tracking-wide uppercase line-clamp-1 max-w-[130px] sm:max-w-[180px]">
                {settings.businessName}
              </span>
            </div>

            <button
              onClick={() => setIsVoiceAiOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white font-semibold px-2.5 py-1 rounded-xl border border-blue-400/30 shadow-md shadow-blue-500/25 text-[10px] uppercase tracking-wider transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3 h-3 text-blue-200 fill-blue-200" />
              <Mic className="w-3 h-3" />
              <span>Voice Copilot</span>
            </button>
          </div>
        </div>

        {/* Trade Selector & Settings */}
        <div className="flex items-center space-x-2">
          {/* Trade Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTradeDropdownOpen(!isTradeDropdownOpen)}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 text-white px-2.5 py-1.5 rounded-xl font-medium text-[11px] border border-white/10 shadow-sm transition-all"
            >
              <span className="max-w-[75px] sm:max-w-[110px] truncate">{tradeInfo.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>

            {isTradeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                {(Object.keys(TRADE_INFO) as TradeCategory[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTrade(key);
                      setIsTradeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 font-medium text-xs border-b border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors ${
                      trade === key ? 'bg-blue-600/30 text-blue-300 font-semibold' : 'text-white/80'
                    }`}
                  >
                    <span>{TRADE_INFO[key].name}</span>
                    {trade === key && <Check className="w-4 h-4 text-blue-400 stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white rounded-xl border border-white/10 shadow-sm transition-colors"
            title="Settings & WhatsApp API"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* VOICE AI CALLOUT BANNER */}
        <div
          onClick={() => setIsVoiceAiOpen(true)}
          className="cursor-pointer p-4 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-purple-950/50 backdrop-blur-xl border border-blue-400/30 rounded-3xl shadow-xl shadow-blue-950/30 flex items-center justify-between hover:border-blue-400/50 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-xs tracking-wide text-white flex items-center space-x-2">
                <span>Gemini Speech-to-Quote</span>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded-full uppercase">
                  VOICE AI
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-normal line-clamp-1 mt-0.5">
                Speak details & prices • auto-parses into WhatsApp quote
              </p>
            </div>
          </div>
          <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 group-hover:bg-white/15 transition-colors">
            <Sparkles className="w-4 h-4 text-blue-300 fill-blue-300" />
          </div>
        </div>

        {/* SECTION 1: CLIENT & QUOTE BUILDER SLATE */}
        <section className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/40 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <h2 className="font-semibold text-sm tracking-wide text-white">
                Client & Quote Slate
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetForNewQuote}
                title="Clear Active Quote Slate"
                className="p-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white rounded-xl border border-white/10 transition-colors active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsWhatsAppOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp Quote</span>
              </button>
            </div>
          </div>

          {/* Client & Contact Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                Customer Name / Vehicle Plate
              </label>
              <input
                type="text"
                placeholder="e.g. Mr Tan (SJB 8892)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                WhatsApp Phone Number
              </label>
              <div className="flex space-x-2">
                {!useCustomPrefix ? (
                  <select
                    value={phonePrefix}
                    onChange={(e) => {
                      if (e.target.value === 'custom') setUseCustomPrefix(true);
                      else setPhonePrefix(e.target.value);
                    }}
                    className="px-2.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 font-semibold text-xs text-white focus:outline-none shrink-0"
                  >
                    <option value="+65" className="bg-[#0f172a] text-white">🇸🇬 +65</option>
                    <option value="+60" className="bg-[#0f172a] text-white">🇲🇾 +60</option>
                    <option value="+62" className="bg-[#0f172a] text-white">🇮🇩 +62</option>
                    <option value="+66" className="bg-[#0f172a] text-white">🇹🇭 +66</option>
                    <option value="+61" className="bg-[#0f172a] text-white">🇦🇺 +61</option>
                    <option value="+1" className="bg-[#0f172a] text-white">🇺🇸 +1</option>
                    <option value="+44" className="bg-[#0f172a] text-white">🇬🇧 +44</option>
                    <option value="+971" className="bg-[#0f172a] text-white">🇦🇪 +971</option>
                    <option value="custom" className="bg-[#0f172a] text-white">Other...</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-1 shrink-0">
                    <input
                      type="text"
                      placeholder="+62"
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value)}
                      className="w-16 px-2 py-2 rounded-xl bg-black/30 border border-white/15 font-semibold text-xs text-white text-center"
                    />
                    <button
                      onClick={() => setUseCustomPrefix(false)}
                      className="p-2 bg-white/10 rounded-xl border border-white/10 text-white/60 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <input
                  type="tel"
                  placeholder="91234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">
                Job Context / Vehicle Model / Site Address
              </label>
              <input
                type="text"
                placeholder="e.g. 2021 Toyota Vios or Condo Unit #14-02"
                value={vehicleOrJobDetails}
                onChange={(e) => setVehicleOrJobDetails(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 font-medium text-xs text-white placeholder:text-white/30 focus:border-blue-400/60 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Job Site / Damage Photos (For applicable trades) */}
          {isPhotoTrade && (
            <div className="space-y-2 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Site / Vehicle Photos ({jobPhotos.length})
                </label>
                <label className="cursor-pointer flex items-center space-x-1 bg-white/10 hover:bg-white/15 text-white font-medium px-2.5 py-1.5 rounded-xl border border-white/10 text-xs shadow-sm active:scale-95 transition-all">
                  <Camera className="w-3.5 h-3.5 text-blue-300" />
                  <span>Snap Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleJobPhotoCapture}
                    className="hidden"
                  />
                </label>
              </div>

              {jobPhotos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {jobPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-16 rounded-xl border border-white/15 overflow-hidden shadow-md bg-black/40"
                    >
                      <img
                        src={photo}
                        alt={`Site ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveJobPhoto(idx)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-0.5 rounded-md backdrop-blur-sm transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-white/30 font-medium text-[10px] border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                  Tap Snap Photo to capture vehicle damage or on-site status
                </div>
              )}
            </div>
          )}

          {/* Active Line Items List */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50">
                Quotation Line Items ({activeItems.length})
              </label>

              <button
                onClick={() => setIsItemSelectorOpen(true)}
                className="flex items-center space-x-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 font-semibold px-2.5 py-1 rounded-xl border border-blue-400/30 shadow-sm text-xs active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Item</span>
              </button>
            </div>

            {activeItems.length === 0 ? (
              <div
                onClick={() => setIsItemSelectorOpen(true)}
                className="cursor-pointer text-center py-6 text-white/40 font-medium text-xs border border-dashed border-white/15 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors space-y-1"
              >
                <div className="font-semibold text-white/70">
                  No line items yet
                </div>
                <div className="text-[10px] text-white/40">
                  Tap <span className="text-blue-300 font-semibold underline">+ Add Item</span> or use{' '}
                  <span className="text-blue-300 font-semibold underline">Voice Copilot</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {activeItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/10 text-xs font-medium shadow-sm flex items-center justify-between transition-colors"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-white line-clamp-1">
                        {idx + 1}. {item.title}
                      </div>
                      {item.description && (
                        <div className="text-[10px] text-white/40 line-clamp-1 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-semibold text-blue-300">
                        {settings.currencySymbol}{item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-white/30 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agreed Price Hero Box with Quick Price Nudges */}
          <div className="p-4 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-400/30 rounded-2xl backdrop-blur-md space-y-2.5 shadow-lg shadow-blue-950/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-blue-200">
                Total Agreed Price
              </span>
              <span className="font-semibold text-2xl text-white">
                {settings.currencySymbol}{agreedPrice.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[-10, -5, +5, +10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAdjustPrice(amt)}
                  className="py-1.5 bg-white/10 hover:bg-white/15 font-medium text-xs text-white rounded-xl border border-white/10 shadow-sm transition-all active:scale-95"
                >
                  {amt > 0 ? `+${amt}` : amt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: 1-TAP TRADE PRESETS */}
        <section className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/40 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              <h2 className="font-semibold text-sm tracking-wide text-white">
                1-Tap Scope Presets ({tradeInfo.presets.length})
              </h2>
            </div>
            <span className="text-[10px] font-medium text-white/40 uppercase">
              {tradeInfo.name}
            </span>
          </div>

          <div className="space-y-2">
            {tradeInfo.presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/10 shadow-sm transition-colors"
              >
                <span className="font-medium text-xs text-white/90">{preset.title}</span>
                <button
                  onClick={() => handleAddPresetItem(preset)}
                  className="flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold px-2.5 py-1 rounded-xl border border-emerald-400/30 text-xs shadow-sm transition-all active:scale-95"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>{settings.currencySymbol}{preset.price}</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: DIGITAL TOOLS & UTILITIES */}
        <section className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/40 space-y-3">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2.5">
            <div className="w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <h2 className="font-semibold text-sm tracking-wide text-white">
              Digital Utilities & History
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => setIsCollectOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl border border-white/10 font-medium text-[11px] shadow-sm space-y-1.5 transition-all text-white active:scale-95"
            >
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Collect QR</span>
            </button>

            <button
              onClick={() => setIsReceiptOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl border border-white/10 font-medium text-[11px] shadow-sm space-y-1.5 transition-all text-white active:scale-95"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Receipt</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-2xl border border-white/10 font-medium text-[11px] shadow-sm space-y-1.5 transition-all text-white active:scale-95"
            >
              <History className="w-5 h-5 text-purple-400" />
              <span>Audit ({historyLogs.length})</span>
            </button>
          </div>
        </section>
      </main>

      {/* MODALS */}
      <VoiceAiModal
        isOpen={isVoiceAiOpen}
        onClose={() => setIsVoiceAiOpen(false)}
        trade={trade}
        currencySymbol={settings.currencySymbol}
        onApplyParsedData={handleApplyVoiceParsedData}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        businessName={settings.businessName}
        businessPhone={settings.businessPhone}
        customerName={customerName}
        recipientPhone={phoneNumber}
        phonePrefix={phonePrefix}
        useCustomPrefix={useCustomPrefix}
        customPrefix={customPrefix}
        trade={trade}
        items={activeItems}
        agreedPrice={agreedPrice}
        currencySymbol={settings.currencySymbol}
        jobPhotosCount={jobPhotos.length}
        vehicleOrJobDetails={vehicleOrJobDetails}
        whatsappConfig={settings.whatsappConfig}
        onOpenSettings={() => {
          setIsWhatsAppOpen(false);
          setIsSettingsOpen(true);
        }}
        onRecordHistoryLog={handleRecordHistoryLog}
      />

      <ItemSelectorModal
        isOpen={isItemSelectorOpen}
        onClose={() => setIsItemSelectorOpen(false)}
        trade={trade}
        currencySymbol={settings.currencySymbol}
        onAddPresetItem={handleAddPresetItem}
        onAddCustomItem={handleAddCustomItem}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        businessName={settings.businessName}
        businessPhone={settings.businessPhone}
        businessAddress={settings.address}
        customerName={customerName}
        trade={trade}
        items={activeItems}
        agreedPrice={agreedPrice}
        currencySymbol={settings.currencySymbol}
        vehicleOrJobDetails={vehicleOrJobDetails}
      />

      <CollectModal
        isOpen={isCollectOpen}
        onClose={() => setIsCollectOpen(false)}
        businessName={settings.businessName}
        agreedPrice={agreedPrice}
        currencySymbol={settings.currencySymbol}
        customerName={customerName}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyLogs={historyLogs}
        currencySymbol={settings.currencySymbol}
        onDeleteLog={handleDeleteHistoryLog}
        onReopenQuote={handleReopenHistoryQuote}
      />
    </div>
  );
}
