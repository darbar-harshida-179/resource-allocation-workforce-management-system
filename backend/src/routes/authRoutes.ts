// backend/src/routes/authRoutes.ts

import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    getProfile,
    logoutUser,
    forgotPassword,
    resetPassword,
    verifyEmail
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";
import { registerValidation } from "../validators/authValidator";
import { validateRequest } from "../middleware/validationMiddleware";

const router = Router();
router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshAccessToken);

router.get("/profile", protect, getProfile);
router.post("/logout", logoutUser);

export default router;      