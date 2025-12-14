import { generateGuidance } from "../services/genaiService.js";

export const getHealthGuidance = async (req, res) => {
  console.log("📥 REQUEST BODY:", req.body);

  const { symptoms, duration, age } = req.body;

  // ✅ Explicit validation
  if (!symptoms || !duration || !age) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  try {
    const guidance = await generateGuidance(req.body);
    res.json({ guidance });
  } catch (err) {
    console.error("❌ AI ERROR:", err.message);
    res.status(500).json({
      error: "AI generation failed"
    });
  }
};
