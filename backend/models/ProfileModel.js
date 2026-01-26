import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: String,
    department: String,
    designation: String,
    employmentType: String,
    reportingManager: String,
    role: {
      type: String,
      enum: ['EMPLOYEE', 'ADMIN'],
      default: 'EMPLOYEE'
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending'
    },
    birthDate: Date,
    joiningDate: Date,
    locked: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);