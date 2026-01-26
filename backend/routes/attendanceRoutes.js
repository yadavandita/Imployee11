import express from "express";
import { 
  markAttendance,
  getTodayAttendance, 
  getAttendanceHistory 
} from "../controllers/attendanceController.js";

const router = express.Router();

// Mark attendance
router.post("/mark", markAttendance);

// Get today's attendance
router.get("/today/:userId", getTodayAttendance);

// Get attendance history
router.get("/history/:userId", getAttendanceHistory);

export default router;