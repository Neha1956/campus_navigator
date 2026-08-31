import MapElement from "../models/MapElement.js";
import Floor from "../models/Floor.js";

// Get all map elements for a floor
export const getMapElementsByFloorId = async (req, res) => {
  try {
    const { floorId } = req.params;
    const elements = await MapElement.find({ floorId, isActive: true }).populate("connectsTo.elementId");

    res.status(200).json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single map element
export const getMapElementById = async (req, res) => {
  try {
    const { id } = req.params;
    const element = await MapElement.findById(id).populate("connectsTo.elementId");

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    res.status(200).json(element);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new map element
export const createMapElement = async (req, res) => {
  try {
    const {
      floorId,
      type,
      name,
      position,
      dimensions,
      rotation,
      color,
      strokeColor,
      strokeWidth,
      roomNumber,
      capacity,
      description,
      icon,
      image,
    } = req.body;

    // Validate required fields
    if (!floorId || !type || !name || !position || !dimensions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if floor exists
    const floor = await Floor.findById(floorId);
    if (!floor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    const newElement = new MapElement({
      floorId,
      type,
      name,
      position,
      dimensions,
      rotation,
      color,
      strokeColor,
      strokeWidth,
      roomNumber,
      capacity,
      description,
      icon,
      image,
    });

    await newElement.save();

    // Add element to floor's mapElements array
    floor.mapElements.push(newElement._id);
    await floor.save();

    res.status(201).json({
      message: "Map element created successfully",
      element: newElement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update map element
export const updateMapElement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const element = await MapElement.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("connectsTo.elementId");

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    res.status(200).json({
      message: "Map element updated successfully",
      element,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update element position (for drag-drop)
export const updateElementPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    if (!position) {
      return res.status(400).json({ message: "Position is required" });
    }

    const element = await MapElement.findByIdAndUpdate(
      id,
      { position },
      { new: true }
    );

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    res.status(200).json({
      message: "Position updated successfully",
      element,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update element dimensions (for resize)
export const updateElementDimensions = async (req, res) => {
  try {
    const { id } = req.params;
    const { dimensions } = req.body;

    if (!dimensions) {
      return res.status(400).json({ message: "Dimensions are required" });
    }

    const element = await MapElement.findByIdAndUpdate(
      id,
      { dimensions },
      { new: true }
    );

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    res.status(200).json({
      message: "Dimensions updated successfully",
      element,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add connection between elements (for stairs/lifts connecting floors)
export const addElementConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const { connectElementId, connectFloorId } = req.body;

    if (!connectElementId || !connectFloorId) {
      return res.status(400).json({ message: "Connection details are required" });
    }

    const element = await MapElement.findByIdAndUpdate(
      id,
      {
        $push: {
          connectsTo: {
            elementId: connectElementId,
            floorId: connectFloorId,
          },
        },
      },
      { new: true }
    ).populate("connectsTo.elementId");

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    res.status(200).json({
      message: "Connection added successfully",
      element,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete map element (soft delete)
export const deleteMapElement = async (req, res) => {
  try {
    const { id } = req.params;

    const element = await MapElement.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!element) {
      return res.status(404).json({ message: "Map element not found" });
    }

    // Remove element from floor's mapElements array
    await Floor.findByIdAndUpdate(
      element.floorId,
      { $pull: { mapElements: id } }
    );

    res.status(200).json({
      message: "Map element deleted successfully",
      element,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Batch update elements (for multiple selections)
export const batchUpdateElements = async (req, res) => {
  try {
    const { elementIds, updates } = req.body;

    if (!elementIds || !updates) {
      return res.status(400).json({ message: "ElementIds and updates are required" });
    }

    const result = await MapElement.updateMany(
      { _id: { $in: elementIds } },
      updates
    );

    res.status(200).json({
      message: "Elements updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
