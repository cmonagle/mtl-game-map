# 02 — Questions

> ⚠️ **Unofficial summary — [official rules](https://rules.jetlagthegame.com/) are authoritative.**
> The question lists and reward values below are a convenience cheat sheet and may drift from the
> current rulebook. Verify before relying on them in play.

Questions are how seekers gather information. There are **six categories**. Each question
has a fixed format, a small set of valid answers, and a **card reward** (`draw X, keep Y`)
that the hider collects for answering — the better the information the seekers get, the more
cards the hider draws.

Every answer is a **geometric constraint** on the hider's location. The right-hand notes
below say how each maps onto the map tool; the full translation table lives in
[`05-map-tool.md`](05-map-tool.md).

**Repeating a question** is allowed, but the hider draws its reward again for each repeat
(so re-asking "1 mile radar" pays the hider `draw 2, keep 1` a second time).

---

## 1. Matching — *"Is your nearest ____ the same as my ____?"*

- **Answers:** Yes / No · **Reward:** draw 3, keep 1
- **Map effect:** partitions the map by a feature. "Yes" keeps stations that share the
  seeker's feature; "No" excludes them. Best modelled as a **polygon** include/exclude around
  the relevant region (e.g. same borough, same metro line corridor).

| Group | Questions |
|-------|-----------|
| Transit (4) | Commercial airport · Transit line · Station name's length · Street or path |
| Admin divisions (4) | 1st / 2nd / 3rd / 4th administrative division |
| Natural (3) | Mountain · Landmass · Park |
| Places of interest (6) | Amusement park · Zoo · Aquarium · Golf course · Museum · Movie theater |
| Public utilities (3) | Hospital · Library · Foreign consulate |

*Montreal note:* "administrative divisions" ≈ province → région → agglomeration → borough
(arrondissement)/municipality. Agree on the exact hierarchy before playing.

---

## 2. Measuring — *"Compared to me, are you closer to or further from ____?"*

- **Answers:** Closer / Further · **Reward:** draw 3, keep 1
- **Map effect:** a **perpendicular-bisector line** between the seeker and the feature. The
  hider is on one half-plane. In the tool: a **Line filter** with the **perpendicular** option
  (draw seeker → feature; keep the "closer" or "further" side).

| Group | Questions |
|-------|-----------|
| Transit (3) | Commercial airport · High-speed train line · Rail station |
| Borders (3) | International border · 1st admin-division border · 2nd admin-division border |
| Natural (5) | Sea level · Body of water · Coastline · Mountain · Park |
| Places of interest (6) | Amusement park · Zoo · Aquarium · Golf course · Museum · Movie theater |
| Public utilities (3) | Hospital · Library · Foreign consulate |

---

## 3. Radar — *"Are you within ____ of me?"*

- **Answers:** Yes / No · **Reward:** draw 2, keep 1
- **Map effect:** the cleanest filter of all — a **Radius** centred on the seeker.
  "Yes" = **include** inside; "No" = **exclude** inside (hider is beyond that distance).

Distances: **1/4 mi · 1/2 mi · 1 mi · 3 mi · 5 mi · 10 mi · 25 mi · 50 mi · 100 mi · Choose**
(any custom distance).

> Radar is the seekers' bread-and-butter for shrinking the search area fast. A "No" to a
> big radius eliminates a huge region; a "Yes" to a small one nearly pins the hider.

---

## 4. Thermometer — *"After traveling ____, am I hotter or colder?"*

- **Answers:** Hotter (got closer) / Colder (got further) · **Reward:** draw 2, keep 1
- **Map effect:** another **perpendicular bisector**, this time between the seeker's
  *start* point and their *end* point after travelling the stated distance. Keep the side the
  hider is on. In the tool: a **Line filter, perpendicular**, drawn from start → end point.

| Available in | Distances |
|--------------|-----------|
| Small games | 1/2 mi · 3 mi |
| Medium & Large | + 10 mi |
| Large only | + 50 mi |

> Thermometer is powerful because the seekers choose the travel vector — moving along a
> transit line and asking "hotter/colder" repeatedly triangulates quickly.

---

## 5. Photo — *"Send me a photo of ____"*

- **Answers:** a photo meeting the spec, or "I cannot answer" · **Reward:** draw 1, keep 1
- **Time limit:** 10 min (Small/Medium), 20 min (Large)
- **Map effect:** qualitative, not a clean geometric filter — but a photo reveals the
  built environment (waterfront, high-rises, a specific landmark, transit platform style),
  which lets seekers **manually rule stations in or out**. Model with a **polygon** filter
  once you've reasoned about which zones fit.

| Available in | Photo prompts |
|--------------|---------------|
| Small | Any building visible from transit station · Widest street · Tree · Tallest structure in your sightline · Selfie (you) · The sky |
| Medium & Large (add) | Tallest building visible from station · Trace nearest street/path · 2 buildings · Restaurant interior · Park · Grocery-store aisle · Place of worship · Train platform |
| Large only (add) | 1/2 mi of streets traced · Tallest mountain visible from station · Biggest body of water in your zone · 5 buildings |

---

## 6. Tentacles — *"Within ____, which ____ are you nearest to? (You must also be within ____)"*

- **Answers:** the name of the nearest matching place, or "not within reach" ·
  **Reward:** draw 4, keep 2 (the most generous — it gives away a lot)
- **Time limit:** 5 min · **Not available in Small games.**
- **Map effect:** extremely strong. If the hider names a specific POI, they must be in that
  POI's **Voronoi cell** (nearer to it than any other of that type) **and** within the stated
  range of the seeker. Model as a **Radius** (the reach) combined with a **polygon** around the
  named POI's catchment.

| Available in | Tentacle prompts |
|--------------|------------------|
| Medium | Museums within 1 mi · Libraries within 1 mi · Movie theaters within 1 mi · Hospitals within 1 mi |
| Large (add) | Metro lines within 15 mi · Zoos within 15 mi · Aquariums within 15 mi · Amusement parks within 15 mi |

---

## Reward summary (why the hider answers at all)

| Category | Reward | Info given up |
|----------|--------|---------------|
| Matching | draw 3, keep 1 | Medium |
| Measuring | draw 3, keep 1 | Medium |
| Radar | draw 2, keep 1 | High (per question) |
| Thermometer | draw 2, keep 1 | High (directional) |
| Photo | draw 1, keep 1 | Low–Medium (qualitative) |
| Tentacles | draw 4, keep 2 | Very high |

The reward roughly tracks how much the answer helps the seekers: give away more → draw more
cards → more time bonuses and curses to fight back. Deciding which questions to *ask* (as a
seeker) vs. *bait* (as a hider) is the core strategy loop.

Next: [`03-curses-and-cards.md`](03-curses-and-cards.md) for what the hider does with those
cards.
