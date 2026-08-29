import Route from "../models/Route.js";
import Location from "../models/Location.js";
import getShortestPath from "../utils/shortestPath.js";

// CREATE ROUTE
export const createRoute = async (req, res) => {
  try {
    const {
      from,
      to,
      distance,
      walkingTime,
      path,
      directions,
      isActive,
    } = req.body;

    if (
      !from ||
      !to ||
      distance === undefined ||
      walkingTime === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "From, to, distance and walkingTime are required",
      });
    }

    // Check locations
    const [fromLocation, toLocation] = await Promise.all([
      Location.findById(from),
      Location.findById(to),
    ]);

    if (!fromLocation || !toLocation) {
      return res.status(404).json({
        success: false,
        message: "Source or destination location not found",
      });
    }

    // Check duplicate route
    const existingRoute = await Route.findOne({
      from,
      to,
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: "Route already exists",
      });
    }

    const route = await Route.create({
      from,
      to,
      distance,
      walkingTime,
      path: path || [],
      directions: directions || [],
      isActive: isActive ?? true,
    });

    // Populate locations with building and floor info
    await route.populate([
      {
        path: "from",
        select: "name category building floor x y",
      },
      {
        path: "to",
        select: "name category building floor x y",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      data: route,
    });
  } catch (error) {
    console.error("Create route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create route",
      error: error.message,
    });
  }
};


// GET ALL ROUTES
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("from", "name category building floor x y")
      .populate("to", "name category building floor x y")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch routes",
      error: error.message,
    });
  }
};


// GET SINGLE ROUTE
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("from", "name category building floor x y")
      .populate("to", "name category building floor x y");

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    res.status(200).json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch route",
      error: error.message,
    });
  }
};


// UPDATE ROUTE
export const updateRoute = async (req, res) => {
  try {
    const {
      from,
      to,
      distance,
      walkingTime,
      path,
      directions,
      isActive,
    } = req.body;

    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // If from/to changed, check locations
    if (from || to) {
      const newFrom = from || route.from;
      const newTo = to || route.to;

      const [fromLocation, toLocation] = await Promise.all([
        Location.findById(newFrom),
        Location.findById(newTo),
      ]);

      if (!fromLocation || !toLocation) {
        return res.status(404).json({
          success: false,
          message: "Source or destination location not found",
        });
      }

      // Check duplicate route
      const duplicateRoute = await Route.findOne({
        _id: { $ne: route._id },
        from: newFrom,
        to: newTo,
      });

      if (duplicateRoute) {
        return res.status(400).json({
          success: false,
          message: "Route already exists",
        });
      }

      route.from = newFrom;
      route.to = newTo;
    }

    route.distance = distance ?? route.distance;
    route.walkingTime = walkingTime ?? route.walkingTime;
    route.path = path ?? route.path;
    route.directions = directions ?? route.directions;
    route.isActive = isActive ?? route.isActive;

    await route.save();

    await route.populate([
      {
        path: "from",
        select: "name category building floor x y",
      },
      {
        path: "to",
        select: "name category building floor x y",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      data: route,
    });
  } catch (error) {
    console.error("Update route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update route",
      error: error.message,
    });
  }
};


// DELETE ROUTE
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    await route.deleteOne();

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    console.error("Delete route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete route",
      error: error.message,
    });
  }
};


// GET ROUTE BETWEEN TWO LOCATIONS (DIJKSTRA)
export const getRouteBetweenLocations = async (req, res) => {
  try {
    const { from, to } = req.params;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To locations are required",
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "From and To locations cannot be same",
      });
    }

    // Check locations
    const [fromLocation, toLocation] = await Promise.all([
      Location.findById(from),
      Location.findById(to),
    ]);

    if (!fromLocation) {
      return res.status(404).json({
        success: false,
        message: "Starting location not found",
      });
    }

    if (!toLocation) {
      return res.status(404).json({
        success: false,
        message: "Destination location not found",
      });
    }

    // Get all active routes
    const routes = await Route.find({
      isActive: { $ne: false },
    }).populate(
      "from to",
      "name category building floor x y"
    );

    if (!routes.length) {
      return res.status(404).json({
        success: false,
        message: "No campus routes available",
      });
    }

    // Dijkstra Pathfinding Execution
    const result = getShortestPath(routes, from, to);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No route available between these locations",
      });
    }

    // Calculate walking time
    const walkingTime = Math.ceil(result.distance / 80);

    return res.status(200).json({
      success: true,
      data: {
        from: {
          _id: fromLocation._id,
          name: fromLocation.name,
          category: fromLocation.category,
          building: fromLocation.building,
          floor: fromLocation.floor,
          x: fromLocation.x,
          y: fromLocation.y,
        },
        to: {
          _id: toLocation._id,
          name: toLocation.name,
          category: toLocation.category,
          building: toLocation.building,
          floor: toLocation.floor,
          x: toLocation.x,
          y: toLocation.y,
        },
        distance: result.distance,
        walkingTime,
        path: result.path.map((route) => {
          if (route.reverse) {
            return {
              _id: route._id,
              distance: route.distance,
              walkingTime: route.walkingTime,
              from: route.to,
              to: route.from,
              reverse: true,
            };
          }
          return {
            _id: route._id,
            distance: route.distance,
            walkingTime: route.walkingTime,
            from: route.from,
            to: route.to,
            reverse: false,
          };
        }),
        directions: result.path.map((route, index) => {
          if (route.reverse) {
            return {
              step: index + 1,
              from: route.to.name,
              to: route.from.name,
              distance: route.distance,
              walkingTime: route.walkingTime,
            };
          }
          return {
            step: index + 1,
            from: route.from.name,
            to: route.to.name,
            distance: route.distance,
            walkingTime: route.walkingTime,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Get route between locations error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};