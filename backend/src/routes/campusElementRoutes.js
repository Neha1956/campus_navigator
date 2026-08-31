import express from "express";

import {
  getCampusElements,
  getCampusElementById,
  createCampusElement,
  updateCampusElement,
  deleteCampusElement,
} from "../controllers/campusElementController.js";

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
  createCampusElement
);

/* UPDATE */
router.put(
  "/:id",
  updateCampusElement
);

/* DELETE */
router.delete(
  "/:id",
  deleteCampusElement
);

export default router;