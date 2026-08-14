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
  QrCode
} from 'lucide-react';

// --- TYPES ---
export type TradeCategory = 
  | 'panel_beater' 
  | 'mechanic' 
  | 'auto_electrician' 
  | 'plumber' 
  | 'locksmith' 
  | 'carpenter' 
  | 'handyman' 
  | 'towing' 
  | 'beauty_salon' 
  | 'pet_grooming' 
  | 'dentist' 
  | 'other';

export interface ScopePreset {
  id: string;
  category: TradeCategory;
  title: string;
  price: number;
}

export interface QuoteItem {
  id: string;
  title: string;
  price: number;
}

export interface TradeInfo {
  name: string;
  presets: ScopePreset[];
}

// Trades where physical site/damage photos are relevant
const PHOTO_REQUIRED_TRADES: TradeCategory[] = [
  'panel_beater',
  'mechanic',
  'auto_electrician',
  'plumber',
  'locksmith',
  'carpenter',
  'handyman',
  'towing'
];

// --- TRADE PRESET DATA ---
export const TRADE_INFO: Record<TradeCategory, TradeInfo> = {
  panel_beater: {
    name: 'Panel Beater',
    presets: [
      { id: 'pb1', category: 'panel_beater', title: 'Bumper Dent Repair', price: 280 },
      { id: 'pb2', category: 'panel_beater', title: 'Side Door Scratch Touch-Up', price: 180 },
      { id: 'pb3', category: 'panel_beater', title: 'Windscreen Chip Resin', price: 95 },
      { id: 'pb4', category: 'panel_beater', title: 'Headlight Restoration', price: 75 },
    ]
  },
  mechanic: {
    name: 'Car Mechanic',
    presets: [
      { id: 'm1', category: 'mechanic', title: 'Basic Engine Service', price: 150 },
      { id: 'm2', category: 'mechanic', title: 'Brake Pad Swap (Front)', price: 190 },
      { id: 'm3', category: 'mechanic', title: 'Battery Replacement', price: 140 },
    ]
  },
  auto_electrician: {
    name: 'Auto Electrician',
    presets: [
      { id: 'ae1', category: 'auto_electrician', title: 'Fuse & Wiring Trace', price: 110 },
      { id: 'ae2', category: 'auto_electrician', title: 'Dashcam Hardwire Install', price: 85 }
    ]
  },
  plumber: {
    name: 'Plumber',
    presets: [
      { id: 'p1', category: 'plumber', title: 'Pipe Leak Repair', price: 130 },
      { id: 'p2', category: 'plumber', title: 'Sink Drain Unblock', price: 110 },
      { id: 'p3', category: 'plumber', title: 'Toilet Bowl Replacement', price: 250 },
    ]
  },
  locksmith: {
    name: 'Locksmith',
    presets: [
      { id: 'l1', category: 'locksmith', title: 'Emergency Door Unlock', price: 120 },
      { id: 'l2', category: 'locksmith', title: 'Cylinder Lock Replace', price: 160 }
    ]
  },
  carpenter: {
    name: 'Carpenter',
    presets: [
      { id: 'c1', category: 'carpenter', title: 'Cabinet Hinge Re-align', price: 90 }
    ]
  },
  handyman: {
    name: 'Handyman',
    presets: [
      { id: 'h1', category: 'handyman', title: 'TV Wall Mounting', price: 120 }
    ]
  },
  towing: {
    name: 'Towing Service',
    presets: [
      { id: 't1', category: 'towing', title: 'Local Flatbed Tow', price: 150 }
    ]
  },
  beauty_salon: {
    name: 'Beauty & Nails',
    presets: [
      { id: 'b1', category: 'beauty_salon', title: 'Nail Crack Repair & Gel', price: 65 },
      { id: 'b2', category: 'beauty_salon', title: 'Full Gel Removal & Manicure', price: 50 }
    ]
  },
  pet_grooming: {
    name: 'Pet Grooming',
    presets: [
      { id: 'pg1', category: 'pet_grooming', title: 'Full Dog Wash & Trim', price: 85 }
    ]
  },
  dentist: {
    name: 'Dental Care',
    presets: [
      { id: 'd1', category: 'dentist', title: 'Consultation & Scaling', price: 120 }
    ]
  },
  other: {
    name: 'General Service',
    presets: [
      { id: 'o1', category: 'other', title: 'Standard Callout Fee', price: 80 }
    ]
  }
};

export default function App() {
  // --- STATE ---
  const [trade, setTrade] = useState<TradeCategory>('panel_beater');
  const [isTradeDropdownOpen, setIsTradeDropdownOpen] = useState<boolean>(false);
  
  // Photos
  const [shopPhoto, setShopPhoto] = useState<string | null>(null);
  const [jobPhotos, setJobPhotos] = useState<string[]>([]);

  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>('APEX FIELD SERVICES');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Client & Quote Builder
  const [customerName, setCustomerName] = useState<string>('');
  const [phonePrefix, setPhonePrefix] = useState<string>('+60');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [customPrefix, setCustomPrefix] = useState<string>('');
  const [useCustomPrefix, setUseCustomPrefix] = useState<boolean>(false);
  
  const [activeItems, setActiveItems] = useState<QuoteItem[]>([]);
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [isQuotationSent, setIsQuotationSent] = useState<boolean>(false);

  // Line Item Selector Drawer
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');

  // Modals for Utilities (Restored Page 3 Features)
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isCollectOpen, setIsCollectOpen] = useState<boolean>(false);

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Check if photos should be displayed for current trade
  const isPhotoTrade = PHOTO_REQUIRED_TRADES.includes(trade);

  // Sync Total Agreed Price
  useEffect(() => {
    const sum = activeItems.reduce((acc, item) => acc + item.price, 0);
    setAgreedPrice(Number(sum.toFixed(2)));
  }, [activeItems]);

  // Header Shop Photo Capture
  const handleShopPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setShopPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Job Site Photo Capture
  const handleJobPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
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

  // Add Item Handlers
  const handleAddPresetItem = (preset: ScopePreset) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      title: preset.title,
      price: preset.price
    };
    setActiveItems((prev) => [...prev, newItem]);
    setIsItemSelectorOpen(false);
    setIsQuotationSent(false);
  };

  const handleAddCustomItem = () => {
    if (!customTitle.trim()) return;
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      title: customTitle.trim(),
      price: parseFloat(customPrice) || 0
    };
    setActiveItems((prev) => [...prev, newItem]);
    setCustomTitle('');
    setCustomPrice('');
    setIsItemSelectorOpen(false);
    setIsQuotationSent(false);
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

  // WhatsApp Quote Sender
  const handleSendQuotation = () => {
    if (!customerName) {
      alert('Please enter a customer name.');
      return;
    }
    const finalPhone = useCustomPrefix ? `${customPrefix}${phoneNumber}` : `${phonePrefix}${phoneNumber}`;
    
    let message = `*${businessName} - QUOTATION*\n`;
    message += `Customer: ${customerName}\n`;
    if (isPhotoTrade && jobPhotos.length > 0) {
      message += `Site Photos Attached: ${jobPhotos.length} photo(s)\n`;
    }
    message += `-------------------------\n`;
    activeItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.title} - ${currencySymbol}${item.price.toFixed(2)}\n`;
    });
    message += `-------------------------\n`;
    message += `*TOTAL AGREED PRICE: ${currencySymbol}${agreedPrice.toFixed(2)}*\n\n`;
    message += `Thank you for choosing ${businessName}!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${finalPhone.replace(/[^0-9]/g, '')}?text=${encoded}`;
    
    setIsQuotationSent(true);
    window.open(whatsappUrl, '_blank');
  };

  // AI Copilot Trigger
  const handleRunAICopilot = () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiOutput('');

    setTimeout(() => {
      const formattedResult = `Hello ${customerName || 'Valued Customer'}!\n\nRegarding your service query:\n• ${aiPrompt}\n\nEstimated Quote Total: ${currencySymbol}${agreedPrice.toFixed(2)}\n\nPlease let us know if you would like us to schedule this in!`;
      setAiOutput(formattedResult);
      setIsAiLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans pb-16">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          {/* Header Branding Photo (Doubled Size 64px x 64px) */}
          <div className="relative w-16 h-16 rounded-2xl border-3 border-black bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {shopPhoto ? (
              <img src={shopPhoto} alt="Shop Header" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-black">
                <Camera className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase mt-0.5">Photo</span>
                <input type="file" accept="image/*" capture="environment" onChange={handleShopPhotoCapture} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-black text-xs uppercase tracking-tight line-clamp-1 max-w-[130px]">{businessName}</span>
            
            {/* AI-Copilot Button */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black px-2.5 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[11px] uppercase transition-all active:translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>AI-Copilot</span>
            </button>
          </div>
        </div>

        {/* Trade Selector & Settings */}
        <div className="flex items-center space-x-2">
          
          {/* Trade Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTradeDropdownOpen(!isTradeDropdownOpen)}
              className="flex items-center space-x-1 bg-black text-white px-2.5 py-2 rounded-xl font-extrabold text-[11px] uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <span className="max-w-[85px] truncate">{TRADE_INFO[trade].name}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {isTradeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden max-h-72 overflow-y-auto">
                {(Object.keys(TRADE_INFO) as TradeCategory[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTrade(key);
                      setIsTradeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 font-extrabold text-xs uppercase border-b border-gray-200 flex items-center justify-between hover:bg-amber-100 ${
                      trade === key ? 'bg-amber-300' : 'bg-white'
                    }`}
                  >
                    <span>{TRADE_INFO[key].name}</span>
                    {trade === key && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Settings className="w-5 h-5 text-black" />
          </button>
        </div>
      </header>


      {/* MAIN CONTENT AREA */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-5">

        {/* ================= PAGE ONE: CLIENT & QUOTE BUILDER ================= */}
        <section className="bg-white border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-black text-base uppercase tracking-tight flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full border border-black"></span>
              <span>Client & Quote Builder</span>
            </h2>

            {/* Quotation Sent Action */}
            <button
              onClick={handleSendQuotation}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isQuotationSent ? 'bg-emerald-400 text-black' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isQuotationSent ? 'Quotation Sent ✓' : 'Send Quote'}</span>
            </button>
          </div>

          {/* Client Info Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. John Tan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-black font-bold text-xs bg-gray-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase mb-1">WhatsApp / Phone</label>
              <div className="flex space-x-2">
                {!useCustomPrefix ? (
                  <select
                    value={phonePrefix}
                    onChange={(e) => {
                      if (e.target.value === 'custom') setUseCustomPrefix(true);
                      else setPhonePrefix(e.target.value);
                    }}
                    className="px-2.5 py-2 rounded-xl border-2 border-black font-extrabold text-xs bg-amber-300 focus:outline-none"
                  >
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="custom">Other...</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      placeholder="+62"
                      value={customPrefix}
                      onChange={(e) => setCustomPrefix(e.target.value)}
                      className="w-14 px-2 py-2 rounded-xl border-2 border-black font-extrabold text-xs bg-amber-200"
                    />
                    <button onClick={() => setUseCustomPrefix(false)} className="p-2 bg-gray-200 rounded-xl border-2 border-black">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <input
                  type="tel"
                  placeholder="12345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border-2 border-black font-bold text-xs bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC JOB SITE / DAMAGE PHOTO CAPTURE (SHOWS ONLY FOR TECHNICAL TRADES) */}
          {isPhotoTrade && (
            <div className="space-y-2 border-t-2 border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-black uppercase">Job Site / Damage Photos ({jobPhotos.length})</label>
                <label className="cursor-pointer flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-black font-extrabold px-2.5 py-1 rounded-xl border-2 border-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap Photo</span>
                  <input type="file" accept="image/*" capture="environment" multiple onChange={handleJobPhotoCapture} className="hidden" />
                </label>
              </div>

              {/* Photo Gallery Grid */}
              {jobPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {jobPhotos.map((photo, idx) => (
                    <div key={idx} className="relative w-full h-16 rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <img src={photo} alt={`Job Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveJobPhoto(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-md border border-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Line Items List */}
          <div className="space-y-2 border-t-2 border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black uppercase">Line Items ({activeItems.length})</label>
              
              <button
                onClick={() => setIsItemSelectorOpen(true)}
                className="flex items-center space-x-1 bg-amber-300 hover:bg-amber-400 text-black font-black px-2.5 py-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs uppercase"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Item</span>
              </button>
            </div>

            {activeItems.length === 0 ? (
              <div
                onClick={() => setIsItemSelectorOpen(true)}
                className="cursor-pointer text-center py-5 text-gray-500 font-extrabold text-xs border-2 border-dashed border-black rounded-2xl bg-gray-50 hover:bg-amber-50"
              >
                Tap <span className="text-black font-black">+ Add Item</span> to select trade items or key in custom price
              </div>
            ) : (
              activeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span>{item.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold">{currencySymbol}{item.price.toFixed(2)}</span>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total Agreed Price */}
          <div className="p-3.5 bg-amber-300 border-3 border-black rounded-2xl space-y-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-wide">Total Agreed Price</span>
              <span className="font-black text-lg">{currencySymbol}{agreedPrice.toFixed(2)}</span>
            </div>

            {/* Price Adjuster Stepper */}
            <div className="grid grid-cols-4 gap-2">
              {[-10, -5, +5, +10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAdjustPrice(amt)}
                  className="py-1 bg-white hover:bg-gray-100 font-black text-xs rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  {amt > 0 ? `+${amt}` : amt}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ================= PAGE TWO/THREE RESTORED: UTILITIES & DIGITAL TOOLS ================= */}
        <section className="bg-white border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="font-black text-base uppercase tracking-tight flex items-center space-x-2 border-b-2 border-black pb-3">
            <span className="w-3 h-3 bg-purple-500 rounded-full border border-black"></span>
            <span>Utilities & Digital Tools</span>
          </h2>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setIsCollectOpen(true)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border-2 border-black font-extrabold text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
            >
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Collect Link</span>
            </button>

            <button
              onClick={() => setIsReceiptOpen(true)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border-2 border-black font-extrabold text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Receipt</span>
            </button>

            <button
              onClick={() => alert('Job History Log saved locally.')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border-2 border-black font-extrabold text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
            >
              <History className="w-5 h-5 text-purple-600" />
              <span>History</span>
            </button>
          </div>
        </section>

      </main>


      {/* ================= MODAL: LINE ITEM SELECTOR & FREEFORM ================= */}
      {isItemSelectorOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t-4 sm:border-4 border-black rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center space-x-2">
                <ListPlus className="w-5 h-5" />
                <h3 className="font-black text-sm uppercase">Select or Key Item ({TRADE_INFO[trade].name})</h3>
              </div>
              <button onClick={() => setIsItemSelectorOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase text-gray-500">Trade Presets</span>
              {TRADE_INFO[trade].presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleAddPresetItem(preset)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-amber-100 rounded-xl border-2 border-black font-extrabold text-xs text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>{preset.title}</span>
                  <span className="bg-emerald-400 text-black px-2 py-1 rounded-lg border border-black font-black">
                    {currencySymbol}{preset.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Freeform Input */}
            <div className="border-t-2 border-black pt-3 space-y-2">
              <span className="block text-[10px] font-black uppercase text-gray-500">Or Key Free-form Custom Item</span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Service description..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-black font-bold text-xs bg-gray-50"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-20 px-3 py-2 rounded-xl border-2 border-black font-bold text-xs bg-gray-50"
                />
              </div>
              <button
                onClick={handleAddCustomItem}
                className="w-full py-2.5 bg-black text-white font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                + Insert Custom Item
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ================= MODAL: RECEIPT GENERATOR (RESTORED PAGE 3) ================= */}
      {isReceiptOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase">Digital Receipt</h3>
              <button onClick={() => setIsReceiptOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl space-y-2 font-mono text-xs">
              <div className="text-center font-black uppercase text-sm border-b border-black pb-2">{businessName}</div>
              <div>Customer: {customerName || 'Valued Client'}</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div className="border-t border-dashed border-gray-400 pt-2">
                {activeItems.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.title}</span>
                    <span>{currencySymbol}{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-black pt-2 font-black flex justify-between text-sm">
                <span>PAID TOTAL:</span>
                <span>{currencySymbol}{agreedPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Receipt copied for WhatsApp / Print!');
                setIsReceiptOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-400 text-black font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Share Receipt
            </button>
          </div>
        </div>
      )}


      {/* ================= MODAL: COLLECT PAYMENT (RESTORED PAGE 3) ================= */}
      {isCollectOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase">Instant Collect Link</h3>
              <button onClick={() => setIsCollectOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-100 border-2 border-black rounded-2xl space-y-2">
              <QrCode className="w-16 h-16 mx-auto" />
              <div className="font-black text-sm">DuitNow / PayNow / Cash</div>
              <div className="font-extrabold text-lg text-emerald-600">{currencySymbol}{agreedPrice.toFixed(2)}</div>
            </div>

            <button
              onClick={() => {
                alert('Payment link copied!');
                setIsCollectOpen(false);
              }}
              className="w-full py-2.5 bg-black text-white font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Copy Payment QR / Link
            </button>
          </div>
        </div>
      )}


      {/* ================= MODAL: SETTINGS ================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase">Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Currency Symbol</label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-xs bg-white"
                >
                  <option value="$">$ (SGD / AUD / USD)</option>
                  <option value="RM">RM (MYR)</option>
                  <option value="Rp">Rp (IDR)</option>
                  <option value="฿">฿ (THB)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-emerald-400 text-black font-extrabold text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              Save & Apply
            </button>
          </div>
        </div>
      )}


      {/* ================= MODAL: AI-COPILOT ================= */}
      {isAIOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t-4 sm:border-4 border-black rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-sm uppercase">AI-Copilot</h3>
              </div>
              <button onClick={() => setIsAIOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-gray-600 font-medium">
              Type or speak raw notes in any dialect or language. AI-Copilot formats it into a clean, polite WhatsApp quote.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Dent on left door panel, scratch touch up required, total 250..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-black font-bold text-xs bg-gray-50 focus:bg-white focus:outline-none"
            />

            <button
              onClick={handleRunAICopilot}
              disabled={isAiLoading}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{isAiLoading ? 'Formatting...' : 'Format Scope & Reply'}</span>
            </button>

            {aiOutput && (
              <div className="p-3 bg-amber-50 border-2 border-black rounded-2xl space-y-2">
                <p className="text-xs font-semibold whitespace-pre-wrap">{aiOutput}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiOutput);
                    alert('Copied to clipboard!');
                  }}
                  className="w-full py-1.5 bg-black text-white rounded-xl font-bold text-xs"
                >
                  Copy Message
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
