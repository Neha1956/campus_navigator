import Building from "../models/Building.js";

// ==========================================
// GET ALL BUILDINGS
// ==========================================
export const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find()
      .populate("floors")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buildings.length,
      buildings,
    });
  } catch (error) {
    console.error("Get buildings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch buildings",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE BUILDING BY ID
// ==========================================
export const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id).populate("floors");

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    res.status(200).json({
      success: true,
      building,
    });
  } catch (error) {
    console.error("Get building error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid building ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch building",
      error: error.message,
    });
  }
};

// ==========================================
// CREATE BUILDING
// ==========================================
export const createBuilding = async (req, res) => {
  try {
    const {
      name,
      description,
      floors,
      position,
      dimensions,
      rotation,
      color,
      icon,
      image,
      isActive,
    } = req.body;

    // Required fields validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Building name is required",
      });
    }

    if (
      !position ||
      position.x === undefined ||
      position.y === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Building position (x, y) is required",
      });
    }

    if (
      !dimensions ||
      dimensions.width === undefined ||
      dimensions.depth === undefined ||
      dimensions.height === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Building dimensions (width, depth, height) are required",
      });
    }

    // Check duplicate building name
    const existingBuilding = await Building.findOne({
      name: name.trim(),
    });

    if (existingBuilding) {
      return res.status(409).json({
        success: false,
        message: "A building with this name already exists",
      });
    }

    // Create building
    const building = await Building.create({
      name: name.trim(),
      description: description || "",
      floors: floors || [],
      position: {
        x: position.x,
        y: position.y,
        z: position.z ?? 0,
      },
      dimensions: {
        width: dimensions.width,
        depth: dimensions.depth,
        height: dimensions.height,
      },
      rotation: {
        x: rotation?.x ?? 0,
        y: rotation?.y ?? 0,
        z: rotation?.z ?? 0,
      },
      color: color || "#E8E8E8",
      icon: icon || "building",
      image: image || "",
      isActive: isActive ?? true,
    });

    // Populate floors
    await building.populate("floors");

    res.status(201).json({
      success: true,
      message: "Building created successfully",
      building,
    });
  } catch (error) {
    console.error("Create building error:", error);

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A building with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create building",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE BUILDING
// ==========================================
export const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      floors,
      position,
      dimensions,
      rotation,
      color,
      icon,
      image,
      isActive,
    } = req.body;

    // Check if building exists
    const existingBuilding = await Building.findById(id);

    if (!existingBuilding) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    // Check duplicate name
    if (name && name.trim() !== existingBuilding.name) {
      const duplicateBuilding = await Building.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (duplicateBuilding) {
        return res.status(409).json({
          success: false,
          message: "A building with this name already exists",
        });
      }
    }

    // Update fields only if provided
    if (name !== undefined) {
      existingBuilding.name = name.trim();
    }

    if (description !== undefined) {
      existingBuilding.description = description;
    }

    if (floors !== undefined) {
      existingBuilding.floors = floors;
    }

    if (position !== undefined) {
      existingBuilding.position = {
        x:
          position.x !== undefined
            ? position.x
            : existingBuilding.position.x,

        y:
          position.y !== undefined
            ? position.y
            : existingBuilding.position.y,

        z:
          position.z !== undefined
            ? position.z
            : existingBuilding.position.z,
      };
    }

    if (dimensions !== undefined) {
      existingBuilding.dimensions = {
        width:
          dimensions.width !== undefined
            ? dimensions.width
            : existingBuilding.dimensions.width,

        depth:
          dimensions.depth !== undefined
            ? dimensions.depth
            : existingBuilding.dimensions.depth,

        height:
          dimensions.height !== undefined
            ? dimensions.height
            : existingBuilding.dimensions.height,
      };
    }

    if (rotation !== undefined) {
      existingBuilding.rotation = {
        x:
          rotation.x !== undefined
            ? rotation.x
            : existingBuilding.rotation.x,

        y:
          rotation.y !== undefined
            ? rotation.y
            : existingBuilding.rotation.y,

        z:
          rotation.z !== undefined
            ? rotation.z
            : existingBuilding.rotation.z,
      };
    }

    if (color !== undefined) {
      existingBuilding.color = color;
    }

    if (icon !== undefined) {
      existingBuilding.icon = icon;
    }

    if (image !== undefined) {
      existingBuilding.image = image;
    }

    if (isActive !== undefined) {
      existingBuilding.isActive = isActive;
    }

    const updatedBuilding = await existingBuilding.save();

    await updatedBuilding.populate("floors");

    res.status(200).json({
      success: true,
      message: "Building updated successfully",
      building: updatedBuilding,
    });
  } catch (error) {
    console.error("Update building error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid building ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A building with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update building",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE BUILDING
// ==========================================
export const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    const building = await Building.findById(id);

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    await Building.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Building deleted successfully",
    });
  } catch (error) {
    console.error("Delete building error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid building ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete building",
      error: error.message,
    });
  }
};