import express from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
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
  upload.single("image"),
  updateLocation
);

router.delete(
  "/:id",
  deleteLocation
);

export default router;