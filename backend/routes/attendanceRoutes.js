import express from "express";
import { getTodayAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/today/:userId", getTodayAttendance);

export default router;
