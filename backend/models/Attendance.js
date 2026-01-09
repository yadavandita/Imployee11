import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: String,
  checkInTime: Date,
  checkOutTime: Date,
  date: {
    type: String
  }
});

export default mongoose.model("Attendance", attendanceSchema);
