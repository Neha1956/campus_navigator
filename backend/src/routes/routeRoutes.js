import express from "express";

import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRouteBetweenLocations,
} from "../controllers/routeController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Get all routes
router.get("/", getRoutes);

// IMPORTANT:
// This specific route MUST come before /:id taaki Express "between" ko ID na samajh le
router.get(
  "/between/:from/:to",
  getRouteBetweenLocations
);

// Get single route
router.get("/:id", getRouteById);

// Create route
router.post("/", verifyAdmin, createRoute);

// Update route
router.put("/:id", verifyAdmin, updateRoute);

// Delete route
router.delete("/:id", verifyAdmin, deleteRoute);

export default router;