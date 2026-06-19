// backend/src/services/employeeService.ts

import User, { UserRole } from "../models/User";

export const getEmployees = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const employees = await User.find({
    role: UserRole.EMPLOYEE,
  })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({
    role: UserRole.EMPLOYEE,
  });

  return {
    employees,
    total,
  };
};