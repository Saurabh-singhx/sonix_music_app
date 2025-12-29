import { body } from "express-validator";

export const checkSignupValidation = [

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


  body("dob")
    .exists().withMessage("Date of birth is required")
    .bail()
    .isISO8601().withMessage("DOB must be in YYYY-MM-DD format")
    .bail()
    .custom(value => {
      const dob = new Date(value);
      const today = new Date();

      if (dob > today) {
        throw new Error("DOB cannot be in the future");
      }

      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        throw new Error("You must be at least 18 years old");
      }

      return true;
    }),

    body("otp")
    .exists({ checkFalsy: true }).withMessage("OTP is required")
    .bail()
    .isString().withMessage("OTP must be a string")
    .bail()
    .matches(/^\d{6}$/).withMessage("OTP must be exactly 6 digits")
];
