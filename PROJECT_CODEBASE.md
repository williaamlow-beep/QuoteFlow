# QuoteFlow - Complete Project Codebase Reference
Generated for direct inspection and export.

---

## 1. Project Configuration & Metadata

### `metadata.json`
```json
{
  "name": "QuoteFlow - Voice-to-WhatsApp Trade Quotation",
  "description": "Instant speech-to-text quote generator powered by Gemini AI with WhatsApp Business API and click-to-chat integration for field trades and service professionals.",
  "requestFramePermissions": [
    "microphone",
    "camera"
  ],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ]
}
```

### `.env.example`
```env
# GEMINI_API_KEY: Required for Gemini AI API calls.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
APP_URL="MY_APP_URL"

# WHATSAPP_API_TOKEN: Optional Meta WhatsApp Business Cloud API System User Access Token
WHATSAPP_API_TOKEN=""

# WHATSAPP_PHONE_NUMBER_ID: Optional Meta WhatsApp Phone Number ID (from Meta Developers Portal)
WHATSAPP_PHONE_NUMBER_ID=""

# WHATSAPP_BUSINESS_ACCOUNT_ID: Optional Meta WhatsApp Business Account ID
WHATSAPP_BUSINESS_ACCOUNT_ID=""
```

### `package.json`
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "@types/express": "^4.17.21"
  }
}
```

### `vite.config.ts`
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

---

## 2. Server & Backend Logic

### `server.ts`
```typescript
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function cleanMimeType(rawMime: string): string {
  if (!rawMime) return 'audio/webm';
  const base = rawMime.split(';')[0].trim().toLowerCase();
  const allowed = [
    'audio/webm',
    'audio/mp4',
    'audio/wav',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/aac',
    'audio/x-m4a',
    'audio/m4a',
    'audio/flac'
  ];
  if (allowed.includes(base)) return base;
  if (base.includes('webm')) return 'audio/webm';
  if (base.includes('mp4') || base.includes('m4a')) return 'audio/mp4';
  if (base.includes('wav')) return 'audio/wav';
  if (base.includes('ogg')) return 'audio/ogg';
  return 'audio/webm';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasWhatsAppKey: Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
    });
  });

  app.get('/api/whatsapp/status', (req, res) => {
    const configured = Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
    const maskedPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
      ? `${process.env.WHATSAPP_PHONE_NUMBER_ID.slice(0, 4)}...${process.env.WHATSAPP_PHONE_NUMBER_ID.slice(-4)}`
      : null;

    res.json({
      configured,
      phoneNumberId: maskedPhoneId,
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ? 'Configured' : null,
    });
  });

  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const { recipientPhone, message, customCredentials } = req.body;

      if (!recipientPhone || !message) {
        return res.status(400).json({ error: 'recipientPhone and message are required.' });
      }

      const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 7) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
      }

      const token = customCredentials?.token || process.env.WHATSAPP_API_TOKEN;
      const phoneNumberId = customCredentials?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (token && phoneNumberId) {
        const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanPhone,
            type: 'text',
            text: {
              preview_url: false,
              body: message,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          return res.status(response.status).json({
            error: data.error?.message || 'Failed to dispatch via WhatsApp Business Cloud API',
            details: data,
            fallbackUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
          });
        }

        return res.json({
          success: true,
          method: 'cloud_api',
          messageId: data.messages?.[0]?.id,
          recipient: cleanPhone,
          fallbackUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
        });
      }

      const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      return res.json({
        success: true,
        method: 'deep_link',
        link: waLink,
        message: 'WhatsApp Cloud API credentials not configured; generated direct Click-to-Chat link.',
      });
    } catch (err: any) {
      console.error('WhatsApp send error:', err);
      res.status(500).json({ error: err.message || 'Internal server error while sending WhatsApp message' });
    }
  });

  app.post('/api/speech-to-quote', async (req, res) => {
    try {
      const { audioBase64, mimeType, trade, tradeName } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'audioBase64 is required.' });
      }

      const cleanMime = cleanMimeType(mimeType || 'audio/webm');
      const ai = getGeminiClient();

      const systemInstruction = `You are an elite, highly accurate field trade speech-to-quotation assistant for "${tradeName || 'Field Services'}".
Your job is to transcribe the user's spoken audio verbatim, and accurately extract quotation fields.

Rules:
1. "transcript": Full exact spoken transcript of the audio in English or the spoken language.
2. "customerName": The customer name if mentioned (e.g. "Mr Tan", "Sarah", "Ahmad"). If vehicle number / plate / unit / address identifier is mentioned (e.g., "SMC 1234 A", "Unit 12-04", "Toyota Vios"), append it appropriately like "Mr Tan (SMC 1234 A)" or "Sarah (#12-04)".
3. "phoneNumber": Any contact phone or WhatsApp number mentioned, or empty string.
4. "vehicleOrJobDetails": Short summary of vehicle model, site, or job context (e.g. "2019 Honda Civic Front Bumper", "Kitchen Master Bath leak").
5. "items": Array of distinct line items. For each line item:
   - "title": Clean, professional service/part title (e.g. "Bumper Dent Repair & Spray Paint", "Brake Pad Replacement Front Axle").
   - "price": Numeric value for this specific item (e.g. 280, 45.50). If prices are spoken as "$200", "200 ringgit", "150 dollars", extract the pure number 200 or 150.
   - "description": Brief extra detail if spoken (e.g. "OEM parts included", "Touch-up clear coat").
6. "notes": Any customer instructions or notes (e.g. "Customer needs car by 5pm", "Check oil filter too").

Always return valid JSON matching the schema strictly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: audioBase64,
                },
              },
              {
                text: `Transcribe and parse this spoken trade voice note for trade category: ${tradeName || trade || 'Field Services'}. Extract all line items, customer name, vehicle/site info, and full transcript.`,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transcript: {
                type: Type.STRING,
                description: 'Verbatim spoken audio transcript',
              },
              customerName: {
                type: Type.STRING,
                description: 'Customer name with vehicle plate/unit number if mentioned',
              },
              phoneNumber: {
                type: Type.STRING,
                description: 'Phone or contact number if mentioned',
              },
              vehicleOrJobDetails: {
                type: Type.STRING,
                description: 'Vehicle model, plate, or site summary',
              },
              items: {
                type: Type.ARRAY,
                description: 'List of quotation line items with prices',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Item name or service title' },
                    price: { type: Type.NUMBER, description: 'Item unit or agreed price as a number' },
                    description: { type: Type.STRING, description: 'Optional extra note for this item' },
                  },
                  required: ['title', 'price'],
                },
              },
              notes: {
                type: Type.STRING,
                description: 'Additional customer requests or notes',
              },
            },
            required: ['transcript', 'customerName', 'items'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini returned an empty response.');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        const cleaned = responseText.replace(/```json\s*|\s*```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Speech-to-quote error:', err);
      res.status(500).json({
        error: err.message || 'Failed to process speech-to-text audio quotation.',
      });
    }
  });

  app.post('/api/text-to-quote', async (req, res) => {
    try {
      const { text, trade, tradeName } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text prompt is required.' });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are an expert quotation parser for "${tradeName || 'Field Services'}".
Extract the customer's name (with plate/unit if mentioned), phone number if present, vehicle or site detail, and individual line items with prices from the user's raw written note.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Trade Category: ${tradeName || trade}\nUser Note:\n"${text}"`,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              customerName: { type: Type.STRING },
              phoneNumber: { type: Type.STRING },
              vehicleOrJobDetails: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                  },
                  required: ['title', 'price'],
                },
              },
              notes: { type: Type.STRING },
            },
            required: ['customerName', 'items'],
          },
        },
      });

      const responseText = response.text;
      let parsedData;
      try {
        parsedData = JSON.parse(responseText || '{}');
      } catch (parseErr) {
        const cleaned = (responseText || '{}').replace(/```json\s*|\s*```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Text-to-quote error:', err);
      res.status(500).json({
        error: err.message || 'Failed to parse text quotation.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuoteFlow Server running on http://localhost:${PORT}`);
  });
}

startServer();
```

---

## 3. Frontend App & Data Models

### `src/types.ts`
```typescript
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
```

### `src/data/tradePresets.ts`
```typescript
import { TradeCategory, TradeInfo } from '../types';

export const PHOTO_REQUIRED_TRADES: TradeCategory[] = [
  'panel_beater',
  'mechanic',
  'auto_electrician',
  'plumber',
  'locksmith',
  'carpenter',
  'handyman',
  'towing',
];

export const TRADE_INFO: Record<TradeCategory, TradeInfo> = {
  panel_beater: {
    name: 'Panel Beater & Body Shop',
    iconName: 'Car',
    sampleVoicePrompt: 'Mr Tan, car plate SJB 8892, bumper dent repair 280 dollars, side door scratch touch up 180, windscreen chip resin 95.',
    presets: [
      { id: 'pb1', category: 'panel_beater', title: 'Front Bumper Dent Repair & Spray', price: 280 },
      { id: 'pb2', category: 'panel_beater', title: 'Side Door Scratch Touch-Up', price: 180 },
      { id: 'pb3', category: 'panel_beater', title: 'Windscreen Chip Resin Seal', price: 95 },
      { id: 'pb4', category: 'panel_beater', title: 'Headlight Polish & UV Restoration', price: 75 },
      { id: 'pb5', category: 'panel_beater', title: 'Fender Knocking & Realignment', price: 220 },
      { id: 'pb6', category: 'panel_beater', title: 'Rear Quarter Panel Paint Blend', price: 340 },
    ],
  },
  mechanic: {
    name: 'Car Mechanic & Garage',
    iconName: 'Wrench',
    sampleVoicePrompt: 'David Lim, Toyota Vios, full synthetic engine service 160, replace front brake pads 190, battery test and swap 140.',
    presets: [
      { id: 'm1', category: 'mechanic', title: 'Full Synthetic Engine Oil Service', price: 160 },
      { id: 'm2', category: 'mechanic', title: 'Front Brake Pads Replacement', price: 190 },
      { id: 'm3', category: 'mechanic', title: 'Maintenance-Free Car Battery (DIN55)', price: 140 },
      { id: 'm4', category: 'mechanic', title: 'Transmission Fluid Flush (ATF)', price: 120 },
      { id: 'm5', category: 'mechanic', title: 'Radiator Coolant Flush & Check', price: 85 },
      { id: 'm6', category: 'mechanic', title: 'Spark Plugs Set (Iridium x4)', price: 110 },
    ],
  },
  auto_electrician: {
    name: 'Auto Electrician',
    iconName: 'Zap',
    sampleVoicePrompt: 'Mrs Ong, Honda City, fuse box wiring diagnostic 110, install front and rear dual dashcam 95, alternator charging fix 180.',
    presets: [
      { id: 'ae1', category: 'auto_electrician', title: 'Electrical Short & Wiring Diagnostic', price: 110 },
      { id: 'ae2', category: 'auto_electrician', title: 'Dual Dashcam Hardwire Installation', price: 95 },
      { id: 'ae3', category: 'auto_electrician', title: 'Alternator Repair & Carbon Brush', price: 180 },
      { id: 'ae4', category: 'auto_electrician', title: 'Power Window Motor Replacement', price: 150 },
      { id: 'ae5', category: 'auto_electrician', title: 'Car Alarm & Central Lock Repair', price: 130 },
    ],
  },
  plumber: {
    name: 'Plumbing Services',
    iconName: 'Droplets',
    sampleVoicePrompt: 'Madam Wong, Unit 14-02, kitchen sink drain unblock 110, replace master bathroom toilet inlet valve 130, fix pipe leak under sink 90.',
    presets: [
      { id: 'p1', category: 'plumber', title: 'Under-Sink Pipe Leak Repair', price: 130 },
      { id: 'p2', category: 'plumber', title: 'Kitchen Sink / Floor Trap Drain Unclog', price: 110 },
      { id: 'p3', category: 'plumber', title: 'Toilet Bowl Replacement (Labor)', price: 250 },
      { id: 'p4', category: 'plumber', title: 'Water Heater Supply Pipe & Tap Install', price: 95 },
      { id: 'p5', category: 'plumber', title: 'High Pressure Water Jetting Blockage', price: 280 },
    ],
  },
  locksmith: {
    name: 'Locksmith & Security',
    iconName: 'Key',
    sampleVoicePrompt: 'Mr Kelvin, urgent condo main door lockout service 120, replace digital lock cylinder 160.',
    presets: [
      { id: 'l1', category: 'locksmith', title: 'Emergency Residential Door Unlock', price: 120 },
      { id: 'l2', category: 'locksmith', title: 'High-Security Deadbolt Replacement', price: 160 },
      { id: 'l3', category: 'locksmith', title: 'Vehicle Door Lockout Extraction', price: 140 },
      { id: 'l4', category: 'locksmith', title: 'Smart Digital Lock Installation', price: 180 },
    ],
  },
  carpenter: {
    name: 'Carpentry & Cabinetry',
    iconName: 'Hammer',
    sampleVoicePrompt: 'Sarah Chen, repair kitchen cabinet soft close hinges 90, replace warped sliding wardrobe track 160.',
    presets: [
      { id: 'c1', category: 'carpenter', title: 'Cabinet Soft-Close Hinges Realign & Swap', price: 90 },
      { id: 'c2', category: 'carpenter', title: 'Sliding Wardrobe Roller Track Repair', price: 160 },
      { id: 'c3', category: 'carpenter', title: 'Solid Wood Door Planing & Trimming', price: 130 },
      { id: 'c4', category: 'carpenter', title: 'Custom Wooden Shelf Fabrication & Fit', price: 220 },
    ],
  },
  handyman: {
    name: 'General Handyman',
    iconName: 'Tool',
    sampleVoicePrompt: 'Mr Jackson, 65 inch TV wall mounting 120, assemble 3 tier Ikea storage rack 75, replace ceiling light fixture 50.',
    presets: [
      { id: 'h1', category: 'handyman', title: 'TV Wall Bracket Mounting (Up to 75")', price: 120 },
      { id: 'h2', category: 'handyman', title: 'Flat-Pack Furniture Assembly (Large)', price: 85 },
      { id: 'h3', category: 'handyman', title: 'Ceiling Fan & Light Fixture Install', price: 90 },
      { id: 'h4', category: 'handyman', title: 'Curtain Rod & Blinds Drilling & Setup', price: 70 },
    ],
  },
  towing: {
    name: 'Towing & Recovery',
    iconName: 'Truck',
    sampleVoicePrompt: 'Alex Kumar, vehicle broken down at Highway KM 14, flatbed towing to workshop 150, tire change assistance 50.',
    presets: [
      { id: 't1', category: 'towing', title: 'Flatbed Recovery Tow (Within 20km)', price: 150 },
      { id: 't2', category: 'towing', title: 'Underground Multi-Storey Rescue Tow', price: 220 },
      { id: 't3', category: 'towing', title: 'Roadside Jump Start / Battery Boost', price: 60 },
      { id: 't4', category: 'towing', title: 'Spare Tire Replacement On-Site', price: 50 },
    ],
  },
  beauty_salon: {
    name: 'Beauty, Nails & Spa',
    iconName: 'Sparkles',
    sampleVoicePrompt: 'Jessica, Gel manicure with nail art 85, express pedicure 45, organic eyelash extension 110.',
    presets: [
      { id: 'b1', category: 'beauty_salon', title: 'Express Gel Manicure & Cuticle Care', price: 65 },
      { id: 'b2', category: 'beauty_salon', title: 'Full Classic Pedicure & Callus Scrub', price: 55 },
      { id: 'b3', category: 'beauty_salon', title: 'Nail Extension & Custom 3D Art', price: 120 },
      { id: 'b4', category: 'beauty_salon', title: 'Deep Hydrating Facial Treatment', price: 140 },
    ],
  },
  pet_grooming: {
    name: 'Pet Grooming Services',
    iconName: 'Heart',
    sampleVoicePrompt: 'Chloe, Golden Retriever full wash deshedding and scissor cut 95, ear cleaning and nail clipping 30.',
    presets: [
      { id: 'pg1', category: 'pet_grooming', title: 'Full Dog Wash, Blow-dry & Styling', price: 85 },
      { id: 'pg2', category: 'pet_grooming', title: 'Cat Bath, De-shed & Lion Cut', price: 95 },
      { id: 'pg3', category: 'pet_grooming', title: 'Nail Trimming, Paw Pad Shave & Ear Clean', price: 30 },
      { id: 'pg4', category: 'pet_grooming', title: 'Medicated Skin Wash & Flea Treatment', price: 60 },
    ],
  },
  dentist: {
    name: 'Dental Care & Clinic',
    iconName: 'Smile',
    sampleVoicePrompt: 'Mr Roger, dental consultation scaling and polishing 120, composite tooth filling 90.',
    presets: [
      { id: 'd1', category: 'dentist', title: 'Consultation, Scaling & Airflow Polishing', price: 120 },
      { id: 'd2', category: 'dentist', title: 'Composite Tooth Coloured Filling (Per Tooth)', price: 95 },
      { id: 'd3', category: 'dentist', title: 'Digital Panoramic X-Ray Scan', price: 75 },
      { id: 'd4', category: 'dentist', title: 'In-Office Tooth Whitening Session', price: 350 },
    ],
  },
  other: {
    name: 'General Service & Trade',
    iconName: 'Briefcase',
    sampleVoicePrompt: 'Client Eric, on-site assessment inspection 80, emergency labor service 150.',
    presets: [
      { id: 'o1', category: 'other', title: 'Standard On-Site Callout & Diagnostic', price: 80 },
      { id: 'o2', category: 'other', title: 'Hourly Specialized Trade Labor', price: 90 },
      { id: 'o3', category: 'other', title: 'Materials Sourcing & Delivery', price: 50 },
      { id: 'o4', category: 'other', title: 'Emergency After-Hours Service Surcharge', price: 120 },
    ],
  },
};
```

---

## 4. UI Components

### `src/components/VoiceAiModal.tsx`
*(See source code in workspace `/src/components/VoiceAiModal.tsx`)*

### `src/components/WhatsAppModal.tsx`
*(See source code in workspace `/src/components/WhatsAppModal.tsx`)*

### `src/components/SettingsModal.tsx`
*(See source code in workspace `/src/components/SettingsModal.tsx`)*

### `src/components/ItemSelectorModal.tsx`
*(See source code in workspace `/src/components/ItemSelectorModal.tsx`)*

### `src/components/ReceiptModal.tsx`
*(See source code in workspace `/src/components/ReceiptModal.tsx`)*

### `src/components/CollectModal.tsx`
*(See source code in workspace `/src/components/CollectModal.tsx`)*

### `src/components/HistoryModal.tsx`
*(See source code in workspace `/src/components/HistoryModal.tsx`)*

### `src/App.tsx`
*(See main application code in workspace `/src/App.tsx`)*
