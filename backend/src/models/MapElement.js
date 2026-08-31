import mongoose from "mongoose";

const mapElementSchema = new mongoose.Schema(
  {
    /* =====================================================
       FLOOR
    ===================================================== */

    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },

    /* =====================================================
       ELEMENT TYPE
    ===================================================== */

    type: {
      type: String,
      required: true,
      enum: [
        "room",
        "wall",
        "door",
        "staircase",
        "lift",
        "corridor",
        "washroom",
        "office",
        "lab",
        "classroom",
        "road",       // NEW
        "other",
      ],
    },

    /* =====================================================
       NAME
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    /* =====================================================
       POSITION
    ===================================================== */

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

    /* =====================================================
       DIMENSIONS
       For normal elements
       ===================================================== */

    dimensions: {
      width: {
        type: Number,
        required: true,
      },

      height: {
        type: Number,
        required: true,
      },

      depth: {
        type: Number,
        default: 0,
      },
    },

    /* =====================================================
       ROAD / PATH POINTS
       ===================================================== */

    path: [
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
    ],

    /* =====================================================
       ROTATION
    ===================================================== */

    rotation: {
      x: {
        type: Number,
        default: 0,
      },

      y: {
        type: Number,
        default: 0,
      },

      z: {
        type: Number,
        default: 0,
      },
    },

    /* =====================================================
       STYLING
    ===================================================== */

    color: {
      type: String,
      default: "#FFFFFF",
    },

    strokeColor: {
      type: String,
      default: "#1E293B",
    },

    strokeWidth: {
      type: Number,
      default: 2,
    },

    /* =====================================================
       ROAD SETTINGS
       ===================================================== */

    roadWidth: {
      type: Number,
      default: 12,
    },

    roadStyle: {
      type: String,
      enum: [
        "solid",
        "dashed",
        "dotted",
      ],
      default: "solid",
    },

    /* =====================================================
       CONNECTIONS
       ===================================================== */

    connectsTo: [
      {
        elementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MapElement",
        },

        floorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Floor",
        },
      },
    ],

    /* =====================================================
       METADATA
    ===================================================== */

    roomNumber: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "square",
    },

    image: {
      type: String,
      default: "",
    },

    /* =====================================================
       ACTIVE
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "MapElement",
  mapElementSchema
);