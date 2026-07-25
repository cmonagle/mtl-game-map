# 05 — The seeker map tool

This repo is a single-page **seeker deduction aid**, hosted at
<https://cmonagle.github.io/mtl-game-map/>. It shows every in-play station and its
1/4-mile hiding zone, and lets seekers add **filters** that model each answer the hider
gives — progressively greying out stations that can no longer be the hider's zone.

Everything is one static file, [`index.html`](../index.html) (~890 lines), plus the
[`stations.geojson`](../stations.geojson) data. No build step, no backend.

## Stack

- **MapLibre GL** — the map, using CARTO dark-matter basemap tiles.
- **Turf.js** — geometry (point-in-polygon, distance, circle, intersect/difference for
  clipping zones).
- **open-location-code** — parsing Plus Codes for the paste-a-coordinate input.
- **localStorage** (`jetlag-filters`) — persists your filters between reloads.

## Data model

`stations.geojson` is a `FeatureCollection`. Each real station produces **two** features,
linked by `name` + `system`:

| `featureType` | Geometry | Purpose |
|---------------|----------|---------|
| `station` | Point | the dot + label |
| `hidingZone` | Polygon (64-gon circle) | the 1/4-mile zone drawn around it |

Shared `properties`: `name`, `system` (`Metro`/`REM`), `zone` (`A`/`B`), and for zones
`radiusMiles`. The map splits features into *allowed* vs *excluded* sources and restyles
them as filters change. Allowed zones are additionally **clipped** to the active filters, so
you see the actual surviving sliver of each zone, not just the whole circle.

## The three filter types

Each filter is **include** or **exclude**, and each is drawn by tapping the map or pasting a
coordinate (lat/lng, Plus Code, or a Google Maps URL).

| Filter | Geometry | Include means | Models these questions |
|--------|----------|---------------|------------------------|
| **Radius** | circle around a point, radius in **miles** | keep stations *inside* the circle | **Radar**, Tentacle reach |
| **Line** | infinite line through 2 points; pick Side A / Side B | keep stations on the chosen side | dividing features, coastlines, borders |
| **Line + Perpendicular** | perpendicular bisector of the 2 points | keep the "closer" half-plane | **Measuring**, **Thermometer** |
| **Polygon** | arbitrary closed area | keep stations *inside* the area | **Matching** regions, **Photo** reasoning, Tentacle catchments |

A filter with **Exclude** simply inverts: Radar "No" → exclude inside the circle (hider is
*beyond* that distance); Measuring "further" → exclude the near side; etc.

Filters can be **toggled** (👁), **redrawn** (✎), **relabelled**, and **deleted**. Add via
the **+** button.

## Question → filter translation (the core workflow)

This is the table to keep open during a game. When the hider answers, add the matching
filter:

| Hider answered… | Add this filter |
|-----------------|-----------------|
| **Radar** "Yes, within *d*" | Radius = *d* around **your** position, **Include** |
| **Radar** "No, not within *d*" | Radius = *d* around your position, **Exclude** |
| **Measuring** "Closer to X than me" | Line through **you → X**, **Perpendicular**, **Include** the X side |
| **Measuring** "Further from X than me" | Same line, **Perpendicular**, **Include** the far side (or Exclude near side) |
| **Thermometer** "Hotter after I moved A→B" | Line through **A → B**, **Perpendicular**, **Include** the B (destination) side |
| **Thermometer** "Colder after A→B" | Same line, **Include** the A side |
| **Matching** "Yes, same *region*" | Polygon around the region **you** are in, **Include** |
| **Matching** "No, different *region*" | Polygon around your region, **Exclude** |
| **Tentacle** names POI *P*, reach *r* | Radius = *r* around you **Include** + Polygon around *P*'s catchment **Include** |
| **Tentacle** "not within reach *r*" | Radius = *r* around you, **Exclude** |
| **Photo** reveals terrain (waterfront, skyline…) | Reason manually, then Polygon **Include**/**Exclude** the fitting/unfitting areas |

Stack filters and the candidate set collapses. When one zone remains lit, that's your
target — head there, leave transit inside it, and trigger the endgame.

> **Measuring / Thermometer nuance:** the perpendicular-bisector line is drawn between the
> two reference points, and the hider is on one side of it. In the tool you draw the two
> points and tick **Perp.**; then pick the side the answer implies. Double-check the side by
> clicking a station you *know* should be excluded.

## Sharing a board

The **🔗 share** button serialises all filters into the URL (`?f=<json>`). Opening that link
shows a **preview** with **Adopt** (save as your own) or **Discard**. Handy for a seeker team
keeping one shared board, or for reviewing a round afterward. Preview state is **not** written
to localStorage until adopted.

## Coordinate input

The paste box accepts:
- `45.50,-73.57` (lat,lng — Google Maps order)
- Plus Codes, full (`87Q8GR2C+9W`) or short (`GR2C+9W`, recovered near Montréal)
- Google Maps URLs (`…@45.50,-73.57…`, `?q=lat,lng`, or `/place/lat,lng`)

## Ideas for future features

Cross-referenced with the rules docs — likely next build targets:

- **Named question presets** — pick "Radar 1 mi / Yes" from a menu instead of hand-drawing,
  auto-placing the filter at your GPS location.
- **Geolocation** — a "use my current location" button (seekers are always the filter origin
  for Radar/Measuring/Thermometer).
- **Undo / history** — a round can involve a dozen filters; make them reversible.
- **Tentacle Voronoi** — auto-generate a POI's catchment polygon instead of hand-drawing.
- **Candidate counter** — show "N stations remaining" as filters narrow.
- **Feature layers** — overlay boroughs, waterways, Mont Royal so Matching/Measuring answers
  can be applied by clicking a region rather than tracing it.
- **Larger-game data** — regenerate at 1/2-mile zones and wider scope for a Large game.

See [`04-montreal-adaptation.md`](04-montreal-adaptation.md) for the data-regeneration steps.
