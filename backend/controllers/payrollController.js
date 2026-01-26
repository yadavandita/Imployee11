import Payroll from "../models/PayrollModel.js";
import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import PDFDocument from "pdfkit";

// Generate payroll for a specific month
export const generatePayroll = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId });

    // Check if payroll already exists for this month
    const existingPayroll = await Payroll.findOne({ userId, month, year });
    if (existingPayroll) {
      return res.status(400).json({ 
        success: false, 
        message: "Payroll already exists for this month" 
      });
    }

    // Sample CTC - Replace with actual data from profile
    const annualCTC = 600000; // 6 LPA
    const monthlyCTC = annualCTC / 12; // ₹50,000

    // Salary Breakdown
    const basicSalary = monthlyCTC * 0.40;
    const hra = monthlyCTC * 0.30;
    const educationAllowance = 2500;
    const otherAllowances = monthlyCTC * 0.15;
    const grossSalary = basicSalary + hra + educationAllowance + otherAllowances;

    // Deductions
    const pfEmployee = basicSalary * 0.12;
    const pfEmployer = basicSalary * 0.12;
    const professionalTax = 200;
    const incomeTax = grossSalary * 0.05;

    // Mock attendance data
    const totalWorkingDays = 22;
    const daysPresent = 20;
    const daysAbsent = 2;
    const paidLeaves = 1;
    const unpaidLeaves = 1;

    const perDaySalary = grossSalary / totalWorkingDays;
    const leaveDeductions = unpaidLeaves * perDaySalary;

    const totalDeductions = pfEmployee + professionalTax + incomeTax + leaveDeductions;
    const netSalary = grossSalary - totalDeductions;

    const leaveDetails = [
      { date: new Date("2025-01-15"), type: "CL", status: "Approved", deducted: false },
      { date: new Date("2025-01-20"), type: "SL", status: "Rejected", deducted: true }
    ];

    const payroll = await Payroll.create({
      userId, month, year,
      basicSalary, hra, educationAllowance, otherAllowances, grossSalary,
      pfEmployee, pfEmployer, professionalTax, incomeTax, leaveDeductions,
      totalDeductions, netSalary,
      totalWorkingDays, daysPresent, daysAbsent, paidLeaves, unpaidLeaves,
      leaveDetails,
      paymentDate: new Date(),
      paymentStatus: "Processed"
    });

    res.json({ success: true, message: "Payroll generated successfully", payroll });

  } catch (error) {
    console.error("Payroll generation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payroll by month
export const getPayrollByMonth = async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    const payroll = await Payroll.findOne({
      userId,
      month,
      year: parseInt(year)
    });

    if (!payroll) {
      return res.status(404).json({ success: false, message: "Payroll not found" });
    }

    res.json({ success: true, payroll });
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payroll history
export const getPayrollHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const payrolls = await Payroll.find({ userId })
      .sort({ year: -1, createdAt: -1 })
      .limit(12);

    res.json({ success: true, payrolls });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download payslip PDF
export const downloadPayslipPDF = async (req, res) => {
  try {
    const { payrollId } = req.params;
    const payroll = await Payroll.findById(payrollId).populate('userId');
    
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const user = payroll.userId;
    const profile = await Profile.findOne({ userId: user._id });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Payslip_${payroll.month}_${payroll.year}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).fillColor('#1e40af').text('IMPLOYEE', { align: 'center' });
    doc.fontSize(10).fillColor('#666').text('Smart Employee Management System', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor('#1e40af').text('SALARY SLIP', { align: 'center' });
    doc.moveDown(1.5);
    doc.strokeColor('#1e40af').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Employee Details
    doc.fontSize(14).fillColor('#1e40af').text('EMPLOYEE DETAILS', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000');

    const leftX = 50;
    const rightX = 320;
    let currentY = doc.y;

    const employeeName = profile?.fullName || user.name || 'N/A';
    const employeeId = user.employeeId || 'N/A';
    const designation = profile?.designation || 'N/A';
    const department = profile?.department || 'N/A';
    const email = profile?.email || user.email || 'N/A';
    const phone = profile?.phone || 'N/A';

    doc.text(`Employee Name: ${employeeName}`, leftX, currentY);
    doc.text(`Month: ${payroll.month} ${payroll.year}`, rightX, currentY);
    currentY += 20;
    doc.text(`Employee ID: ${employeeId}`, leftX, currentY);
    doc.text(`Payment Date: ${payroll.paymentDate ? payroll.paymentDate.toLocaleDateString('en-IN') : 'Pending'}`, rightX, currentY);
    currentY += 20;
    doc.text(`Designation: ${designation}`, leftX, currentY);
    doc.text(`Status: ${payroll.paymentStatus}`, rightX, currentY);
    currentY += 20;
    doc.text(`Department: ${department}`, leftX, currentY);
    doc.text(`Email: ${email}`, rightX, currentY);
    currentY += 20;
    doc.text(`Phone: ${phone}`, leftX, currentY);

    doc.moveDown(2);
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Earnings and Deductions
    const colLeft = 50;
    const colRight = 320;
    let startY = doc.y;

    doc.fontSize(14).fillColor('#16a34a').text('EARNINGS', colLeft, startY, { underline: true });
    doc.fontSize(10).fillColor('#000');
    startY += 25;
    doc.text('Basic Salary', colLeft, startY);
    doc.text(`₹${payroll.basicSalary.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('HRA', colLeft, startY);
    doc.text(`₹${payroll.hra.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('Education Allowance', colLeft, startY);
    doc.text(`₹${payroll.educationAllowance.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('Other Allowances', colLeft, startY);
    doc.text(`₹${payroll.otherAllowances.toFixed(2)}`, colLeft + 150, startY);
    startY += 30;
    doc.fontSize(12).fillColor('#16a34a').text('Gross Salary', colLeft, startY, { bold: true });
    doc.text(`₹${payroll.grossSalary.toFixed(2)}`, colLeft + 150, startY, { bold: true });

    startY = doc.y - 145;
    doc.fontSize(14).fillColor('#dc2626').text('DEDUCTIONS', colRight, startY, { underline: true });
    doc.fontSize(10).fillColor('#000');
    startY += 25;
    doc.text('Provident Fund', colRight, startY);
    doc.text(`₹${payroll.pfEmployee.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Professional Tax', colRight, startY);
    doc.text(`₹${payroll.professionalTax.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Income Tax (TDS)', colRight, startY);
    doc.text(`₹${payroll.incomeTax.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Leave Deductions', colRight, startY);
    doc.text(`₹${payroll.leaveDeductions.toFixed(2)}`, colRight + 150, startY);
    startY += 30;
    doc.fontSize(12).fillColor('#dc2626').text('Total Deductions', colRight, startY, { bold: true });
    doc.text(`₹${payroll.totalDeductions.toFixed(2)}`, colRight + 150, startY, { bold: true });

    doc.moveDown(4);

    // Net Salary
    doc.rect(50, doc.y, 500, 50).fillAndStroke('#1e40af', '#1e40af');
    doc.fontSize(18).fillColor('#fff').text('NET SALARY', 60, doc.y + 15);
    doc.fontSize(20).fillColor('#fff').text(`₹${payroll.netSalary.toFixed(2)}`, 400, doc.y - 5, { bold: true });

    doc.moveDown(3);

    // Attendance
    doc.fontSize(14).fillColor('#1e40af').text('ATTENDANCE SUMMARY', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000');
    const attendanceY = doc.y;
    doc.text(`Total Working Days: ${payroll.totalWorkingDays}`, 50, attendanceY);
    doc.text(`Days Present: ${payroll.daysPresent}`, 200, attendanceY);
    doc.text(`Days Absent: ${payroll.daysAbsent}`, 350, attendanceY);
    doc.text(`Paid Leaves: ${payroll.paidLeaves}`, 50, attendanceY + 20);
    doc.text(`Unpaid Leaves: ${payroll.unpaidLeaves}`, 200, attendanceY + 20);

    doc.moveDown(2);

    // Leave Details
    if (payroll.leaveDetails && payroll.leaveDetails.length > 0) {
      doc.fontSize(14).fillColor('#1e40af').text('LEAVE DETAILS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      
      payroll.leaveDetails.forEach((leave) => {
        const statusColor = leave.status === 'Approved' ? '#16a34a' : '#dc2626';
        const deductedText = leave.deducted ? '(Deducted)' : '(Paid)';
        doc.fillColor('#000').text(`${new Date(leave.date).toLocaleDateString('en-IN')}`, 50, doc.y);
        doc.text(`${leave.type}`, 150, doc.y - 12);
        doc.fillColor(statusColor).text(`${leave.status} ${deductedText}`, 220, doc.y - 12);
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(2);

    // Footer
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(8).fillColor('#666').text('This is a computer-generated document. No signature is required.', { align: 'center' });
    doc.fontSize(8).text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

// Generate test PDF without saving to database
export const generateTestPDF = async (req, res) => {
  try {
    const payrollData = req.body;
    const userData = payrollData.userData || {};

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Payslip_Demo_January_2025.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).fillColor('#1e40af').text('IMPLOYEE', { align: 'center' });
    doc.fontSize(10).fillColor('#666').text('Smart Employee Management System', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor('#1e40af').text('SALARY SLIP (DEMO)', { align: 'center' });
    doc.moveDown(1.5);
    doc.strokeColor('#1e40af').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Employee Details
    doc.fontSize(14).fillColor('#1e40af').text('EMPLOYEE DETAILS', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000');

    const leftX = 50;
    const rightX = 320;
    let currentY = doc.y;

    const employeeName = userData.fullName || 'Demo Employee';
    const employeeId = userData.employeeId || 'EMP001';
    const designation = userData.designation || 'Software Developer';
    const department = userData.department || 'IT';
    const email = userData.email || 'demo@imployee.com';
    const phone = userData.phone || '+91 XXXXXXXXXX';

    doc.text(`Employee Name: ${employeeName}`, leftX, currentY);
    doc.text(`Month: ${payrollData.month} ${payrollData.year}`, rightX, currentY);
    currentY += 20;
    doc.text(`Employee ID: ${employeeId}`, leftX, currentY);
    doc.text(`Payment Date: ${new Date(payrollData.paymentDate).toLocaleDateString('en-IN')}`, rightX, currentY);
    currentY += 20;
    doc.text(`Designation: ${designation}`, leftX, currentY);
    doc.text(`Status: ${payrollData.paymentStatus}`, rightX, currentY);
    currentY += 20;
    doc.text(`Department: ${department}`, leftX, currentY);
    doc.text(`Email: ${email}`, rightX, currentY);
    currentY += 20;
    doc.text(`Phone: ${phone}`, leftX, currentY);

    doc.moveDown(2);
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Earnings and Deductions
    const colLeft = 50;
    const colRight = 320;
    let startY = doc.y;

    doc.fontSize(14).fillColor('#16a34a').text('EARNINGS', colLeft, startY, { underline: true });
    doc.fontSize(10).fillColor('#000');
    startY += 25;
    doc.text('Basic Salary', colLeft, startY);
    doc.text(`₹${payrollData.basicSalary.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('HRA', colLeft, startY);
    doc.text(`₹${payrollData.hra.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('Education Allowance', colLeft, startY);
    doc.text(`₹${payrollData.educationAllowance.toFixed(2)}`, colLeft + 150, startY);
    startY += 20;
    doc.text('Other Allowances', colLeft, startY);
    doc.text(`₹${payrollData.otherAllowances.toFixed(2)}`, colLeft + 150, startY);
    startY += 30;
    doc.fontSize(12).fillColor('#16a34a').text('Gross Salary', colLeft, startY, { bold: true });
    doc.text(`₹${payrollData.grossSalary.toFixed(2)}`, colLeft + 150, startY, { bold: true });

    startY = doc.y - 145;
    doc.fontSize(14).fillColor('#dc2626').text('DEDUCTIONS', colRight, startY, { underline: true });
    doc.fontSize(10).fillColor('#000');
    startY += 25;
    doc.text('Provident Fund', colRight, startY);
    doc.text(`₹${payrollData.pfEmployee.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Professional Tax', colRight, startY);
    doc.text(`₹${payrollData.professionalTax.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Income Tax (TDS)', colRight, startY);
    doc.text(`₹${payrollData.incomeTax.toFixed(2)}`, colRight + 150, startY);
    startY += 20;
    doc.text('Leave Deductions', colRight, startY);
    doc.text(`₹${payrollData.leaveDeductions.toFixed(2)}`, colRight + 150, startY);
    startY += 30;
    doc.fontSize(12).fillColor('#dc2626').text('Total Deductions', colRight, startY, { bold: true });
    doc.text(`₹${payrollData.totalDeductions.toFixed(2)}`, colRight + 150, startY, { bold: true });

    doc.moveDown(4);

    // Net Salary
    doc.rect(50, doc.y, 500, 50).fillAndStroke('#1e40af', '#1e40af');
    doc.fontSize(18).fillColor('#fff').text('NET SALARY', 60, doc.y + 15);
    doc.fontSize(20).fillColor('#fff').text(`₹${payrollData.netSalary.toFixed(2)}`, 400, doc.y - 5, { bold: true });

    doc.moveDown(3);

    // Attendance
    doc.fontSize(14).fillColor('#1e40af').text('ATTENDANCE SUMMARY', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#000');
    const attendanceY = doc.y;
    doc.text(`Total Working Days: ${payrollData.totalWorkingDays}`, 50, attendanceY);
    doc.text(`Days Present: ${payrollData.daysPresent}`, 200, attendanceY);
    doc.text(`Days Absent: ${payrollData.daysAbsent}`, 350, attendanceY);
    doc.text(`Paid Leaves: ${payrollData.paidLeaves}`, 50, attendanceY + 20);
    doc.text(`Unpaid Leaves: ${payrollData.unpaidLeaves}`, 200, attendanceY + 20);

    doc.moveDown(2);

    // Leave Details
    if (payrollData.leaveDetails && payrollData.leaveDetails.length > 0) {
      doc.fontSize(14).fillColor('#1e40af').text('LEAVE DETAILS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      
      payrollData.leaveDetails.forEach((leave) => {
        const statusColor = leave.status === 'Approved' ? '#16a34a' : '#dc2626';
        const deductedText = leave.deducted ? '(Deducted)' : '(Paid)';
        doc.fillColor('#000').text(`${new Date(leave.date).toLocaleDateString('en-IN')}`, 50, doc.y);
        doc.text(`${leave.type}`, 150, doc.y - 12);
        doc.fillColor(statusColor).text(`${leave.status} ${deductedText}`, 220, doc.y - 12);
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(2);

    // Demo Notice
    doc.rect(50, doc.y, 500, 60).fillAndStroke('#fff3cd', '#ffc107');
    doc.fontSize(10).fillColor('#856404').text('🎯 DEMO PAYSLIP FOR PRESENTATION', 60, doc.y + 15, { bold: true });
    doc.fontSize(9).fillColor('#856404').text('This is a sample payslip generated for demonstration purposes.', 60, doc.y + 10);
    doc.text('Actual payslips will be generated from real attendance data.', 60, doc.y + 5);

    doc.moveDown(2);

    // Footer
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(8).fillColor('#666').text('This is a computer-generated document. No signature is required.', { align: 'center' });
    doc.fontSize(8).text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error("Test PDF generation error:", error);
    res.status(500).json({ message: "Failed to generate test PDF" });
  }
};