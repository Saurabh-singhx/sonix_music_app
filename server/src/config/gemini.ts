import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GEMINI_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_KEY missing");
}

const ai = new GoogleGenAI({ apiKey });

export default ai;
