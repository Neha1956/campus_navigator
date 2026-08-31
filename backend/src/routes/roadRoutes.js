
import express from "express";

import {
  getRoads,
  getRoadById,
  createRoad,
  updateRoad,
  deleteRoad,
} from "../controllers/roadController.js";

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

router.post("/", createRoad);

router.put("/:id", updateRoad);

router.delete("/:id", deleteRoad);

export default router;

