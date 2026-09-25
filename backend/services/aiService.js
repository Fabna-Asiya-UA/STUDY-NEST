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

  const models = [
    "gemini-3.7-flash",
    "gemini-3.5-flash-lite"
  ];

  let lastError;

  for (const model of models) {

    for (let attempt = 1; attempt <= 2; attempt++) {

      try {

        console.log(
          `Trying ${model} - Attempt ${attempt}`
        );

        const response = await ai.models.generateContent({

          model: model,

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
- If a student asks for an academic explanation,
  teach the concept rather than only giving the final answer.

Student Question:

${message}
          `
        });

        console.log(
          `Success using ${model}`
        );

        return response.text;

      } catch (error) {

        lastError = error;

        console.error(
          `${model} attempt ${attempt} failed:`,
          error.message
        );

        // Do not retry errors such as 404
        if (error.status !== 503) {
          break;
        }

        if (attempt < 2) {
          await sleep(1500);
        }
      }
    }

    console.log(
      `${model} unavailable. Trying next model...`
    );
  }

  throw lastError;
};