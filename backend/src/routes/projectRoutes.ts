// backend/src/routes/projectRoutes.ts

import { Router } from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controllers/projectController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", protect, authorize("admin"), createProject);

router.put("/:id", protect, authorize("admin"), updateProject);

router.delete("/:id", protect, authorize("admin"), deleteProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProjectById);

export default router;