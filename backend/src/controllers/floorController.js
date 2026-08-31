import Floor from "../models/Floor.js";
import Building from "../models/Building.js";
import MapElement from "../models/MapElement.js";

// Get all floors for a building
export const getFloorsByBuildingId = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const floors = await Floor.find({ buildingId, isActive: true })
      .populate("mapElements")
      .sort({ floorNumber: 1 });

    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single floor with all map elements
export const getFloorById = async (req, res) => {
  try {
    const { id } = req.params;
    const floor = await Floor.findById(id).populate("mapElements");

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new floor
export const createFloor = async (req, res) => {
  try {
    const {
      name,
      floorNumber,
      buildingId,
      width,
      height,
      heightZ,
      backgroundColor,
      layoutData,
    } = req.body;

    // Validate required fields
    if (!name || floorNumber === undefined || !buildingId || !width || !height || heightZ === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if building exists
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    const newFloor = new Floor({
      name,
      floorNumber,
      buildingId,
      width,
      height,
      heightZ,
      backgroundColor,
      layoutData,
    });

    await newFloor.save();

    // Add floor to building's floors array
    building.floors.push(newFloor._id);
    await building.save();

    res.status(201).json({
      message: "Floor created successfully",
      floor: newFloor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update floor
export const updateFloor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const floor = await Floor.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("mapElements");

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    res.status(200).json({
      message: "Floor updated successfully",
      floor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete floor (soft delete)
export const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params;

    const floor = await Floor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    // Deactivate all map elements on this floor
    await MapElement.updateMany(
      { floorId: id },
      { isActive: false }
    );

    // Remove floor from building's floors array
    await Building.findByIdAndUpdate(
      floor.buildingId,
      { $pull: { floors: id } }
    );

    res.status(200).json({
      message: "Floor deleted successfully",
      floor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update floor layout data (for storing editor state)
export const updateFloorLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { layoutData } = req.body;

    const floor = await Floor.findByIdAndUpdate(
      id,
      { layoutData },
      { new: true }
    ).populate("mapElements");

    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    res.status(200).json({
      message: "Floor layout updated successfully",
      floor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
