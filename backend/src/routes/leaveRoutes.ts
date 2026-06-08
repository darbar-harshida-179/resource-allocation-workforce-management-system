// backend/src/routes/leaveRoutes.ts

import { Router } from "express";

import {
    applyLeave,
    getLeaves,
    approveLeave,
    rejectLeave,
} from "../controllers/leaveController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("employee"), applyLeave);

router.get("/", protect, getLeaves);

router.put("/:id/approve", protect, authorize("manager", "admin"), approveLeave);

router.put("/:id/reject", protect, authorize("manager", "admin"), rejectLeave);

export default router;