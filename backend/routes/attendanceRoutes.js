import express from "express";
import { getTodayAttendance, markAttendance } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today/:userId", authMiddleware, getTodayAttendance);
router.post("/mark", authMiddleware, markAttendance);

export default router;
