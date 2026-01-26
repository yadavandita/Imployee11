import express from "express";
import { 
  generatePayroll, 
  getPayrollByMonth, 
  getPayrollHistory,
  downloadPayslipPDF,
  generateTestPDF  // Add this
} from "../controllers/payrollController.js";

const router = express.Router();

// Generate payroll for a user
router.post("/generate/:userId", generatePayroll);

// Get payroll by month and year
router.get("/:userId/:month/:year", getPayrollByMonth);

// Get payroll history
router.get("/history/:userId", getPayrollHistory);

// Download PDF
router.get("/download/:payrollId", downloadPayslipPDF);
router.post("/generate-test-pdf", generateTestPDF);
export default router;