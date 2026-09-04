import express from "express";
import {
  getMapElementsByFloorId,
  getMapElementById,
  createMapElement,
  updateMapElement,
  updateElementPosition,
  updateElementDimensions,
  addElementConnection,
  deleteMapElement,
  batchUpdateElements,
} from "../controllers/mapElementController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Get all map elements for a floor
router.get("/floor/:floorId", getMapElementsByFloorId);

// Get single map element
router.get("/:id", getMapElementById);

// Create map element
router.post("/", verifyAdmin, createMapElement);

// Update map element
router.put("/:id", verifyAdmin, updateMapElement);

// Update element position (for drag-drop)
router.patch("/:id/position", verifyAdmin, updateElementPosition);

// Update element dimensions (for resize)
router.patch("/:id/dimensions", verifyAdmin, updateElementDimensions);

// Add connection to another element
router.post("/:id/connect", verifyAdmin, addElementConnection);

// Batch update elements
router.patch("/batch/update", verifyAdmin, batchUpdateElements);

// Delete map element
router.delete("/:id", verifyAdmin, deleteMapElement);

export default router;
