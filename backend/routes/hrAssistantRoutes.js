import express from "express";
import { chatWithHRAssistant, uploadPolicy, getPolicy } from "../controllers/hrAssistantController.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Chat with HR Assistant (requires authentication)
router.post("/chat", authMiddleware, chatWithHRAssistant);

// Upload HR Policy (only admins)
router.post("/policy/upload", authMiddleware, roleMiddleware(["ADMIN"]), uploadPolicy);

// Get HR Policy (public)
router.get("/policy", getPolicy);

export default router;