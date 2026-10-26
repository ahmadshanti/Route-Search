# Route Search Web App

Assignment 1 — Fundamentals of Artificial Intelligence (10672224), Fall 2026
Instructor: Nadeem Zaid Kilani

A web app that finds a route between any two cities on a road map using
**BFS, DFS, UCS, Greedy Best-First and A\***, draws the path on the map, and
compares all algorithms side by side.

## Group members

| Name | Student ID | Part |
|------|-----------|------|
| Ahmad Al-Shanti | _12326330_ | Map loading, map drawing, UI, integration |
| Shaima Dwikat | _12323638_ | BFS, DFS, UCS |
| Hala _____ | _ID_ | Heuristic, Greedy Best-First, A*, Compare all |

## How to run

No installation and no server needed — plain HTML/CSS/JavaScript.

1. Download / unzip the project.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox).

Optional: run it through a local server instead, e.g. `npx serve .` or
`python -m http.server`, then open the printed address.

## How to use

1. Choose the **start city**, **goal city** and **algorithm** (or click two cities on the map).
2. Press **Find route** — the path is highlighted on the map, with its total cost (km) and number of steps.
3. Press **Compare all** — every algorithm runs on the same start and goal; the table shows each
   path, cost and steps, and marks the optimal (lowest-cost) results. Click a row to see its path.
4. Press **Upload map (.json)** to load another map in the same format
   (try `data/sample_map.json`). **Default map** returns to the West Bank map.

## Rules followed by every algorithm

- **Heuristic:** `h(n)` = straight-line distance from `n` to the goal from the x/y coordinates, rounded down.
- **Ties:** equal nodes → the one that comes first alphabetically.
- **Goal test:** when a node is removed from the frontier, not when it is generated.
- **Graph search:** a city is never expanded twice.
- **Steps:** number of nodes removed from the frontier and expanded.

No ready-made search or graph library is used.

## Project structure

```
index.html                  App page
css/style.css               Styles
data/westbank_map.json      Default map (given with the assignment)
data/default-map.js         Same map embedded as JS (so index.html works without a server)
data/sample_map.json        Small map for testing the upload
js/graph.js                 Map parsing + validation, neighbours (A→Z), path cost
js/algorithms/uninformed.js BFS, DFS, UCS
js/algorithms/informed.js   Heuristic, Greedy Best-First, A*
js/compare.js               "Compare all" logic (optimal marking)
js/map-view.js              SVG map drawing and path highlight
js/app.js                   UI wiring
```

## Map JSON format

```json
{
  "name": "West Bank (simplified road map)",
  "unit": "km",
  "cities": [ { "name": "Jenin", "x": 28.38, "y": 106.671 } ],
  "roads":  [ { "from": "Jenin", "to": "Tubas", "km": 22 } ]
}
```

Roads are two-way. Uploaded maps are validated (unknown cities, missing
coordinates, non-positive distances and duplicate roads are reported).
