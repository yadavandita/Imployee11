import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  faceImage: {
    type: String // Base64 image
  },
  status: {
    type: String,
    enum: ["PRESENT", "ABSENT", "LATE"],
    default: "PRESENT"
  },
  deviceType: {
    type: String,
    enum: ["mobile", "laptop", "desktop"],
    default: "laptop"
  }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);