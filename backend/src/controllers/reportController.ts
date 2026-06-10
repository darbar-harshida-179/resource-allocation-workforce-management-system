// backend/src/controllers/reportController.ts

import { Request, Response } from "express";
import User, { UserRole } from "../models/User";
import Allocation from "../models/Allocation";
import Timesheet from "../models/Timesheet";
import Project from "../models/Project";
import Leave from "../models/Leave";

export const getUtilizationReport = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employees = await User.find({
            role: UserRole.EMPLOYEE,
        });

        const report = [];

        for (const employee of employees) {
            const allocations = await Allocation.find({
                employee: employee._id,
            });

            const totalAllocation =
                allocations.reduce(
                    (sum, allocation) =>
                        sum +
                        allocation.allocationPercentage,
                    0
                );

            const timesheets =
                await Timesheet.find({
                    employee: employee._id,
                    status: "approved",
                });

            const totalHours =
                timesheets.reduce(
                    (sum, sheet) =>
                        sum + sheet.hours,
                    0
                );

            const utilizationPercentage = Number(
                ((totalHours / 160) * 100).toFixed(2)
            );

            report.push({
                employeeId: employee._id,
                employeeName:
                    `${employee.firstName} ${employee.lastName}`,
                allocationPercentage:
                    totalAllocation,
                actualHours:
                    totalHours,
                utilizationPercentage,
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to generate utilization report",
        });
    }
};

export const getProjectReport = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects =
            await Project.find();

        const report = [];

        for (const project of projects) {

            const allocations =
                await Allocation.find({
                    project: project._id,
                });

            const timesheets =
                await Timesheet.find({
                    project: project._id,
                    status: "approved",
                });

            const totalHours =
                timesheets.reduce(
                    (sum, sheet) =>
                        sum + sheet.hours,
                    0
                );

            report.push({
                projectId: project._id,
                projectName:
                    project.projectName,
                allocatedResources:
                    allocations.length,
                totalHours,
                completionStatus:
                    project.status,
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to generate project report",
        });
    }
};

export const getLeaveReport = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const leaves =
            await Leave.find({
                status: "approved",
            }).populate(
                "employee",
                "department firstName lastName"
            );

        const summary: Record<string, number> = {};

        leaves.forEach((leave: any) => {

            const department =
                leave.employee?.department ||
                "Unassigned";

            summary[department] =
                (summary[department] || 0) + 1;
        });

        const report = Object.entries(summary).map(
            ([department, totalLeaves]) => ({
                department,
                totalLeaves,
            })
        );

        res.status(200).json({
            success: true,
            data: report,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to generate leave report",
        });
    }
};