import { Router } from "express";
import { 
  getPlants, 
  getPlantById, 
  createPlant,
  deletePlant,
  getPlantsByOwner,
  updatePlant
} from "../db/plants.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const plants = await getPlants();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const plants = await getPlantsByOwner(req.user.userId);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your plants" });
  }
});

router.get('/owner/:ownerId', protect, adminOnly, async (req, res) => {
  try {
    const plants = await getPlantsByOwner(req.params.ownerId);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plants by owner" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
});

router.post('/', protect, async (req, res) => {
  console.log("REQ USER IN POST:", req.user);
  try {
    const newPlant = await createPlant({
      ...req.body,
      owner: req.user.userId
    });

    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ error: "Failed to create plant" });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    if (
      plant.owner.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await deletePlant(req.params.id);

    res.json({ message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete plant" });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    if (
      plant.owner.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updatedPlant = await updatePlant(req.params.id, req.body);

    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ error: "Failed to update plant" });
  }
});


router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  await deletePlant(req.params.id);
  res.json({ message: "Deleted by admin" });
});

export default router;