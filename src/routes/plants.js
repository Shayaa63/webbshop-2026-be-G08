import { Router } from "express";
import { 
  getPlants, 
  getPlantById, 
  createPlant 
} from "../db/plants.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const plants = await getPlants()
        res.json(plants)
        } catch (error) {
            console.error("Error fetching plants:", error)
            res.status(500).json({ error: "Failed to fetch plants" })
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
        console.error("Error fetching plant:", error);
        res.status(500).json({ error: "Failed to fetch plant" });
    }
});

router.post('/', async (req, res) => {
    try {
        const newPlant = await createPlant(req.body)
        res.status(201).json(newPlant)
    } catch (error) {
        console.error("Error creating plant:", error)
        res.status(500).json({ error: "Failed to create plant" }) 
    }
});


export default router;