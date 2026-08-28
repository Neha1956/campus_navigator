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
      required: true,
    },

    walkingTime: {
      type: Number,
      required: true,
    },

    path: {
      type: Array,
      default: [],
    },

    directions: {
      type: Array,
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

export default mongoose.model("Route", routeSchema);