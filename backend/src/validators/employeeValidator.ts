// backend/src/validatiors/employeeValidator.ts

import { body } from "express-validator";

export const updateEmployeeValidation = [
  body("firstName")
    .optional()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("lastName")
    .optional()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required"),

  body("department")
    .optional()
    .notEmpty()
    .withMessage("Department cannot be empty"),
];

export const skillsValidation = [
  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),
];

export const departmentValidation = [
  body("department")
    .notEmpty()
    .withMessage("Department is required"),
];