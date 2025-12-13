import axios from "axios";
import { generateGuidance } from "../services/genaiService.js";

export const getHealthGuidance = async (req, res) => {
  try {
    const { symptoms, duration, age } = req.body;

    // Call Flask CV API (optional but OK if running)
    let visualIndicators = {};
    try {
      const cvRes = await axios.get(
        "http://localhost:7000/api/vision/analyze"
      );
      visualIndicators = cvRes.data.visual_indicators;
    } catch {
      console.log("CV service not available, continuing without it");
    }

    const guidance = await generateGuidance(
      symptoms,
      duration,
      age,
      visualIndicators
    );

    res.json({ guidance, visualIndicators });
  } catch (error) {
    console.error("AI ERROR 👉", error.message);
    res.status(500).json({ error: "Failed to generate guidance" });
  }
};
