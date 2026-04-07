import { body, validationResult } from "express-validator";

export const validateTrades = [
  body("offeredPlant").isMongoId().withMessage("Valid offered plant ID is required"),
  body("requestedPlant").isMongoId().withMessage("Valid requested plant ID is required"),
];

export const validateTradeResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};