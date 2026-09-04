import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import locationRoutes from "./routes/locationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import floorRoutes from "./routes/floorRoutes.js";
import mapElementRoutes from "./routes/mapElementRoutes.js";
import roadRoutes from "./routes/roadRoutes.js";
import campusElementRoutes from "./routes/campusElementRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  if (error && error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }

  return next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Navigator API is running",
  });
});

app.use("/api/locations", locationRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/floors", floorRoutes);
app.use("/api/map-elements", mapElementRoutes);
app.use("/api/roads", roadRoutes);
app.use(
  "/api/campus-elements",
  campusElementRoutes
);
app.use("/api/auth", authRoutes);
export default app;