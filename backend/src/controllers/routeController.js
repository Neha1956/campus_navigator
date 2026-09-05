import Route from "../models/Route.js";
import Location from "../models/Location.js";
import Road from "../models/Road.js";
import getShortestPath from "../utils/shortestPath.js";

const getRoadNetworkPath = (roads, fromLocation, toLocation) => {
  const nodes = new Map();
  const graph = new Map();
  const segments = [];
  const rawSegments = [];
  const endpointNodes = new Set();

  const addNode = (point, customKey) => {
    const key = customKey || `${Number(point.x).toFixed(2)},${Number(point.y).toFixed(2)}`;
    if (!nodes.has(key)) {
      const node = { key, x: Number(point.x), y: Number(point.y) };
      nodes.set(key, node);
      graph.set(key, []);
    }
    return nodes.get(key);
  };

  const addEdge = (from, to) => {
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    if (!distance) return;
    graph.get(from.key).push({ node: to.key, distance });
    graph.get(to.key).push({ node: from.key, distance });
  };

  roads.forEach((road) => {
    const points = Array.isArray(road.points) ? road.points : [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const from = addNode(points[index]);
      const to = addNode(points[index + 1]);
      addEdge(from, to);
      rawSegments.push({ from, to });
      endpointNodes.add(from.key);
      endpointNodes.add(to.key);
    }
  });

  if (!nodes.size) return null;

  const getIntersection = (first, second) => {
    const x1 = first.from.x;
    const y1 = first.from.y;
    const x2 = first.to.x;
    const y2 = first.to.y;
    const x3 = second.from.x;
    const y3 = second.from.y;
    const x4 = second.to.x;
    const y4 = second.to.y;
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (!denominator) return null;

    const firstRatio = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const secondRatio = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denominator;

    if (firstRatio <= 0 || firstRatio >= 1 || secondRatio <= 0 || secondRatio >= 1) {
      return null;
    }

    return {
      x: x1 + firstRatio * (x2 - x1),
      y: y1 + firstRatio * (y2 - y1),
    };
  };

  rawSegments.forEach((segment) => segments.push(segment));

  for (let firstIndex = 0; firstIndex < rawSegments.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < rawSegments.length; secondIndex += 1) {
      const intersection = getIntersection(
        rawSegments[firstIndex],
        rawSegments[secondIndex]
      );

      if (!intersection) continue;

      const intersectionNode = addNode(intersection);
      addEdge(rawSegments[firstIndex].from, intersectionNode);
      addEdge(intersectionNode, rawSegments[firstIndex].to);
      addEdge(rawSegments[secondIndex].from, intersectionNode);
      addEdge(intersectionNode, rawSegments[secondIndex].to);
    }
  }

  // Connect T-junctions where one road ends on the middle of another road.
  endpointNodes.forEach((endpointKey) => {
    const endpoint = nodes.get(endpointKey);
    rawSegments.forEach((segment) => {
      const deltaX = segment.to.x - segment.from.x;
      const deltaY = segment.to.y - segment.from.y;
      const lengthSquared = deltaX ** 2 + deltaY ** 2;
      if (!lengthSquared) return;

      const ratio = Math.max(
        0,
        Math.min(
          1,
          ((endpoint.x - segment.from.x) * deltaX +
            (endpoint.y - segment.from.y) * deltaY) /
            lengthSquared
        )
      );
      const point = {
        x: segment.from.x + ratio * deltaX,
        y: segment.from.y + ratio * deltaY,
      };

      if (Math.hypot(endpoint.x - point.x, endpoint.y - point.y) > 35) {
        return;
      }

      const junction = addNode(point);
      addEdge(endpoint, junction);
      addEdge(segment.from, junction);
      addEdge(junction, segment.to);
    });
  });

  const endpointList = [...endpointNodes].map((key) => nodes.get(key));
  for (let firstIndex = 0; firstIndex < endpointList.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < endpointList.length; secondIndex += 1) {
      const first = endpointList[firstIndex];
      const second = endpointList[secondIndex];
      if (Math.hypot(second.x - first.x, second.y - first.y) <= 35) {
        addEdge(first, second);
      }
    }
  }

  const attachToRoad = (location, prefix) => {
    let nearest = null;
    let nearestDistance = Infinity;
    segments.forEach((segment) => {
      const deltaX = segment.to.x - segment.from.x;
      const deltaY = segment.to.y - segment.from.y;
      const lengthSquared = deltaX ** 2 + deltaY ** 2;
      const ratio = lengthSquared
        ? Math.max(0, Math.min(1, (
            (Number(location.x) - segment.from.x) * deltaX +
            (Number(location.y) - segment.from.y) * deltaY
          ) / lengthSquared))
        : 0;
      const point = {
        x: segment.from.x + ratio * deltaX,
        y: segment.from.y + ratio * deltaY,
      };
      const distance = Math.hypot(
        point.x - Number(location.x),
        point.y - Number(location.y)
      );
      if (distance < nearestDistance) {
        nearest = { segment, point, distance };
        nearestDistance = distance;
      }
    });

    if (!nearest) return null;
    const node = addNode({
      x: nearest.point.x,
      y: nearest.point.y,
    }, `${prefix}-${location._id}`);
    addEdge(nearest.segment.from, node);
    addEdge(node, nearest.segment.to);
    return { node, distance: nearest.distance };
  };

  const source = attachToRoad(fromLocation, "source");
  const destination = attachToRoad(toLocation, "destination");
  if (!source?.node || !destination?.node) return null;

  const distances = new Map([[source.node.key, 0]]);
  const previous = new Map();
  const visited = new Set();

  while (true) {
    let current = null;
    let smallest = Infinity;
    distances.forEach((distance, key) => {
      if (!visited.has(key) && distance < smallest) {
        current = key;
        smallest = distance;
      }
    });

    if (!current || current === destination.node.key) break;
    visited.add(current);

    (graph.get(current) || []).forEach((edge) => {
      const nextDistance = smallest + edge.distance;
      if (nextDistance < (distances.get(edge.node) ?? Infinity)) {
        distances.set(edge.node, nextDistance);
        previous.set(edge.node, current);
      }
    });
  }

  if (!distances.has(destination.node.key)) return null;

  const nodePath = [];
  let current = destination.node.key;
  while (current) {
    nodePath.unshift(nodes.get(current));
    if (current === source.node.key) break;
    current = previous.get(current);
  }

  if (nodePath[0]?.key !== source.node.key) return null;

  const path = [
    {
      from: fromLocation,
      to: nodePath[0],
      distance: source.distance,
    },
  ];

  for (let index = 0; index < nodePath.length - 1; index += 1) {
    const from = nodePath[index];
    const to = nodePath[index + 1];
    path.push({
      from,
      to,
      distance: Math.hypot(to.x - from.x, to.y - from.y),
    });
  }

  path.push({
    from: nodePath[nodePath.length - 1],
    to: toLocation,
    distance: destination.distance,
  });

  return {
    distance: source.distance + distances.get(destination.node.key) + destination.distance,
    path,
  };
};

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

    const roads = await Road.find({ isActive: { $ne: false } });
    const usableRoads = roads.filter(
      (road) => Array.isArray(road.points) && road.points.length >= 2
    );

    // Dijkstra Pathfinding Execution
    const result = usableRoads.length
      ? getRoadNetworkPath(usableRoads, fromLocation, toLocation)
      : getShortestPath(routes, from, to);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: usableRoads.length
          ? "No road path available between these locations"
          : "No campus roads available",
      });
    }

    // Calculate walking time
    const walkingTime = Math.ceil(result.distance / 80);

    const path = result.path.map((route, index) => {
      const segment = route.toObject ? route.toObject() : route;
      return {
        _id: segment._id || `road-segment-${index}`,
        distance: Math.ceil(Number(segment.distance) || 0),
        walkingTime: Math.max(1, Math.ceil((Number(segment.distance) || 0) / 80)),
        from: segment.reverse ? segment.to : segment.from,
        to: segment.reverse ? segment.from : segment.to,
        reverse: Boolean(segment.reverse),
      };
    });

    const allLocations = await Location.find({
      isActive: { $ne: false },
    }).select("name category building floor x y");

    const viaLocations = allLocations
      .map((location) => {
        let closestDistance = Infinity;
        let pathPosition = Infinity;
        let travelled = 0;

        path.forEach((segment) => {
          const startX = Number(segment.from.x);
          const startY = Number(segment.from.y);
          const endX = Number(segment.to.x);
          const endY = Number(segment.to.y);
          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const lengthSquared = deltaX ** 2 + deltaY ** 2;
          const ratio = lengthSquared
            ? Math.max(0, Math.min(1, (
                (Number(location.x) - startX) * deltaX +
                (Number(location.y) - startY) * deltaY
              ) / lengthSquared))
            : 0;
          const distance = Math.hypot(
            Number(location.x) - (startX + ratio * deltaX),
            Number(location.y) - (startY + ratio * deltaY)
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            pathPosition = travelled + ratio * Math.sqrt(lengthSquared);
          }
          travelled += Math.sqrt(lengthSquared);
        });

        return { location, closestDistance, pathPosition };
      })
      .filter(({ closestDistance }) => closestDistance <= 45)
      .sort((first, second) => first.pathPosition - second.pathPosition)
      .map(({ location }) => location);

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
        distance: Math.ceil(result.distance),
        walkingTime: Math.max(1, Math.ceil(result.distance / 80)),
        path,
        viaLocations,
        directions: path.map((segment, index) => ({
          step: index + 1,
          from: segment.from.name || (index === 0 ? fromLocation.name : "Campus road"),
          to: segment.to.name || (index === path.length - 1 ? toLocation.name : "Continue ahead"),
          distance: segment.distance,
          walkingTime: segment.walkingTime,
        })),
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