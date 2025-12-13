import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateGuidance = async (symptoms, duration, ageGroup) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a health awareness assistant.

STRICT RULES:
- Do NOT diagnose diseases
- Do NOT prescribe medicines
- Provide awareness and early guidance only
- Encourage medical consultation when symptoms persist

User details:
Symptoms: ${symptoms}
Duration: ${duration}
Age Group: ${ageGroup}

Respond with:
1. Possible common illness awareness (non-diagnostic)
2. Warning signs 🚨
3. When to visit hospital
4. Do’s and Don’ts
5. Home-care & hydration guidance

End with this exact sentence:
"This system does not diagnose diseases or replace doctors."
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
