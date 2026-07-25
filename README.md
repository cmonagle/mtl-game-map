# mtl-game-map

A seeker's deduction map for playing **[Jet Lag: The Game — Hide + Seek](https://jetlagthegame.com/)**
in Montréal.

**Live:** <https://cmonagle.github.io/mtl-game-map/>

It plots every STM Métro and REM station with its 1/4-mile hiding zone, then lets the seeker
team add **filters** — one per answer the hider gives — that grey out stations until only the
hider's zone is left lit.

## What's here

| Path | What it is |
|------|-----------|
| [`index.html`](index.html) | The whole app — one static page (MapLibre GL + Turf.js). No build step. |
| [`stations.geojson`](stations.geojson) | 88 stations + their hiding-zone circles (generated). |
| [`fetch_stations.js`](fetch_stations.js) | One-off Node script that rebuilds the geojson from OpenStreetMap. |
| [`docs/`](docs/) | Rules reference + how this tool models them ⟶ start at [`docs/README.md`](docs/README.md). |
| [`AGENTS.md`](AGENTS.md) | Orientation for AI agents / new contributors — architecture, data model, conventions. |

## Rules docs

> This is an **unofficial fan tool** for a purchased game. The rules pages in [`docs/`](docs/)
> are a convenience summary — the **[official rules](https://rules.jetlagthegame.com/) are
> authoritative**. Support the creators at <https://jetlagthegame.com/>.

The [`docs/`](docs/) folder is a reference for playing and for extending this tool:

1. [Game overview](docs/01-game-overview.md) — roles, round flow, hiding zones, winning.
2. [Questions](docs/02-questions.md) — the six question categories and every question.
3. [Curses & cards](docs/03-curses-and-cards.md) — the hider deck and the 24 standard curses.
4. [Montréal adaptation](docs/04-montreal-adaptation.md) — Métro/REM, ARTM zones, house rules.
5. [The map tool](docs/05-map-tool.md) — how the app works + the **question → filter** table.

## Run locally

It's a static page — any file server works:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

To regenerate the station data (Node ≥18):

```bash
node fetch_stations.js        # rewrites stations.geojson from live OSM data
```

## Status

Fork of [`cmonagle/mtl-game-map`](https://github.com/cmonagle/mtl-game-map) — working copy
for contributing rules docs and features back upstream.
