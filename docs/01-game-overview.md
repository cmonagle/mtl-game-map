# 01 — Game overview

> ⚠️ **Unofficial summary — [official rules](https://rules.jetlagthegame.com/) are authoritative.**
> Compiled for quick reference; may be out of date. Verify mechanics against the rulebook.

Jet Lag: Hide + Seek is a large-scale hide-and-seek game played across a city's transit
network. This file covers the structure of a game; the questions, cards, and curses have
their own files.

## Roles

- **Hider** — one player. Picks a hiding zone centred on a transit station, answers every
  question truthfully, and uses cards/curses to survive as long as possible.
- **Seekers** — everyone else, moving **together** as one team. They ask questions and
  chase down the hider.

Recommended 2–4 players. **Everyone hides exactly once**; by default the number of rounds
equals the number of players, and the round with the **longest single hiding time wins**.

## Game sizes

Almost every number scales with the chosen game size. Pick one for the whole game.

| Parameter | Small | Medium | Large |
|-----------|-------|--------|-------|
| Hiding-zone radius | 1/4 mi (400 m) | 1/4 mi (400 m) | 1/2 mi (800 m) |
| Hiding period (time to reach zone) | 30 min | 60 min | 180 min |
| Question answer time limit | 5 min | 5 min | 5 min |
| Photo-question time limit | 10 min | 10 min | 20 min |
| Tentacle questions available? | No | Yes | Yes |
| Typical playing area | neighbourhood | city | region / multi-city |

> Montreal (island + near off-island via Metro & REM) is naturally a **Medium** game, and
> can be pushed to **Large** if you include the full REM/South-Shore extent. See
> [`04-montreal-adaptation.md`](04-montreal-adaptation.md).

## The hiding zone

- The hider secretly picks **one transit station** as the centre of their zone.
- The zone is a circle of the size-dependent radius (1/4 or 1/2 mile) around that station.
- When the hiding period ends, the hider **must be at a station/stop that is in play** and
  inside their own zone. They may move freely **within** the zone during the round.
- Every question the hider answers is measured **from their current position**, which is why
  Thermometer and Radar answers can shift slightly as they reposition inside the zone.

## Round flow

1. **Prep (10 min):** the upcoming hider gets 10 minutes to prepare before their round.
2. **Hiding period:** the hider travels to their chosen zone (30 / 60 / 180 min by size).
   The seekers wait at a fixed start point and cannot track them yet.
3. **Timer starts:** when the hiding period ends, the hider's clock begins and seeking
   begins.
4. **Seeking loop:** seekers move together and ask questions. They may ask a new question
   only once the previous one has been answered.
   - The hider must answer within the time limit (5 min; longer for photos).
   - After each answer, the hider **draws cards** from the hider deck (see
     [`03-curses-and-cards.md`](03-curses-and-cards.md)).
   - The hider may play powerups/curses to slow the seekers or dodge questions.
5. **Endgame trigger:** the moment the seekers **enter the hider's zone and leave transit**,
   the endgame begins. The hider must now **freeze at a single, publicly accessible hiding
   spot** and can no longer move.
6. **Caught:** the round ends when seekers **spot the hider and are within 5 feet**. The
   hider's time is locked in (base time + any time-bonus cards still in hand).

## Valid hiding spots

- Must be **publicly accessible at all game times** (not a home, a locked area, a paid venue
  that could close, or a bathroom).
- Must be **within ~10 feet of a marked path or road** on a standard map app — no hiding in
  the middle of impassable terrain.
- Must be inside the hider's zone.

## Winning

- Each hider's score is their **base hiding time plus time-bonus cards held at round end**.
- Discarding a time-bonus card (e.g. to pay a curse cost) forfeits that time.
- **Longest single hiding run across the whole game wins.** It is not cumulative — one great
  hide beats several mediocre ones.

## Fair-play principles

- The hider must answer **truthfully** and to the best of available information (map apps
  are the shared source of truth for "nearest X", borders, etc.).
- Seekers move as **one group**; they cannot split up to cover more ground.
- Disputes are resolved by whatever map app / data source the group agreed on before play.

See [`02-questions.md`](02-questions.md) for how seekers actually gather information.
