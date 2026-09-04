import express from "express";

import {
  getCampusElements,
  getCampusElementById,
  createCampusElement,
  updateCampusElement,
  deleteCampusElement,
} from "../controllers/campusElementController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

/* GET ALL */
router.get(
  "/",
  getCampusElements
);

/* GET ONE */
router.get(
  "/:id",
  getCampusElementById
);

/* CREATE */
router.post(
  "/",
  verifyAdmin,
  createCampusElement
);

/* UPDATE */
router.put(
  "/:id",
  verifyAdmin,
  updateCampusElement
);

/* DELETE */
router.delete(
  "/:id",
  verifyAdmin,
  deleteCampusElement
);

export default router;