import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "QuoteFlow", geminiAvailable: !!ai });
});

// AI Line item suggestions for specific trades/jobs
app.post("/api/suggest-line-items", async (req, res) => {
  try {
    const { profession, jobDescription, propertyType, notes } = req.body;

    if (!ai) {
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    const prompt = `You are a professional estimator and pricing expert for service trades.
The freelancer works as a "${profession || "General Contractor"}".
Job details provided:
- Description: ${jobDescription || "Standard service job"}
- Context/Property: ${propertyType || "Standard location"}
- Additional Notes: ${notes || "None"}

Generate a realistic list of 3 to 6 itemized billing line items for this job. Include labor, materials, call-out/travel fee, or specialized service tasks if appropriate.
Return strict JSON matching this structure:
{
  "lineItems": [
    {
      "description": "Item or service name",
      "category": "labor" | "materials" | "callout" | "travel" | "urgency" | "other",
      "quantity": 1,
      "unitPrice": 120,
      "unit": "hrs" | "units" | "item" | "sq ft" | "pax" | "flat"
    }
  ],
  "suggestedTerms": "Brief 1-2 sentence suggested terms or scope note"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/suggest-line-items:", error);
    res.status(500).json({ error: error.message || "Failed to generate line items" });
  }
});

// AI Generated WhatsApp Message follow-up / reminder copy
app.post("/api/generate-whatsapp-copy", async (req, res) => {
  try {
    const { type, customerName, docNumber, total, deposit, dueDate, businessName, trade } = req.body;

    if (!ai) {
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    const prompt = `Write a short, friendly, high-converting WhatsApp message to be sent from ${businessName || "our business"} (${trade || "Service Provider"}) to customer ${customerName || "Customer"}.
Message type: ${type || "quote"} (Options: 'quote_send', 'quote_followup', 'invoice_send', 'payment_reminder').
Quote/Invoice Number: ${docNumber || "Q-1001"}
Total Amount: ${total || "$250"}
${deposit ? `Deposit required: ${deposit}` : ""}
${dueDate ? `Due date: ${dueDate}` : ""}

Keep it concise, polite, professional yet friendly, suitable for WhatsApp chatting. Include emojis where natural. Include a call to action. Return strict JSON:
{
  "messageText": "The formatted text message..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/generate-whatsapp-copy:", error);
    res.status(500).json({ error: error.message || "Failed to generate message text" });
  }
});

// Setup Vite middleware in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QuoteFlow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
