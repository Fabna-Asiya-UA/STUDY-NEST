import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const generateAIResponse = async (message) => {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",

        contents: `
You are StudyNest AI Assistant.

Your job is to help students learn.

Rules:
- Explain concepts in simple language.
- Explain difficult topics step by step.
- Give examples whenever useful.
- Help students understand programming concepts.
- Help debug code when code is provided.
- Generate practice questions when requested.
- Help students prepare for quizzes and exams.
- Help students create study plans.
- Do not unnecessarily make answers complicated.
- If a student asks for an academic explanation, teach the concept rather than only giving the final answer.

Student Question:

${message}
        `
      });

      return response.text;

    } catch (error) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.message
      );

      if (attempt < 3) {
        await sleep(2000 * attempt);
      }
    }
  }

  throw lastError;
};