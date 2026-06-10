// backend/src/controllers/dashboardController.ts

import { Request, Response } from "express";
import User, { UserRole } from "../models/User";
import Project, { ProjectStatus } from "../models/Project";
import Allocation from "../models/Allocation";
import Leave from "../models/Leave";
import Timesheet from "../models/Timesheet";
import LeaveBalance from "../models/LeaveBalance";

export const getAdminDashboard = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const totalEmployees = await User.countDocuments({
            role: UserRole.EMPLOYEE,
        });

        const activeProjects = await Project.countDocuments({
            status: ProjectStatus.IN_PROGRESS,
        });

        const resourcesAllocated =
            await Allocation.countDocuments();

        const employeesOnLeave =
            await Leave.countDocuments({
                status: "approved",
            });

        res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                activeProjects,
                resourcesAllocated,
                employeesOnLeave,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard",
        });
    }
};

export const getManagerDashboard = async (
    req: any,
    res: Response
): Promise<void> => {
    try {

        const managerId = req.user.id;

        const myProjects =
            await Project.countDocuments({
                manager: managerId,
            });

        const projects =
            await Project.find({
                manager: managerId,
            });

        const projectIds =
            projects.map(
                (project) => project._id
            );

        const assignedResources =
            await Allocation.countDocuments({
                project: {
                    $in: projectIds,
                },
            });

        const pendingTimesheets =
            await Timesheet.countDocuments({
                status: "pending",
            });

        const pendingLeaveRequests =
            await Leave.countDocuments({
                status: "pending",
            });

        res.status(200).json({
            success: true,
            data: {
                myProjects,
                assignedResources,
                pendingTimesheets,
                pendingLeaveRequests,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to load manager dashboard",
        });

    }
};

export const getEmployeeDashboard = async (
    req: any,
    res: Response
): Promise<void> => {
    try {

        const employeeId = req.user.id;

        const currentProjects =
            await Allocation.countDocuments({
                employee: employeeId,
            });

        const todaysTasks = await Allocation.find({
            employee: employeeId,
        })
            .populate("project", "projectName status")
            .select("allocationPercentage startDate endDate");

        const monthlyHours =
            await Timesheet.aggregate([
                {
                    $match: {
                        employee: employeeId,
                        status: "approved",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalHours: {
                            $sum: "$hours",
                        },
                    },
                },
            ]);

        const totalHours =
            monthlyHours.length > 0
                ? monthlyHours[0].totalHours
                : 0;

        const leaveBalance =
            await LeaveBalance.findOne({
                employee: employeeId,
            });

        res.status(200).json({
            success: true,
            data: {
                currentProjects,
                todaysTasks,
                leaveBalance,
                monthlyHours: totalHours,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                "Failed to load employee dashboard",
        });

    }
};