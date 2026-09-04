import express from "express";
import {
  getFloorsByBuildingId,
  getFloorById,
  createFloor,
  updateFloor,
  deleteFloor,
  updateFloorLayout,
} from "../controllers/floorController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Get all floors for a building
router.get("/building/:buildingId", getFloorsByBuildingId);

// Get single floor
router.get("/:id", getFloorById);

// Create floor
router.post("/", verifyAdmin, createFloor);

// Update floor
router.put("/:id", verifyAdmin, updateFloor);

// Update floor layout
router.patch("/:id/layout", verifyAdmin, updateFloorLayout);

// Delete floor
router.delete("/:id", verifyAdmin, deleteFloor);

export default router;
