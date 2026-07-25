# AGENTS.md

Orientation for AI agents (and humans) working on this repo. Read this first.

## What this is

A **seeker's deduction map** for the game **Jet Lag: The Game — Hide + Seek**, adapted to
Montréal. It plots STM Métro + REM stations with their hiding-zone circles and lets the
seeker team add **filters** that model each answer the hider gives, greying out stations
until the hider's zone is the only one left.

- **Live site:** <https://cmonagle.github.io/mtl-game-map/> (GitHub Pages, served from repo root).
- **Not affiliated with Jet Lag: The Game.** It's a fan tool for a purchased game.

## The one concept to understand

Every answer a hider gives is a **geometric constraint** on where they can be, and each of
the app's three filter types models a class of question:

| Filter | Models |
|--------|--------|
| **Radius** (circle) | Radar questions ("within X miles?"), Tentacle reach |
| **Line + Perpendicular** (bisector / half-plane) | Measuring & Thermometer ("closer/further", "hotter/colder") |
| **Polygon** (area) | Matching regions, Photo reasoning, Tentacle catchments |

The full **question → filter translation table** is in [`docs/05-map-tool.md`](docs/05-map-tool.md).
That mapping — not the rules text — is the original value of this repo. If you change filter
behaviour, keep that doc in sync.

## Architecture

Deliberately minimal — **no build step, no framework, no backend.**

| File | Role |
|------|------|
| [`index.html`](index.html) | The entire app (~890 lines): HTML + inline CSS + inline JS. |
| [`stations.geojson`](stations.geojson) | Generated data: 88 stations + a hiding-zone circle each. |
| [`fetch_stations.js`](fetch_stations.js) | One-off Node script that regenerates the geojson from OpenStreetMap (Overpass API). |
| [`docs/`](docs/) | Rules reference + app documentation. Start at [`docs/README.md`](docs/README.md). |

**Libraries** (loaded from unpkg CDNs in `index.html`, no npm install):
- **MapLibre GL** — map rendering (CARTO dark-matter basemap).
- **Turf.js** — geometry: distance, circle, point-in-polygon, intersect/difference (zone clipping).
- **open-location-code** — Plus Code parsing for the coordinate paste box.

**State:** filters live in `localStorage['jetlag-filters']` and can be shared via a `?f=<json>`
URL param (preview mode with Adopt/Discard). There is no server; everything is client-side.

## Data model

`stations.geojson` is a `FeatureCollection`. Each station is **two** features sharing
`name`+`system`:
- `featureType: "station"` — a Point (the dot/label).
- `featureType: "hidingZone"` — a Polygon (64-gon circle, 1/4 mile ≈ 402 m radius).

Shared `properties`: `name`, `system` (`"Metro"`|`"REM"`), `zone` (`"A"`|`"B"`).

Regenerate with `node fetch_stations.js` (Node ≥18 for global `fetch`). Tunable constants at
the top of that file: `BBOX` (Overpass bounding box), `QUARTER_MILE_M` (zone radius — bump to
`804.672` for a 1/2-mile "Large" game), and `classifyZone()` (A/B/C zone logic + hard-coded
off-island station lists). See [`docs/04-montreal-adaptation.md`](docs/04-montreal-adaptation.md).

## Dev workflow

```bash
# Run locally — it's a static page, any file server works:
python3 -m http.server 8000     # → http://localhost:8000

# Regenerate station data:
node fetch_stations.js          # rewrites stations.geojson
```

No tests, no linter, no CI at time of writing. Deployment is automatic via GitHub Pages on
push to the default branch. When editing `index.html`, prefer to **match the existing vanilla
style** (plain DOM APIs, inline handlers, the established CSS variables/naming) rather than
introducing a framework or build tooling.

## Where the rules live — and how to treat them

The [`docs/`](docs/) rules pages (`01`–`03`) are an **unofficial convenience summary**. They
are a cheat sheet, not a spec, and may be out of date.

> When reasoning about game mechanics, treat the **official rules as authoritative**, not these docs:
> - 📖 Official rules: <https://rules.jetlagthegame.com/>
> - 🛒 The game / creators: <https://jetlagthegame.com/> · <https://nebula.tv/jetlag>

Docs `04` (Montréal adaptation) and `05` (the map tool + filter mapping) *are* the
repo-specific source of truth — keep those accurate and current when you change code or data.

## Good future-feature candidates

Cross-referenced with the rules (see [`docs/05-map-tool.md`](docs/05-map-tool.md#ideas-for-future-features)):
named question presets, browser geolocation as the filter origin, undo/history, a "N stations
remaining" counter, borough/waterway/Mont-Royal overlays for click-to-apply Matching answers,
auto-Voronoi for Tentacle catchments, and a 1/2-mile "Large game" data variant.

## Conventions / gotchas

- **Distances are in miles** in the UI and filter math (`radius` field, Turf `{units:'miles'}`);
  the geojson generator works in metres. Don't mix them up.
- Coordinates in geojson/Turf are **`[lng, lat]`**; user-facing paste input is **`lat,lng`**
  (Google Maps order). `parseCoordinate()` in `index.html` handles the conversion.
- Zones are **clipped** to active filters before rendering, so the map shows the surviving
  sliver of each zone — not just whole circles. That logic is `clipZonePolygon()`.
- Keep it dependency-light and offline-friendly; the value of this app is that it's one file
  that runs anywhere, including on a phone mid-game with spotty signal.
