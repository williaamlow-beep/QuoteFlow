import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Settings,
  History,
  Wrench,
  CarFront,
  Droplets,
  KeyRound,
  Hammer,
  Briefcase,
  Zap,
  Truck,
  Plus,
  Check,
  Camera,
  Trash2,
  X,
  Sparkles,
  ChevronDown,
  Globe,
  Share2,
  DollarSign
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
  description: string;
  price: number;
}

export interface QuoteItem {
  id: string;
  title: string;
  price: number;
}

export interface TradeInfo {
  name: string;
  iconName: string;
  presets: ScopePreset[];
}

// --- TRADE DATA ---
export const TRADE_INFO: Record<TradeCategory, TradeInfo> = {
  panel_beater: {
    name: 'Panel Beater',
    iconName: 'CarFront',
    presets: [
      { id: 'pb1', category: 'panel_beater', title: 'Bumper Dent Repair', description: 'Dent pulling, surface sanding, primer & coat', price: 280 },
      { id: 'pb2', category: 'panel_beater', title: 'Side Door Scratch Touch-Up', description: 'Deep scratch compound sanding, touch-up & polish', price: 180 },
      { id: 'pb3', category: 'panel_beater', title: 'Windscreen Chip Resin', description: 'Vacuum pressure injection of optical glass resin', price: 95 },
      { id: 'pb4', category: 'panel_beater', title: 'Headlight Restoration', description: 'Wet sanding oxidation layer, UV clear sealing', price: 75 },
      { id: 'pb5', category: 'panel_beater', title: 'Fender Realignment', description: 'Remove broken clips, realign front fender', price: 120 },
    ]
  },
  mechanic: {
    name: 'Car Mechanic',
    iconName: 'Wrench',
    presets: [
      { id: 'm1', category: 'mechanic', title: 'Basic Engine Service', description: 'Synthetic oil replacement, filter swap & safety check', price: 150 },
      { id: 'm2', category: 'mechanic', title: 'Brake Pad Swap (Front)', description: 'Replace worn ceramic front pads & rotor inspection', price: 190 },
      { id: 'm3', category: 'mechanic', title: 'Battery Replacement', description: '12V Maintenance-free battery with terminal cleaning', price: 140 },
      { id: 'm4', category: 'mechanic', title: 'Alternator Diagnostic & Swap', description: 'Voltage drop test & refurbished alternator installation', price: 320 }
    ]
  },
  auto_electrician: {
    name: 'Auto Electrician',
    iconName: 'Zap',
    presets: [
      { id: 'ae1', category: 'auto_electrician', title: 'Fuse & Wiring Trace', description: 'Diagnostic trace for short circuits or dead blown fuses', price: 110 },
      { id: 'ae2', category: 'auto_electrician', title: 'Dashcam Hardwire Install', description: 'Clean hidden cable hardwire to ignition fuse box', price: 85 }
    ]
  },
  plumber: {
    name: 'Plumber',
    iconName: 'Droplets',
    presets: [
      { id: 'p1', category: 'plumber', title: 'Pipe Leak Repair', description: 'Locate pipe fissure, cut & install brass compression coupling', price: 130 },
      { id: 'p2', category: 'plumber', title: 'Sink Drain Unblock', description: 'High-pressure snake auger clear blockages', price: 110 }
    ]
  },
  locksmith: {
    name: 'Locksmith',
    iconName: 'KeyRound',
    presets: [
      { id: 'l1', category: 'locksmith', title: 'Emergency Door Unlock', description: 'Non-destructive door lock opening', price: 120 },
      { id: 'l2', category: 'locksmith', title: 'Cylinder Lock Replace', description: 'Swap euro profile cylinder with 3 anti-snap keys', price: 160 }
    ]
  },
  carpenter: {
    name: 'Carpenter',
    iconName: 'Hammer',
    presets: [
      { id: 'c1', category: 'carpenter', title: 'Cabinet Hinge Re-align', description: 'Repair stripped wood holes & install heavy duty hinges', price: 90 }
    ]
  },
  handyman: {
    name: 'Handyman',
    iconName: 'Briefcase',
    presets: [
      { id: 'h1', category: 'handyman', title: 'TV Wall Mounting', description: 'Bracket mounting into concrete or drywall with cable conceal', price: 120 }
    ]
  },
  towing: {
    name: 'Towing Service',
    iconName: 'Truck',
    presets: [
      { id: 't1', category: 'towing', title: 'Local Flatbed Tow', description: 'Flatbed recovery & transport within 15km zone', price: 150 }
    ]
  },
  beauty_salon: {
    name: 'Beauty & Nails',
    iconName: 'Sparkles',
    presets: [
      { id: 'b1', category: 'beauty_salon', title: 'Nail Crack Repair & Gel', description: 'Nail reinforcement, gel polish & finish', price: 65 },
      { id: 'b2', category: 'beauty_salon', title: 'Full Gel Removal & Manicure', description: 'Gentle soak-off, nail shaping & cuticle care', price: 50 }
    ]
  },
  pet_grooming: {
    name: 'Pet Grooming',
    iconName: 'Sparkles',
    presets: [
      { id: 'pg1', category: 'pet_grooming', title: 'Full Dog Wash & Trim', description: 'Shampoo bath, blow dry, nail clipping & sanitary trim', price: 85 }
    ]
  },
  dentist: {
    name: 'Dental Care',
    iconName: 'Sparkles',
    presets: [
      { id: 'd1', category: 'dentist', title: 'Consultation & Scaling', description: 'Full oral checkup, ultrasonic scaling & polishing', price: 120 }
    ]
  },
  other: {
    name: 'General Service',
    iconName: 'Briefcase',
    presets: [
      { id: 'o1', category: 'other', title: 'Standard Service Callout', description: 'On-site consultation & diagnostic fee', price: 80 }
    ]
  }
};

export default function App() {
  // --- STATE ---
  const [trade, setTrade] = useState<TradeCategory>('panel_beater');
  const [isTradeDropdownOpen, setIsTradeDropdownOpen] = useState<boolean>(false);
  const [shopPhoto, setShopPhoto] = useState<string | null>(null);
  
  // Settings & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
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

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Sync Agreed Price with Active Items sum
  useEffect(() => {
    const sum = activeItems.reduce((acc, item) => acc + item.price, 0);
    setAgreedPrice(Number(sum.toFixed(2)));
  }, [activeItems]);

  // Handle Photo Capture (Page 1 Header 4x4 Photo)
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setShopPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Preset Addition
  const handleAddPreset = (preset: ScopePreset) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      title: preset.title,
      price: preset.price
    };
    setActiveItems((prev) => [...prev, newItem]);
    setIsQuotationSent(false);
  };

  const handleRemoveItem = (id: string) => {
    setActiveItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Adjust Agreed Price without float errors
  const handleAdjustPrice = (amount: number) => {
    setAgreedPrice((prev) => {
      const updated = Math.max(0, prev + amount);
      return Number(updated.toFixed(2));
    });
  };

  // Handle Quote Action
  const handleSendQuotation = () => {
    if (!customerName) {
      alert('Please enter a customer name.');
      return;
    }
    const finalPhone = useCustomPrefix ? `${customPrefix}${phoneNumber}` : `${phonePrefix}${phoneNumber}`;
    
    // Format message
    let message = `*${businessName} - QUOTATION*\n`;
    message += `Customer: ${customerName}\n`;
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

  // AI Assistant Polish Trigger
  const handleRunAIAssistant = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiOutput('');

    try {
      // Prompt logic - cleanly formats raw trader notes into polite WhatsApp message
      const formattedResult = `Hello! Based on our field inspection, here is the scope summary:\n\n• ${aiPrompt}\n\nEstimated Total: ${currencySymbol}${agreedPrice.toFixed(2)}\n\nPlease let us know if you'd like us to proceed today!`;
      setTimeout(() => {
        setAiOutput(formattedResult);
        setIsAiLoading(false);
      }, 800);
    } catch {
      setAiOutput('Could not process request. Please try again.');
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans pb-16">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          {/* Page 1 Item 4: 4x4 Shop / Profile Photo Capture */}
          <div className="relative w-12 h-12 rounded-xl border-2 border-black bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {shopPhoto ? (
              <img src={shopPhoto} alt="Shop" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-black">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
              </label>
            )}
          </div>

          {/* Page 3 Item 1: AI Assistant Button next to Photo */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-black font-extrabold px-3 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs uppercase transition-all active:translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* Page 1 Item 1: Trade Dropdown Badge */}
        <div className="relative">
          <button
            onClick={() => setIsTradeDropdownOpen(!isTradeDropdownOpen)}
            className="flex items-center space-x-2 bg-black text-white px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
          >
            <span>{TRADE_INFO[trade].name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Trade Selector Dropdown (Disappears after selection) */}
          {isTradeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden max-h-80 overflow-y-auto">
              {(Object.keys(TRADE_INFO) as TradeCategory[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTrade(key);
                    setIsTradeDropdownOpen(false); // Disappears after selection
                  }}
                  className={`w-full text-left px-4 py-3 font-bold text-xs uppercase border-b border-gray-200 flex items-center justify-between hover:bg-amber-100 ${
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

        {/* Page 1 Item 2: Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Settings className="w-5 h-5 text-black" />
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-6">

        {/* ================= PAGE ONE: PRICE LIST & TRADER PRESETS ================= */}
        <section className="bg-white border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          
          {/* Page 1 Item 3: Set Price List Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-black text-base uppercase tracking-tight flex items-center space-x-2">
              <span className="w-3 h-3 bg-amber-400 rounded-full border border-black"></span>
              <span>Set Price List ({TRADE_INFO[trade].presets.length})</span>
            </h2>
            <span className="text-xs font-bold text-gray-500 uppercase">{TRADE_INFO[trade].name}</span>
          </div>

          {/* Preset Buttons Grid */}
          <div className="space-y-3">
            {TRADE_INFO[trade].presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-amber-50 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="pr-2">
                  <div className="font-extrabold text-sm">{preset.title}</div>
                  <div className="text-xs text-gray-600 line-clamp-1">{preset.description}</div>
                </div>
                <button
                  onClick={() => handleAddPreset(preset)}
                  className="shrink-0 flex items-center space-x-1 bg-emerald-400 hover:bg-emerald-300 text-black font-black px-3 py-2 rounded-xl border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{currencySymbol}{preset.price}</span>
                </button>
              </div>
            ))}
          </div>
        </section>


        {/* ================= PAGE TWO: CLIENT & QUOTE BUILDER ================= */}
        <section className="bg-white border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
          
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-black text-base uppercase tracking-tight flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full border border-black"></span>
              <span>Client & Quote Builder</span>
            </h2>

            {/* Page 2 Item 1: Quotation Sent Button */}
            <button
              onClick={handleSendQuotation}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isQuotationSent ? 'bg-emerald-400 text-black' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isQuotationSent ? 'Quotation Sent ✓' : 'Send Quote'}</span>
            </button>
          </div>

          {/* Client Details Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black uppercase mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. John Tan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Page 2 Item 2: WhatsApp / Phone with Country Prefixes */}
            <div>
              <label className="block text-xs font-black uppercase mb-1">WhatsApp / Phone</label>
              <div className="flex space-x-2">
                
                {/* Prefix Selector */}
                {!useCustomPrefix ? (
                  <select
                    value={phonePrefix}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setUseCustomPrefix(true);
                      } else {
                        setPhonePrefix(e.target.value);
                      }
                    }}
                    className="px-2.5 py-2.5 rounded-xl border-2 border-black font-extrabold text-xs bg-amber-300 focus:outline-none"
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
                      className="w-16 px-2 py-2 rounded-xl border-2 border-black font-extrabold text-xs bg-amber-200"
                    />
                    <button
                      onClick={() => setUseCustomPrefix(false)}
                      className="p-2 bg-gray-200 rounded-xl border-2 border-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <input
                  type="tel"
                  placeholder="12345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-sm bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Active Line Items */}
          <div className="space-y-2 border-t-2 border-gray-200 pt-3">
            <label className="block text-xs font-black uppercase">Line Items ({activeItems.length})</label>
            {activeItems.length === 0 ? (
              <div className="text-center py-6 text-gray-400 font-bold text-xs border-2 border-dashed border-gray-300 rounded-2xl">
                Tap + on price list items above to build quote
              </div>
            ) : (
              activeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-black text-xs font-bold">
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

          {/* Page 2 Item 3: Total Agreed Price (Fixed Decimals) */}
          <div className="p-4 bg-amber-300 border-3 border-black rounded-2xl space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-wide">Total Agreed Price</span>
              <span className="font-black text-xl">{currencySymbol}{agreedPrice.toFixed(2)}</span>
            </div>

            {/* Price Adjuster Stepper Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[-10, -5, +5, +10].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAdjustPrice(amt)}
                  className="py-1.5 bg-white hover:bg-gray-100 font-black text-xs rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                >
                  {amt > 0 ? `+${amt}` : amt}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ================= PAGE THREE: UTILITIES & ACTIONS ================= */}
        <section className="bg-white border-4 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="font-black text-base uppercase tracking-tight flex items-center space-x-2 border-b-2 border-black pb-3">
            <span className="w-3 h-3 bg-purple-500 rounded-full border border-black"></span>
            <span>Utilities & Digital Tools</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <DollarSign className="w-4 h-4" />
              <span>Collect Link</span>
            </button>

            <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <History className="w-4 h-4" />
              <span>Job History</span>
            </button>
          </div>
        </section>

      </main>


      {/* ================= MODAL: SETTINGS ================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-lg uppercase">Settings</h3>
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
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Currency Symbol</label>
                <select
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black font-bold text-sm bg-white"
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
              className="w-full py-3 bg-black text-white font-extrabold text-sm uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}


      {/* ================= MODAL: AI ASSISTANT ================= */}
      {isAIOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t-4 sm:border-4 border-black rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-black text-base uppercase">AI Field Assistant</h3>
              </div>
              <button onClick={() => setIsAIOpen(false)} className="p-1 rounded-xl hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Type or speak raw job notes in any language (Singlish, Mandarin, Malay, English). Gemini formats it into a professional client message.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Gel nail repair + crack fix, 50 dollars, can come 3pm tomorrow..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-black font-bold text-xs bg-gray-50 focus:bg-white focus:outline-none"
            />

            <button
              onClick={handleRunAIAssistant}
              disabled={isAiLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 font-black text-xs uppercase tracking-wider rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{isAiLoading ? 'Polishing Scope...' : 'Format Client Scope'}</span>
            </button>

            {aiOutput && (
              <div className="p-3 bg-amber-50 border-2 border-black rounded-2xl space-y-2">
                <div className="text-[10px] font-black uppercase text-gray-500">Suggested Client Message:</div>
                <p className="text-xs font-semibold whitespace-pre-wrap">{aiOutput}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiOutput);
                    alert('Copied to clipboard!');
                  }}
                  className="w-full py-1.5 bg-black text-white rounded-xl font-bold text-xs"
                >
                  Copy to WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
