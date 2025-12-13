import express from "express";
import { getHealthGuidance } from "../controllers/aiController.js";

const router = express.Router();

router.post("/guidance", getHealthGuidance);

export default router;
