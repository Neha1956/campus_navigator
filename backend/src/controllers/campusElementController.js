import CampusElement from "../models/CampusElement.js";

/* =====================================================
   GET ALL CAMPUS ELEMENTS
===================================================== */

export const getCampusElements = async (req, res) => {
  try {
    const elements = await CampusElement.find({
      isActive: true,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: elements.length,
      data: elements,
    });
  } catch (error) {
    console.error(
      "GET CAMPUS ELEMENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE CAMPUS ELEMENT
===================================================== */

export const getCampusElementById = async (
  req,
  res
) => {
  try {
    const element = await CampusElement.findById(
      req.params.id
    );

    if (!element) {
      return res.status(404).json({
        success: false,
        message: "Campus element not found",
      });
    }

    res.status(200).json({
      success: true,
      data: element,
    });
  } catch (error) {
    console.error(
      "GET CAMPUS ELEMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   CREATE CAMPUS ELEMENT
===================================================== */

export const createCampusElement = async (
  req,
  res
) => {
  try {
    const {
      name,
      type,
      description,
      position,
      dimensions,
      color,
      strokeColor,
      strokeWidth,
      rotation,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Element name is required",
      });
    }

    const allowedTypes = [
      "parking",
      "ground",
      "park",
      "small-room",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campus element type",
      });
    }

    const element =
      await CampusElement.create({
        name: name.trim(),

        type,

        description:
          description || "",

        position: {
          x: Number(position?.x) || 0,
          y: Number(position?.y) || 0,
          z: Number(position?.z) || 0,
        },

        dimensions: {
          width:
            Number(dimensions?.width) || 200,

          height:
            Number(dimensions?.height) || 120,

          depth:
            Number(dimensions?.depth) || 10,
        },

        color:
          color || "#CBD5E1",

        strokeColor:
          strokeColor || "#475569",

        strokeWidth:
          Number(strokeWidth) || 2,

        rotation:
          Number(rotation) || 0,

        isActive: true,
      });

    res.status(201).json({
      success: true,
      message:
        "Campus element created successfully",
      data: element,
    });
  } catch (error) {
    console.error(
      "CREATE CAMPUS ELEMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE CAMPUS ELEMENT
===================================================== */

export const updateCampusElement = async (
  req,
  res
) => {
  try {
    const element =
      await CampusElement.findById(
        req.params.id
      );

    if (!element) {
      return res.status(404).json({
        success: false,
        message: "Campus element not found",
      });
    }

    const {
      name,
      type,
      description,
      position,
      dimensions,
      color,
      strokeColor,
      strokeWidth,
      rotation,
      isActive,
    } = req.body;

    if (name !== undefined) {
      element.name = name.trim();
    }

    if (type !== undefined) {
      element.type = type;
    }

    if (description !== undefined) {
      element.description = description;
    }

    if (position) {
      element.position = {
        x:
          position.x !== undefined
            ? Number(position.x)
            : element.position.x,

        y:
          position.y !== undefined
            ? Number(position.y)
            : element.position.y,

        z:
          position.z !== undefined
            ? Number(position.z)
            : element.position.z,
      };
    }

    if (dimensions) {
      element.dimensions = {
        width:
          dimensions.width !== undefined
            ? Number(dimensions.width)
            : element.dimensions.width,

        height:
          dimensions.height !== undefined
            ? Number(dimensions.height)
            : element.dimensions.height,

        depth:
          dimensions.depth !== undefined
            ? Number(dimensions.depth)
            : element.dimensions.depth,
      };
    }

    if (color !== undefined) {
      element.color = color;
    }

    if (strokeColor !== undefined) {
      element.strokeColor = strokeColor;
    }

    if (strokeWidth !== undefined) {
      element.strokeWidth =
        Number(strokeWidth);
    }

    if (rotation !== undefined) {
      element.rotation =
        Number(rotation);
    }

    if (isActive !== undefined) {
      element.isActive = isActive;
    }

    await element.save();

    res.status(200).json({
      success: true,
      message:
        "Campus element updated successfully",
      data: element,
    });
  } catch (error) {
    console.error(
      "UPDATE CAMPUS ELEMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE CAMPUS ELEMENT
===================================================== */

export const deleteCampusElement = async (
  req,
  res
) => {
  try {
    const element =
      await CampusElement.findByIdAndDelete(
        req.params.id
      );

    if (!element) {
      return res.status(404).json({
        success: false,
        message: "Campus element not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Campus element deleted successfully",
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    console.error(
      "DELETE CAMPUS ELEMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};