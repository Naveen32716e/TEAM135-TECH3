import { generateGuidance } from "../services/genaiService.js";

export const getHealthGuidance = async (req, res) => {
  try {
    const { symptoms, duration, ageGroup } = req.body;

    if (!symptoms || !duration || !ageGroup) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const guidance = await generateGuidance(symptoms, duration, ageGroup);
    res.json({ guidance });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate guidance" });
  }
};
