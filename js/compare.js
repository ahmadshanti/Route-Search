// =============================================================
// compare.js  —  "Compare all" logic                (Owner: Hala)
// -------------------------------------------------------------
// compareAll(graph, coords, start, goal, algorithms, order)
//
//   algorithms : the window.Algorithms object { "BFS": fn, ... }
//   order      : display order, e.g. ["BFS","DFS","UCS","Greedy Best-First","A*"]
//
// Must return one row per algorithm, in `order`:
//   [
//     { name: "BFS", path: [...], cost: 185, steps: 11, optimal: false, error: null },
//     { name: "UCS", path: [...], cost: 144, steps: 11, optimal: true,  error: null },
//     ...
//   ]
//
//   - Run every algorithm on the same start/goal.
//   - If an algorithm throws, keep the row with error = the message
//     (and path/cost/steps = null) so the table still shows it.
//   - optimal = true for every row whose cost equals the LOWEST cost
//     found (several rows can be optimal).
//
// The table itself is drawn by app.js from these rows.
// =============================================================
(function () {
  "use strict";

  function compareAll(graph, coords, start, goal, algorithms, order) {
    const rows = [];

    for (const name of order) {
      try {
        const algorithm = algorithms[name];

        if (typeof algorithm !== "function") {
          throw new Error("Algorithm is not registered.");
        }

        const result = algorithm(graph, coords, start, goal);

        rows.push({
          name: name,
          path: result.path,
          cost: result.cost,
          steps: result.steps,
          optimal: false,
          error: null
        });
      } catch (error) {
        rows.push({
          name: name,
          path: null,
          cost: null,
          steps: null,
          optimal: false,
          error: error.message || String(error)
       });
      }
    }

    let lowestCost = Infinity;

    for (const row of rows) {
      if (
        row.error === null &&
        row.path !== null &&
        Number.isFinite(row.cost) &&
        row.cost < lowestCost
      ) {
        lowestCost = row.cost;
      }
    }

    for (const row of rows) {
      row.optimal =
        row.error === null &&
        row.path !== null &&
        Number.isFinite(row.cost) &&
        row.cost === lowestCost;
    }

    return rows;
  }

  window.Compare = { compareAll };
})();
