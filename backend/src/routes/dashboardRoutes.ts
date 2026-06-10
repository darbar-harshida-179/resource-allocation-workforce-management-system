// backend/src/routes/dashboardRoutes.ts

import express from "express";

import {
  getAdminDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
} from "../controllers/dashboardController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminDashboard);

router.get("/manager", protect, authorize("manager"), getManagerDashboard);

router.get("/employee", protect, authorize("employee"), getEmployeeDashboard);

export default router;