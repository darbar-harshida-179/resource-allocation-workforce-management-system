// backend/src/controllers/timesheetController.ts

import { Request, Response } from "express";
import Timesheet from "../models/Timesheet";

export const submitTimesheet = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            employee,
            project,
            date,
            hours,
        } = req.body;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingTimesheets =
            await Timesheet.find({
                employee,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            });

        const totalHours =
            existingTimesheets.reduce(
                (sum, entry) =>
                    sum + entry.hours,
                0
            );

        if (
            totalHours + hours >
            24
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Total hours cannot exceed 24 per day",
            });
            return;
        }

        const timesheet =
            await Timesheet.create({
                employee,
                project,
                date,
                hours,
            });

        res.status(201).json({
            success: true,
            data: timesheet,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to submit timesheet",
        });
    }
};

export const getTimesheets = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const timesheets =
            await Timesheet.find()
                .populate(
                    "employee",
                    "firstName lastName email"
                )
                .populate(
                    "project",
                    "projectName"
                );

        res.status(200).json({
            success: true,
            count: timesheets.length,
            data: timesheets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch timesheets",
        });
    }
};

export const getMyTimesheets = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const timesheets =
            await Timesheet.find({
                employee: (req as any).user.id,
            }).populate(
                "project",
                "projectName"
            );

        res.status(200).json({
            success: true,
            count: timesheets.length,
            data: timesheets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch timesheets",
        });
    }
};

export const approveTimesheet = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const timesheet =
            await Timesheet.findByIdAndUpdate(
                req.params.id,
                { status: "approved" },
                { new: true }
            );

        if (!timesheet) {
            res.status(404).json({
                success: false,
                message:
                    "Timesheet not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: timesheet,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to approve timesheet",
        });
    }
};

export const rejectTimesheet = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const timesheet =
            await Timesheet.findByIdAndUpdate(
                req.params.id,
                { status: "rejected" },
                { new: true }
            );

        if (!timesheet) {
            res.status(404).json({
                success: false,
                message:
                    "Timesheet not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: timesheet,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to reject timesheet",
        });
    }
};

export const getWeeklyTimesheetSummary = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employeeId =
            (req as any).user.id;

        const sevenDaysAgo =
            new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        const timesheets =
            await Timesheet.find({
                employee: employeeId,
                date: {
                    $gte: sevenDaysAgo,
                },
            });

        const totalHours =
            timesheets.reduce(
                (sum, item) =>
                    sum + item.hours,
                0
            );

        res.status(200).json({
            success: true,
            totalEntries:
                timesheets.length,
            totalHours,
            data: timesheets,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch weekly summary",
        });
    }
};

export const getMonthlyTimesheetSummary =
    async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const employeeId =
                (req as any).user.id;

            const thirtyDaysAgo =
                new Date();

            thirtyDaysAgo.setDate(
                thirtyDaysAgo.getDate() - 30
            );

            const timesheets =
                await Timesheet.find({
                    employee: employeeId,
                    date: {
                        $gte:
                            thirtyDaysAgo,
                    },
                });

            const totalHours =
                timesheets.reduce(
                    (sum, item) =>
                        sum + item.hours,
                    0
                );

            res.status(200).json({
                success: true,
                totalEntries:
                    timesheets.length,
                totalHours,
                data: timesheets,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch monthly summary",
            });
        }
    };