import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {
  recordSignal,
  getTeamSignals,
  aggregateTeamSignals
} from "../controllers/signalsController.js";

const router = express.Router();

/**
 * Internal endpoint: Record signal from employee actions
 * Called by attendance, leave, communication endpoints
 * No role restriction - passive collection
 */
router.post("/record", authMiddleware, recordSignal);

/**
 * Manager endpoint: Get team signals (aggregated, anonymized)
 * Only managers and admins can access
 */
router.get("/team", authMiddleware, roleMiddleware(["MANAGER", "ADMIN"]), getTeamSignals);

/**
 * Internal endpoint: Trigger aggregation (for batch job)
 * Should be called periodically (every 6 hours) by backend job
 * Admin only
 */
router.post("/aggregate", authMiddleware, roleMiddleware(["ADMIN"]), aggregateTeamSignals);

export default router;
