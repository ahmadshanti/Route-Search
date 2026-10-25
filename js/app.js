// =============================================================
// app.js  —  UI wiring                              (Owner: Ahmad)
// -------------------------------------------------------------
// Connects the form, the map, the upload button and the compare
// table to the algorithms registered in window.Algorithms.
// =============================================================
(function () {
  "use strict";

  const ORDER = ["BFS", "DFS", "UCS", "Greedy Best-First", "A*"];

  const $ = (id) => document.getElementById(id);
  const ui = {
    mapName: $("mapName"), mapFile: $("mapFile"), resetMap: $("resetMap"),
    form: $("searchForm"), start: $("start"), goal: $("goal"), algorithm: $("algorithm"),
    swap: $("swap"), compareBtn: $("compareBtn"), message: $("message"),
    result: $("result"), resultAlgo: $("resultAlgo"), resultPath: $("resultPath"),
    resultCost: $("resultCost"), resultSteps: $("resultSteps"),
    svg: $("map"), compareSection: $("compareSection"), compareSub: $("compareSub"),
    compareBody: $("compareBody"),
  };

  const state = { map: null, path: [], nextClick: "start" };

  // ---------- helpers ----------
  function showMessage(text, kind) {
    ui.message.textContent = text;
    ui.message.className = "message" + (kind ? " message--" + kind : "");
    ui.message.hidden = !text;
  }

  function friendlyError(err) {
    return err && err.message === "NOT_IMPLEMENTED"
      ? "This algorithm is not implemented yet."
      : "Error: " + (err && err.message ? err.message : err);
  }

  function fillSelect(select, items, selected) {
    select.innerHTML = "";
    items.forEach((name) => {
      const o = document.createElement("option");
      o.value = o.textContent = name;
      select.appendChild(o);
    });
    if (selected && items.includes(selected)) select.value = selected;
  }

  function redraw() {
    MapView.render(ui.svg, state.map, {
      path: state.path,
      start: ui.start.value,
      goal: ui.goal.value,
      onCityClick: handleCityClick,
    });
  }

  function clearResults() {
    state.path = [];
    ui.result.hidden = true;
    ui.compareSection.hidden = true;
    showMessage("");
  }

  // ---------- map loading ----------
  function loadMap(raw) {
    const map = Graph.parseMap(raw); // throws on invalid map
    state.map = map;
    ui.mapName.textContent = map.name + " · " + map.cities.length + " cities";
    fillSelect(ui.start, map.cities, map.cities.includes("Jenin") ? "Jenin" : map.cities[0]);
    fillSelect(ui.goal, map.cities, map.cities.includes("Hebron") ? "Hebron" : map.cities[map.cities.length - 1]);
    state.nextClick = "start";
    clearResults();
    redraw();
  }

  ui.mapFile.addEventListener("change", () => {
    const file = ui.mapFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        loadMap(reader.result);
        showMessage(`Loaded "${state.map.name}".`, "ok");
      } catch (err) {
        showMessage("Could not load this map. " + err.message, "error");
      }
      ui.mapFile.value = "";
    };
    reader.onerror = () => showMessage("Could not read the file.", "error");
    reader.readAsText(file);
  });

  ui.resetMap.addEventListener("click", () => loadMap(window.DEFAULT_MAP));

  // ---------- single search ----------
  function runOne(name) {
    const fn = window.Algorithms && window.Algorithms[name];
    if (!fn) throw new Error(`Algorithm "${name}" is not registered.`);
    return fn(state.map.graph, state.map.coords, ui.start.value, ui.goal.value);
  }

  ui.form.addEventListener("submit", (e) => {
    e.preventDefault();
    ui.compareSection.hidden = true;
    const name = ui.algorithm.value;
    try {
      const r = runOne(name);
      showResult(name, r);
    } catch (err) {
      state.path = [];
      ui.result.hidden = true;
      showMessage(friendlyError(err), "error");
      redraw();
    }
  });

  function showResult(name, r) {
    ui.resultAlgo.textContent = name + ":  " + ui.start.value + " → " + ui.goal.value;
    if (!r || !r.path) {
      state.path = [];
      ui.result.hidden = true;
      showMessage(`No route exists between ${ui.start.value} and ${ui.goal.value}` +
        (r && Number.isFinite(r.steps) ? ` (${r.steps} steps).` : "."), "error");
    } else {
      state.path = r.path;
      showPathChips(r.path);
      ui.resultCost.textContent = r.cost + " " + state.map.unit;
      ui.resultSteps.textContent = r.steps;
      ui.result.hidden = false;
      showMessage("");
    }
    redraw();
  }

  // Path as small "chips": Jenin → Nablus → ... (first green, last red)
  function showPathChips(path) {
    ui.resultPath.innerHTML = "";
    path.forEach((city, i) => {
      if (i > 0) {
        const arrow = document.createElement("span");
        arrow.className = "chip-arrow";
        arrow.textContent = "→";
        ui.resultPath.appendChild(arrow);
      }
      const chip = document.createElement("span");
      chip.className = "chip";
      if (i === 0) chip.classList.add("chip--start");
      if (i === path.length - 1 && i > 0) chip.classList.add("chip--goal");
      chip.textContent = city;
      ui.resultPath.appendChild(chip);
    });
  }

  // ---------- compare all ----------
  ui.compareBtn.addEventListener("click", () => {
    let rows;
    try {
      rows = Compare.compareAll(state.map.graph, state.map.coords,
        ui.start.value, ui.goal.value, window.Algorithms || {}, ORDER);
    } catch (err) {
      ui.compareSection.hidden = true;
      showMessage("Compare all: " + friendlyError(err), "error");
      return;
    }
    showMessage("");
    ui.result.hidden = true;
    ui.compareSub.textContent = `${ui.start.value} → ${ui.goal.value}`;
    ui.compareBody.innerHTML = "";

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      if (row.optimal) tr.className = "is-optimal";
      const cells = row.error
        ? [row.name, friendlyError({ message: row.error }), "—", "—", ""]
        : !row.path
          ? [row.name, "No route", "—", row.steps ?? "—", ""]
          : [row.name, row.path.join(" → "), row.cost + " " + state.map.unit, row.steps, row.optimal ? "✓ Optimal" : ""];
      cells.forEach((v, i) => {
        const td = document.createElement("td");
        td.textContent = v;
        if (i === 2 || i === 3) td.className = "num";
        if (i === 4 && row.optimal) td.className = "badge";
        tr.appendChild(td);
      });
      if (row.path) {
        tr.tabIndex = 0;
        tr.classList.add("clickable");
        const pick = () => {
          state.path = row.path;
          ui.compareBody.querySelectorAll("tr").forEach((t) => t.classList.remove("is-selected"));
          tr.classList.add("is-selected");
          redraw();
        };
        tr.addEventListener("click", pick);
        tr.addEventListener("keydown", (e) => { if (e.key === "Enter") pick(); });
      }
      ui.compareBody.appendChild(tr);
    });

    // show the first optimal path on the map by default
    const best = rows.find((r) => r.optimal && r.path);
    state.path = best ? best.path : [];
    ui.compareSection.hidden = false;
    redraw();
    ui.compareSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // ---------- small interactions ----------
  function handleCityClick(city) {
    if (state.nextClick === "start") {
      ui.start.value = city;
      state.nextClick = "goal";
    } else {
      ui.goal.value = city;
      state.nextClick = "start";
    }
    clearResults();
    redraw();
  }

  ui.swap.addEventListener("click", () => {
    const s = ui.start.value;
    ui.start.value = ui.goal.value;
    ui.goal.value = s;
    clearResults();
    redraw();
  });

  [ui.start, ui.goal].forEach((s) => s.addEventListener("change", () => { clearResults(); redraw(); }));

  // ---------- init ----------
  fillSelect(ui.algorithm, ORDER, "A*");
  try {
    loadMap(window.DEFAULT_MAP);
  } catch (err) {
    showMessage("Default map failed to load: " + err.message, "error");
  }
})();
