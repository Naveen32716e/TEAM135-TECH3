import express from "express";
import axios from "axios";
import { generateGuidance } from "../services/genaiService.js";

const router = express.Router();

/**
 * 🧠 AI Health Guidance
 * POST /api/ai/guidance
 */
router.post("/guidance", async (req, res) => {
  try {
    const { symptoms, duration, age } = req.body;

    if (!symptoms || !duration || !age) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const guidance = await generateGuidance({
      symptoms,
      duration,
      age,
    });

    res.json({ guidance });
  } catch (err) {
    console.error("AI Guidance Error:", err);
    res.status(500).json({
      error: "Failed to generate guidance",
    });
  }
});

/**
 * 📸 Facial Image Analysis
 * POST /api/ai/analyze-face
 */
router.post("/analyze-face", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "Image data is required",
      });
    }

    // 🔗 Forward image to Flask OpenCV service
    const response = await axios.post(
      "https://genaii-health-cv.onrender.com/analyze",
      { image },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Face Analysis Error:", err.message);

    res.status(500).json({
      error: "Facial analysis service unavailable",
    });
  }
});

export default router;
