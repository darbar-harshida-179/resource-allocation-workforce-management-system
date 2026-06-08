// backend/src/routes/allocationRoutes.ts

import { Router } from "express";

import {
  createAllocation,
  getAllocations,
  updateAllocation,
  deleteAllocation,
  getAllocationHistory
} from "../controllers/allocationController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("admin", "manager"), createAllocation);

router.get("/", protect, getAllocations);

router.get("/history", protect, getAllocationHistory);

router.put("/:id", protect, authorize("admin", "manager"), updateAllocation);

router.delete("/:id", protect, authorize("admin", "manager"), deleteAllocation);

export default router;