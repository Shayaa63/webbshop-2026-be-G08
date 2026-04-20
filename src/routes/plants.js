import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getAllPlants,
  getPlant,
  createNewPlant,
  removePlant,
  getMyPlants,
  getPlantsByOwnerId,
  updateExistingPlant,
  deletePlantAdmin
} from "../controllers/plantController.js";

import { validatePlants, validatePlantResult, validatePlantUpdate } from "../middleware/plantsValidation.js";

const router = Router();

router.get("/", getAllPlants);
router.get("/mine", protect, getMyPlants);
router.get("/owner/:ownerId", protect, adminOnly, getPlantsByOwnerId);
router.get("/:id", getPlant);

router.post("/", protect, validatePlants, validatePlantResult, createNewPlant);

router.delete("/:id", protect, removePlant);

router.put("/:id", protect, validatePlantUpdate, updateExistingPlant);

router.delete("/admin/:id", protect, adminOnly, deletePlantAdmin);

export default router;