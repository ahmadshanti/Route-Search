// =============================================================
// uninformed.js  —  BFS, DFS, UCS                 (Owner: Shaima)
// -------------------------------------------------------------
// Every function has the SAME signature and return shape:
//
//   fn(graph, coords, start, goal)
//     → { path: ["Jenin", ..., "Hebron"], cost: 185, steps: 11 }
//     → { path: null, cost: null, steps: n }   if no path exists
//
// RULES (from the assignment sheet — follow them exactly):
//   1. Ties: when two nodes are equally good, pick the one that
//      comes first alphabetically.
//      → Use Graph.neighbors(graph, city): it is already sorted A→Z.
//   2. Goal test: when a node is REMOVED from the frontier,
//      not when it is generated.
//   3. Graph search: never expand the same city twice
//      (keep an "expanded" Set; skip a popped city already in it).
//   4. Steps = number of nodes removed from the frontier AND expanded
//      (count +1 each time you pop a city that was not expanded before,
//       including the goal itself).
//
// Helpers available:  Graph.neighbors(graph, city), Graph.pathCost(graph, path)
// Do NOT use any ready-made search/graph library.
// =============================================================
(function () {
  "use strict";

  /**
   * Graph.neighbors may return plain city names, or objects that carry the
   * city name and the road length. This turns either form into
   * { city, km } so the algorithms don't care which one it is.
   * (km is only needed by UCS; if it is missing we ask Graph.pathCost.)
   */
  function expand(graph, city) {
    return Graph.neighbors(graph, city).map(function (nb) {
      if (typeof nb === "string") {
        return { city: nb, km: Graph.pathCost(graph, [city, nb]) };
      }
      var name = nb.city !== undefined ? nb.city
               : nb.to !== undefined ? nb.to
               : nb.name !== undefined ? nb.name
               : nb.node;
      var km = nb.km !== undefined ? nb.km
             : nb.cost !== undefined ? nb.cost
             : nb.weight !== undefined ? nb.weight
             : nb.distance;
      if (km === undefined) km = Graph.pathCost(graph, [city, name]);
      return { city: name, km: km };
    });
  }

  function fail(steps) {
    return { path: null, cost: null, steps: steps };
  }

  function success(graph, path, steps) {
    return { path: path, cost: Graph.pathCost(graph, path), steps: steps };
  }

  /**
   * Breadth-First Search — frontier is a FIFO queue.
   * Expected: Jenin → Hebron = 185 km, 11 steps
   */
  function bfs(graph, coords, start, goal) {
    var frontier = [{ city: start, path: [start] }];
    var head = 0;                       // queue pointer (avoids slow shift())
    var expanded = new Set();
    var steps = 0;

    while (head < frontier.length) {
      var node = frontier[head++];      // remove from the FRONT (FIFO)
      if (expanded.has(node.city)) continue;
      expanded.add(node.city);
      steps++;

      if (node.city === goal) return success(graph, node.path, steps);

      expand(graph, node.city).forEach(function (nb) {
        if (!expanded.has(nb.city)) {
          frontier.push({ city: nb.city, path: node.path.concat(nb.city) });
        }
      });
    }
    return fail(steps);
  }

  /**
   * Depth-First Search — frontier is a LIFO stack.
   * Tip: push neighbours in REVERSE alphabetical order so the
   * alphabetically-first one is popped first.
   * Expected: Jenin → Hebron = 185 km, 5 steps
   */
  function dfs(graph, coords, start, goal) {
    var frontier = [{ city: start, path: [start] }];
    var expanded = new Set();
    var steps = 0;

    while (frontier.length > 0) {
      var node = frontier.pop();        // remove from the TOP (LIFO)
      if (expanded.has(node.city)) continue;
      expanded.add(node.city);
      steps++;

      if (node.city === goal) return success(graph, node.path, steps);

      var nbs = expand(graph, node.city);
      for (var i = nbs.length - 1; i >= 0; i--) {   // reverse A→Z
        if (!expanded.has(nbs[i].city)) {
          frontier.push({ city: nbs[i].city, path: node.path.concat(nbs[i].city) });
        }
      }
    }
    return fail(steps);
  }

  /**
   * Uniform-Cost Search — frontier ordered by g(n) = cost so far.
   * Tie on g → alphabetical by city name.
   * Expected: Jenin → Hebron = 144 km, 11 steps
   */
  function ucs(graph, coords, start, goal) {
    var frontier = [{ city: start, g: 0, path: [start] }];
    var expanded = new Set();
    var steps = 0;

    while (frontier.length > 0) {
      // pick the entry with the smallest g; on a tie, the alphabetically-first city
      var best = 0;
      for (var i = 1; i < frontier.length; i++) {
        var a = frontier[i], b = frontier[best];
        if (a.g < b.g || (a.g === b.g && a.city < b.city)) best = i;
      }
      var node = frontier.splice(best, 1)[0];

      if (expanded.has(node.city)) continue;
      expanded.add(node.city);
      steps++;

      if (node.city === goal) return success(graph, node.path, steps);

      expand(graph, node.city).forEach(function (nb) {
        if (!expanded.has(nb.city)) {
          frontier.push({
            city: nb.city,
            g: node.g + nb.km,
            path: node.path.concat(nb.city)
          });
        }
      });
    }
    return fail(steps);
  }

  window.Algorithms = window.Algorithms || {};
  window.Algorithms["BFS"] = bfs;
  window.Algorithms["DFS"] = dfs;
  window.Algorithms["UCS"] = ucs;
})();