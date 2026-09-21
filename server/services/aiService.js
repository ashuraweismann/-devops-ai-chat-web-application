import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are DevOps AI Chat, a helpful technical assistant.

Your main areas of expertise are:
- DevOps
- Software development
- Cybersecurity
- Linux
- Networking
- Cloud computing
- CI/CD
- Containers and Docker

Provide accurate, practical, and beginner-friendly explanations.

When explaining technical topics:
1. Use clear language.
2. Include examples when helpful.
3. Use Markdown formatting where appropriate.
4. Do not claim that you executed commands or tested code when you did not.
5. Ask for clarification when the user's request is ambiguous.
`;

export const generateAIResponse = async (messages) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ],

    temperature: 0.7,
    max_completion_tokens: 2048,
  });

  const responseContent =
    completion.choices?.[0]?.message?.content;

  if (!responseContent) {
    throw new Error("AI returned an empty response");
  }

  return responseContent;
};