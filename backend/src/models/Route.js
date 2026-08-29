import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    distance: {
      type: Number,
      required: true, // in meters or pixels
    },
    walkingTime: {
      type: Number,
      required: true, // in seconds
    },
    // Array of coordinate points [ [x1, y1], [x2, y2], ... ] for drawing the line on the map
    path: {
      type: Array,
      default: [],
    },
    // Detailed text or directional cues (e.g., "Walk straight down the corridor, take a left at the CAD lab")
    directions: {
      type: Array,
      default: [],
    },
    // Flag to handle multi-floor transitions if a route goes upstairs
    isCrossFloor: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Route", routeSchema);