// backend/src/controllers/authController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const existingUser = await User.findOne({
            email: req.body.email,
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }
        const { password, ...rest } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...rest,
            password: hashedPassword,
        });
        const userResponse = user.toObject();

        const { password: _, ...safeUser } = userResponse;

        res.status(201).json({
            success: true,
            data: safeUser,
            message: "Register successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d",
            }
        );

        const userResponse = user.toObject();

        const { password: _, ...safeUser } = userResponse;

        res.status(200).json({
            success: true,
            token,
            data: safeUser,
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};