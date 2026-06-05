// backend/src/routes/employeeRoutes.ts

import { Router } from "express";
import { getAllEmployees, updateEmployee, searchEmployees, addSkillsToEmployee, assignDepartment } from "../controllers/employeeController";

const router = Router();

router.get("/", getAllEmployees);
router.get('/search', searchEmployees);
router.put('/:id', updateEmployee);
router.put('/:id/skills', addSkillsToEmployee);
router.put('/:id/department', assignDepartment);

export default router;