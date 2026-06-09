// backend/src/routes/resourceAvailabilityRoutes.ts

import { Router } from "express";

import { getResourceAvailability } from "../controllers/resourceAvailabilityController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getResourceAvailability);

export default router;