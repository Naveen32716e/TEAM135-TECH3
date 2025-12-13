import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateGuidance = async (
  symptoms,
  duration,
  age,
  visualIndicators = {}
) => {
  const prompt = `
You are a health awareness assistant.

STRICT RULES:
- Do NOT diagnose diseases
- Do NOT prescribe medicines
- Provide early awareness and guidance only
- Be concise and clear

User Inputs:
Symptoms: ${symptoms}
Duration: ${duration}
Age: ${age}

Facial Visual Indicators (non-diagnostic):
- Fatigue indicator: ${visualIndicators.fatigue_indicator ?? "N/A"}
- Nose redness level: ${visualIndicators.nose_redness_level ?? "N/A"}

Tasks:
• Explain possible causes (awareness only)
• Mention warning signs 🚨
• Suggest when to visit hospital
• Give do’s and don’ts

End with:
"This system does not diagnose diseases or replace doctors."
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 250
  });

  return completion.choices[0].message.content;
};
