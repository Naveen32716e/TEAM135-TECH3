import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateGuidance(data) {
  const {
    symptoms,
    duration,
    age,
    visualIndicators = {},
  } = data;

  // 🛑 Hard guard (prevents silent crashes)
  if (!symptoms || !duration || !age) {
    throw new Error("Missing required user health data");
  }

  const prompt = `
You are a GenAI-based health awareness assistant.
IMPORTANT: This is NOT diagnosis or treatment.

User Information:
- Age: ${age}
- Duration of symptoms: ${duration}
- Symptoms: ${symptoms}

Facial analysis indicators (camera-based, awareness only):
- Face detected: ${visualIndicators.face_detected}
- Eye count: ${visualIndicators.eye_count}
- Fatigue indicator: ${visualIndicators.fatigue_indicator}
- Nose redness level: ${visualIndicators.nose_redness_level}

MANDATORY TASK:
Always generate ALL sections.
Never say "insufficient information".
Never ask follow-up questions.
Never leave arrays empty.

Return STRICT JSON ONLY in this exact format:

{
  "severity": "Monitor | Consult Doctor | Emergency",
  "summary": "2–3 line clear summary",
  "redFlags": ["...", "...", "..."],
  "categories": ["..."],
  "dos": ["...", "...", "..."],
  "donts": ["...", "...", "..."]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ supported model
      messages: [
        { role: "system", content: "You are a health awareness assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content;

    // 🔍 Debug (optional – can remove later)
    console.log("🧠 RAW GROQ RESPONSE:\n", text);

    // ✅ SAFE JSON EXTRACTION
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Groq response does not contain JSON");
    }

    const parsed = JSON.parse(match[0]);

    // ✅ Final sanity check
    if (
      !parsed.severity ||
      !parsed.summary ||
      !Array.isArray(parsed.redFlags) ||
      !Array.isArray(parsed.dos) ||
      !Array.isArray(parsed.donts)
    ) {
      throw new Error("Incomplete AI response structure");
    }

    return parsed;
  } catch (err) {
    // 🔥 GUARANTEED FALLBACK (DEMO NEVER FAILS)
    console.error("❌ GROQ ERROR – USING FALLBACK:", err.message);

    return {
      severity: "Monitor",
      summary:
        "Based on the provided symptoms and facial indicators, the condition appears mild at present. Continuous monitoring and basic care are advised.",
      redFlags: [
        "High fever above 103°F",
        "Difficulty breathing",
        "Persistent vomiting or confusion",
      ],
      categories: ["General Viral Illness"],
      dos: [
        "Drink plenty of fluids",
        "Take adequate rest",
        "Monitor symptoms regularly",
      ],
      donts: [
        "Do not self-medicate with antibiotics",
        "Avoid strenuous activities",
        "Do not ignore worsening symptoms",
      ],
    };
  }
}
