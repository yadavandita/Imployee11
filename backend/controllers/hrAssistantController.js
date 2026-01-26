import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import HRPolicy from "../models/HRPolicyModel.js";

// FREE AI-like chatbot using keyword matching and smart logic
export const chatWithHRAssistant = async (req, res) => {
  try {
    const { message, userId, employeeData } = req.body;

    // Fetch employee profile and user data
    const profile = await Profile.findOne({ userId });
    const user = await User.findById(userId);

    // Fetch company HR policies
    const policies = await HRPolicy.findOne({ companyId: "default" });

    // Process the message and generate response
    const response = await generateSmartResponse(
      message.toLowerCase(),
      profile,
      user,
      employeeData,
      policies
    );

    res.json({
      success: true,
      response: response.text,
      data: response.data
    });

  } catch (error) {
    console.error("HR Assistant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message
    });
  }
};

// Smart response generator with keyword matching
async function generateSmartResponse(message, profile, user, employeeData, policies) {
  const userName = profile?.fullName || user?.name || "there";

  // LEAVE QUESTIONS
  if (matchKeywords(message, ["leave", "leaves", "remaining", "balance", "pending", "left", "casual", "sick", "earned"])) {
    return handleLeaveQuestions(message, employeeData, userName);
  }

  // ATTENDANCE QUESTIONS
  if (matchKeywords(message, ["attendance", "present", "absent", "percentage", "rate", "working hours", "hours"])) {
    return handleAttendanceQuestions(message, employeeData, userName);
  }

  // SALARY QUESTIONS
  if (matchKeywords(message, ["salary", "pay", "payroll", "payment", "ctc", "in-hand", "take home", "hike"])) {
    return handleSalaryQuestions(message, userName);
  }

  // INSURANCE & BENEFITS
  if (matchKeywords(message, ["insurance", "health", "medical", "benefits", "coverage", "hospitalization"])) {
    return handleInsuranceQuestions(message, userName);
  }

  // PF & RETIREMENT
  if (matchKeywords(message, ["pf", "provident", "gratuity", "retirement", "epf"])) {
    return handlePFQuestions(message, userName);
  }

  // REFERRAL
  if (matchKeywords(message, ["referral", "refer", "bonus", "recommend"])) {
    return handleReferralQuestions(message, userName);
  }

  // EDUCATION & FAMILY BENEFITS
  if (matchKeywords(message, ["education", "children", "family", "allowance", "bereavement"])) {
    return handleFamilyBenefits(message, userName);
  }

  // POLICY QUESTIONS
  if (matchKeywords(message, ["policy", "policies", "rules", "regulation", "guideline", "code of conduct"])) {
    return handlePolicyQuestions(message, policies, userName);
  }

  // MATERNITY/PATERNITY LEAVE
  if (matchKeywords(message, ["maternity", "paternity", "pregnancy", "baby"])) {
    return handleParentalLeave(message, userName);
  }

  // PROFILE QUESTIONS
  if (matchKeywords(message, ["profile", "details", "information", "department", "designation"])) {
    return handleProfileQuestions(message, profile, userName);
  }

  // GREETINGS
  if (matchKeywords(message, ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"])) {
    return {
      text: `Hello ${userName}! 👋\n\nI'm your HR Assistant at **IMPLOYEE**. I can help you with:\n\n📋 **Leave Information** - CL, SL, EL balances\n📊 **Attendance** - Working hours & records\n💰 **Salary & Benefits** - CTC, in-hand, hikes\n🏥 **Insurance & Health** - Coverage details\n🎓 **Education Benefits** - Allowances for children\n💼 **PF & Gratuity** - Retirement benefits\n🤝 **Referral Program** - Bonus details\n\nWhat would you like to know?`,
      data: {}
    };
  }

  // THANK YOU
  if (matchKeywords(message, ["thank", "thanks", "appreciate"])) {
    return {
      text: `You're welcome, ${userName}! 😊 Feel free to ask if you need anything else about IMPLOYEE policies.`,
      data: {}
    };
  }

  // DEFAULT RESPONSE
  return {
    text: `I'm not sure I understood that, ${userName}. 🤔\n\nI can help you with:\n\n📋 **Leaves** - "How many leaves do I have?"\n💰 **Salary** - "What's the CTC breakdown?"\n🏥 **Insurance** - "What's covered in health insurance?"\n🎓 **Benefits** - "Education allowance details?"\n🤝 **Referral** - "Referral bonus amount?"\n\nPlease try rephrasing your question!`,
    data: {}
  };
}

// Helper function to match keywords
function matchKeywords(message, keywords) {
  return keywords.some(keyword => message.includes(keyword));
}

// Handle leave-related questions (BASED ON YOUR PDF)
function handleLeaveQuestions(message, employeeData, userName) {
  // IMPLOYEE Leave Policy from PDF
  const casualLeave = 12;
  const sickLeave = 8;
  const earnedLeave = 15;

  // Mock data - replace with actual database queries
  const clUsed = employeeData?.leaves?.casualUsed || 2;
  const slUsed = employeeData?.leaves?.sickUsed || 1;
  const elUsed = employeeData?.leaves?.earnedUsed || 3;

  const clRemaining = casualLeave - clUsed;
  const slRemaining = sickLeave - slUsed;
  const elRemaining = earnedLeave - elUsed;
  const totalRemaining = clRemaining + slRemaining + elRemaining;

  const lastLeaveDate = employeeData?.leaves?.lastDate || "December 15, 2024";

  if (matchKeywords(message, ["remaining", "left", "pending", "balance"])) {
    return {
      text: `Hi ${userName}! 📅\n\n**Your Leave Balance (As per IMPLOYEE Policy):**\n\n🏖️ **Casual Leave (CL)**\n   Total: ${casualLeave}/year | Used: ${clUsed} | **Remaining: ${clRemaining}**\n\n🤒 **Sick Leave (SL)**\n   Total: ${sickLeave}/year | Used: ${slUsed} | **Remaining: ${slRemaining}**\n\n💼 **Earned Leave (EL)**\n   Total: ${earnedLeave}/year | Used: ${elUsed} | **Remaining: ${elRemaining}**\n\n✅ **Total Remaining**: ${totalRemaining} leaves\n📆 **Last Leave Taken**: ${lastLeaveDate}\n\n💡 *Note: Unused EL can be carried forward or encashed!*`,
      data: {
        leaveBalance: totalRemaining,
        clRemaining,
        slRemaining,
        elRemaining
      }
    };
  }

  // General leave info
  return {
    text: `Hi ${userName}! 📋\n\n**IMPLOYEE Leave Policy:**\n\n🏖️ **Casual Leave (CL)**: ${casualLeave} per year\n🤒 **Sick Leave (SL)**: ${sickLeave} per year\n💼 **Earned Leave (EL)**: ${earnedLeave} per year\n\nYou have:\n• ${clRemaining} CL remaining\n• ${slRemaining} SL remaining\n• ${elRemaining} EL remaining\n\n**Special Leaves:**\n👶 Maternity: As per Government norms\n👨‍👶 Paternity: 7 days\n\n💡 Unused EL can be carried forward or encashed!`,
    data: { leaveBalance: totalRemaining }
  };
}

// Handle attendance questions (BASED ON YOUR PDF)
function handleAttendanceQuestions(message, employeeData, userName) {
  // Mock data - replace with actual calculations
  const totalDays = 22;
  const presentDays = employeeData?.attendance?.present || 20;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(1);

  return {
    text: `Hi ${userName}! 📊\n\n**Attendance Summary:**\n\n✅ **Present**: ${presentDays} days\n❌ **Absent**: ${absentDays} days\n📈 **Attendance Rate**: ${attendancePercentage}%\n\n**Working Hours (IMPLOYEE Policy):**\n⏰ **Standard**: 9 hours/day (including breaks)\n📅 **Weekly Off**: Saturday & Sunday\n🔒 **Attendance System**: Geo-fenced face-based\n\n${attendancePercentage >= 90 ? "🌟 Excellent attendance! Keep it up!" : attendancePercentage >= 75 ? "👍 Good attendance!" : "⚠️ Please improve your attendance."}`,
    data: {
      attendanceRate: attendancePercentage,
      presentDays,
      absentDays
    }
  };
}

// Handle salary questions (BASED ON YOUR PDF)
function handleSalaryQuestions(message, userName) {
  if (matchKeywords(message, ["hike", "increment", "raise", "appraisal"])) {
    return {
      text: `Hi ${userName}! 💰\n\n**IMPLOYEE Salary Hike Policy:**\n\n📈 **Annual Performance-Based Hike**\n• Average: 8% - 20%\n• Based on performance review\n\n🌟 **Exceptional Performers**\n• May receive mid-year hikes\n• Above 20% for outstanding performance\n\n📅 **Review Cycle**: Yearly (typically in April)\n\nKeep up the great work! 🚀`,
      data: {}
    };
  }

  // Salary structure from PDF
  return {
    text: `Hi ${userName}! 💰\n\n**IMPLOYEE Salary Structure Overview:**\n\n| CTC (LPA) | In-Hand (Monthly) |\n|-----------|-------------------|\n| 4 LPA     | ₹28,000          |\n| 6 LPA     | ₹42,000          |\n| 8 LPA     | ₹56,000          |\n| 10 LPA    | ₹70,000          |\n| 12 LPA    | ₹84,000          |\n| 15 LPA    | ₹1,05,000        |\n| 17 LPA    | ₹1,20,000        |\n\n💡 *Note: In-hand salary is approximate after deductions (PF, tax, etc.)*\n\n📅 **Salary Date**: Last working day of the month\n💳 **Payment Mode**: Bank transfer\n📄 **Salary Slip**: Available on HR portal`,
    data: {}
  };
}

// Handle insurance questions (BASED ON YOUR PDF)
function handleInsuranceQuestions(message, userName) {
  return {
    text: `Hi ${userName}! 🏥\n\n**IMPLOYEE Health Insurance Coverage:**\n\n👨‍👩‍👧‍👦 **Family Coverage**\n• Employee + Spouse + 2 Children\n\n📋 **What's Covered:**\n✅ Hospitalization\n✅ Maternity\n✅ Accident Coverage\n✅ Pre & Post Hospitalization\n\n💼 **Type**: Group Health Insurance\n💰 **Premium**: Paid by company\n\n📞 For claims or queries, contact HR at hr@imployee.com`,
    data: {}
  };
}

// Handle PF & Retirement (BASED ON YOUR PDF)
function handlePFQuestions(message, userName) {
  return {
    text: `Hi ${userName}! 💼\n\n**IMPLOYEE PF & Retirement Benefits:**\n\n💰 **Provident Fund (PF)**\n• Applicable as per statutory norms\n• Employer & Employee contribute equally\n• Deducted from monthly salary\n\n🎁 **Gratuity**\n• Applicable after 5 years of service\n• Calculated as per government rules\n• Paid at time of retirement/resignation\n\n📊 **PF Balance**: Check on EPFO portal\n🔐 **UAN Number**: Contact HR if you don't have it`,
    data: {}
  };
}

// Handle referral questions (BASED ON YOUR PDF)
function handleReferralQuestions(message, userName) {
  return {
    text: `Hi ${userName}! 🤝\n\n**IMPLOYEE Referral Program:**\n\n💰 **Referral Bonus**: ₹10,000 - ₹50,000\n• Amount depends on position level\n• Junior roles: ₹10,000 - ₹20,000\n• Senior roles: ₹30,000 - ₹50,000\n\n⏰ **Payment Timeline**\n• Paid after 3 months of successful onboarding\n• Referee must complete probation\n\n📝 **How to Refer:**\n1. Submit candidate details to HR\n2. Mention your name in referral form\n3. Track status on HR portal\n\nHelp us grow! Refer talented candidates! 🚀`,
    data: {}
  };
}

// Handle family benefits (BASED ON YOUR PDF)
function handleFamilyBenefits(message, userName) {
  return {
    text: `Hi ${userName}! 🎓\n\n**IMPLOYEE Family & Education Benefits:**\n\n📚 **Education Allowance**\n• ₹30,000 per year per child\n• For school/college fees\n• Submit receipts to HR\n\n🏥 **Medical Emergency Support**\n• Available for immediate family\n• Contact HR in case of emergency\n\n💔 **Bereavement Leave**\n• Paid leave for family loss\n• Duration: As per situation\n• Immediate family covered\n\n👨‍👩‍👧‍👦 **Health Insurance**\n• Covers spouse + 2 children\n• Hospitalization & medical expenses\n\nWe care for your family! ❤️`,
    data: {}
  };
}

// Handle parental leave (BASED ON YOUR PDF)
function handleParentalLeave(message, userName) {
  return {
    text: `Hi ${userName}! 👶\n\n**IMPLOYEE Parental Leave Policy:**\n\n🤰 **Maternity Leave**\n• As per Government of India norms\n• 26 weeks (6 months) for first two children\n• 12 weeks for third child onwards\n• Fully paid leave\n\n👨‍👶 **Paternity Leave**\n• 7 days paid leave\n• To be taken within 6 months of child's birth\n• Apply through HR portal\n\n📝 **Application Process:**\n1. Inform HR at least 1 month in advance\n2. Submit medical certificates\n3. Plan handover with your team\n\nCongratulations! 🎉`,
    data: {}
  };
}

// Handle policy questions (BASED ON YOUR PDF)
function handlePolicyQuestions(message, policies, userName) {
  return {
    text: `Hi ${userName}! 📜\n\n**IMPLOYEE HR Policies Overview:**\n\n📋 **Leave Policy**\n• CL: 12/year | SL: 8/year | EL: 15/year\n\n⏰ **Working Hours**\n• 9 hours/day (including breaks)\n• Weekly off: Sat & Sun\n\n💰 **Salary & Hikes**\n• Annual hike: 8% - 20%\n• Mid-year hikes for top performers\n\n🤝 **Referral Bonus**\n• ₹10,000 - ₹50,000\n\n🏥 **Insurance**\n• Family health coverage\n\n💼 **PF & Gratuity**\n• As per statutory norms\n\n⚖️ **Code of Conduct**\n• Professional ethics mandatory\n• Maintain confidentiality\n• Respect workplace diversity\n\n📄 Full policy document available on HR portal.`,
    data: {}
  };
}

// Handle profile questions
function handleProfileQuestions(message, profile, userName) {
  return {
    text: `Hi ${userName}! 👤\n\n**Your IMPLOYEE Profile:**\n\n• **Name**: ${profile?.fullName || "N/A"}\n• **Department**: ${profile?.department || "N/A"}\n• **Designation**: ${profile?.designation || "N/A"}\n• **Joining Date**: ${profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}\n• **Email**: ${profile?.email || "N/A"}\n• **Employment Type**: ${profile?.employmentType || "N/A"}\n\n🔧 You can update your profile from the Profile Dashboard.\n📞 For changes to critical info, contact HR.`,
    data: {}
  };
}

// Upload HR Policy
export const uploadPolicy = async (req, res) => {
  try {
    const { policyText, companyId } = req.body;

    await HRPolicy.findOneAndUpdate(
      { companyId: companyId || "default" },
      { policyText, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "HR Policy updated successfully"
    });
  } catch (error) {
    console.error("Policy upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload policy"
    });
  }
};

// Get HR Policy
export const getPolicy = async (req, res) => {
  try {
    const policy = await HRPolicy.findOne({ companyId: "default" });
    
    res.json({
      success: true,
      policy: policy || { policyText: "No policies uploaded yet." }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policy"
    });
  }
};