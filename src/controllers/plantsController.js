import {
  getPlants,
  getPlantById,
  createPlant,
  deletePlant,
  getPlantsByOwner,
  updatePlant
} from "../db/plants.js";

export const getAllPlants = async (req, res) => {
  try {
    const { name, lightLevel } = req.query;
    const plants = await getPlants({ name, lightLevel });
    res.json(plants);
  } catch {
    res.status(500).json({ error: "Failed to fetch plants" });
  }
};