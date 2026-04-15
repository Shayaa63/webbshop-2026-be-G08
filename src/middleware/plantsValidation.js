import { body, validationResult } from "express-validator";

export const validatePlants = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("description").optional().trim(),
  body("imageUrl").isURL().withMessage("Valid image URL is required"),
  body("lightLevel").isIn([1, 2, 3]).withMessage("Light level must be 1, 2 or 3"),
];

export const validatePlantResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
