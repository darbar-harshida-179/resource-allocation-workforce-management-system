// backend/src/controllers/employeeController.ts

import { Request, Response } from "express";
import User, { UserRole } from "../models/User";

export const getAllEmployees = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employees = await User.find({
            role: UserRole.EMPLOYEE,
        }).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch employees",
        });
    }
};

export const updateEmployee = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employee = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: employee,
            message: "Employee updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update employee",
        });
    }
};

export const searchEmployees = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const keyword = req.query.keyword as string;

        const employees = await User.find({
            role: UserRole.EMPLOYEE,
            $or: [
                {
                    firstName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ],
        }).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};

export const addSkillsToEmployee = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { skills } = req.body;

        const employee = await User.findByIdAndUpdate(
            req.params.id,
            {
                skills,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: employee,
            message: "Skills added successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add skills",
        });
    }
};

export const assignDepartment = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { department } = req.body;

        const employee = await User.findByIdAndUpdate(
            req.params.id,
            {
                department,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        if (!employee) {
            res.status(404).json({
                success: false,
                message: "Employee not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: employee,
            message: "Department assigned successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to assign department",
        });
    }
};

export const getAllManagers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const managers = await User.find({
            role: UserRole.MANAGER,
        }).select(
            "-password -refreshToken -verificationToken -resetPasswordToken"
        );

        res.status(200).json({
            success: true,
            count: managers.length,
            data: managers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch managers",
        });
    }
};
