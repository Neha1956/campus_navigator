
import mongoose from "mongoose";

const roadPointSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const roadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "road",
        "path",
        "corridor",
        "walkway",
        "entrance",
      ],
      default: "road",
    },

    // Starting building/location
    fromBuilding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },

    // Ending building/location
    toBuilding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      default: null,
    },

    // Road drawing points
    points: {
      type: [roadPointSchema],
      default: [],
    },

    width: {
      type: Number,
      default: 20,
    },

    color: {
      type: String,
      default: "#64748B",
    },

    // Optional road metadata
    distance: {
      type: Number,
      default: 0,
    },

    walkingTime: {
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

const Road = mongoose.model("Road", roadSchema);

export default Road;

