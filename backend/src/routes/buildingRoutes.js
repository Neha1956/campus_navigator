import express from "express";
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingController.js";

const router = express.Router();

// Get all buildings
router.get("/", getAllBuildings);

// Get single building
router.get("/:id", getBuildingById);

// Create building
router.post("/", createBuilding);

// Update building
router.put("/:id", updateBuilding);

// Delete building
router.delete("/:id", deleteBuilding);

export default router;
