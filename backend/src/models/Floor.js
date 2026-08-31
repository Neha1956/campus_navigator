import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floorNumber: {
      type: Number,
      required: true, // 0 = Ground, 1 = 1st, 2 = 2nd, etc.
    },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true,
    },
    // 2D floor plan dimensions
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    // Floor height in 3D space (Y coordinate)
    heightZ: {
      type: Number,
      required: true,
    },
    // Map elements (rooms, walls, doors, stairs, etc.)
    mapElements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MapElement",
      },
    ],
    // Background color
    backgroundColor: {
      type: String,
      default: "#F8FAFC",
    },
    image: {
      type: String,
      default: "", // SVG or image of floor plan
    },
    // Floor plan SVG or layout data
    layoutData: {
      type: Object,
      default: {},
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

// Ensure unique floor numbers per building
floorSchema.index({ buildingId: 1, floorNumber: 1 }, { unique: true });

export default mongoose.model("Floor", floorSchema);
