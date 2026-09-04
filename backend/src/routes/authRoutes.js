import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/verify-admin", verifyAdmin, (req, res) => {
  res.status(200).json({ valid: true, message: "Admin authenticated successfully." });
});

export default router;