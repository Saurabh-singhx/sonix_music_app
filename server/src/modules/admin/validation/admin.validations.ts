import { body } from "express-validator";

export const addSongValidation = [
  body("song_title")
    .trim()
    .notEmpty().withMessage("song_title is required")
    .isLength({ min: 2, max: 150 }).withMessage("song_title length is invalid"),

  body("song_url")
    .notEmpty().withMessage("song_url is required")
    .isString().withMessage("song_url must be a string"),

  body("artist_id")
    .notEmpty().withMessage("artist_id is required")
    .isUUID().withMessage("artist_id must be a valid UUID"),

  body("duration")
    .notEmpty().withMessage("duration is required")
    .isInt({ min: 1 }).withMessage("duration must be a positive integer"),

  body("genre")
    .trim()
    .notEmpty().withMessage("genre is required")
    .isLength({ min: 2, max: 50 }).withMessage("genre is invalid"),

  body("release_date")
    .optional()
    .isISO8601().withMessage("release_date must be a valid date"),

  body("cover_image_url")
    .notEmpty().withMessage("cover_image_url is required")
    .isString().withMessage("cover_image_url must be a string"),

  body("tags")
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string" && value.trim().length > 0) return true;
      throw new Error("tags must be a string or array");
    }),

  body("mood")
    .trim()
    .notEmpty().withMessage("mood is required")
    .isLength({ max: 50 }).withMessage("mood is too long"),

  body("energy_level")
    .trim()
    .notEmpty().withMessage("energy_level is required")
    .isLength({ max: 50 }).withMessage("energy_level is too long"),

  body("language")
    .trim()
    .notEmpty().withMessage("language is required")
    .isLength({ max: 50 }).withMessage("language is too long"),
];
