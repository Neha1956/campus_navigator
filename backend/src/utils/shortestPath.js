const getShortestPath = (routes, startId, endId) => {
  const start = startId.toString();
  const end = endId.toString();

  const graph = {};

  routes.forEach((route) => {
    if (!route.from || !route.to) return;

    const from = route.from._id.toString();
    const to = route.to._id.toString();

    if (!graph[from]) {
      graph[from] = [];
    }

    if (!graph[to]) {
      graph[to] = [];
    }

    // Optional: Agar floor change ho raha hai toh stair/floor penalty add kar sakte hain
    let routeWeight = route.distance;
    const fromFloor = route.from.floor ?? 0;
    const toFloor = route.to.floor ?? 0;
    
    if (fromFloor !== toFloor) {
      // Jaise 5 meters ya equivalent walking distance penalty for changing floors
      routeWeight += 10; 
    }

    // Forward
    graph[from].push({
      node: to,
      route,
      weight: routeWeight,
      reverse: false,
    });

    // Reverse
    graph[to].push({
      node: from,
      route,
      weight: routeWeight,
      reverse: true,
    });
  });

  if (!graph[start]) {
    console.log("START NODE NOT FOUND");
    return null;
  }

  const distances = {};
  const previous = {};
  const visited = new Set();

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[start] = 0;

  while (true) {
    let current = null;
    let smallest = Infinity;

    for (const node of Object.keys(distances)) {
      if (
        !visited.has(node) &&
        distances[node] < smallest
      ) {
        smallest = distances[node];
        current = node;
      }
    }

    if (current === null || current === end) {
      break;
    }

    visited.add(current);

    for (const neighbor of graph[current] || []) {
      // Use the calculated weight (includes floor change penalty if applicable)
      const newDistance = distances[current] + neighbor.weight;

      if (newDistance < distances[neighbor.node]) {
        distances[neighbor.node] = newDistance;

        previous[neighbor.node] = {
          node: current,
          route: neighbor.route,
          reverse: neighbor.reverse,
        };
      }
    }
  }

  if (distances[end] === Infinity) {
    console.log("NO PATH FOUND");
    return null;
  }

  const path = [];
  let current = end;

  while (current !== start) {
    const previousNode = previous[current];

    if (!previousNode) {
      return null;
    }

    path.unshift({
      ...previousNode.route.toObject(),
      reverse: previousNode.reverse,
    });

    current = previousNode.node;
  }

  return {
    distance: distances[end],
    path,
  };
};

export default getShortestPath;