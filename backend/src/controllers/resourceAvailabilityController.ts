// backend/src/controllers/resourceAvailabilityController.ts

import { Request, Response } from "express";
import User, { UserRole } from "../models/User";
import Allocation from "../models/Allocation";
import Leave from "../models/Leave";

export const getResourceAvailability = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const employees = await User.find({
            role: UserRole.EMPLOYEE,
            isActive: true,
        });

        const availableResources = [];
        const partiallyAllocatedResources = [];
        const fullyAllocatedResources = [];

        for (const employee of employees) {

            const currentDate = new Date();

            const allocations =
                await Allocation.find({
                    employee: employee._id,
                    startDate: { $lte: currentDate },
                    endDate: { $gte: currentDate },
                });

            const totalAllocation =
                allocations.reduce(
                    (sum, allocation) =>
                        sum +
                        allocation.allocationPercentage,
                    0
                );

            const employeeData = {
                employeeId: employee._id,
                name: `${employee.firstName} ${employee.lastName}`,
                utilization: totalAllocation,
                available:
                    100 - totalAllocation,
            };

            if (totalAllocation === 0) {
                availableResources.push(
                    employeeData
                );
            } else if (
                totalAllocation < 100
            ) {
                partiallyAllocatedResources.push(
                    employeeData
                );
            } else {
                fullyAllocatedResources.push(
                    employeeData
                );
            }
        }
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const employeesOnLeave =
            await Leave.find({
                status: "approved",
                startDate: { $lte: today },
                endDate: { $gte: today },
            }).populate(
                "employee",
                "firstName lastName email"
            );

        res.status(200).json({
            success: true,
            availableResources,
            partiallyAllocatedResources,
            fullyAllocatedResources,
            employeesOnLeave,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch resource availability",
        });
    }
};