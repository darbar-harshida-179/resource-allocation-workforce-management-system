// backend/src/routes/leaveBalanceRoutes.ts

import { Router } from "express";

import {
    createLeaveBalance,
    getLeaveBalance,
} from "../controllers/leaveBalanceController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("admin", "manager"), createLeaveBalance);

router.get("/:employeeId", protect, getLeaveBalance);

export default router;