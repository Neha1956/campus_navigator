
import express from "express";

import {
  getRoads,
  getRoadById,
  createRoad,
  updateRoad,
  deleteRoad,
} from "../controllers/roadController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

/*
  GET    /api/roads
  GET    /api/roads/:id
  POST   /api/roads
  PUT    /api/roads/:id
  DELETE /api/roads/:id
*/

router.get("/", getRoads);

router.get("/:id", getRoadById);

router.post("/", verifyAdmin, createRoad);

router.put("/:id", verifyAdmin, updateRoad);

router.delete("/:id", verifyAdmin, deleteRoad);

export default router;

