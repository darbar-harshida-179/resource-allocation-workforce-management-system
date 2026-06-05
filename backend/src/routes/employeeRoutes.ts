// backend/src/routes/employeeRoutes.ts

import { Router } from "express";
import { getAllEmployees, updateEmployee, searchEmployees } from "../controllers/employeeController";

const router = Router();

router.get("/", getAllEmployees);
router.get('/search', searchEmployees);
router.put('/:id', updateEmployee);

export default router;