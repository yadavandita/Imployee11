import Attendance from "../models/AttendanceModel.js";

// Office location
const OFFICE_LOCATION = {
  lat: 19.183925,
  lng: 72.837345
};

const ALLOWED_RADIUS = 8000; // 8km in meters

// Calculate distance
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, latitude, longitude, faceImage } = req.body;

    // Calculate distance
    const distance = getDistanceInMeters(
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng,
      latitude,
      longitude
    );

    // Check geofence
    if (distance > ALLOWED_RADIUS) {
      return res.status(403).json({
        success: false,
        message: `You are ${Math.round(distance)}m away from office. Please be within ${ALLOWED_RADIUS}m radius.`
      });
    }

    // Check if already marked today
    const today = new Date().toISOString().split("T")[0];
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today!"
      });
    }

    // Detect device type
    const deviceType = /Mobile|Android|iPhone/i.test(req.headers['user-agent']) 
      ? 'mobile' 
      : 'laptop';

    // Mark attendance
    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: new Date(),
      latitude,
      longitude,
      faceImage,
      status: "PRESENT",
      deviceType
    });

    res.json({
      success: true,
      message: `Attendance marked successfully! You are ${Math.round(distance)}m from office.`,
      attendance: {
        time: attendance.checkInTime,
        distance: Math.round(distance),
        location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      }
    });

  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again." 
    });
  }
};

// Get today's attendance
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
      time: attendance.checkInTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      distance: attendance.latitude && attendance.longitude ? 
        Math.round(getDistanceInMeters(
          OFFICE_LOCATION.lat,
          OFFICE_LOCATION.lng,
          attendance.latitude,
          attendance.longitude
        )) : null
    });

  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance history
export const getAttendanceHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    res.json({
      success: true,
      history: history.map(att => ({
        date: att.date,
        checkInTime: att.checkInTime,
        checkOutTime: att.checkOutTime,
        status: att.status,
        deviceType: att.deviceType
      }))
    });

  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};