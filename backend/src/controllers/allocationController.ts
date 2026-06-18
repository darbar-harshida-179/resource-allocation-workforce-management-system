// backend/src/controllers/allocationController.ts

import { Request, Response } from "express";
import Allocation from "../models/Allocation";
import AllocationHistory from "../models/AllocationHistory";

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
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create allocation",
        });
    }
};

export const getAllocations = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const allocations =
            await Allocation.find()
                .populate(
                    "employee",
                    "firstName lastName email role"
                )
                .populate(
                    "project",
                    "projectName status"
                );

        res.status(200).json({
            success: true,
            count: allocations.length,
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

        const startDate =
            req.body.startDate ||
            allocation.startDate;

        const endDate =
            req.body.endDate ||
            allocation.endDate;

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