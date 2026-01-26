import express from "express";
import { chatWithHRAssistant, uploadPolicy, getPolicy } from "../controllers/hrAssistantController.js";

const router = express.Router();

router.post("/chat", chatWithHRAssistant);
router.post("/policy/upload", uploadPolicy);
router.get("/policy", getPolicy);

export default router;