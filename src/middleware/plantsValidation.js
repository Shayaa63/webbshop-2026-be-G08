import { body, validationResult } from "express-validator";

export const validatePlants = [
  body("name").notEmpty().trim().withMessage("Name is required"),
  body("species").notEmpty().trim().withMessage("Species is required"),  
  body("description").optional().trim(),
  body("imageUrl").isURL().withMessage("Valid image URL is required"),
  body("lightLevel").isIn([1, 2, 3]).withMessage("Light level must be 1, 2 or 3"),
  body("location.coordinates.lat").isFloat({ min: -90, max: 90 }).withMessage("Valid latitude is required"),
  body("location.coordinates.lng").isFloat({ min: -180, max: 180 }).withMessage("Valid longitude is required"),
];

export const validatePlantResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
