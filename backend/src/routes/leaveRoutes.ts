// backend/src/routes/leaveRoutes.ts

import { Router } from "express";

import {
    applyLeave,
    getLeaves,
    getMyLeaves,
    approveLeave,
    rejectLeave,
    getLeaveCalendar
} from "../controllers/leaveController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("employee"), applyLeave);

router.get("/", protect, getLeaves);

router.get("/my", protect, authorize("employee"), getMyLeaves);

router.get("/calendar", protect, authorize("manager", "admin"), getLeaveCalendar);

router.put("/:id/approve", protect, authorize("manager", "admin"), approveLeave);

router.put("/:id/reject", protect, authorize("manager", "admin"), rejectLeave);

export default router;