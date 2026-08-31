import Location from "../models/Location.js";
import { normalizeLocationImages } from "../utils/locationImageUtils.js";

// CREATE LOCATION
export const createLocation = async (req, res) => {
  try {
    const {
  name,
  category,
  building,
  buildingId,
  floor,
  floorId,
  mapElementId,
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
if (mapElementId) {
  const existingLocation = await Location.findOne({
    mapElementId,
  });

  if (existingLocation) {
    return res.status(400).json({
      success: false,
      message: "This map element is already added as a location.",
    });
  }
}
    const uploadedFiles = [
      ...(req.files?.images || []),
      ...(req.files?.image || []),
    ];
    const { image, images } = normalizeLocationImages(uploadedFiles);

   const location = await Location.create({
  name,
  category,

  building: building || "RCIT Building",

  buildingId: buildingId || null,

  floor: floor !== undefined ? Number(floor) : 0,

  floorId: floorId || null,

  mapElementId: mapElementId || null,

  description: description || "",

  x: Number(x),
  y: Number(y),

  icon: icon || category,

  image,
  images,

  isActive: true,
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


// GET ALL LOCATIONS (With Floor & Building Filtering)
export const getLocations = async (req, res) => {
  try {
    const { floor, building, category } = req.query;
    let filter = { isActive: true };

    if (floor !== undefined) filter.floor = Number(floor);
    if (building) filter.building = building;
    if (category) filter.category = category;

    const locations = await Location.find(filter).sort({ floor: 1, name: 1 });

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
      building,
      floor,
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
    location.building = building ?? location.building;
    location.floor = floor !== undefined ? Number(floor) : location.floor;
    location.description = description ?? location.description;
    location.x = x !== undefined ? Number(x) : location.x;
    location.y = y !== undefined ? Number(y) : location.y;
    location.icon = icon ?? location.icon;

    const uploadedFiles = [
      ...(req.files?.images || []),
      ...(req.files?.image || []),
    ];

    if (uploadedFiles.length) {
      const { image, images } = normalizeLocationImages(uploadedFiles);
      location.image = image;
      location.images = images;
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