import express from "express";
import { 
  createProfile, 
  getProfile,
  submitProfileForApproval,
  getManagerApprovalRequests,
  approveProfile,
  rejectProfile
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee endpoints
router.post("/create/:userId", createProfile);
router.post("/submit-approval", authMiddleware, submitProfileForApproval);

// Manager endpoints (role-based access) - MUST come before /:userId to avoid matching
router.get("/approval/requests", authMiddleware, roleMiddleware(["MANAGER", "ADMIN"]), getManagerApprovalRequests);
router.post("/approval/approve/:requestId", authMiddleware, roleMiddleware(["MANAGER", "ADMIN"]), approveProfile);
router.post("/approval/reject/:requestId", authMiddleware, roleMiddleware(["MANAGER", "ADMIN"]), rejectProfile);

// Generic profile endpoint - MUST come last
router.get("/:userId", getProfile);

export default router;
