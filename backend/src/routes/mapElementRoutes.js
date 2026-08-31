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

const router = express.Router();

// Get all map elements for a floor
router.get("/floor/:floorId", getMapElementsByFloorId);

// Get single map element
router.get("/:id", getMapElementById);

// Create map element
router.post("/", createMapElement);

// Update map element
router.put("/:id", updateMapElement);

// Update element position (for drag-drop)
router.patch("/:id/position", updateElementPosition);

// Update element dimensions (for resize)
router.patch("/:id/dimensions", updateElementDimensions);

// Add connection to another element
router.post("/:id/connect", addElementConnection);

// Batch update elements
router.patch("/batch/update", batchUpdateElements);

// Delete map element
router.delete("/:id", deleteMapElement);

export default router;
