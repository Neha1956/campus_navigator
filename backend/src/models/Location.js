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
      trim: true,
    },

    building: {
      type: String,
      default: null,
    },

    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },

    floor: {
      type: Number,
      default: 0,
    },

    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      default: null,
    },

    mapElementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MapElement",
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

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