import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askTutor(userInput, memoryContext) {
  const systemPrompt = `
  You are an AI programming tutor.
  - Explain clearly but briefly.
  - When users send code, help debug it line by line.
  - If they ask theory, give examples.
  - Use simple terms like teaching a beginner.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-mini", 
    messages: [
      { role: "system", content: systemPrompt },
      ...(memoryContext || []),
      { role: "user", content: userInput },
    ],
  });

  return response.choices[0].message.content;
}
