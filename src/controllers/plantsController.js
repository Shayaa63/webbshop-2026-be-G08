import {
  getPlants,
  getPlantById,
  createPlant,
  deletePlant,
  getPlantsByOwner,
  updatePlant
} from "../db/plants.js";

import { validationResult } from "express-validator";

//
// GET ALL PLANTS
//
export const getAllPlants = async (req, res) => {
  try {
    const { name, lightLevel } = req.query;
    const plants = await getPlants({ name, lightLevel });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plants" });
  }
};

//
// GET SINGLE PLANT
//
export const getPlant = async (req, res) => {
  try {
    const plant = await getPlantById(req.params.id);

    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }

    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
};

//
// GET MY PLANTS
//
export const getMyPlants = async (req, res) => {
  try {
    const plants = await getPlantsByOwner(req.user.userId);
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your plants" });
  }
};

//
// GET BY OWNER (ADMIN)
//

export const getPlantsByOwnerId = async (req, res) => {
  try {
    const plants = await getPlantsByOwner(req.params.ownerId);    
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants by owner:", error);
    res.status(500).json({ error: "Failed to fetch plants by owner" });
  }
};

//
// CREATE PLANT
//
export const createNewPlant = async (req, res) => {
  try {
    const newPlant = await createPlant({
      ...req.body,
      owner: req.user.userId,
    });

    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ error: "Failed to create plant" });
  }
};

//
// DELETE PLANT (user + admin check)
//
export const removePlant = async (req, res) => {
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
};

//
// UPDATE PLANT
//
export const updateExistingPlant = async (req, res) => {
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

    const updated = await updatePlant(req.params.id, req.body);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update plant" });
  }
};

//
// ADMIN DELETE
//
export const deletePlantAdmin = async (req, res) => {
  try {
    await deletePlant(req.params.id);
    res.json({ message: "Deleted by admin" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete plant" });
  }
};