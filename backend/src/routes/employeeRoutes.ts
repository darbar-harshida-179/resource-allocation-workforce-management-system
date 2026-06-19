// backend/src/routes/employeeRoutes.ts

import { Router } from "express";
import { getAllEmployees, updateEmployee, searchEmployees, addSkillsToEmployee, assignDepartment, getAllManagers } from "../controllers/employeeController";
import { validateRequest } from "../middleware/validationMiddleware";

import {
    updateEmployeeValidation,
    skillsValidation,
    departmentValidation,
} from "../validators/employeeValidator";

const router = Router();

router.get("/", getAllEmployees);
router.get("/managers", getAllManagers);
router.get('/search', searchEmployees);
router.put("/:id", updateEmployeeValidation, validateRequest, updateEmployee);
router.put("/:id/skills", skillsValidation, validateRequest, addSkillsToEmployee);
router.put("/:id/department", departmentValidation, validateRequest, assignDepartment);

export default router;
