// backend/src/controllers/leaveController.ts

import { Request, Response } from "express";
import Leave from "../models/Leave";
import LeaveBalance from "../models/LeaveBalance";
import Allocation from "../models/Allocation";

export const applyLeave = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leave = await Leave.create(req.body);

        res.status(201).json({
            success: true,
            data: leave,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to apply leave",
        });
    }
};

export const getLeaves = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leaves = await Leave.find()
            .populate(
                "employee",
                "firstName lastName email role"
            );

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaves",
        });
    }
};

export const approveLeave = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const leave = await Leave.findById(
            req.params.id
        );

        if (!leave) {
            res.status(404).json({
                success: false,
                message: "Leave not found",
            });
            return;
        }

        if (leave.status !== "pending") {
            res.status(400).json({
                success: false,
                message:
                    "Leave already processed",
            });
            return;
        }

        const criticalAllocation =
            await Allocation.findOne({
                employee: leave.employee,
                allocationPercentage: { $gte: 80 },
            });

        if (criticalAllocation) {
            res.status(400).json({
                success: false,
                message:
                    "Cannot approve leave. Employee is critically allocated to a project.",
            });
            return;
        }

        const leaveBalance =
            await LeaveBalance.findOne({
                employee: leave.employee,
            });

        if (!leaveBalance) {
            res.status(404).json({
                success: false,
                message:
                    "Leave balance not found",
            });
            return;
        }

        const startDate = new Date(
            leave.startDate
        );

        const endDate = new Date(
            leave.endDate
        );

        const leaveDays =
            Math.ceil(
                (
                    endDate.getTime() -
                    startDate.getTime()
                ) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        let availableBalance = 0;

        switch (leave.leaveType) {
            case "casual":
                availableBalance =
                    leaveBalance.casual;
                break;

            case "sick":
                availableBalance =
                    leaveBalance.sick;
                break;

            case "earned":
                availableBalance =
                    leaveBalance.earned;
                break;
        }

        if (
            availableBalance < leaveDays
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Insufficient leave balance",
            });
            return;
        }

        switch (leave.leaveType) {
            case "casual":
                leaveBalance.casual -=
                    leaveDays;
                break;

            case "sick":
                leaveBalance.sick -=
                    leaveDays;
                break;

            case "earned":
                leaveBalance.earned -=
                    leaveDays;
                break;
        }

        await leaveBalance.save();

        leave.status = "approved";

        await leave.save();

        res.status(200).json({
            success: true,
            message:
                "Leave approved successfully",
            leave,
            leaveBalance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to approve leave",
        });
    }
};

export const rejectLeave = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            {
                new: true,
            }
        );

        if (!leave) {
            res.status(404).json({
                success: false,
                message: "Leave not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: leave,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reject leave",
        });
    }
};

export const getLeaveCalendar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leaves = await Leave.find({
            status: "approved",
        }).populate(
            "employee",
            "firstName lastName email"
        );

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch leave calendar",
        });
    }
};

export const getMyLeaves = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const leaves = await Leave.find({
            employee: (req as any).user.id,
        });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaves",
        });
    }
};