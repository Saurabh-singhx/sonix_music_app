import { body } from "express-validator";

export const checkLoginValidation = [

  body("email")
    .exists().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email address")
    .bail()
    .normalizeEmail(),


  body("password")
    .exists().withMessage("Password is required")
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .bail()
    .matches(/[A-Z]/).withMessage("Password must contain one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain one number")
    .matches(/[@$!%*?&]/).withMessage("Password must contain one special character"),

];