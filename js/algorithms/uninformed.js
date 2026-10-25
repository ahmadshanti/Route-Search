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
   * Breadth-First Search — frontier is a FIFO queue.
   * Expected: Jenin → Hebron = 185 km, 11 steps
   */
  function bfs(graph, coords, start, goal) {
    // TODO (Shaima)
    throw new Error("NOT_IMPLEMENTED");
  }

  /**
   * Depth-First Search — frontier is a LIFO stack.
   * Tip: push neighbours in REVERSE alphabetical order so the
   * alphabetically-first one is popped first.
   * Expected: Jenin → Hebron = 185 km, 5 steps
   */
  function dfs(graph, coords, start, goal) {
    // TODO (Shaima)
    throw new Error("NOT_IMPLEMENTED");
  }

  /**
   * Uniform-Cost Search — frontier ordered by g(n) = cost so far.
   * Tie on g → alphabetical by city name.
   * Expected: Jenin → Hebron = 144 km, 11 steps
   */
  function ucs(graph, coords, start, goal) {
    // TODO (Shaima)
    throw new Error("NOT_IMPLEMENTED");
  }

  window.Algorithms = window.Algorithms || {};
  window.Algorithms["BFS"] = bfs;
  window.Algorithms["DFS"] = dfs;
  window.Algorithms["UCS"] = ucs;
})();
