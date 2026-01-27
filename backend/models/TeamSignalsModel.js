import mongoose from "mongoose";

const teamSignalsSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    teamName: {
      type: String,
      required: true
    },

    teamSize: Number,

    // Aggregated metrics (team-level only)
    metrics: {
      averageLoginTimeShift: {
        value: Number, // minutes
        previousMonth: Number,
        trendDirection: String // "up", "down", "stable"
      },

      attendanceVariability: {
        coefficient: Number, // standard deviation
        change: Number, // percent change
        isElevated: Boolean
      },

      leaveClusteringScore: {
        score: Number, // 0-100
        clusteredDays: Number, // how many days had multiple leave requests
        affectedCount: Number // how many people (anonymized: ">= 3" or exact if over threshold)
      },

      communicationTrend: {
        activityChange: Number, // percent
        currentLevel: String, // "high", "normal", "low"
        previousLevel: String
      },

      meetingEngagement: {
        acceptanceRate: Number, // percent
        declineRate: Number, // percent
        noResponseRate: Number, // percent
        change: Number // percent change
      },

      teamHealthScore: {
        score: Number, // 0-100
        signals: [String] // array of detected anomalies
      }
    },

    // Time windows for trend analysis
    periodStart: Date,
    periodEnd: Date,
    baselinePeriodStart: Date,
    baselinePeriodEnd: Date,

    // Alerts and recommendations
    alerts: [
      {
        type: String,
        severity: String, // "info", "warning", "critical"
        description: String,
        recommendation: String,
        dateDetected: Date
      }
    ],

    // Individual signal count (anonymized)
    signalCounts: {
      late_arrivals: Number,
      leave_requests: Number,
      communication_changes: Number,
      meeting_declines: Number
    },

    // Comparison to org baseline
    orgComparison: {
      teamHealthVsOrg: Number, // -50 to +50 (relative to org average)
      attendance: Number,
      communication: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("TeamSignals", teamSignalsSchema);
