// backend/src/routes/reportRoutes.ts

import express from "express";

import {
    getUtilizationReport,
    getProjectReport,
    getLeaveReport,
} from "../controllers/reportController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/utilization", protect, authorize("admin", "manager"), getUtilizationReport);

router.get("/projects", protect, authorize("admin", "manager"), getProjectReport);

router.get("/leaves", protect, authorize("admin", "manager"), getLeaveReport);

export default router;