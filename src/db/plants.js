import Plant from "../models/Plants.js";

export async function getPlants(filters = {}) {
  const query = {};

  if (filters.name) query.name = filters.name;
  if (filters.lightLevel) query.lightLevel = Number(filters.lightLevel);

  return await Plant.find(query);
}

export async function createPlant(plantData) {
    try {
        const plant = new Plant(plantData);
        await plant.save();
        return plant;
    } catch (error) {
        console.error("Error adding plant:", error);
        throw error;
    }
}
export async function getPlantById(plantId) {
    try {        const plant = await Plant.findById(plantId);
        if (!plant) {
            throw new Error("Plant not found");
        }
        return plant;
    } catch (error) {
        console.error("Error fetching plant:", error);
        throw error;
    }
}
export async function updatePlant(plantId, updateData) {
    try {
        const plant = await Plant.findByIdAndUpdate(plantId, updateData, { new: true });
        if (!plant) {
            throw new Error("Plant not found");
        }
        return plant;
    } catch (error) {
        console.error("Error updating plant:", error);
        throw error;
    }
}
export async function deletePlant(plantId) {
    try {
        const plant = await Plant.findByIdAndDelete(plantId);
        if (!plant) {
            throw new Error("Plant not found");
        }
        return plant;
    } catch (error) {
        console.error("Error deleting plant:", error);
        throw error;
    }
}
export async function getPlantsByOwner(ownerId) {
    try {
        const plants = await Plant.find({ owner: ownerId });
        return plants;
    } catch (error) {
        console.error("Error fetching plants by owner:", error);
        throw error;
    }
}
