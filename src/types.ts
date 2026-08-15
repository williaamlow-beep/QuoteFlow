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
  description?: string;
}

export interface HistoricalQuote {
  id: string;
  timestamp: string;
  customerName: string;
  phoneNumber?: string;
  vehicleOrJobDetails?: string;
  totalPrice: number;
  items: QuoteItem[];
  photosCount: number;
  deliveryMethod: 'whatsapp_link' | 'whatsapp_cloud_api';
  messageId?: string;
  transcript?: string;
}

export interface TradeInfo {
  name: string;
  iconName: string;
  presets: ScopePreset[];
  sampleVoicePrompt: string;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  useCloudApi: boolean;
}

export interface BusinessSettings {
  businessName: string;
  businessPhone: string;
  currencySymbol: string;
  address: string;
  paymentInstructions: string;
  whatsappConfig: WhatsAppConfig;
}
