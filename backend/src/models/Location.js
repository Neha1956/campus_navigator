import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true, // e.g., "outdoor", "classroom", "lab", "washroom", "corridor"
    },
    building: {
      type: String,
      default: "RCIT Building", // To separate RCIT building from other campus areas
    },
    floor: {
      type: Number,
      default: 0, // 0 for Ground Floor, 1 for 1st Floor, etc.
    },
    description: {
      type: String,
      default: "",
    },
    // Coordinates for rendering on map UI
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      default: "building",
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
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

const Location = mongoose.model("Location", locationSchema);

export default Location;