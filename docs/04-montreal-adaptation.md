# 04 — Montreal adaptation

How the generic rules map onto Montreal, and the concrete choices baked into this repo's
data. This is the doc to argue over before a real game.

## Transit network in play

The hiding zones are built from **STM Métro + REM stations** (the two rapid-transit systems
with fixed, well-defined stops). Data is pulled from OpenStreetMap by
[`fetch_stations.js`](../fetch_stations.js) via the Overpass API, then rendered by
[`index.html`](../index.html).

Current data snapshot (from `stations.geojson`):

| | Count |
|---|---|
| **Total stations in play** | **88** |
| Métro | 67 |
| REM | 21 |
| Zone A (Island of Montréal) | 79 |
| Zone B (off-island: Laval, South Shore) | 9 |

Each station gets a **1/4-mile (402 m) hiding-zone circle** — matching the Small/Medium
game radius. Every station is therefore a legal hiding-zone centre.

> **Not included by design:** city buses, the exo commuter-rail lines, and the YUL-airport
> REM stop (explicitly filtered out). Zone C stations (Deux-Montagnes, Grand-Moulin,
> Sunnybrooke) are classified but **excluded** from play — only Zones A and B ship in the
> data. If you want a Large game, widen the net (see "Open decisions" below).

## Zones (ARTM fare zones, reused as game regions)

`fetch_stations.js` tags each station with an ARTM-style zone:

- **Zone A** — Island of Montréal (the bulk of the Métro + island REM).
- **Zone B** — off-island: Laval (Orange-line stns Cartier, De la Concorde, Montmorency),
  Longueuil (Yellow line), and South-Shore / Laval REM (Brossard, Du Quartier, Panama,
  Gare Rive-Sud, Île-Bigras, Sainte-Dorothée, etc.).
- **Zone C** — beyond B (Deux-Montagnes branch). Classified but **not shipped**.

The map colours zones differently (A = blue, B = orange) so seekers can eyeball how far
out a candidate zone is.

## Suggested game size for Montreal

- **Medium** is the natural fit: 1/4-mile zones, 60-minute hiding period, Tentacles enabled,
  10-minute photo limit. The island + near off-island is roughly city-scale.
- Bump to **Large** (1/2-mile zones, 180-min hiding period, 50-mile thermometer, 15-mile
  tentacles) only if you extend the network outward — at which point the 1/4-mile circles in
  the current data should be regenerated at 1/2 mile.

## Mapping question features to Montreal

Concrete answers to "what counts as X here" — agree on these up front:

| Rules feature | Montreal interpretation |
|---------------|-------------------------|
| Commercial airport | YUL (Montréal–Trudeau); possibly YMX Mirabel (cargo) |
| High-speed train line | None true HSR — use VIA Rail corridor / Gare Centrale as the "rail" reference, or declare N/A |
| Rail station | Métro/REM/exo stations, or specifically Gare Centrale / Lucien-L'Allier |
| International border | Canada–US border (~50 km south) |
| 1st admin division | Province of Québec (constant — usually useless) |
| 2nd admin division | Région administrative (Montréal / Laval / Montérégie) |
| 3rd admin division | Agglomeration / MRC |
| 4th admin division | Borough (*arrondissement*) or on-island municipality (Westmount, etc.) |
| Body of water / coastline | St. Lawrence River, Rivière des Prairies, Lac Saint-Louis |
| Mountain | Mont Royal (and its summits) |
| Sea level | Elevation above sea level (Mont Royal ≈ 233 m is the high point) |

> **Admin divisions are the fiddly part.** Montreal's boroughs, demerged municipalities,
> and the agglomeration overlap confusingly. Write down the exact hierarchy you'll use so
> "same 3rd administrative division?" has a definite yes/no.

## Open decisions / house rules to settle

1. **Network scope** — Métro + REM only (current), or add exo lines / key bus corridors?
2. **Game size** — Medium (1/4 mi) vs Large (1/2 mi). If Large, regenerate zones at 800 m.
3. **Zone B extent** — how far off-island is fair? Include all of the South-Shore REM?
4. **Admin-division hierarchy** — lock the 1st–4th mapping above.
5. **Card vs coin economy** — use the tabletop draw/keep card system (default) or an
   app-based coin/curse-dice variant.
6. **Custom curses** — the creators encourage local ones. Montreal candidates: "photograph a
   *dep* (corner store)", "eat a smoked-meat sandwich", "find a mural in the Plateau",
   "touch the river". Add to [`03-curses-and-cards.md`](03-curses-and-cards.md) once agreed.

## Regenerating the data

`fetch_stations.js` is a one-off Node script (no dependencies beyond Node ≥18 for `fetch`):

```bash
node fetch_stations.js   # rewrites stations.geojson from live OSM data
```

Edit the constants at the top to change scope:
- `BBOX` — the Overpass bounding box (currently Greater Montréal).
- `QUARTER_MILE_M` — the hiding-zone radius (switch to 804.672 for a 1/2-mile Large game).
- `classifyZone()` — the A/B/C zone logic and the hard-coded off-island station lists.

See [`05-map-tool.md`](05-map-tool.md) for how the map consumes this file.
