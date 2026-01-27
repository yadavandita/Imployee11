/**
 * Passive signal collection utility
 * Captures behavior data without direct involvement
 * Designed to be called from various controllers
 */

export class SignalsCollector {
  /**
   * Record attendance pattern signal
   * Called after successful attendance mark
   */
  static createAttendanceSignal(loginTime, date) {
    const dateObj = new Date(date);
    const minutesFromMidnight = dateObj.getHours() * 60 + dateObj.getMinutes();
    const officeOpeningTime = 9 * 60; // 9 AM in minutes

    return {
      attendancePattern: {
        loginTime: minutesFromMidnight,
        isLate: minutesFromMidnight > officeOpeningTime,
        dayOfWeek: dateObj.getDay(),
        timestamp: new Date()
      }
    };
  }

  /**
   * Record leave request pattern
   * Called when leave is requested
   */
  static createLeaveSignal(leaveDate, leaveReason, upcomingDeadlines = []) {
    const isBeforeDeadline = upcomingDeadlines.some(d => leaveDate < d);
    const isClustered = false; // Will be determined by aggregation engine

    return {
      leaveRequest: {
        type: isBeforeDeadline ? "before_deadline" : "after_deadline",
        timestamp: new Date(),
        reason: leaveReason
      }
    };
  }

  /**
   * Record communication activity change
   * Called by background job monitoring communication patterns
   */
  static createCommunicationSignal(currentActivityLevel, previousLevel) {
    const levels = { high: 3, normal: 2, low: 1 };
    const currentScore = levels[currentActivityLevel] || 2;
    const previousScore = levels[previousLevel] || 2;
    const changePercent = ((currentScore - previousScore) / previousScore) * 100;

    return {
      communicationActivity: {
        status: currentActivityLevel,
        changePercent: Math.round(changePercent),
        timestamp: new Date()
      }
    };
  }

  /**
   * Record meeting response pattern
   * Called when employee responds to meeting invitation
   */
  static createMeetingSignal(response) {
    // response should be: "accept", "decline", "no_response"
    return {
      meetingResponse: {
        type: response,
        timestamp: new Date()
      }
    };
  }

  /**
   * Record tool usage pattern
   * Called by monitoring system tracking activity in various tools
   */
  static createToolActivitySignal(toolName, activityLevel) {
    // activityLevel should be: "high", "normal", "low"
    return {
      toolActivity: {
        tool: toolName,
        level: activityLevel,
        timestamp: new Date()
      }
    };
  }

  /**
   * Calculate engagement score based on all signals
   * Scale: 0-100, where 100 = highly engaged
   */
  static calculateEngagementScore(signals) {
    let score = 100;

    if (signals.attendancePattern?.isLate) {
      score -= 10;
    }

    if (signals.communicationActivity?.status === "low") {
      score -= 20;
    } else if (signals.communicationActivity?.status === "high") {
      score += 5;
    }

    if (signals.meetingResponse?.type === "decline") {
      score -= 15;
    } else if (signals.meetingResponse?.type === "no_response") {
      score -= 8;
    }

    if (signals.meetingResponse?.type === "accept") {
      score += 5;
    }

    if (signals.leaveRequest?.type === "before_deadline") {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Detect if employee is showing disengagement signals
   * Used internally, never shown to employee
   */
  static detectDisengagementSignals(recentSignals) {
    const anomalies = [];

    const lateArrivals = recentSignals.filter(s => s.attendancePattern?.isLate).length;
    if (lateArrivals > 5) {
      anomalies.push("early_disengagement");
    }

    const lowComm = recentSignals.filter(s => s.communicationActivity?.status === "low").length;
    if (lowComm > 3) {
      anomalies.push("communication_drop");
    }

    const declinedMeetings = recentSignals.filter(s => s.meetingResponse?.type === "decline").length;
    if (declinedMeetings > 2) {
      anomalies.push("low_engagement");
    }

    return anomalies;
  }
}

export default SignalsCollector;
