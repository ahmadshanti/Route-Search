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
    // TODO (Hala)
    throw new Error("NOT_IMPLEMENTED");
  }

  /**
   * Greedy Best-First Search — frontier ordered by f(n) = h(n).
   * Expected: Jenin → Hebron = 144 km, 6 steps
   */
  function greedy(graph, coords, start, goal) {
    // TODO (Hala)
    throw new Error("NOT_IMPLEMENTED");
  }

  /**
   * A* Search — frontier ordered by f(n) = g(n) + h(n).
   * Expected: Jenin → Hebron = 144 km, 10 steps
   */
  function aStar(graph, coords, start, goal) {
    // TODO (Hala)
    throw new Error("NOT_IMPLEMENTED");
  }

  window.Heuristic = heuristic;
  window.Algorithms = window.Algorithms || {};
  window.Algorithms["Greedy Best-First"] = greedy;
  window.Algorithms["A*"] = aStar;
})();
