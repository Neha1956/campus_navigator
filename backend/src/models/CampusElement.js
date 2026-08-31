import mongoose from "mongoose";

const campusElementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "parking",
        "ground",
        "park",
        "small-room",
      ],
      default: "parking",
    },

    description: {
      type: String,
      default: "",
    },

    position: {
      x: {
        type: Number,
        default: 100,
      },
      y: {
        type: Number,
        default: 100,
      },
      z: {
        type: Number,
        default: 0,
      },
    },

    dimensions: {
      width: {
        type: Number,
        default: 200,
        min: 10,
      },

      height: {
        type: Number,
        default: 120,
        min: 10,
      },

      depth: {
        type: Number,
        default: 10,
        min: 1,
      },
    },

    color: {
      type: String,
      default: "#CBD5E1",
    },

    strokeColor: {
      type: String,
      default: "#475569",
    },

    strokeWidth: {
      type: Number,
      default: 2,
    },

    rotation: {
      type: Number,
      default: 0,
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

const CampusElement = mongoose.model(
  "CampusElement",
  campusElementSchema
);

export default CampusElement;