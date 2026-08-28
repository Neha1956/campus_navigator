import express from "express";

import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRouteBetweenLocations,
} from "../controllers/routeController.js";

const router = express.Router();

// Get all routes
router.get("/", getRoutes);

// IMPORTANT:
// This route MUST come before /:id
router.get(
  "/between/:from/:to",
  getRouteBetweenLocations
);

// Get single route
router.get("/:id", getRouteById);

// Create route
router.post("/", createRoute);

// Update route
router.put("/:id", updateRoute);

// Delete route
router.delete("/:id", deleteRoute);

export default router;