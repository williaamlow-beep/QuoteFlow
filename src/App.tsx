import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  Layers,
  Plus,
  Check,
  Camera,
  Image as ImageIcon,
  Trash2,
  Tag,
  ZoomIn,
  Download,
  X,
  CheckCircle2,
  DollarSign,
  QrCode,
  Banknote,
  Copy,
  ShieldCheck,
  ArrowRight,
  Upload,
  Search,
  MessageSquare,
  Clock,
  ExternalLink,
  Receipt,
  Filter,
  User,
  Smartphone,
  FileText,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Minus
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
export type TradeCategory = 
  | 'panel_beater' 
  | 'mechanic' 
  | 'plumber' 
  | 'locksmith' 
  | 'handyman' 
  | 'auto_electrician'
  | 'towing'
  | 'custom';

export interface ScopePreset {
  id: string;
  category: TradeCategory;
  title: string;
  description: string;
  suggestedPrice: number;
}

export type PaymentMethod = 'Cash' | 'DuitNow QR' | 'PayNow QR';

export type JobStatus = 'Quotation Sent' | 'Completed';

export interface JobPhoto {
  id: string;
  dataUrl: string;
  timestamp: string;
  tag?: string;
}

export interface Job {
  id: string;
  createdAt: string;
  completedAt?: string;
  tradeCategory: TradeCategory;
  customerName: string;
  customerPhone: string;
  scopeDescription: string;
  agreedPrice: number;
  currency: string;
  photos: JobPhoto[];
  status: JobStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
}

export interface TraderSettings {
  businessName: string;
  logoUrl?: string;
  traderPhone: string;
  tradeCategory: TradeCategory;
  currency: string;
  duitNowUenOrPhone: string;
  payNowUenOrPhone: string;
  highContrastMode: boolean;
}

// ============================================================================
// DATA & PRESETS
// ============================================================================
export const TRADE_INFO: Record<TradeCategory, { name: string; iconName: string; color: string; badgeBg: string }> = {
  panel_beater: {
    name: 'Panel Beater',
    iconName: 'CarFront',
    color: 'border-amber-500 bg-amber-50 text-amber-900',
    badgeBg: 'bg-amber-500 text-white',
  },
  mechanic: {
    name: 'Car Mechanic',
    iconName: 'Wrench',
    color: 'border-blue-500 bg-blue-50 text-blue-900',
    badgeBg: 'bg-blue-600 text-white',
  },
  auto_electrician: {
    name: 'Auto Electrician',
    iconName: 'Zap',
    color: 'border-yellow-500 bg-yellow-50 text-yellow-900',
    badgeBg: 'bg-yellow-500 text-black',
  },
  towing: {
    name: 'Towing & Recovery',
    iconName: 'Truck',
    color: 'border-red-500 bg-red-50 text-red-900',
    badgeBg: 'bg-red-600 text-white',
  },
  plumber: {
    name: 'Plumber',
    iconName: 'Droplets',
    color: 'border-cyan-500 bg-cyan-50 text-cyan-900',
    badgeBg: 'bg-cyan-600 text-white',
  },
  locksmith: {
    name: 'Locksmith',
    iconName: 'KeyRound',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    badgeBg: 'bg-emerald-600 text-white',
  },
  handyman: {
    name: 'Handyman',
    iconName: 'Hammer',
    color: 'border-orange-500 bg-orange-50 text-orange-900',
    badgeBg: 'bg-orange-600 text-white',
  },
  custom: {
    name: 'General / Custom',
    iconName: 'Briefcase',
    color: 'border-slate-500 bg-slate-50 text-slate-900',
    badgeBg: 'bg-slate-700 text-white',
  },
};

export const INITIAL_PRESETS: ScopePreset[] = [
  // Panel Beater
  {
    id: 'pb-1',
    category: 'panel_beater',
    title: 'Bumper dent respray & pull',
    description: 'Dent pulling on front/rear bumper, surface sanding, primer base coat, and matching color respray with clear topcoat.',
    suggestedPrice: 280,
  },
  {
    id: 'pb-2',
    category: 'panel_beater',
    title: 'Side door scratch repair & polish',
    description: 'Deep scratch compound sanding, spot touch-up painting, and full door panel buffing.',
    suggestedPrice: 180,
  },
  {
    id: 'pb-3',
    category: 'panel_beater',
    title: 'Windscreen chip resin repair',
    description: 'Vacuum pressure injection of optical glass repair resin into stone chip crack to prevent spreading.',
    suggestedPrice: 95,
  },
  {
    id: 'pb-4',
    category: 'panel_beater',
    title: 'Headlight restoration pair',
    description: 'Wet sanding oxidation layer, UV clear coat sealing, and high-gloss machine polish on both headlights.',
    suggestedPrice: 75,
  },
  {
    id: 'pb-5',
    category: 'panel_beater',
    title: 'Fender realignment & re-clip',
    description: 'Remove broken clips, realign front fender alignment panel, replace heavy-duty mounting fasteners.',
    suggestedPrice: 120,
  },

  // Mechanic
  {
    id: 'mech-1',
    category: 'mechanic',
    title: 'Brake pads & rotor resurface',
    description: 'Replacement of front ceramic brake pads, cleaning brake caliper assembly, and rotor surface check.',
    suggestedPrice: 160,
  },
  {
    id: 'mech-2',
    category: 'mechanic',
    title: 'On-site battery jump & swap',
    description: 'Emergency response, alternator output check, and installation of new maintenance-free car battery.',
    suggestedPrice: 140,
  },
  {
    id: 'mech-3',
    category: 'mechanic',
    title: 'Full synthetic oil & filter service',
    description: 'Draining engine oil, replacing OEM filter, refilling 4L 5W-30 synthetic oil, and 21-point safety check.',
    suggestedPrice: 90,
  },
  {
    id: 'mech-4',
    category: 'mechanic',
    title: 'AC gas refill & vacuum leak test',
    description: 'Refrigerant pressure recovery, vacuum hold test for leaks, R134a/R1234yf gas recharge and compressor lube.',
    suggestedPrice: 85,
  },
  {
    id: 'mech-5',
    category: 'mechanic',
    title: 'Tire puncture plug & pressure balance',
    description: 'Heavy duty vulcanized rubber plug repair for tread puncture, rim bead check, and tire inflation to specs.',
    suggestedPrice: 35,
  },

  // Plumber
  {
    id: 'plumb-1',
    category: 'plumber',
    title: 'Burst pipe emergency leak fix',
    description: 'Isolate main supply, cut damaged copper/PEX pipe segment, install quick-connect repair coupling.',
    suggestedPrice: 150,
  },
  {
    id: 'plumb-2',
    category: 'plumber',
    title: 'Clogged main drain hydro clearing',
    description: 'Power snake/drain auger clearance of grease and hair buildup in kitchen/bathroom drain pipes.',
    suggestedPrice: 130,
  },
  {
    id: 'plumb-3',
    category: 'plumber',
    title: 'Sink mixer tap replacement',
    description: 'Dismantle faulty faucet, clean mounting hole, install new stainless steel mixer tap with stainless flex hoses.',
    suggestedPrice: 110,
  },

  // Locksmith
  {
    id: 'lock-1',
    category: 'locksmith',
    title: 'Emergency door gain entry',
    description: 'Non-destructive lock picking / bypass for locked residential main door.',
    suggestedPrice: 80,
  },
  {
    id: 'lock-2',
    category: 'locksmith',
    title: 'High-security deadbolt installation',
    description: 'Drill new door bore, chisel strike plate, install anti-snap heavy-duty deadbolt lockset with 3 keys.',
    suggestedPrice: 175,
  },

  // Handyman
  {
    id: 'handy-1',
    category: 'handyman',
    title: 'Drywall hole patch & paint touchup',
    description: 'Mesh screen backing, spackle compound skim coat, sand smooth, and color-matched paint touch-up.',
    suggestedPrice: 85,
  },
  {
    id: 'handy-2',
    category: 'handyman',
    title: 'Ceiling fan & light mounting',
    description: 'Assemble fan blades, test electrical ceiling junction box voltage, securely anchor safety wire and balance.',
    suggestedPrice: 95,
  },
];

// ============================================================================
// UTILS: WHATSAPP & STORAGE
// ============================================================================
export function formatPhoneNumberForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('0')) {
    return '60' + cleaned.substring(1);
  }
  return cleaned;
}

export function buildQuoteWhatsAppMessage(job: Job, traderName: string): string {
  const dateStr = new Date(job.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const photoCountNotice = job.photos.length > 0 
    ? `\n📷 Attached Photos: ${job.photos.length} photo(s) inspectable on site.`
    : '';

  return `📋 *OFFICIAL QUOTATION*
--------------------------------
*Business:* ${traderName || 'Field Specialist Service'}
*Date:* ${dateStr}
*Client:* ${job.customerName || 'Valued Client'}

*WORK SCOPE / JOB DETAILS:*
${job.scopeDescription}
${photoCountNotice}

--------------------------------
💰 *AGREED TOTAL PRICE:* ${job.currency} ${job.agreedPrice.toFixed(2)}
--------------------------------
💳 *Payment Methods Accepted:*
Cash | DuitNow QR | PayNow QR

_Reply "AGREE" to confirm this work order or let us know if you have any questions!_`;
}

export function buildReceiptWhatsAppMessage(job: Job, traderName: string): string {
  const dateStr = new Date(job.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const coreReceiptLine = `RECEIPT: ${job.scopeDescription.replace(/\n/g, ' ')} | Paid via ${job.paymentMethod} | Amount: ${job.currency}${job.agreedPrice.toFixed(2)}`;

  return `🧾 *OFFICIAL PAYMENT RECEIPT*
--------------------------------
*Business:* ${traderName || 'Field Specialist Service'}
*Date:* ${dateStr}
*Client:* ${job.customerName || 'Valued Client'}
*Ref ID:* #${job.id.slice(0, 8).toUpperCase()}

${coreReceiptLine}

--------------------------------
✅ *Status:* PAID & COMPLETED
Thank you for your business!`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanedPhone = formatPhoneNumberForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  if (cleanedPhone && cleanedPhone.length >= 7) {
    return `https://wa.me/${cleanedPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

const STORAGE_KEYS = {
  JOBS: 'solo_field_trader_jobs_v1',
  SETTINGS: 'solo_field_trader_settings_v1',
  PRESETS: 'solo_field_trader_presets_v1',
};

export const DEFAULT_SETTINGS: TraderSettings = {
  businessName: 'Apex Field Services',
  traderPhone: '+60123456789',
  tradeCategory: 'panel_beater',
  currency: '$',
  duitNowUenOrPhone: '123456789-MY',
  payNowUenOrPhone: '+6591234567',
  highContrastMode: false,
};

export function loadSavedJobs(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveJobs(jobs: Job[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  } catch (err) {}
}

export function loadTraderSettings(): TraderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export function saveTraderSettings(settings: TraderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {}
}

export function loadScopePresets(): ScopePreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (!raw) return INITIAL_PRESETS;
    const custom: ScopePreset[] = JSON.parse(raw);
    return custom && custom.length > 0 ? custom : INITIAL_PRESETS;
  } catch (err) {
    return INITIAL_PRESETS;
  }
}

export function saveScopePresets(presets: ScopePreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
  } catch (err) {}
}

// ============================================================================
// COMPONENT 1: HEADER
// ============================================================================
export const Header: React.FC<{
  settings: TraderSettings;
  activeTrade: TradeCategory;
  onTradeChange: (trade: TradeCategory) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onToggleHighContrast: () => void;
  savedJobsCount: number;
}> = ({
  settings,
  activeTrade,
  onOpenSettings,
  onOpenHistory,
  onToggleHighContrast,
  savedJobsCount,
}) => {
  const currentTradeObj = TRADE_INFO[activeTrade] || TRADE_INFO.custom;

  const renderTradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'CarFront': return <CarFront className="w-3.5 h-3.5" />;
      case 'Wrench': return <Wrench className="w-3.5 h-3.5" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Truck': return <Truck className="w-3.5 h-3.5" />;
      case 'Droplets': return <Droplets className="w-3.5 h-3.5" />;
      case 'KeyRound': return <KeyRound className="w-3.5 h-3.5" />;
      case 'Hammer': return <Hammer className="w-3.5 h-3.5" />;
      default: return <Briefcase className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white text-black border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-colors">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {settings.logoUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 flex items-center justify-center">
              <img
                src={settings.logoUrl}
                alt="Business Logo"
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
              ⚡
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-black text-base sm:text-lg uppercase tracking-tight leading-tight text-black truncate">
              {settings.businessName || 'FieldTrade Pro'}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {renderTradeIcon(currentTradeObj.iconName)}
                <span>{currentTradeObj.name}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHighContrast}
            className={`p-2 rounded-xl border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              settings.highContrastMode
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-slate-100'
            }`}
            title="Toggle High-Contrast Outdoor Sun Mode"
          >
            <Sun className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl bg-white border-2 border-black text-black hover:bg-slate-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Job History Register"
          >
            <History className="w-5 h-5 stroke-[2.5]" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {savedJobsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-black text-white border-2 border-black hover:bg-slate-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Trader Settings"
          >
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// COMPONENT 2: TRADE SELECTOR & TICKER
// ============================================================================
export const TradeSelector: React.FC<{
  selectedCategory: TradeCategory;
  onSelectCategory: (category: TradeCategory) => void;
  presets: ScopePreset[];
  onApplyPreset: (preset: ScopePreset) => void;
  currency: string;
  isHighContrast?: boolean;
  onAddNewPresetClick?: () => void;
}> = ({
  selectedCategory,
  onSelectCategory,
  presets,
  onApplyPreset,
  currency,
  onAddNewPresetClick,
}) => {
  const filteredPresets = presets.filter((p) => p.category === selectedCategory);

  const categories: TradeCategory[] = [
    'panel_beater',
    'mechanic',
    'auto_electrician',
    'towing',
    'plumber',
    'locksmith',
    'handyman',
    'custom',
  ];

  const renderIcon = (category: TradeCategory, className: string) => {
    switch (category) {
      case 'panel_beater': return <CarFront className={className} />;
      case 'mechanic': return <Wrench className={className} />;
      case 'auto_electrician': return <Zap className={`${className} text-yellow-400`} />;
      case 'towing': return <Truck className={className} />;
      case 'plumber': return <Droplets className={className} />;
      case 'locksmith': return <KeyRound className={className} />;
      case 'handyman': return <Hammer className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  return (
    <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 border border-black inline-block shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
          <span>Unlimited Trade Ticker Bar</span>
        </label>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-black">
          Scroll ➔
        </span>
      </div>

      <div className="relative mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-thin scrollbar-thumb-black snap-x touch-pan-x">
          {categories.map((cat) => {
            const info = TRADE_INFO[cat] || TRADE_INFO.custom;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`snap-start min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all border-2 border-black shrink-0 active:translate-x-[1px] active:translate-y-[1px] ${
                  isSelected
                    ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                    : 'bg-slate-100 text-black hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {renderIcon(cat, 'w-4 h-4')}
                <span>{info.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-yellow-400 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-black pt-3 mb-2">
        <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Presets ({filteredPresets.length})</span>
        </span>

        {onAddNewPresetClick && (
          <button
            type="button"
            onClick={onAddNewPresetClick}
            className="px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-black uppercase flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Add Custom Preset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="min-h-[52px] p-3 rounded-xl border-2 border-black bg-slate-50 hover:bg-yellow-300 text-left transition-all flex items-start justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-xs text-black uppercase leading-snug line-clamp-1">
                {preset.title}
              </div>
              <p className="text-[11px] text-slate-700 line-clamp-2 mt-0.5 font-medium leading-tight">
                {preset.description}
              </p>
            </div>
            <div className="shrink-0 px-2 py-1 rounded-lg bg-green-500 text-black font-black border-2 border-black text-xs font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              +{currency}{preset.suggestedPrice}
            </div>
          </button>
        ))}

        {filteredPresets.length === 0 && (
          <div className="col-span-full py-6 text-center text-slate-600 bg-slate-50 rounded-xl border-2 border-dashed border-black space-y-2">
            <p className="text-xs font-black uppercase">No presets found for this trade category</p>
            {onAddNewPresetClick && (
              <button
                type="button"
                onClick={onAddNewPresetClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-yellow-400 font-black text-xs uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Preset Now</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 3: CAMERA CAPTURE
// ============================================================================
export const CameraCapture: React.FC<{
  photos: JobPhoto[];
  onAddPhoto: (photo: JobPhoto) => void;
  onRemovePhoto: (id: string) => void;
  onTagPhoto: (id: string, tag: string) => void;
  onOpenLightbox: (url: string) => void;
  isHighContrast?: boolean;
}> = ({ photos, onAddPhoto, onRemovePhoto, onTagPhoto, onOpenLightbox }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const TAG_OPTIONS = ['Before Repair', 'Damage Site', 'Serial #', 'Work Completed'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: JobPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          dataUrl: reader.result as string,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tag: 'Before Repair',
        };
        onAddPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black transition-all space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 border border-black inline-block shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></span>
          <span>Field Photos & Inspection ({photos.length})</span>
        </label>
        <span className="text-[11px] font-bold text-slate-600 uppercase">
          Camera / Gallery
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="native-camera-input"
        multiple
      />

      <label
        htmlFor="native-camera-input"
        className="w-full min-h-[52px] p-3 rounded-xl border-3 border-black bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
      >
        <Camera className="w-5 h-5 stroke-[2.5]" />
        <span>Snap Site Photo (Native Camera)</span>
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-xl border-2 border-black bg-slate-50 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col"
            >
              <div className="relative h-28 w-full bg-black overflow-hidden group">
                <img
                  src={photo.dataUrl}
                  alt="Job Inspection"
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onOpenLightbox(photo.dataUrl)}
                />

                <button
                  type="button"
                  onClick={() => onRemovePhoto(photo.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500 text-black border border-black hover:bg-red-600 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  title="Delete photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenLightbox(photo.dataUrl)}
                  className="absolute bottom-1.5 right-1.5 p-1 rounded-lg bg-black text-white border border-black hover:bg-slate-800 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  title="Expand"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-1.5 bg-white border-t-2 border-black flex items-center gap-1">
                <Tag className="w-3 h-3 text-black shrink-0" />
                <select
                  value={photo.tag || 'Before Repair'}
                  onChange={(e) => onTagPhoto(photo.id, e.target.value)}
                  className="w-full text-[10px] font-black uppercase bg-slate-100 border border-black rounded px-1 py-0.5 text-black focus:outline-none"
                >
                  {TAG_OPTIONS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT 4: PAYMENT & QR MODAL
// ============================================================================
export const PaymentQRModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  amount: number;
  currency: string;
  scope: string;
  settings: TraderSettings;
  onConfirmPayment: () => void;
}> = ({
  isOpen,
  onClose,
  selectedMethod,
  onSelectMethod,
  amount,
  currency,
  scope,
  settings,
  onConfirmPayment,
}) => {
  const [cashTendered, setCashTendered] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  if (!isOpen) return null;

  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = tenderedNum > amount ? tenderedNum - amount : 0;

  const buildQRData = () => {
    if (selectedMethod === 'DuitNow QR') {
      const uen = settings.duitNowUenOrPhone || 'MY-FIELD-TRADER';
      return `DUITNOW:${uen}:AMT:${amount.toFixed(2)}:REF:${encodeURIComponent(scope.slice(0, 20))}`;
    }
    if (selectedMethod === 'PayNow QR') {
      const uen = settings.payNowUenOrPhone || 'SG-FIELD-TRADER';
      return `PAYNOW:${uen}:AMT:${amount.toFixed(2)}:REF:${encodeURIComponent(scope.slice(0, 20))}`;
    }
    return `CASH_RECEIPT:${amount}`;
  };

  const qrString = buildQRData();

  const handleCopyQRString = () => {
    navigator.clipboard.writeText(qrString);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black overflow-hidden flex flex-col transition-all">
        <div className="p-4 bg-white border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-extrabold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              💰
            </div>
            <div>
              <h3 className="font-black text-base uppercase text-black">Collect Payment</h3>
              <p className="text-xs font-bold text-slate-600">Total Due: <span className="text-black font-black">{currency}{amount.toFixed(2)}</span></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black text-white border-2 border-black hover:bg-slate-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 border-2 border-black">
            {(['Cash', 'DuitNow QR', 'PayNow QR'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onSelectMethod(method)}
                className={`py-2.5 px-2 rounded-lg text-xs font-black uppercase transition-all flex flex-col items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] border-2 border-black ${
                  selectedMethod === method
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-yellow-400/20'
                }`}
              >
                {method === 'Cash' ? (
                  <Banknote className="w-4 h-4" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>{method}</span>
              </button>
            ))}
          </div>

          {(selectedMethod === 'DuitNow QR' || selectedMethod === 'PayNow QR') && (
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border-2 border-black space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 border border-black text-black text-xs font-black uppercase">
                <QrCode className="w-3.5 h-3.5" />
                <span>{selectedMethod} Instant Scan</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <QRCodeSVG
                  value={qrString}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-black text-slate-700 uppercase">
                  {selectedMethod === 'DuitNow QR' ? 'DuitNow ID / Phone:' : 'PayNow UEN / Phone:'}
                </p>
                <p className="text-sm font-black text-black font-mono mt-0.5">
                  {selectedMethod === 'DuitNow QR' 
                    ? (settings.duitNowUenOrPhone || 'Set UEN in Settings')
                    : (settings.payNowUenOrPhone || 'Set UEN in Settings')}
                </p>
              </div>

              <div className="w-full flex items-center justify-between text-[11px] text-black px-2 py-1.5 rounded-lg bg-white border-2 border-black">
                <span className="truncate max-w-[200px] font-mono font-bold">{qrString}</span>
                <button
                  type="button"
                  onClick={handleCopyQRString}
                  className="flex items-center gap-1 text-black hover:text-blue-600 font-black uppercase ml-2 shrink-0"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {selectedMethod === 'Cash' && (
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-black space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-black uppercase flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Cash Received from Client</span>
                </label>
                <span className="text-[11px] font-black uppercase text-slate-500">Quick Change Calc</span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-black text-base">
                  {currency}
                </span>
                <input
                  type="number"
                  placeholder={`${amount}`}
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border-2 border-black text-black font-black text-lg focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="flex gap-2">
                {[amount, 50, 100, 200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashTendered(val.toString())}
                    className="flex-1 py-1.5 rounded-lg bg-white hover:bg-yellow-300 border-2 border-black text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    {currency}{val}
                  </button>
                ))}
              </div>

              {tenderedNum >= amount && (
                <div className="p-3 rounded-xl bg-green-100 border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs font-black text-black uppercase">Change to return:</span>
                  <span className="text-lg font-black text-black font-mono">
                    {currency}{changeDue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onConfirmPayment}
            className="w-full min-h-[52px] rounded-xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-[#25D366] hover:bg-[#20bd5a] text-white border-4 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Mark Completed & Paid</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 5: TRADER SETTINGS MODAL
// ============================================================================
export const TraderSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  settings: TraderSettings;
  onSaveSettings: (settings: TraderSettings) => void;
  presets: ScopePreset[];
  onSavePresets: (presets: ScopePreset[]) => void;
}> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  presets,
  onSavePresets,
}) => {
  const [formSettings, setFormSettings] = useState<TraderSettings>(settings);
  const [activeTab, setActiveTab] = useState<'profile' | 'presets'>('profile');
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('50');
  const [newCat, setNewCat] = useState<TradeCategory>('panel_beater');

  if (!isOpen) return null;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormSettings(prev => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormSettings(prev => ({
      ...prev,
      logoUrl: undefined,
    }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    onClose();
  };

  const handleAddCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPresetObj: ScopePreset = {
      id: `custom-${Date.now()}`,
      category: newCat,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom trade service scope item',
      suggestedPrice: parseFloat(newPrice) || 50,
    };

    const updated = [newPresetObj, ...presets];
    onSavePresets(updated);

    setNewTitle('');
    setNewDesc('');
    setNewPrice('50');
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    onSavePresets(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black overflow-hidden flex flex-col max-h-[90vh] transition-all">
        <div className="p-4 bg-white border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚙️
            </div>
            <div>
              <h3 className="font-black text-base uppercase text-black">Trader Profile & Settings</h3>
              <p className="text-xs font-bold text-slate-600">Customize business header & payment QR IDs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black text-white border-2 border-black hover:bg-slate-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b-2 border-black bg-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-xs font-black uppercase transition-colors ${
              activeTab === 'profile'
                ? 'bg-yellow-400 text-black border-r-2 border-black shadow-[inset_0_-2px_0_0_rgba(0,0,0,1)]'
                : 'bg-slate-100 text-black hover:bg-slate-200 border-r-2 border-black'
            }`}
          >
            Business & Logo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2.5 text-xs font-black uppercase transition-colors ${
              activeTab === 'presets'
                ? 'bg-yellow-400 text-black shadow-[inset_0_-2px_0_0_rgba(0,0,0,1)]'
                : 'bg-slate-100 text-black hover:bg-slate-200'
            }`}
          >
            Custom Presets ({presets.length})
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-yellow-500" />
                  <span>Pro Branding - Company Logo (Square 1:1 / 4x4)</span>
                </label>
                
                <div className="flex items-center gap-3">
                  {formSettings.logoUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden shrink-0">
                      <img
                        src={formSettings.logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-cover aspect-square"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-black bg-white flex flex-col items-center justify-center shrink-0 text-slate-400">
                      <ImageIcon className="w-6 h-6 text-black" />
                      <span className="text-[9px] font-black uppercase text-black">No Logo</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="trader-logo-upload"
                    />
                    <label
                      htmlFor="trader-logo-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black hover:bg-slate-800 text-yellow-400 text-xs font-black uppercase cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formSettings.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                    </label>

                    {formSettings.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="ml-2 inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-red-500 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                    <p className="text-[10px] text-slate-600 font-bold">Square photo uploaded will appear in header and WhatsApp quotes.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Company / Business Name</span>
                </label>
                <input
                  type="text"
                  value={formSettings.businessName}
                  onChange={(e) => setFormSettings({ ...formSettings, businessName: e.target.value })}
                  placeholder="e.g. Apex Dent & Repair Co"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-black text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span>Trader Mobile Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={formSettings.traderPhone}
                    onChange={(e) => setFormSettings({ ...formSettings, traderPhone: e.target.value })}
                    placeholder="+60123456789"
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Currency Symbol</span>
                  </label>
                  <select
                    value={formSettings.currency}
                    onChange={(e) => setFormSettings({ ...formSettings, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black text-black font-black text-xs focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="$">$ (USD/SGD/AUD)</option>
                    <option value="RM">RM (MYR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="₹">₹ (INR)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border-2 border-black space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <label className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-600" />
                  <span>Instant Payment QR Identifiers</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-black uppercase mb-1">
                    DuitNow QR Phone / UEN (Malaysia)
                  </label>
                  <input
                    type="text"
                    value={formSettings.duitNowUenOrPhone}
                    onChange={(e) => setFormSettings({ ...formSettings, duitNowUenOrPhone: e.target.value })}
                    placeholder="e.g. 0123456789"
                    className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-black uppercase mb-1">
                    PayNow QR UEN / Mobile (Singapore)
                  </label>
                  <input
                    type="text"
                    value={formSettings.payNowUenOrPhone}
                    onChange={(e) => setFormSettings({ ...formSettings, payNowUenOrPhone: e.target.value })}
                    placeholder="e.g. 201912345A"
                    className="w-full px-3 py-2 rounded-lg bg-white border-2 border-black text-black font-mono font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <span>Save Profile Settings</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleAddCustomPreset} className="p-3.5 rounded-xl bg-slate-50 border-2 border-black space-y-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-green-600" />
                  <span>Add New Custom Preset</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black">Trade Category</label>
                    <select
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value as TradeCategory)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border-2 border-black text-xs font-black uppercase"
                    >
                      {Object.entries(TRADE_INFO).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-black">Price ({formSettings.currency})</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border-2 border-black text-xs font-mono font-black"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black">Preset Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Battery replacement"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border-2 border-black text-xs font-black text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black">Description</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. On-site swap & terminal clean"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border-2 border-black text-xs font-bold text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-black text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-800 transition-all"
                >
                  Save Preset Item
                </button>
              </form>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-black">Existing Presets ({presets.length})</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-2.5 rounded-xl border-2 border-black bg-white flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black text-white">
                            {TRADE_INFO[preset.category]?.name || preset.category}
                          </span>
                          <span className="font-black text-xs text-black uppercase truncate">{preset.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 truncate mt-0.5 font-bold">{preset.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-black text-xs font-mono text-black">{formSettings.currency}{preset.suggestedPrice}</span>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1 rounded bg-red-500 text-black border border-black hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 6: JOB HISTORY MODAL
// ============================================================================
export const JobHistoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  settings: TraderSettings;
  onOpenPaymentForJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  isHighContrast?: boolean;
}> = ({
  isOpen,
  onClose,
  jobs,
  settings,
  onOpenPaymentForJob,
  onDeleteJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobStatus>('ALL');

  if (!isOpen) return null;

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerPhone.includes(searchTerm) ||
      job.scopeDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendQuoteWhatsApp = (job: Job) => {
    const text = buildQuoteWhatsAppMessage(job, settings.businessName);
    const url = getWhatsAppUrl(job.customerPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendReceiptWhatsApp = (job: Job) => {
    const text = buildReceiptWhatsAppMessage(job, settings.businessName);
    const url = getWhatsAppUrl(job.customerPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black overflow-hidden flex flex-col max-h-[90vh] transition-all">
        <div className="p-4 bg-white border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              📋
            </div>
            <div>
              <h3 className="font-black text-base uppercase text-black">Field Job Register ({jobs.length})</h3>
              <p className="text-xs font-bold text-slate-600">All local quotes & completed receipts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black text-white border-2 border-black hover:bg-slate-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b-2 border-black space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, phone, or scope..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-2 border-black text-black text-xs font-black focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex gap-2">
            {(['ALL', 'Quotation Sent', 'Completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-black uppercase transition-all border-2 border-black active:translate-x-[1px] active:translate-y-[1px] ${
                  statusFilter === st
                    ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {st === 'ALL' ? 'All Jobs' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`p-3.5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2.5 ${
                  job.status === 'Completed'
                    ? 'bg-green-50'
                    : 'bg-yellow-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase text-black">
                        {job.customerName || 'Unnamed Client'}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-black ${
                        job.status === 'Completed'
                          ? 'bg-green-400 text-black'
                          : 'bg-yellow-400 text-black'
                      }`}>
                        {job.status === 'Completed' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid & Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Quotation Sent</span>
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                      📱 {job.customerPhone || 'No WhatsApp phone'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-base text-black font-mono">
                      {job.currency}{job.agreedPrice.toFixed(2)}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-600">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-black line-clamp-2 bg-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {job.scopeDescription}
                </p>

                {job.photos.length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-black font-black uppercase">
                    <span>📷 {job.photos.length} photo(s) attached</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t-2 border-black">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendQuoteWhatsApp(job)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white border-2 border-black font-black text-xs uppercase flex items-center gap-1 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Quote WA</span>
                    </button>

                    {job.status === 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => handleSendReceiptWhatsApp(job)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white border-2 border-black font-black text-xs uppercase flex items-center gap-1 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Send Receipt via WA</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenPaymentForJob(job)}
                        className="px-2.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-black text-xs uppercase flex items-center gap-1 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Collect Payment</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteJob(job.id)}
                    className="p-1.5 rounded-lg bg-red-500 text-black border-2 border-black font-black text-xs transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    title="Delete Job"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-black space-y-2">
              <p className="text-sm font-black uppercase">No jobs matching filter</p>
              <p className="text-xs font-bold text-slate-600">Create a quote from the main screen to register field jobs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 7: LIGHTBOX MODAL
// ============================================================================
export const LightboxModal: React.FC<{
  dataUrl: string | null;
  onClose: () => void;
}> = ({ dataUrl, onClose }) => {
  if (!dataUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-xl bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300 transition-all font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
          title="Close Lightbox"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
          <img
            src={dataUrl}
            alt="Field photo detail"
            className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <a
            href={dataUrl}
            download="field-site-photo.jpg"
            className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Field Photo</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [settings, setSettings] = useState<TraderSettings>(loadTraderSettings);
  const [jobs, setJobs] = useState<Job[]>(loadSavedJobs);
  const [presets, setPresets] = useState<ScopePreset[]>(loadScopePresets);

  const [activeTrade, setActiveTrade] = useState<TradeCategory>(settings.tradeCategory || 'panel_beater');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [scopeDescription, setScopeDescription] = useState<string>('');
  const [agreedPrice, setAgreedPrice] = useState<number>(150);
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [jobStatus, setJobStatus] = useState<JobStatus>('Quotation Sent');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DuitNow QR');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [copiedQuoteMsg, setCopiedQuoteMsg] = useState<boolean>(false);
  const [copiedReceiptMsg, setCopiedReceiptMsg] = useState<boolean>(false);

  useEffect(() => {
    saveTraderSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    saveScopePresets(presets);
  }, [presets]);

  const handleApplyPreset = (preset: ScopePreset) => {
    if (scopeDescription.trim()) {
      setScopeDescription((prev) => `${prev}\n• ${preset.title}: ${preset.description}`);
      setAgreedPrice((prev) => prev + preset.suggestedPrice);
    } else {
      setScopeDescription(`• ${preset.title}: ${preset.description}`);
      setAgreedPrice(preset.suggestedPrice);
    }
  };

  const handleAddPhoto = (photo: JobPhoto) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleTagPhoto = (id: string, tag: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tag } : p))
    );
  };

  const handleAdjustPrice = (delta: number) => {
    setAgreedPrice((prev) => Math.max(0, prev + delta));
  };

  const getCurrentJobObject = (): Job => {
    return {
      id: activeJobId || `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      tradeCategory: activeTrade,
      customerName: customerName.trim() || 'Client',
      customerPhone: customerPhone.trim() || settings.traderPhone,
      scopeDescription: scopeDescription.trim() || 'Field service & repair work',
      agreedPrice: agreedPrice,
      currency: settings.currency || '$',
      photos: photos,
      status: jobStatus,
      paymentMethod: paymentMethod,
    };
  };

  const handleSendQuote = () => {
    const jobObj = getCurrentJobObject();

    setJobs((prev) => {
      const exists = prev.some((j) => j.id === jobObj.id);
      if (exists) {
        return prev.map((j) => (j.id === jobObj.id ? jobObj : j));
      }
      return [jobObj, ...prev];
    });

    setActiveJobId(jobObj.id);

    const textMsg = buildQuoteWhatsAppMessage(jobObj, settings.businessName);
    const waUrl = getWhatsAppUrl(jobObj.customerPhone, textMsg);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyQuoteText = () => {
    const jobObj = getCurrentJobObject();
    const textMsg = buildQuoteWhatsAppMessage(jobObj, settings.businessName);
    navigator.clipboard.writeText(textMsg);
    setCopiedQuoteMsg(true);
    setTimeout(() => setCopiedQuoteMsg(false), 2000);
  };

  const handleConfirmPaymentAndComplete = () => {
    const jobObj = getCurrentJobObject();
    const completedJob: Job = {
      ...jobObj,
      status: 'Completed',
      completedAt: new Date().toISOString(),
      paymentMethod: paymentMethod,
    };

    setJobStatus('Completed');

    setJobs((prev) => {
      const exists = prev.some((j) => j.id === completedJob.id);
      if (exists) {
        return prev.map((j) => (j.id === completedJob.id ? completedJob : j));
      }
      return [completedJob, ...prev];
    });

    setIsPaymentModalOpen(false);
  };

  const handleSendReceipt = () => {
    const jobObj = getCurrentJobObject();
    const textMsg = buildReceiptWhatsAppMessage(jobObj, settings.businessName);
    const waUrl = getWhatsAppUrl(jobObj.customerPhone, textMsg);

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyReceiptText = () => {
    const jobObj = getCurrentJobObject();
    const textMsg = buildReceiptWhatsAppMessage(jobObj, settings.businessName);
    navigator.clipboard.writeText(textMsg);
    setCopiedReceiptMsg(true);
    setTimeout(() => setCopiedReceiptMsg(false), 2000);
  };

  const handleResetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setScopeDescription('');
    setAgreedPrice(150);
    setPhotos([]);
    setJobStatus('Quotation Sent');
    setActiveJobId(null);
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleOpenPaymentForJob = (job: Job) => {
    setActiveJobId(job.id);
    setActiveTrade(job.tradeCategory);
    setCustomerName(job.customerName);
    setCustomerPhone(job.customerPhone);
    setScopeDescription(job.scopeDescription);
    setAgreedPrice(job.agreedPrice);
    setPhotos(job.photos);
    setJobStatus(job.status);
    setPaymentMethod(job.paymentMethod);
    setIsHistoryModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-black font-sans antialiased transition-colors duration-200">
      <Header
        settings={settings}
        activeTrade={activeTrade}
        onTradeChange={setActiveTrade}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onToggleHighContrast={() =>
          setSettings((prev) => ({ ...prev, highContrastMode: !prev.highContrastMode }))
        }
        savedJobsCount={jobs.length}
      />

      <main className="max-w-xl mx-auto px-4 py-4 space-y-4 pb-28">
        {settings.highContrastMode && (
          <div className="p-3 rounded-xl bg-yellow-400 text-black font-black text-xs flex items-center justify-between border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <span className="flex items-center gap-1.5 uppercase">
              ☀️ <span>HIGH-GLARE SOLAR OUTDOOR MODE ACTIVE</span>
            </span>
            <span className="text-[10px] uppercase font-black bg-black text-white px-2 py-0.5 rounded">Direct Sunlight</span>
          </div>
        )}

        <TradeSelector
          selectedCategory={activeTrade}
          onSelectCategory={setActiveTrade}
          presets={presets}
          onApplyPreset={handleApplyPreset}
          currency={settings.currency}
          isHighContrast={settings.highContrastMode}
          onAddNewPresetClick={() => setIsSettingsModalOpen(true)}
        />

        <section className="p-5 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-blue-600 border border-black inline-block"></span>
              <h2 className="font-black text-lg uppercase text-black tracking-tight">1. Client & Quote Builder</h2>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              jobStatus === 'Completed'
                ? 'bg-emerald-400 text-black'
                : 'bg-yellow-400 text-black'
            }`}>
              <Zap className="w-3.5 h-3.5" />
              <span>{jobStatus}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John Tan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-bold bg-slate-50 border-2 border-black text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-green-600" />
                <span>WhatsApp / Phone</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. +60123456789"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold bg-slate-50 border-2 border-black text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Work Scope Description</span>
              </label>
              {scopeDescription && (
                <button
                  type="button"
                  onClick={() => setScopeDescription('')}
                  className="text-[11px] text-red-600 hover:underline font-black uppercase"
                >
                  Clear Scope
                </button>
              )}
            </div>
            <textarea
              rows={3}
              placeholder="Describe repair/service scope or tap presets above to pre-fill..."
              value={scopeDescription}
              onChange={(e) => setScopeDescription(e.target.value)}
              className="w-full p-3 rounded-xl text-xs font-bold bg-slate-50 border-2 border-black text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Total Agreed Price ({settings.currency})</span>
              </label>
              <span className="text-[11px] font-black uppercase text-slate-500">Quick adjust</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-black text-xl">
                  {settings.currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full min-h-[52px] pl-10 pr-4 py-2 rounded-xl bg-white border-2 border-black text-black font-black text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(-10)}
                  className="w-12 h-[52px] rounded-xl bg-white border-2 border-black font-black text-xs text-black hover:bg-slate-100 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  title="Subtract $10"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(10)}
                  className="w-12 h-[52px] rounded-xl bg-yellow-400 border-2 border-black font-black text-xs text-black hover:bg-yellow-300 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  title="Add $10"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(50)}
                  className="w-12 h-[52px] rounded-xl bg-green-500 border-2 border-black font-black text-xs text-black hover:bg-green-400 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  title="Add $50"
                >
                  +50
                </button>
              </div>
            </div>
          </div>
        </section>

        <CameraCapture
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
          onTagPhoto={handleTagPhoto}
          onOpenLightbox={setLightboxUrl}
          isHighContrast={settings.highContrastMode}
        />

        <section className="p-5 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black space-y-3">
          <button
            type="button"
            onClick={handleSendQuote}
            className="w-full min-h-[56px] px-4 py-3.5 rounded-xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all bg-[#25D366] text-white hover:bg-[#20bd5a] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Send className="w-5 h-5 stroke-[2.5]" />
            <span>Send Quote via WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyQuoteText}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white border-2 border-black text-black text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              {copiedQuoteMsg ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
              <span>{copiedQuoteMsg ? 'Quote Copied!' : 'Copy Quote Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-yellow-400 border-2 border-black text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <QrCode className="w-4 h-4" />
              <span>Collect Payment QR</span>
            </button>
          </div>

          {jobStatus !== 'Completed' ? (
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full py-3 rounded-xl bg-black text-white border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <CheckCircle2 className="w-4 h-4 text-yellow-400" />
              <span>Mark Completed & Collect Payment</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-black space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between text-xs font-black text-black uppercase">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>JOB COMPLETED & PAID ({paymentMethod})</span>
                </span>
                <span className="font-mono text-sm">{settings.currency}{agreedPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={handleSendReceipt}
                className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white border-3 border-black font-black text-sm uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <Receipt className="w-5 h-5 stroke-[2.5]" />
                <span>Send Receipt via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReceiptText}
                className="w-full py-2 rounded-lg bg-white border border-black text-black text-xs font-black uppercase flex items-center justify-center gap-1 hover:bg-slate-100 transition-colors"
              >
                {copiedReceiptMsg ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReceiptMsg ? 'Receipt Copied!' : 'Copy Receipt String'}</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-black text-black hover:text-blue-600 uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Start New Job Quote</span>
            </button>
          </div>
        </section>
      </main>

      <PaymentQRModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        amount={agreedPrice}
        currency={settings.currency}
        scope={scopeDescription}
        settings={settings}
        onConfirmPayment={handleConfirmPaymentAndComplete}
      />

      <TraderSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        presets={presets}
        onSavePresets={setPresets}
      />

      <JobHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        jobs={jobs}
        settings={settings}
        onOpenPaymentForJob={handleOpenPaymentForJob}
        onDeleteJob={handleDeleteJob}
      />

      <LightboxModal
        dataUrl={lightboxUrl}
        onClose={() => setLightboxUrl(null)}
      />
    </div>
  );
}
