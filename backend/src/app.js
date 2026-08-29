import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import locationRoutes from "./routes/locationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(cors());
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

export default app;