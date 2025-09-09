import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a single Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Export whichever model you want to use
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // you can also try "gemini-1.5-pro" for deeper reasoning
});

export default geminiModel;
