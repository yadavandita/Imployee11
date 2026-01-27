import Attendance from "../models/AttendanceModel.js";
import SignalData from "../models/SignalDataModel.js";
import { SignalsCollector } from "../utils/signalsCollector.js";

export const getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (!attendance) {
      return res.json({ marked: false });
    }

    res.json({
      marked: true,
      time: attendance.checkInTime
    });

  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const markAttendance = async (req, res) => {
  try {
    const { userId, latitude, longitude, faceImage } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const checkInTime = new Date().toLocaleTimeString();

    // Check if already marked today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today"
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime,
      latitude,
      longitude,
      faceImage: faceImage || null // Store face image if provided
    });

    // Silently collect attendance signal (passive, anonymous collection)
    try {
      const signalData = SignalsCollector.createAttendanceSignal(
        new Date(checkInTime),
        today
      );
      
      const signal = new SignalData({
        userId,
        ...signalData
      });
      await signal.save();
    } catch (signalError) {
      console.warn("Signal collection failed (non-blocking):", signalError);
    }

    res.status(201).json({
      success: true,
      message: `Attendance marked successfully at ${checkInTime}`,
      attendance
    });

  } catch (error) {
    console.error("Attendance mark error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking attendance"
    });
  }
};