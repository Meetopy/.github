import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🎯 API برای گفتگو
app.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    // تاریخچه گفتگو برای روان‌شناس
    const context = history?.map(h => `${h.role}: ${h.content}`).join("\n") || "";

    const response = await client.responses.create({
      model: "gpt-5",
      input: `شما یک روانشناس حرفه‌ای، آرام، همدل و علمی هستید.
کاربر می‌خواهد مشاوره روانشناسی بگیرد.
تاریخچه گفتگو:
${context}

کاربر گفت: "${message}"
پاسخ دهید:`
    });

    res.json({ reply: response.output[0].content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ خطایی رخ داد، لطفاً بعداً دوباره تلاش کنید." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 سرور روانشناس روی پورت ${PORT} اجرا شد`);
});