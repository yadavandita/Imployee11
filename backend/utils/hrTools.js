import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import AttendanceModel from "../models/AttendanceModel.js";
import PayrollModel from "../models/PayrollModel.js";
import HRPolicyModel from "../models/HRPolicyModel.js";

/**
 * HR Tools that Gemini AI can call to fetch relevant information
 */

// Tool 1: Get User's Leave Balance
export const getUserLeaveBalance = async (employeeId) => {
  try {
    const user = await User.findOne({ employeeId });
    if (!user) throw new Error("User not found");

    // Get current year
    const currentYear = new Date().getFullYear();

    // Calculate leave used
    const leaveUsed = {
      casualLeave: user.leaveUsed?.casual || 0,
      sickLeave: user.leaveUsed?.sick || 0,
      earnedLeave: user.leaveUsed?.earned || 0,
    };

    // IMPLOYEE Leave Policy
    const leavePolicy = {
      casualLeave: 12,
      sickLeave: 8,
      earnedLeave: 15,
      maternityLeave: 180, // days
      paternityLeave: 7, // days
    };

    const leaveRemaining = {
      casual: leavePolicy.casualLeave - leaveUsed.casualLeave,
      sick: leavePolicy.sickLeave - leaveUsed.sickLeave,
      earned: leavePolicy.earnedLeave - leaveUsed.earnedLeave,
    };

    const total = leaveRemaining.casual + leaveRemaining.sick + leaveRemaining.earned;

    return {
      employeeId,
      leavePolicy,
      leaveUsed,
      leaveRemaining,
      totalRemaining: total,
      currentYear,
      lastLeaveDate: user.lastLeaveDate || null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch leave balance: ${error.message}`);
  }
};

// Tool 2: Get User's Attendance Summary
export const getUserAttendanceSummary = async (employeeId) => {
  try {
    const user = await User.findOne({ employeeId });
    if (!user) throw new Error("User not found");

    const userId = user._id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Get attendance records for current month
    const startDate = new Date(currentYear, currentDate.getMonth(), 1);
    const endDate = new Date(currentYear, currentDate.getMonth() + 1, 0);

    const attendanceRecords = await AttendanceModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const presentDays = attendanceRecords.length;

    // Calculate total working days (excluding weekends)
    let totalDays = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        totalDays++;
      }
    }

    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    // Get YTD (Year-to-date) attendance
    const ytdStart = new Date(currentYear, 0, 1);
    const ytdRecords = await AttendanceModel.find({
      userId,
      date: { $gte: ytdStart, $lte: currentDate },
    });

    let ytdWorkingDays = 0;
    for (let d = new Date(ytdStart); d <= currentDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        ytdWorkingDays++;
      }
    }

    const ytdAttendancePercentage =
      ytdWorkingDays > 0 ? ((ytdRecords.length / ytdWorkingDays) * 100).toFixed(2) : 0;

    return {
      userId,
      currentMonth,
      currentYear,
      monthlyStats: {
        present: presentDays,
        working_days: totalDays,
        attendance_percentage: parseFloat(attendancePercentage),
      },
      ytdStats: {
        present: ytdRecords.length,
        working_days: ytdWorkingDays,
        attendance_percentage: parseFloat(ytdAttendancePercentage),
      },
      lastMarkedDate: attendanceRecords.length > 0 ? attendanceRecords[attendanceRecords.length - 1].date : null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch attendance summary: ${error.message}`);
  }
};

// Tool 3: Get User's Payroll Information
export const getUserPayrollInfo = async (employeeId) => {
  try {
    const user = await User.findOne({ employeeId });
    if (!user) throw new Error("User not found");

    const userId = user._id;

    const profile = await Profile.findOne({ userId });

    // Get latest payroll record
    const payrollRecord = await PayrollModel.findOne({ userId }).sort({ createdAt: -1 });

    const salary = {
      ctc: user.salary?.ctc || 0,
      inHandSalary: user.salary?.inHand || 0,
      salary_frequency: "Monthly",
    };

    let deductions = {};
    let earnings = {};

    if (payrollRecord) {
      deductions = {
        pf: payrollRecord.deductions?.pf || 0,
        tax: payrollRecord.deductions?.tax || 0,
        insurance: payrollRecord.deductions?.insurance || 0,
        other: payrollRecord.deductions?.other || 0,
      };

      earnings = {
        basic: payrollRecord.earnings?.basic || 0,
        allowances: payrollRecord.earnings?.allowances || 0,
        bonus: payrollRecord.earnings?.bonus || 0,
      };
    }

    return {
      userId,
      salary,
      deductions,
      earnings,
      lastPayrollDate: payrollRecord?.createdAt || null,
      department: profile?.department || "N/A",
      designation: profile?.designation || "N/A",
    };
  } catch (error) {
    throw new Error(`Failed to fetch payroll info: ${error.message}`);
  }
};

// Tool 4: Get Company HR Policies
export const getCompanyHRPolicies = async () => {
  try {
    // Default IMPLOYEE HR Policies
    const policies = {
      company: "IMPLOYEE",
      leavePolicy: {
        casualLeave: "12 days per year",
        sickLeave: "8 days per year",
        earnedLeave: "15 days per year",
        maternityLeave: "26 weeks for first two children, 12 weeks for third onwards",
        paternityLeave: "7 days",
        carryForward: "EL can be carried forward or encashed",
      },
      workingHours: {
        daily: "9 hours (including breaks)",
        weekly_off: "Saturday & Sunday",
        attendance_system: "Geo-fenced face-based",
      },
      salary: {
        payment_frequency: "Monthly",
        payment_date: "Last working day of the month",
        mode: "Bank transfer",
      },
      benefits: {
        health_insurance: "Family coverage (employee + spouse + 2 children)",
        pf: "Applicable as per statutory norms",
        gratuity: "After 5 years of service",
        education_allowance: "₹30,000 per year per child",
        referral_bonus: "₹10,000 - ₹50,000 (based on position level)",
      },
      salary_hike: {
        frequency: "Annual (typically in April)",
        average_hike: "8% - 20%",
        exceptional_performers: "Above 20%",
        mid_year_hikes: "Available for top performers",
      },
      code_of_conduct: [
        "Maintain professional ethics",
        "Respect workplace diversity",
        "Keep confidential information private",
        "Be punctual and reliable",
        "Follow company guidelines",
      ],
    };

    // Try to fetch from database
    try {
      const dbPolicy = await HRPolicyModel.findOne({ companyId: "default" });
      if (dbPolicy && dbPolicy.policyText) {
        return {
          ...policies,
          customPolicies: dbPolicy.policyText,
        };
      }
    } catch (err) {
      console.log("Using default policies");
    }

    return policies;
  } catch (error) {
    throw new Error(`Failed to fetch HR policies: ${error.message}`);
  }
};

// Tool 5: Get User Profile Information
export const getUserProfileInfo = async (employeeId) => {
  try {
    const user = await User.findOne({ employeeId });
    const profile = user ? await Profile.findOne({ userId: user._id }) : null;

    if (!user) throw new Error("User not found");

    return {
      employeeId,
      personalInfo: {
        name: profile?.fullName || user.name || "N/A",
        email: user.email,
        phone: profile?.phone || "N/A",
        date_of_birth: profile?.dateOfBirth || "N/A",
      },
      professionalInfo: {
        employeeId: user.employeeId,
        department: profile?.department || "N/A",
        designation: profile?.designation || "N/A",
        joining_date: profile?.joiningDate || "N/A",
        employment_type: profile?.employmentType || "Full-time",
        reporting_manager: profile?.manager || "N/A",
      },
      accountStatus: {
        status: user.status || "Active",
        role: user.role || "EMPLOYEE",
        profileLocked: user.profileLocked || false,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch profile info: ${error.message}`);
  }
};

// Tool 6: Get Application Information
export const getApplicationInfo = async () => {
  return {
    application: "IMPLOYEE - Employee Management System",
    version: "1.0.0",
    features: [
      "Face-based attendance tracking",
      "Geo-fenced location verification",
      "HR policy management",
      "Leave management",
      "Payroll processing",
      "Profile management",
      "AI-powered HR Assistant",
    ],
    support: {
      email: "hr@imployee.com",
      documentation: "Available on HR portal",
    },
    working_hours: "9 AM - 6 PM IST",
    timezone: "IST (Indian Standard Time)",
  };
};

// Tool 7: Search HR Policy by Topic
export const searchHRPolicy = async (topic) => {
  try {
    const policies = await getCompanyHRPolicies();
    
    const keywords = topic.toLowerCase();
    let results = [];

    // Search through policies
    if (keywords.includes("leave")) {
      results.push({
        category: "Leave Policy",
        content: policies.leavePolicy,
      });
    }
    if (keywords.includes("salary") || keywords.includes("pay") || keywords.includes("ctc")) {
      results.push({
        category: "Salary Information",
        content: policies.salary,
      });
    }
    if (keywords.includes("benefit")) {
      results.push({
        category: "Benefits",
        content: policies.benefits,
      });
    }
    if (keywords.includes("work") || keywords.includes("hour")) {
      results.push({
        category: "Working Hours",
        content: policies.workingHours,
      });
    }
    if (keywords.includes("conduct") || keywords.includes("code")) {
      results.push({
        category: "Code of Conduct",
        content: policies.code_of_conduct,
      });
    }
    if (keywords.includes("hike") || keywords.includes("increment")) {
      results.push({
        category: "Salary Hike Policy",
        content: policies.salary_hike,
      });
    }

    return results.length > 0 ? results : { message: "No matching policies found", suggestions: Object.keys(policies) };
  } catch (error) {
    throw new Error(`Failed to search policies: ${error.message}`);
  }
};
