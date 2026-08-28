import Location from "../models/Location.js";

// CREATE LOCATION
export const createLocation = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      x,
      y,
      icon,
    } = req.body;

    if (!name || !category || x === undefined || y === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category, x and y are required",
      });
    }

    const location = await Location.create({
      name,
      category,
      description,
      x,
      y,
      icon,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    console.error("Create location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create location",
      error: error.message,
    });
  }
};


// GET ALL LOCATIONS
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch locations",
      error: error.message,
    });
  }
};


// GET LOCATION BY ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch location",
      error: error.message,
    });
  }
};


// UPDATE LOCATION
export const updateLocation = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      x,
      y,
      icon,
    } = req.body;

    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    location.name = name ?? location.name;
    location.category = category ?? location.category;
    location.description = description ?? location.description;
    location.x = x ?? location.x;
    location.y = y ?? location.y;
    location.icon = icon ?? location.icon;

    if (req.file) {
      location.image = req.file.path;
    }

    await location.save();

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    console.error("Update location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update location",
      error: error.message,
    });
  }
};


// DELETE LOCATION
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await location.deleteOne();

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Delete location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete location",
      error: error.message,
    });
  }
};