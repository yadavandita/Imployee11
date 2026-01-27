import mongoose from "mongoose";

const signalDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    managerTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      description: "Manager's user ID if employee is on a team"
    },

    // Attendance signals
    attendancePattern: {
      loginTime: Number, // minutes from midnight
      isLate: Boolean,
      dayOfWeek: Number, // 0-6
      timestamp: Date
    },

    // Leave signals
    leaveRequest: {
      type: String, // "before_deadline", "after_deadline", "isolated", "clustered"
      timestamp: Date
    },

    // Communication signals
    communicationActivity: {
      status: String, // "high", "normal", "low"
      changePercent: Number,
      timestamp: Date
    },

    // Meeting signals
    meetingResponse: {
      type: String, // "accept", "decline", "no_response"
      timestamp: Date
    },

    // Tool usage signals
    toolActivity: {
      tool: String, // "email", "chat", "project_management"
      level: String, // "high", "normal", "low"
      timestamp: Date
    },

    // General engagement score
    engagementScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },

    // Flag for analysis
    isAnomaly: Boolean,
    anomalyType: String // "disengagement", "stress", "leave_clustering", etc.
  },
  { timestamps: true }
);

export default mongoose.model("SignalData", signalDataSchema);
