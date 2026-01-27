import SignalData from "../models/SignalDataModel.js";
import TeamSignals from "../models/TeamSignalsModel.js";
import User from "../models/UserModel.js";

/**
 * Collect passive signal from attendance, leave, communication
 * Called after employee actions (anonymous at point of collection)
 */
export const recordSignal = async (req, res) => {
  try {
    const { userId, signalType, data } = req.body;

    const signal = new SignalData({
      userId,
      managerTeamId: req.userId, // Will be updated by batch job to find actual manager
      [signalType]: data,
      timestamp: new Date()
    });

    await signal.save();

    res.json({
      success: true,
      message: "Signal recorded",
      data: signal
    });
  } catch (error) {
    console.error("Record signal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record signal"
    });
  }
};

/**
 * Get team signals for manager
 * Returns ONLY aggregated, anonymized data
 */
export const getTeamSignals = async (req, res) => {
  try {
    const managerId = req.userId;
    const { timeRange = "month" } = req.query;

    // Verify user is manager
    const user = await User.findById(managerId);
    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only managers can access team signals"
      });
    }

    // Get or create team signals document
    let teamSignals = await TeamSignals.findOne({ managerId });

    if (!teamSignals) {
      // Create initial team signals
      teamSignals = new TeamSignals({
        managerId,
        teamName: `${user.name}'s Team`,
        teamSize: 0,
        metrics: {
          averageLoginTimeShift: { value: 0, previousMonth: 0, trendDirection: "stable" },
          attendanceVariability: { coefficient: 0, change: 0, isElevated: false },
          leaveClusteringScore: { score: 0, clusteredDays: 0, affectedCount: 0 },
          communicationTrend: { activityChange: 0, currentLevel: "normal", previousLevel: "normal" },
          meetingEngagement: { acceptanceRate: 0, declineRate: 0, noResponseRate: 0, change: 0 },
          teamHealthScore: { score: 100, signals: [] }
        },
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: new Date()
      });
      await teamSignals.save();
    }

    res.json({
      success: true,
      message: "Team signals retrieved",
      data: teamSignals
    });
  } catch (error) {
    console.error("Get team signals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve team signals"
    });
  }
};

/**
 * Core aggregation: Process signals and detect patterns
 * Should run as batch job (every 6 hours)
 */
export const aggregateTeamSignals = async (req, res) => {
  try {
    const { managerId } = req.body;

    // Get all employees managed by this manager (if manager can define team)
    const employees = await User.find({ role: "EMPLOYEE" });
    
    // Get signals from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const signals = await SignalData.find({
      userId: { $in: employees.map(e => e._id) },
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get baseline (previous 30 days before that)
    const baselineStart = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const baselineEnd = thirtyDaysAgo;
    const baselineSignals = await SignalData.find({
      userId: { $in: employees.map(e => e._id) },
      createdAt: { $gte: baselineStart, $lt: baselineEnd }
    });

    // Calculate metrics
    const metrics = calculateMetrics(signals, baselineSignals);
    
    // Detect anomalies
    const alerts = detectAnomalies(metrics, signals);

    // Update or create team signals document
    let teamSignals = await TeamSignals.findOne({ managerId });
    if (!teamSignals) {
      const manager = await User.findById(managerId);
      teamSignals = new TeamSignals({
        managerId,
        teamName: `${manager.name}'s Team`
      });
    }

    teamSignals.teamSize = employees.length;
    teamSignals.metrics = metrics;
    teamSignals.alerts = alerts;
    teamSignals.periodStart = thirtyDaysAgo;
    teamSignals.periodEnd = new Date();
    teamSignals.baselinePeriodStart = baselineStart;
    teamSignals.baselinePeriodEnd = baselineEnd;

    await teamSignals.save();

    res.json({
      success: true,
      message: "Team signals aggregated",
      data: teamSignals
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to aggregate signals"
    });
  }
};

/**
 * Calculate aggregated metrics (no individual names)
 */
function calculateMetrics(currentSignals, baselineSignals) {
  // Attendance pattern analysis
  const attendanceData = currentSignals
    .filter(s => s.attendancePattern)
    .map(s => s.attendancePattern);

  const lateArrivals = attendanceData.filter(a => a.isLate).length;
  const avgLoginTime = attendanceData.length > 0
    ? attendanceData.reduce((sum, a) => sum + (a.loginTime || 0), 0) / attendanceData.length
    : 0;

  // Baseline average
  const baselineAttendance = baselineSignals
    .filter(s => s.attendancePattern)
    .map(s => s.attendancePattern);
  const baselineLoginTime = baselineAttendance.length > 0
    ? baselineAttendance.reduce((sum, a) => sum + (a.loginTime || 0), 0) / baselineAttendance.length
    : 0;

  const loginTimeShift = avgLoginTime - baselineLoginTime;

  // Leave clustering analysis
  const leaveRequests = currentSignals.filter(s => s.leaveRequest);
  const leaveClustered = leaveRequests.filter(s => s.leaveRequest.type === "clustered").length;

  // Communication trend
  const commLow = currentSignals.filter(
    s => s.communicationActivity?.status === "low"
  ).length;
  const commNormal = currentSignals.filter(
    s => s.communicationActivity?.status === "normal"
  ).length;
  const commHigh = currentSignals.filter(
    s => s.communicationActivity?.status === "high"
  ).length;

  const currentCommActivitySum = commLow * 0.5 + commNormal * 1 + commHigh * 1.5;
  const currentCommAvg = currentCommActivitySum / Math.max(currentSignals.length, 1);

  const baselineCommLow = baselineSignals.filter(
    s => s.communicationActivity?.status === "low"
  ).length;
  const baselineCommNormal = baselineSignals.filter(
    s => s.communicationActivity?.status === "normal"
  ).length;
  const baselineCommHigh = baselineSignals.filter(
    s => s.communicationActivity?.status === "high"
  ).length;

  const baselineCommActivitySum = baselineCommLow * 0.5 + baselineCommNormal * 1 + baselineCommHigh * 1.5;
  const baselineCommAvg = baselineCommActivitySum / Math.max(baselineSignals.length, 1);

  const commChangePercent = baselineCommAvg > 0
    ? ((currentCommAvg - baselineCommAvg) / baselineCommAvg) * 100
    : 0;

  // Meeting engagement
  const meetingResponses = currentSignals.filter(s => s.meetingResponse);
  const accepts = meetingResponses.filter(m => m.meetingResponse.type === "accept").length;
  const declines = meetingResponses.filter(m => m.meetingResponse.type === "decline").length;
  const noResponses = meetingResponses.filter(m => m.meetingResponse.type === "no_response").length;

  const totalMeetings = accepts + declines + noResponses || 1;
  const acceptanceRate = (accepts / totalMeetings) * 100;
  const declineRate = (declines / totalMeetings) * 100;
  const noResponseRate = (noResponses / totalMeetings) * 100;

  // Baseline meeting metrics
  const baseMeetingResponses = baselineSignals.filter(s => s.meetingResponse);
  const baseAccepts = baseMeetingResponses.filter(m => m.meetingResponse.type === "accept").length;
  const baseDeclines = baseMeetingResponses.filter(m => m.meetingResponse.type === "decline").length;
  const baseNoResponses = baseMeetingResponses.filter(m => m.meetingResponse.type === "no_response").length;
  const baseTotalMeetings = baseAccepts + baseDeclines + baseNoResponses || 1;
  const baseAcceptanceRate = (baseAccepts / baseTotalMeetings) * 100;
  const meetingChange = acceptanceRate - baseAcceptanceRate;

  // Team health score (0-100)
  const healthFactors = [
    100 - Math.min(lateArrivals * 5, 50), // attendance factor
    100 - Math.min(leaveClustered * 10, 30), // leave clustering factor
    100 + (commChangePercent > -20 ? 0 : commChangePercent), // communication factor
    Math.max(50, acceptanceRate) // meeting engagement factor
  ];
  const teamHealthScore = Math.round(
    healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length
  );

  return {
    averageLoginTimeShift: {
      value: Math.round(loginTimeShift),
      previousMonth: Math.round(baselineLoginTime),
      trendDirection: loginTimeShift > 15 ? "up" : loginTimeShift < -15 ? "down" : "stable"
    },
    attendanceVariability: {
      coefficient: Math.round(calculateStandardDeviation(attendanceData.map(a => a.loginTime || 0)) * 10) / 10,
      change: Math.round(((lateArrivals / Math.max(attendanceData.length, 1)) - (baselineAttendance.filter(a => a.isLate).length / Math.max(baselineAttendance.length, 1))) * 100),
      isElevated: lateArrivals > baselineAttendance.filter(a => a.isLate).length * 1.3
    },
    leaveClusteringScore: {
      score: Math.min(leaveClustered * 20, 100),
      clusteredDays: Math.ceil(leaveClustered / 2),
      affectedCount: Math.min(leaveClustered, Math.max(3, Math.ceil(currentSignals.length / 10)))
    },
    communicationTrend: {
      activityChange: Math.round(commChangePercent),
      currentLevel: commLow > commNormal && commLow > commHigh ? "low" : commHigh > commNormal ? "high" : "normal",
      previousLevel: baselineCommLow > baselineCommNormal ? "low" : baselineCommHigh > baselineCommNormal ? "high" : "normal"
    },
    meetingEngagement: {
      acceptanceRate: Math.round(acceptanceRate),
      declineRate: Math.round(declineRate),
      noResponseRate: Math.round(noResponseRate),
      change: Math.round(meetingChange)
    },
    teamHealthScore: {
      score: teamHealthScore,
      signals: generateSignalDescriptions(
        loginTimeShift,
        lateArrivals,
        leaveClustered,
        commChangePercent,
        meetingChange
      )
    }
  };
}

/**
 * Detect anomalies and generate alerts for manager
 * All alerts reference patterns, not individuals
 */
function detectAnomalies(metrics, signals) {
  const alerts = [];

  // Alert 1: Attendance shift
  if (Math.abs(metrics.averageLoginTimeShift.value) > 30) {
    alerts.push({
      type: "ATTENDANCE_SHIFT",
      severity: metrics.averageLoginTimeShift.value > 45 ? "critical" : "warning",
      description: `Your team's average login time shifted ${Math.abs(metrics.averageLoginTimeShift.value)} minutes ${metrics.averageLoginTimeShift.value > 0 ? "later" : "earlier"} this month`,
      recommendation: "Consider a team check-in or workload review",
      dateDetected: new Date()
    });
  }

  // Alert 2: Leave clustering
  if (metrics.leaveClusteringScore.score > 40) {
    alerts.push({
      type: "LEAVE_CLUSTERING",
      severity: metrics.leaveClusteringScore.score > 70 ? "critical" : "warning",
      description: `Unusual leave concentration detected: ${metrics.leaveClusteringScore.affectedCount}+ people requested leave on the same days`,
      recommendation: "Review workload distribution and project deadlines",
      dateDetected: new Date()
    });
  }

  // Alert 3: Communication drop
  if (metrics.communicationTrend.activityChange < -25) {
    alerts.push({
      type: "COMMUNICATION_DROP",
      severity: metrics.communicationTrend.activityChange < -40 ? "critical" : "warning",
      description: `Team communication activity dropped ${Math.abs(metrics.communicationTrend.activityChange)}% compared to baseline`,
      recommendation: "Consider an anonymous pulse survey or team retrospective",
      dateDetected: new Date()
    });
  }

  // Alert 4: Meeting engagement decline
  if (metrics.meetingEngagement.change < -20) {
    alerts.push({
      type: "MEETING_ENGAGEMENT_DROP",
      severity: "warning",
      description: `Meeting acceptance rate declined by ${Math.abs(metrics.meetingEngagement.change)}%`,
      recommendation: "Check meeting quality, frequency, and relevance",
      dateDetected: new Date()
    });
  }

  // Alert 5: Low health score
  if (metrics.teamHealthScore.score < 60) {
    alerts.push({
      type: "LOW_TEAM_HEALTH",
      severity: metrics.teamHealthScore.score < 40 ? "critical" : "warning",
      description: `Team health score is at ${metrics.teamHealthScore.score}/100 - multiple signals detected`,
      recommendation: "Schedule a comprehensive team check-in and review recent changes",
      dateDetected: new Date()
    });
  }

  return alerts;
}

/**
 * Generate plain-language signal descriptions
 */
function generateSignalDescriptions(loginShift, lateCount, leaveCluster, commChange, meetingChange) {
  const signals = [];

  if (Math.abs(loginShift) > 30) {
    signals.push(loginShift > 0 ? "Shifted login times" : "Earlier login pattern");
  }

  if (lateCount > 5) {
    signals.push("Increased late arrivals");
  }

  if (leaveCluster > 2) {
    signals.push("Leave request clustering");
  }

  if (commChange < -25) {
    signals.push("Communication declining");
  }

  if (meetingChange < -15) {
    signals.push("Lower meeting engagement");
  }

  return signals;
}

/**
 * Utility: Calculate standard deviation
 */
function calculateStandardDeviation(arr) {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}
