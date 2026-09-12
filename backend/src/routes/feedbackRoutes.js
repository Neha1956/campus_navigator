import express from "express";
import { submitFeedback, getAllFeedbacks, deleteFeedback } from "../controllers/feedbackController.js";
 import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/",  getAllFeedbacks); // Add admin middleware if required: router.get("/", verifyAdmin, getAllFeedbacks);
router.delete("/:id", verifyAdmin, deleteFeedback); // Add admin middleware if required: router.delete("/:id", verifyAdmin, deleteFeedback);

export default router;