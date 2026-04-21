import { body, validationResult } from "express-validator";

const PLANT_NAMES = [
  "Monstera",
  "Efeutute",
  "Svärmorstunga",
  "Fredslilja",
  "Gummiträd",
  "Fiolbladsfikonträd",
  "Spindelplanta",
  "ZZ-växt",
  "Filodendron",
  "Pilea",

  "Aloe Vera",
  "Echeveria",
  "Jadeplanta",
  "Kaktus",
  "Haworthia",

  "Orkidé",
  "Afrikanskt Viol",
  "Kalanchoe",
  "Anthurium",
  "Begonia",

  "Murgröna",
  "Tradescantia",
  "Gullranka",
  "Hängande Ampellilja",
  "Passionsblomma",

  "Övrigt",
];

export const validatePlants = [
  body("name")
    .isIn(PLANT_NAMES)
    .withMessage("Please select a valid plant name from the list"),

  body("description")
    .optional()
    .trim(),

  body("imageUrl")
    .isURL()
    .withMessage("Valid image URL is required"),

  body("lightLevel")
    .isIn([1, 2, 3])
    .withMessage("Light level must be 1, 2 or 3"),

  body("location.address")
    .optional()
    .trim(),
];

export const validatePlantResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validatePlantUpdate = [
  body("name").optional().isIn(PLANT_NAMES),
  body("imageUrl").optional().isURL(),
  body("lightLevel").optional().isIn([1, 2, 3]),
  body("description").optional().trim(),
  body("location.address").optional().trim(),
];