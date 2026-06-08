// backend/src/controllers/leaveBalanceController.ts

import { Request, Response } from "express";
import LeaveBalance from "../models/LeaveBalance";

export const createLeaveBalance = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { employee } = req.body;

        const existingBalance =
            await LeaveBalance.findOne({
                employee,
            });

        if (existingBalance) {
            res.status(400).json({
                success: false,
                message:
                    "Leave balance already exists",
            });
            return;
        }

        const leaveBalance =
            await LeaveBalance.create({
                employee,
            });

        res.status(201).json({
            success: true,
            data: leaveBalance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to create leave balance",
        });
    }
};

export const getLeaveBalance = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leaveBalance =
            await LeaveBalance.findOne({
                employee: req.params.employeeId,
            }).populate(
                "employee",
                "firstName lastName email"
            );

        if (!leaveBalance) {
            res.status(404).json({
                success: false,
                message:
                    "Leave balance not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: leaveBalance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch leave balance",
        });
    }
};