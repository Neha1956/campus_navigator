import express from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
 verifyAdmin, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createLocation
);

router.get(
  "/",
  getLocations
);

router.get(
  "/:id",
  getLocationById
);

router.put(
  "/:id",
  verifyAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateLocation
);

router.delete(
  "/:id",
  verifyAdmin,
  deleteLocation
);

export default router;