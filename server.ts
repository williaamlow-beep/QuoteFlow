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
// Retries requests automatically if Google returns a 503 (High Demand) or 429 (Rate Limit) error
async function generateContentWithRetry(aiClient: any, params: any, maxRetries = 3, initialDelayMs = 1500) {
  let delay = initialDelayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (error: any) {
      const isTransient = error?.status === 503 || error?.status === 429 || error?.toString().includes('503');

      if (isTransient && attempt < maxRetries) {
        console.warn(`[Gemini API] Temporary 503 spike (Attempt ${attempt}/${maxRetries}). Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff: 1.5s -> 3.0s -> 6.0s
      } else {
        throw error;
      }
    }
  }
}
// Clean mime type (e.g., 'audio/webm;codecs=opus' -> 'audio/webm')
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

  // Support up to 50MB for audio base64 uploads & images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasWhatsAppKey: Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
    });
  });

  // WhatsApp Cloud API Configuration Status
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

  // Direct WhatsApp Business Cloud API dispatch
  app.post('/api/whatsapp/send', async (req, res) => {
    try {
      const { recipientPhone, message, customCredentials } = req.body;

      if (!recipientPhone || !message) {
        return res.status(400).json({ error: 'recipientPhone and message are required.' });
      }

      // Format recipient phone number: remove non-digits
      const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 7) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
      }

      const token = customCredentials?.token || process.env.WHATSAPP_API_TOKEN;
      const phoneNumberId = customCredentials?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

      // If official Cloud API credentials exist, attempt direct dispatch
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

      // Fallback response with pre-built wa.me deep link
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

  // Speech-To-Text & Smart Quotation Parsing using Gemini 3.7 Flash
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

  const response = await generateContentWithRetry(ai, {
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

  // Text-To-Quote Parsing using Gemini 3.7 Flash
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

  // Vite middleware for development vs static build for production
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
