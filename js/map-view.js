// =============================================================
// map-view.js  —  Draws the map as SVG             (Owner: Ahmad)
// -------------------------------------------------------------
// MapView.render(svg, map, { path, start, goal, onCityClick })
//   Draws every road (with its km), every city, and highlights
//   the found path. City positions come from the x/y coordinates,
//   so any uploaded map is drawn correctly.
// =============================================================
(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const PAD = 48;
  const WIDTH = 560;

  function el(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function edgeKey(a, b) {
    return a < b ? a + "|" + b : b + "|" + a;
  }

  function render(svg, map, opts) {
    opts = opts || {};
    const path = opts.path || [];
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // --- scale coordinates into the SVG box (y axis points up in the data) ---
    const xs = map.cities.map((c) => map.coords[c].x);
    const ys = map.cities.map((c) => map.coords[c].y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const spanX = Math.max(maxX - minX, 1e-9);
    const spanY = Math.max(maxY - minY, 1e-9);
    const scale = Math.min((WIDTH - 2 * PAD) / spanX, 620 / spanY);
    const height = Math.max(spanY * scale + 2 * PAD, 260);
    const offX = (WIDTH - spanX * scale) / 2;
    const offY = (height - spanY * scale) / 2;

    const pos = {};
    map.cities.forEach((c) => {
      pos[c] = {
        x: offX + (map.coords[c].x - minX) * scale,
        y: height - (offY + (map.coords[c].y - minY) * scale),
      };
    });

    svg.setAttribute("viewBox", `0 0 ${WIDTH} ${height}`);

    const onPath = new Set();
    for (let i = 0; i + 1 < path.length; i++) onPath.add(edgeKey(path[i], path[i + 1]));
    const pathCities = new Set(path);

    // --- roads: dark edge layer first, then the lighter road on top ---
    const edgeLayer = el("g", {}, svg);
    const roadLayer = el("g", {}, svg);
    const routeLayer = el("g", {}, svg);
    const labelLayer = el("g", {}, svg);
    map.roads.forEach((r) => {
      const a = pos[r.from], b = pos[r.to];
      const hot = onPath.has(edgeKey(r.from, r.to));
      el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "road-edge" }, edgeLayer);
      el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "road" }, roadLayer);

      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const g = el("g", { class: hot ? "km km--path" : "km" }, labelLayer);
      const text = String(r.km);
      const w = 8 + text.length * 7;
      el("rect", { x: mx - w / 2, y: my - 9, width: w, height: 18, rx: 4 }, g);
      el("text", { x: mx, y: my + 4, "text-anchor": "middle" }, g).textContent = text;
    });
    // --- found route: one polyline from start to goal ---
    // pathLength="1" lets the CSS animation "draw" it from 0% to 100%.
    if (path.length > 1) {
      const points = path.map((c) => pos[c].x + "," + pos[c].y).join(" ");
      el("polyline", { points, class: "route-edge" }, routeLayer);
      el("polyline", { points, class: "route", pathLength: 1 }, routeLayer);
    }

    // --- cities ---
    map.cities.forEach((c) => {
      const p = pos[c];
      let cls = "city";
      if (pathCities.has(c)) cls += " city--path";
      if (c === opts.start) cls += " city--start";
      if (c === opts.goal) cls += " city--goal";

      const isStart = c === opts.start, isGoal = c === opts.goal;
      const g = el("g", { class: cls, tabindex: 0, role: "button", "aria-label": c }, svg);
      el("circle", { cx: p.x, cy: p.y, r: 14, class: "city__hit" }, g);
      // start / goal: a pulsing ring and a bigger dot with "S" or "G" inside
      if (isStart || isGoal) el("circle", { cx: p.x, cy: p.y, r: 14, class: "city__pulse" }, g);
      el("circle", { cx: p.x, cy: p.y, r: isStart || isGoal ? 10 : 6, class: "city__dot" }, g);
      if (isStart || isGoal) {
        el("text", { x: p.x, y: p.y + 3.2, "text-anchor": "middle", class: "city__letter" }, g)
          .textContent = isStart ? "S" : "G";
      }
      const right = p.x < WIDTH - 110;
      el("text", {
        x: p.x + (right ? 13 : -13),
        y: p.y - 10,
        "text-anchor": right ? "start" : "end",
        class: "city__label",
      }, g).textContent = c;

      if (opts.onCityClick) {
        g.addEventListener("click", () => opts.onCityClick(c));
        g.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opts.onCityClick(c); }
        });
      }
    });
  }

  window.MapView = { render };
})();
