import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/chatbot", async (req, res) => {
  try {
    const { message } = req.body; 

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);

    res.json({ reply: result.response.candidates[0].content });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({ error: "Chatbot service unavailable." });
  }
});


export default router;