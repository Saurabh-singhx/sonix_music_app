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


export const getUploadUrlValidator = [

  body("fileName")
    .notEmpty().withMessage("fileName is required")
    .isString().withMessage("fileName must be a string")
    .isLength({ max: 255 }).withMessage("fileName too long"),

  body("fileType")
    .notEmpty().withMessage("fileType is required")
    .isString().withMessage("fileType must be a string")
    .custom((value) => {
      if (!value.startsWith("audio/")) {
        throw new Error("Invalid file type");
      }
      return true;
    }),

  body("fileSize")
    .notEmpty().withMessage("fileSize is required")
    .isInt({ min: 1 }).withMessage("fileSize must be a positive number")
    .custom((value) => {
      if (value > 20 * 1024 * 1024) {
        throw new Error("File too large (max 20MB)");
      }
      return true;
    }),
];


export const addSongDetailsValidator = [
  body("song_title")
    .exists().withMessage("song_title is required")
    .isString().withMessage("song_title must be string")
    .trim()
    .notEmpty().withMessage("song_title cannot be empty"),

  body("song_url")
    .exists().withMessage("song_url is required")
    .isString().withMessage("song_url must be string")
    .isURL().withMessage("song_url must be a valid URL"),

  body("artist_id")
    .exists().withMessage("artist_id is required")
    .isString().withMessage("artist_id must be string")
    .notEmpty().withMessage("artist_id cannot be empty"),

  body("duration")
    .exists().withMessage("duration is required")
    .isInt({ min: 1 }).withMessage("duration must be a positive number"),

  body("genre")
    .exists().withMessage("genre is required")
    .isString().withMessage("genre must be string")
    .trim()
    .notEmpty(),

  body("release_date")
    .optional()
    .isISO8601().withMessage("release_date must be a valid date"),

  body("cover_image_url")
    .optional()
    .isString()
    .isURL().withMessage("cover_image_url must be valid URL"),

  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      throw new Error("tags must be array or comma-separated string");
    }),

  body("mood")
    .exists().withMessage("mood is required")
    .isString().withMessage("mood must be string"),

  body("energy_level")
    .exists().withMessage("energy_level is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("energy_level must be between 1 and 10"),

  body("language")
    .exists().withMessage("language is required")
    .isString().withMessage("language must be string"),
];

export const addSongDetailsWithAiValidator = [
  body("song_title")
    .exists().withMessage("song_title is required")
    .isString().withMessage("song_title must be string")
    .trim()
    .notEmpty().withMessage("song_title cannot be empty"),

  body("song_url")
    .exists().withMessage("song_url is required")
    .isString().withMessage("song_url must be string"),

  body("artist_id")
    .exists().withMessage("artist_id is required")
    .isString().withMessage("artist_id must be string")
    .notEmpty().withMessage("artist_id cannot be empty"),


  body("cover_image_url")
    .optional()
    .isString()
];


export const createArtistValidator = [
  body("artist_name")
    .exists().withMessage("artist_name is required")
    .isString().withMessage("artist_name must be string")
    .trim()
    .notEmpty().withMessage("artist_name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("artist_name must be 2–100 chars"),

  body("artist_bio")
    .exists().withMessage("artist_bio is required")
    .isString().withMessage("artist_bio must be string")
    .trim()
    .notEmpty().withMessage("artist_bio cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("artist_bio too long"),
];

export const getArtistImageUploadUrlValidator = [
  body("userId")
    .exists().withMessage("userId is required")
    .isString().withMessage("userId must be string")
    .notEmpty().withMessage("userId cannot be empty"),

  body("imageType")
    .exists().withMessage("imageType is required")
    .isString().withMessage("imageType must be string")
    .notEmpty().withMessage("imageType cannot be empty"),

  body("fileType")
    .exists().withMessage("fileType is required")
    .isString().withMessage("fileType must be string")
    .custom((value) => {
      if (!value.startsWith("image/")) {
        throw new Error("Invalid file type");
      }
      return true;
    }),

  body("fileSize")
    .exists().withMessage("fileSize is required")
    .isInt({ min: 1 }).withMessage("fileSize must be number")
    .custom((value) => {
      if (value > 20 * 1024 * 1024) {
        throw new Error("File too large (max 20MB)");
      }
      return true;
    }),
];

export const setImages3KeyValidator = [
  body("userId")
    .exists().withMessage("userId is required")
    .isString().withMessage("userId must be string")
    .notEmpty().withMessage("userId cannot be empty"),

  body("profilePic")
    .exists().withMessage("profilePic is required")
    .isString().withMessage("profilePic must be string")
    .notEmpty().withMessage("profilePic cannot be empty")
    .isLength({ max: 500 })
    .withMessage("profilePic too long"),
];

