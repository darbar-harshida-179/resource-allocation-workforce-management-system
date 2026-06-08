// backend/src/controllers/leaveController.ts

import { Request, Response } from "express";
import Leave from "../models/Leave";

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
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
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
            message: "Failed to approve leave",
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