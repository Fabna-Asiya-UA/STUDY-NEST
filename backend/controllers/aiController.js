import { generateAIResponse } from "../services/aiService.js";

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured"
      });
    }

    console.log("Sending request to Gemini...");

    const answer = await generateAIResponse(message);

    console.log("Gemini response received");

    return res.status(200).json({
      success: true,
      answer
    });

  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error("MESSAGE:", error.message);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message:
        "AI service is temporarily unavailable. Please try again."
    });
  }
};