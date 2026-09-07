const getElementSize = (element) => {
  const dimensions = element?.dimensions || {};

  return {
    width: Number(dimensions.width || 0),
    depth: Number(dimensions.depth || dimensions.height || 0),
  };
};

export const getIndoorElementCenter = (element) => {
  const position = element?.position || {};
  const size = getElementSize(element);

  return {
    x: Number(position.x || 0) + size.width / 2,
    y: Number(position.y || 0) + size.depth / 2,
  };
};

export const getIndoorRoute = (source, destination) => {
  if (!source || !destination) return [];

  const sourcePoint = getIndoorElementCenter(source);
  const destinationPoint = getIndoorElementCenter(destination);

  if (source._id === destination._id) return [sourcePoint];

  return [sourcePoint, destinationPoint];
};

const getPointOnSegment = (point, start, end) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const lengthSquared = deltaX ** 2 + deltaY ** 2;
  if (!lengthSquared) return { distance: Infinity, progress: 0 };

  const progress = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) / lengthSquared)
  );
  const closest = {
    x: start.x + progress * deltaX,
    y: start.y + progress * deltaY,
  };

  return {
    distance: Math.hypot(point.x - closest.x, point.y - closest.y),
    progress,
    closest,
  };
};

const getRouteReach = (element) => {
  const dimensions = element?.dimensions || {};
  const width = Number(dimensions.width || 100);
  const depth = Number(dimensions.depth || dimensions.height || 70);

  return Math.max(90, Math.hypot(width, depth) / 2 + 30);
};

const getElementRotation = (element) =>
  typeof element?.rotation === "object"
    ? Number(element.rotation.z || 0)
    : Number(element?.rotation || 0);

const getCorridorPath = (corridor, sourcePoint, destinationPoint) => {
  const position = corridor.position || {};
  const dimensions = corridor.dimensions || {};
  const width = Number(dimensions.width || 100);
  const depth = corridor.type === "corridor"
    ? Number(dimensions.height || 40)
    : Number(dimensions.depth || dimensions.height || 40);
  const center = {
    x: Number(position.x || 0) + width / 2,
    y: Number(position.y || 0) + depth / 2,
  };
  const rotation = (getElementRotation(corridor) * Math.PI) / 180;
  const isVertical = depth > width;
  const halfLength = (isVertical ? depth : width) / 2;
  const axis = isVertical
    ? { x: -Math.sin(rotation), y: Math.cos(rotation) }
    : { x: Math.cos(rotation), y: Math.sin(rotation) };
  const start = {
    x: center.x - axis.x * halfLength,
    y: center.y - axis.y * halfLength,
  };
  const end = {
    x: center.x + axis.x * halfLength,
    y: center.y + axis.y * halfLength,
  };
  const sourceProjection = getPointOnSegment(sourcePoint, start, end);
  const destinationProjection = getPointOnSegment(destinationPoint, start, end);

  return {
    isVertical,
    sourcePoint: sourceProjection.progress <= destinationProjection.progress
      ? sourceProjection.closest
      : destinationProjection.closest,
    destinationPoint: sourceProjection.progress <= destinationProjection.progress
      ? destinationProjection.closest
      : sourceProjection.closest,
  };
};

export const getIndoorRoutePoints = (source, destination, elements = []) => {
  const sourcePoint = getIndoorElementCenter(source);
  const destinationPoint = getIndoorElementCenter(destination);
  const bestCorridor = elements
    .filter((element) => element.type === "corridor" || element.type === "staircase")
    .map((corridor) => {
      const path = getCorridorPath(corridor, sourcePoint, destinationPoint);
      return {
        ...path,
        score:
          Math.hypot(sourcePoint.x - path.sourcePoint.x, sourcePoint.y - path.sourcePoint.y) +
          Math.hypot(destinationPoint.x - path.destinationPoint.x, destinationPoint.y - path.destinationPoint.y),
      };
    })
    .sort((first, second) => first.score - second.score)[0];

  if (!bestCorridor) return [sourcePoint, destinationPoint];

  const entry = bestCorridor.sourcePoint;
  const exit = bestCorridor.destinationPoint;
  const sourceConnector = bestCorridor.isVertical
    ? { x: sourcePoint.x, y: entry.y }
    : { x: entry.x, y: sourcePoint.y };
  const destinationConnector = bestCorridor.isVertical
    ? { x: destinationPoint.x, y: exit.y }
    : { x: exit.x, y: destinationPoint.y };

  return [
    sourcePoint,
    sourceConnector,
    entry,
    exit,
    destinationConnector,
    destinationPoint,
  ];
};

export const getIndoorRouteStops = (source, destination, elements = []) => {
  if (!source || !destination) return [];

  const start = getIndoorElementCenter(source);
  const end = getIndoorElementCenter(destination);
  const routePath = getIndoorRoutePoints(source, destination, elements);
  const stops = elements
    .filter((element) => element._id !== source._id && element._id !== destination._id && element.type !== "corridor")
    .map((element) => ({ element, point: getIndoorElementCenter(element) }))
    .map((stop) => {
      let best = { distance: Infinity, progress: 0, segmentIndex: 0 };
      routePath.slice(0, -1).forEach((pathStart, index) => {
        const segment = getPointOnSegment(stop.point, pathStart, routePath[index + 1]);
        if (segment.distance < best.distance) best = { ...segment, segmentIndex: index };
      });
      return { ...stop, ...best };
    })
    .filter(
      (stop) =>
        stop.distance <= getRouteReach(stop.element) &&
        stop.progress > 0 &&
        stop.progress < 1
    )
    .sort((first, second) => first.segmentIndex - second.segmentIndex || first.progress - second.progress);

  const corridor = elements.find(
    (element) => element.type === "corridor" || element.type === "staircase"
  );
  const corridorStops = corridor
    ? routePath.slice(1, -1).map((point, index) => ({
        element: corridor,
        point,
        segmentIndex: index,
        progress: 0,
      }))
    : [];

  return [
    { element: source, point: start },
    ...corridorStops,
    ...stops,
    { element: destination, point: end },
  ];
};

export const getIndoorDirections = (stops = []) => {
  const visibleStops = stops.filter((stop, index) => {
    const isEndpoint = index === 0 || index === stops.length - 1;
    const isWalkway = ["corridor", "staircase"].includes(stop.element?.type);

    return isEndpoint || !isWalkway;
  });

  return visibleStops.slice(1).map((stop, index) => ({
    step: index + 1,
    from: visibleStops[index].element,
    to: stop.element,
    floorName: stop.element.floorName,
  }));
};