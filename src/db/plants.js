import Plant from "../models/Plants.js";

export async function getPlants() {
  return await Plant.find();
}

export async function createPlant(plantData) {
  const plant = new Plant(plantData);
  await plant.save();
  return plant;
}

export async function getPlantById(plantId) {
  return await Plant.findById(plantId);
}

export async function updatePlant(plantId, updateData) {
  return await Plant.findByIdAndUpdate(plantId, updateData, {
    new: true,
    runValidators: true
  });
}

export async function deletePlant(plantId) {
  return await Plant.findByIdAndDelete(plantId);
}

export async function getPlantsByOwner(ownerId) {
  return await Plant.find({ owner: ownerId });
}