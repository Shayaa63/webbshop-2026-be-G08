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
} from "../controllers/plantsController.js";

import { validatePlants, validatePlantResult, validatePlantUpdate } from "../middleware/plantsValidation.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const name = req.query.name;
    const lightLevel = req.query.lightLevel;
    const plants = await getPlants({ name, lightLevel });
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});
router.get("/mine", protect, getMyPlants);
router.get("/owner/:ownerId", protect, adminOnly, getPlantsByOwnerId);
router.get("/:id", getPlant);

router.post("/", protect, validatePlants, validatePlantResult, createNewPlant);

router.delete("/:id", protect, removePlant);

router.put("/:id", protect, validatePlantUpdate, updateExistingPlant);

router.delete("/admin/:id", protect, adminOnly, deletePlantAdmin);

export default router;