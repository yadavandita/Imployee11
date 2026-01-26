import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      default: function() {
        return "EMP" + Math.floor(100000 + Math.random() * 900000);
      }
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

    profileLocked: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "ADMIN", "MANAGER"],
      default: "EMPLOYEE"
    },

    // OTP fields for password reset
    otp: String,
    otpExpires: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);