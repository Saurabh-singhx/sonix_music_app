import { body, param } from "express-validator";

export const createPlaylistValidator = [
  body("playlistName")
    .exists().withMessage("name is required")
    .isString().withMessage("name must be string")
    .trim()
    .notEmpty().withMessage("name cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("name must be 1–100 chars"),

  body("description")
    .exists().withMessage("description is required")
    .isString().withMessage("description must be string")
    .trim()
    .notEmpty().withMessage("description cannot be empty")
    .isLength({ max: 500 })
    .withMessage("description too long"),

  body("isPublic")
    .exists().withMessage("isPublic is required")
    .isBoolean().withMessage("isPublic must be boolean"),
];

export const getPlaylistsSongsValidator = [
  param("playlistId")
    .exists().withMessage("playlistId is required")
    .isString().withMessage("playlistId must be string")
    .notEmpty().withMessage("playlistId cannot be empty"),
];


export const validateSongEvent = [
  body("songId")
    .exists().withMessage("songId is required")
    .bail()
    .isUUID().withMessage("songId must be a valid UUID"),

  body("duration")
    .exists().withMessage("duration is required")
    .bail()
    .isFloat({ min: 0, max: 100 })
    .withMessage("duration must be a number between 0 and 100"),
];


