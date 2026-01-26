import Attendance from "../models/AttendanceModel.js";

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
