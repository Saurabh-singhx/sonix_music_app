import { body } from "express-validator";

export const checkEmailValidation = [

  body("email")
    .exists().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email address")
    .bail()
    .normalizeEmail(),
];