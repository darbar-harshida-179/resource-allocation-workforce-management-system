// backend/src/routes/timesheetRoutes.ts

import { Router } from "express";

import {
    submitTimesheet,
    getTimesheets,
    approveTimesheet,
    rejectTimesheet,
    getMyTimesheets,
    getWeeklyTimesheetSummary,
    getMonthlyTimesheetSummary
} from "../controllers/timesheetController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("employee"), submitTimesheet);

router.get("/", protect, authorize("admin", "manager"), getTimesheets);

router.get("/my", protect, authorize("employee"), getMyTimesheets);

router.put("/:id/approve", protect, authorize("admin", "manager"), approveTimesheet);

router.put("/:id/reject", protect, authorize("admin", "manager"), rejectTimesheet);

router.get("/weekly-summary", protect, authorize("employee"), getWeeklyTimesheetSummary);

router.get("/monthly-summary", protect, authorize("employee"), getMonthlyTimesheetSummary);

export default router;