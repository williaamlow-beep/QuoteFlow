// netlify/functions/parse-quote.js

exports.handler = async (event) => {
  // Handle CORS preflight options
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { transcript, trade } = JSON.parse(event.body || "{}");

    if (!transcript) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Transcript input is required." }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Server error: GEMINI_API_KEY is not configured in Netlify environment." }),
      };
    }

    const systemInstruction = `
You are an expert field quotation parser for trade services (active trade: ${trade || "general"}).
Your job is to transcribe messy, conversational, or off-script spoken text into a clean JSON quotation object.

RULES FOR PARSING:
1. EXTRACT DATA:
   - Extract Customer Name, Vehicle/Unit/Address Info, Phone Number, Line Items (title + numeric price), and extra notes.
   - Ignore filler words ("uh", "um", "like", "you know").

2. HANDLE SELF-CORRECTIONS:
   - If the speaker changes their mind (e.g., "bumper repair 200... actually make it 250"), prioritize the LAST spoken value ($250).

3. HANDLE OFF-SCRIPT / CONVERSATIONAL TALK:
   - Put any extra chatter, special instructions, or context that doesn't fit a line item into "notes". Do NOT throw an error.

4. OUTPUT REQUIREMENT:
   - You MUST ONLY return a raw, valid JSON object matching this schema.

JSON SCHEMA:
{
  "customerName": "string or null",
  "phoneNumber": "string or null",
  "vehicleOrJobDetails": "string or null",
  "items": [
    {
      "title": "string",
      "price": number,
      "description": "string or null"
    }
  ],
  "notes": "string or null"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Spoken input: "${transcript}"` }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Gemini API error: ${errorText}` }),
      };
    }

    const geminiData = await response.json();
    const rawJsonText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsedQuote = JSON.parse(rawJsonText);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true, data: parsedQuote }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Failed to parse voice quotation." }),
    };
  }
};
