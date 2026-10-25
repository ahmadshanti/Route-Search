// =============================================================
// graph.js  —  Map loading & graph helpers        (Owner: Ahmad)
// -------------------------------------------------------------
// Turns a map JSON (default or uploaded) into the shared shape
// every algorithm uses:
//
//   map.graph  = { "Jenin": { "Tubas": 22, "Tulkarm": 38, ... }, ... }
//   map.coords = { "Jenin": { x: 28.38, y: 106.671 }, ... }
//   map.cities = ["Bethlehem", "Hebron", ...]   (sorted A→Z)
//
// No external graph library is used (assignment rule).
// =============================================================
(function () {
  "use strict";

  /**
   * Validate and parse a map. Accepts a JSON string or an object.
   * Throws an Error with a readable message if the map is invalid.
   */
  function parseMap(raw) {
    let data;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error("The file is not valid JSON: " + e.message);
      }
    } else {
      data = raw;
    }

    if (!data || typeof data !== "object") throw new Error("Map must be a JSON object.");
    if (!Array.isArray(data.cities) || data.cities.length === 0)
      throw new Error('Map must have a non-empty "cities" list.');
    if (!Array.isArray(data.roads))
      throw new Error('Map must have a "roads" list.');

    const coords = {};
    const graph = {};

    data.cities.forEach((c, i) => {
      if (!c || typeof c.name !== "string" || c.name.trim() === "")
        throw new Error(`City #${i + 1} has no valid "name".`);
      const name = c.name.trim();
      if (coords[name]) throw new Error(`City "${name}" appears more than once.`);
      const x = Number(c.x), y = Number(c.y);
      if (!Number.isFinite(x) || !Number.isFinite(y))
        throw new Error(`City "${name}" needs numeric "x" and "y" coordinates.`);
      coords[name] = { x, y };
      graph[name] = {};
    });

    const roads = [];
    data.roads.forEach((r, i) => {
      const where = `Road #${i + 1}`;
      if (!r || typeof r.from !== "string" || typeof r.to !== "string")
        throw new Error(`${where} needs "from" and "to" city names.`);
      const a = r.from.trim(), b = r.to.trim();
      if (!coords[a]) throw new Error(`${where}: unknown city "${a}".`);
      if (!coords[b]) throw new Error(`${where}: unknown city "${b}".`);
      if (a === b) throw new Error(`${where}: a road cannot connect "${a}" to itself.`);
      const km = Number(r.km);
      if (!Number.isFinite(km) || km <= 0)
        throw new Error(`${where} (${a} – ${b}) needs a positive "km" value.`);
      if (graph[a][b] !== undefined)
        throw new Error(`Road ${a} – ${b} is listed more than once.`);
      // Roads are two-way
      graph[a][b] = km;
      graph[b][a] = km;
      roads.push({ from: a, to: b, km });
    });

    return {
      name: typeof data.name === "string" && data.name.trim() ? data.name.trim() : "Untitled map",
      unit: data.unit || "km",
      cities: Object.keys(coords).sort(compareNames),
      coords,
      graph,
      roads,
    };
  }

  /** Alphabetical comparison used for every tie-break in the project. */
  function compareNames(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /**
   * Neighbours of a city, sorted alphabetically (A→Z):
   *   [ { city: "Nablus", km: 42 }, { city: "Tubas", km: 22 }, ... ]
   * Use this in every algorithm so tie-breaking is consistent.
   */
  function neighbors(graph, city) {
    return Object.keys(graph[city] || {})
      .sort(compareNames)
      .map((n) => ({ city: n, km: graph[city][n] }));
  }

  /** Total km of a path given as an array of city names. */
  function pathCost(graph, path) {
    let total = 0;
    for (let i = 0; i + 1 < path.length; i++) total += graph[path[i]][path[i + 1]];
    return total;
  }

  window.Graph = { parseMap, neighbors, pathCost, compareNames };
})();
