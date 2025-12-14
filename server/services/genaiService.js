import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate health awareness guidance (NOT diagnosis)
 */
export const generateGuidance = async (
  symptoms,
  duration,
  age
) => {
  // 🔹 Prompt forcing STRICT JSON
  const prompt = `
You are a health awareness assistant.

STRICT RULES:
- This is NOT diagnosis
- Do NOT prescribe medicines
- Provide early awareness & guidance only
- Respond ONLY in valid JSON
- Do NOT include markdown
- Do NOT include extra text

Return JSON in EXACT format:

{
  "severity": "Monitor | Consult Doctor | Emergency",
  "summary": "Short clear summary",
  "redFlags": ["..."],
  "categories": ["..."],
  "dos": ["..."],
  "donts": ["..."]
}

User Input:
Symptoms: ${symptoms}
Duration: ${duration} days
Age: ${age} years
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });

    const rawText = completion.choices[0].message.content;

    // 🔹 Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError) {
      // Fallback: never crash frontend
      parsed = {
        severity: "Monitor",
        summary: rawText,
        redFlags: [],
        categories: [],
        dos: [],
        donts: [],
      };
    }

    // 🔹 Final safety check (ensure arrays)
    return {
      severity: parsed.severity || "Monitor",
      summary: parsed.summary || "",
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      dos: Array.isArray(parsed.dos) ? parsed.dos : [],
      donts: Array.isArray(parsed.donts) ? parsed.donts : [],
    };

  } catch (error) {
    console.error("GROQ AI ERROR 👉", error.message);

    // 🔹 Absolute fallback
    return {
      severity: "Monitor",
      summary:
        "Unable to generate AI guidance at the moment. Please consult a healthcare professional if symptoms persist.",
      redFlags: [],
      categories: [],
      dos: [],
      donts: [],
    };
  }
};
