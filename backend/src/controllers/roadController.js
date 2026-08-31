
import Road from "../models/Road.js";

/* =========================================================
   GET ALL ROADS
========================================================= */

export const getRoads = async (req, res) => {
  try {
    const roads = await Road.find({
      isActive: true,
    })
      .populate("fromBuilding", "name")
      .populate("toBuilding", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      roads,
    });
  } catch (error) {
    console.error("GET ROADS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch roads",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE ROAD
========================================================= */

export const getRoadById = async (req, res) => {
  try {
    const road = await Road.findById(req.params.id)
      .populate("fromBuilding", "name")
      .populate("toBuilding", "name");

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road not found",
      });
    }

    res.status(200).json({
      success: true,
      road,
    });
  } catch (error) {
    console.error("GET ROAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch road",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE ROAD
========================================================= */

export const createRoad = async (req, res) => {
  try {
    const {
      name,
      type,
      fromBuilding,
      toBuilding,
      points,
      width,
      color,
      distance,
      walkingTime,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Road name is required",
      });
    }

    if (!points || !Array.isArray(points) || points.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 road points are required",
      });
    }

    const road = await Road.create({
      name,
      type: type || "road",
      fromBuilding: fromBuilding || null,
      toBuilding: toBuilding || null,
      points,
      width: Number(width) || 20,
      color: color || "#64748B",
      distance: Number(distance) || 0,
      walkingTime: Number(walkingTime) || 0,
    });

    const populatedRoad = await Road.findById(road._id)
      .populate("fromBuilding", "name")
      .populate("toBuilding", "name");

    res.status(201).json({
      success: true,
      message: "Road created successfully",
      road: populatedRoad,
    });
  } catch (error) {
    console.error("CREATE ROAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create road",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE ROAD
========================================================= */

export const updateRoad = async (req, res) => {
  try {
    const {
      name,
      type,
      fromBuilding,
      toBuilding,
      points,
      width,
      color,
      distance,
      walkingTime,
      isActive,
    } = req.body;

    const road = await Road.findById(req.params.id);

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road not found",
      });
    }

    if (name !== undefined) road.name = name;
    if (type !== undefined) road.type = type;
    if (fromBuilding !== undefined)
      road.fromBuilding = fromBuilding || null;

    if (toBuilding !== undefined)
      road.toBuilding = toBuilding || null;

    if (points !== undefined)
      road.points = points;

    if (width !== undefined)
      road.width = Number(width);

    if (color !== undefined)
      road.color = color;

    if (distance !== undefined)
      road.distance = Number(distance);

    if (walkingTime !== undefined)
      road.walkingTime = Number(walkingTime);

    if (isActive !== undefined)
      road.isActive = isActive;

    await road.save();

    const updatedRoad = await Road.findById(road._id)
      .populate("fromBuilding", "name")
      .populate("toBuilding", "name");

    res.status(200).json({
      success: true,
      message: "Road updated successfully",
      road: updatedRoad,
    });
  } catch (error) {
    console.error("UPDATE ROAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update road",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE ROAD
========================================================= */

export const deleteRoad = async (req, res) => {
  try {
    const road = await Road.findById(req.params.id);

    if (!road) {
      return res.status(404).json({
        success: false,
        message: "Road not found",
      });
    }

    await Road.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Road deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ROAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete road",
      error: error.message,
    });
  }
};

