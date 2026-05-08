import express from "express";
import fetch from "node-fetch";

const router = express.Router();

let lastMessage = "";

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Empty message" });
    }

    // 🧠 OCR duplicate filter
    if (message === lastMessage) {
      return res.json({ reply: "⏭ Duplicate ignored" });
    }

    lastMessage = message;

    console.log("🧑 USER:", message);

    // 🔥 CALL OPENROUTER
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "OCR Chatbot"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            ...history,
            { role: "user", content: message }
          ]
        })
      }
    );

    // ❌ HARD CHECK (IMPORTANT)
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ OpenRouter HTTP ERROR:", errText);
      return res.json({
        reply: "AI Error: " + errText
      });
    }

    const data = await response.json();

    console.log("📦 RAW OPENROUTER:", JSON.stringify(data, null, 2));

    // ✅ SAFE EXTRACTION
    let reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.error?.message;

    // 🚨 FINAL FALLBACK
    if (!reply) {
      reply = "⚠️ No response from model (check API quota/model)";
    }

    console.log("🤖 FINAL REPLY:", reply);

    return res.json({ reply });

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return res.status(500).json({
      reply: "Server error: " + err.message
    });
  }
});

export default router;