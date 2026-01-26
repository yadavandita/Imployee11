import express from "express";
import { getTodayAttendance } from "../controllers/attendanceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today/:userId", authMiddleware, getTodayAttendance);

export default router;

