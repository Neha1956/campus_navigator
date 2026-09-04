import express from "express";
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all buildings
router.get("/", getAllBuildings);

// Get single building
router.get("/:id", getBuildingById);

// Create building
router.post("/", verifyAdmin, createBuilding);

// Update building
router.put("/:id", verifyAdmin, updateBuilding);

// Delete building
router.delete("/:id", verifyAdmin, deleteBuilding);

export default router;
