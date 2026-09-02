import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    floors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Floor",
      },
    ],
    // Outdoor campus map position
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
      z: {
        type: Number,
        default: 0,
      },
    },
    // Building dimensions
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
    },
    // Rotation in degrees
   rotation: {
  type: Number,
  default: 0,
},
    // Building color/texture
    color: {
      type: String,
      default: "#E8E8E8",
    },
    icon: {
      type: String,
      default: "building",
    },
    image: {
      type: String,
      default: "",
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

export default mongoose.model("Building", buildingSchema);
