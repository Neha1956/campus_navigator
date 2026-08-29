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
  upload.fields([
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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateLocation
);

router.delete(
  "/:id",
  deleteLocation
);

export default router;