import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      default: "EMP001"
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    department: String,
    designation: String,
    employmentType: String,
    reportingManager: String,
    birthDate: Date,

    profileLocked: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN"],
      default: "EMPLOYEE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
