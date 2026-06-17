// backend/src/controllers/authController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/User";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail";
import LeaveBalance from "../models/LeaveBalance";

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
        if (req.body.role === UserRole.ADMIN) {
            res.status(403).json({
                success: false,
                message: "Admin registration not allowed",
            });
            return;
        }
        const { password, ...rest } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        const user = await User.create({
            ...rest,
            password: hashedPassword,
            verificationToken,
        });

        await LeaveBalance.create({
            employee: user._id,
        });
        const userResponse = user.toObject();

        const verificationUrl =
            `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    //     await sendEmail({
    //         to: user.email,
    //         subject: "Verify Your Email",
    //         html: `
    //     <h3>Email Verification</h3>
    //     <p>Click below link to verify your account:</p>
    //     <a href="${verificationUrl}">
    //         Verify Email
    //     </a>
    // `,
    //     });


    try {
    await sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        html: `
        <h3>Email Verification</h3>
        <p>Click below link to verify your account:</p>
        <a href="${verificationUrl}">
            Verify Email
        </a>
        `,
    });
} catch (emailError) {
    console.error("Email Error:", emailError);
}

        const { password: _, verificationToken: __, ...safeUser } = userResponse;

        res.status(201).json({
            success: true,
            data: safeUser,
            message: "Register successful",
        });
    } catch (error) {
        console.error("Register Error:", error);

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

        if (!user.isVerified && user.role !== UserRole.ADMIN) {
            res.status(401).json({
                success: false,
                message: "Please verify your email before logging in.",
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

        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        user.refreshToken = refreshToken;
        await user.save();

        const userResponse = user.toObject();

        const {
            password: _password,
            verificationToken: _verificationToken,
            refreshToken: _refreshToken,
            ...safeUser
        } = userResponse;

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
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

export const verifyEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid verification token",
            });
            return;
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Email verification failed",
        });
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
            return;
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET as string
        ) as { id: string };

        const user = await User.findById(decoded.id);

        if (
            !user ||
            user.refreshToken !== refreshToken
        ) {
            res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
            return;
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Refresh token expired or invalid",
        });
    }
};

export const logoutUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        const user = await User.findOne({
            refreshToken,
        });

        console.log("Before:", user?.refreshToken);

        if (user) {
            user.refreshToken = undefined;
            await user.save();
        }

        console.log("After:", user?.refreshToken);

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        user.resetPasswordToken = resetToken;

        user.resetPasswordExpire = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await user.save();

        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // await sendEmail({
        //     to: user.email,
        //     subject: "Password Reset Request",
        //     html: `
        //         <h3>Password Reset</h3>
        //         <p>Click below link to reset your password:</p>
        //         <a href="${resetUrl}">
        //             Reset Password
        //         </a>
        //         <p>Link expires in 10 minutes.</p>
        //     `,
        // });

        try {
    await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
            <h3>Password Reset</h3>
            <p>Click below link to reset your password:</p>
            <a href="${resetUrl}">
                Reset Password
            </a>
            <p>Link expires in 10 minutes.</p>
            `,
    });
} catch (emailError) {
    console.error("Password Reset Email Error:", emailError);
}

res.status(200).json({
    success: true,
    message: "Password reset email processed",
});

        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send reset email",
        });
    }
};

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
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