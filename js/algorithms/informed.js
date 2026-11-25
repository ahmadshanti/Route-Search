// =============================================================
// informed.js  —  heuristic, Greedy Best-First, A*   (Owner: Hala)
// -------------------------------------------------------------
// Same signature and return shape as the uninformed algorithms:
//
//   fn(graph, coords, start, goal)
//     → { path: [...], cost: <km>, steps: <n> }
//     → { path: null, cost: null, steps: n }   if no path exists
//
// RULES (from the assignment sheet — follow them exactly):
//   1. h(n) = straight-line distance from n to the goal, computed
//      from the x/y coordinates and ROUNDED DOWN (Math.floor).
//   2. Ties: equal priority → city that comes first alphabetically.
//   3. Goal test when a node is REMOVED from the frontier.
//   4. Graph search: never expand the same city twice.
//   5. Steps = number of nodes removed from the frontier and expanded.
//
// Helpers available:  Graph.neighbors(graph, city), Graph.pathCost(graph, path)
// Do NOT use any ready-made search/graph library.
// =============================================================
(function () {
  "use strict";

  /**
   * h(n): straight-line distance from city `n` to `goal`, rounded down.
   * Expected (goal = Hebron): Jenin 104, Nablus 78, Ramallah 42, Bethlehem 21
   */
  function heuristic(coords, n, goal) {
    const dx = coords[n].x - coords[goal].x;
    const dy = coords[n].y - coords[goal].y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    return Math.floor(distance); 
  }

  /**
   * Greedy Best-First Search — frontier ordered by f(n) = h(n).
   * Expected: Jenin → Hebron = 144 km, 6 steps
   */
 function greedy(graph, coords, start, goal) {
  const frontier = [
    { city: start, path: [start] }
  ];

  const expanded = new Set();
  let steps = 0;

  while (frontier.length > 0) {
    let best = 0;

    for (let i = 1; i < frontier.length; i++) {
      const currentH = heuristic(coords, frontier[i].city, goal);
      const bestH = heuristic(coords, frontier[best].city, goal);

      if (
        currentH < bestH ||
        (currentH === bestH &&
          frontier[i].city < frontier[best].city)
      ) {
        best = i;
      }
    }

    const node = frontier.splice(best, 1)[0];

    if (expanded.has(node.city)) {
      continue;
    }

    expanded.add(node.city);
    steps++;

    if (node.city === goal) {
      return {
        path: node.path,
        cost: Graph.pathCost(graph, node.path),
        steps: steps
      };
    }

    const neighbors = Graph.neighbors(graph, node.city);

    for (const neighbor of neighbors) {
      if (!expanded.has(neighbor.city)) {
        frontier.push({
          city: neighbor.city,
          path: node.path.concat(neighbor.city)
        });
      }
    }
  }

  return {
    path: null,
    cost: null,
    steps: steps
  };
}

  /**
   * A* Search — frontier ordered by f(n) = g(n) + h(n).
   * Expected: Jenin → Hebron = 144 km, 10 steps
   */
  function aStar(graph, coords, start, goal) {
  const frontier = [
    { city: start, path: [start], g: 0 }
  ];

  const expanded = new Set();
  let steps = 0;

  while (frontier.length > 0) {
    let best = 0;

    for (let i = 1; i < frontier.length; i++) {
      const currentF =
        frontier[i].g +
        heuristic(coords, frontier[i].city, goal);

      const bestF =
        frontier[best].g +
        heuristic(coords, frontier[best].city, goal);

      if (
        currentF < bestF ||
        (currentF === bestF &&
          frontier[i].city < frontier[best].city)
      ) {
        best = i;
      }
    }

    const node = frontier.splice(best, 1)[0];

    if (expanded.has(node.city)) {
      continue;
    }

    expanded.add(node.city);
    steps++;

    if (node.city === goal) {
      return {
        path: node.path,
        cost: node.g,
        steps: steps
      };
    }

    const neighbors = Graph.neighbors(graph, node.city);

     for (const neighbor of neighbors) {
       if (expanded.has(neighbor.city)) {
        continue;
       }

       const newG = node.g + neighbor.km;

       let existing = -1;

       for (let i = 0; i < frontier.length; i++) {
         if (frontier[i].city === neighbor.city) {
          existing = i;
          break;
         }
        }

       if (existing === -1) {
         frontier.push({
           city: neighbor.city,
           path: node.path.concat(neighbor.city),
           g: newG
         });
       } else if (newG < frontier[existing].g) {
         frontier[existing].g = newG;
         frontier[existing].path =
           node.path.concat(neighbor.city);
       }
      }
  }   

  return {
    path: null,
    cost: null,
    steps: steps
  };
}

  window.Heuristic = heuristic;
  window.Algorithms = window.Algorithms || {};
  window.Algorithms["Greedy Best-First"] = greedy;
  window.Algorithms["A*"] = aStar;
})();
