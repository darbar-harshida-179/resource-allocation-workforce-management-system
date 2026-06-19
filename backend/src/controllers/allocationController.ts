// backend/src/controllers/allocationController.ts

import { Request, Response } from "express";
import Allocation from "../models/Allocation";
import AllocationHistory from "../models/AllocationHistory";
import Leave from "../models/Leave";

export const createAllocation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            employee,
            allocationPercentage,
            startDate,
            endDate,
        } = req.body;

        const existingAllocations =
            await Allocation.find({ employee });

        const totalAllocation =
            existingAllocations.reduce(
                (sum, allocation) =>
                    sum + allocation.allocationPercentage,
                0
            );

        if (
            totalAllocation + allocationPercentage >
            100
        ) {
            res.status(400).json({
                success: false,
                message: "Allocation exceeds 100%",
            });
            return;
        }

        if (
            new Date(endDate).getTime() <=
            new Date(startDate).getTime()
        ) {
            res.status(400).json({
                success: false,
                message:
                    "End date must be after start date",
            });
            return;
        }

        const approvedLeave = await Leave.findOne({
            employee,
            status: "approved",
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
        });

        if (approvedLeave) {
            res.status(400).json({
                success: false,
                message:
                    "Employee is on approved leave and cannot be allocated",
            });
            return;
        }
        const allocation =
            await Allocation.create(req.body);

        await AllocationHistory.create({
            employee: allocation.employee,
            project: allocation.project,
            allocationPercentage:
                allocation.allocationPercentage,
            action: "created",
        });

        res.status(201).json({
            success: true,
            data: allocation,
        });
    } catch (error: any) {
        console.error("Allocation Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllocations = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const total =
            await Allocation.countDocuments();

        const allocations =
            await Allocation.find()
                .populate(
                    "employee",
                    "firstName lastName email role"
                )
                .populate(
                    "project",
                    "projectName status"
                )
                .skip(skip)
                .limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages:
                Math.ceil(total / limit),
            data: allocations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch allocations",
        });
    }
};

export const updateAllocation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const existingAllocation =
            await Allocation.findById(req.params.id);

        if (!existingAllocation) {
            res.status(404).json({
                success: false,
                message: "Allocation not found",
            });
            return;
        }

        const otherAllocations =
            await Allocation.find({
                employee: existingAllocation.employee,
                _id: { $ne: req.params.id },
            });

        const totalAllocation =
            otherAllocations.reduce(
                (sum, allocation) =>
                    sum + allocation.allocationPercentage,
                0
            );

        const newAllocationPercentage =
            req.body.allocationPercentage ??
            existingAllocation.allocationPercentage;

        if (
            totalAllocation +
            newAllocationPercentage >
            100
        ) {
            res.status(400).json({
                success: false,
                message: "Allocation exceeds 100%",
            });
            return;
        }

        const startDate =
            req.body.startDate ||
            existingAllocation.startDate;

        const endDate =
            req.body.endDate ||
            existingAllocation.endDate;

        if (
            new Date(endDate) <
            new Date(startDate)
        ) {
            res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date",
            });
            return;
        }

        const allocation =
            await Allocation.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!allocation) {
            res.status(404).json({
                success: false,
                message: "Allocation not found",
            });
            return;
        }

        await AllocationHistory.create({
            employee: allocation.employee,
            project: allocation.project,
            allocationPercentage:
                allocation.allocationPercentage,
            action: "updated",
        });

        res.status(200).json({
            success: true,
            data: allocation,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update allocation",
        });
    }
};

export const deleteAllocation = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const allocation =
            await Allocation.findByIdAndDelete(
                req.params.id
            );

        if (!allocation) {
            res.status(404).json({
                success: false,
                message: "Allocation not found",
            });
            return;
        }

        await AllocationHistory.create({
            employee: allocation.employee,
            project: allocation.project,
            allocationPercentage:
                allocation.allocationPercentage,
            action: "deleted",
        });

        res.status(200).json({
            success: true,
            message:
                "Allocation deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete allocation",
        });
    }
};

export const getAllocationHistory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const history = await AllocationHistory.find()
            .populate(
                "employee",
                "firstName lastName email"
            )
            .populate(
                "project",
                "projectName"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch allocation history",
        });
    }
};