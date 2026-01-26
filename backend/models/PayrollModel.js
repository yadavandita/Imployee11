import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: String,
    required: true // Format: "January 2025"
  },
  year: {
    type: Number,
    required: true
  },
  
  // Salary Components
  basicSalary: Number,
  hra: Number,
  educationAllowance: Number,
  otherAllowances: Number,
  grossSalary: Number,
  
  // Deductions
  pfEmployee: Number,
  pfEmployer: Number,
  professionalTax: Number,
  incomeTax: Number,
  leaveDeductions: Number,
  otherDeductions: Number,
  totalDeductions: Number,
  
  // Net Salary
  netSalary: Number,
  
  // Attendance & Leave Details
  totalWorkingDays: Number,
  daysPresent: Number,
  daysAbsent: Number,
  paidLeaves: Number,
  unpaidLeaves: Number,
  
  // Leave Details Array
  leaveDetails: [{
    date: Date,
    type: String, // CL, SL, EL
    status: String, // Approved, Rejected
    deducted: Boolean
  }],
  
  // Payment Details
  paymentDate: {
    type: Date,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Processed", "Failed"],
    default: "Pending"
  },
  
  // PDF Link
  pdfUrl: String
  
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);