import express from "express";
import {
  getFloorsByBuildingId,
  getFloorById,
  createFloor,
  updateFloor,
  deleteFloor,
  updateFloorLayout,
} from "../controllers/floorController.js";

const router = express.Router();

// Get all floors for a building
router.get("/building/:buildingId", getFloorsByBuildingId);

// Get single floor
router.get("/:id", getFloorById);

// Create floor
router.post("/", createFloor);

// Update floor
router.put("/:id", updateFloor);

// Update floor layout
router.patch("/:id/layout", updateFloorLayout);

// Delete floor
router.delete("/:id", deleteFloor);

export default router;
