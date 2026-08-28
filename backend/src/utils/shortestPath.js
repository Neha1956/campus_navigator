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

    // Forward
    graph[from].push({
      node: to,
      route,
      reverse: false,
    });

    // Reverse
    graph[to].push({
      node: from,
      route,
      reverse: true,
    });
  });

  console.log("GRAPH:", graph);
  console.log("START:", start);
  console.log("END:", end);

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

    if (current === null) {
      break;
    }

    if (current === end) {
      break;
    }

    visited.add(current);

    for (const neighbor of graph[current] || []) {
      const newDistance =
        distances[current] + neighbor.route.distance;

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

  console.log("PATH FOUND:", path);

  return {
    distance: distances[end],
    path,
  };
};

export default getShortestPath;