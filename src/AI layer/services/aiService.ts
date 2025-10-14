import OpenAI from "openai";
import 'dotenv/config';


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is not set in environment variables");
}
if(!openai) {
  throw new Error("OpenAI client is not initialized");
}

export async function askTutor(userInput, memoryContext) {
  const systemPrompt = `
  You are an AI programming tutor.
  - Explain clearly but briefly.
  - When users send code, help debug it line by line.
  - If they ask theory, give examples.
  - Use simple terms like teaching a beginner.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(memoryContext || []),
        { role: "user", content: userInput },
      ],
    });
    return response.choices[0]?.message?.content ?? "";
  } catch (err) {
    // Re-throw with concise message so controller can log
    const message = (err && (err as any).message) ? (err as any).message : "OpenAI request failed";
    throw new Error(message);
  }
}
