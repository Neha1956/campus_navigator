import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import locationRoutes from "./routes/locationRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Navigator API is running",
  });
});

app.use("/api/locations", locationRoutes);
app.use("/api/routes", routeRoutes);

export default app;