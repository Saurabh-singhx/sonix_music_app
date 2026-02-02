import { body, param } from "express-validator";

export const createPlaylistValidator = [
  body("name")
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

