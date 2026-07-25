# Montreal Jet Lag — Hide + Seek docs

Reference documentation for playing **Jet Lag: The Game — Hide + Seek** in Montreal,
and for the seeker's deduction map hosted in this repo
(<https://cmonagle.github.io/mtl-game-map/>).

These files exist so that during a live game we can quickly cross-reference the rules,
translate a hider's answers into map filters, and make informed decisions. They also
document how the map tool models the game so we can extend it later.

> ### ⚠️ Not authoritative — the official rules govern
>
> Jet Lag: Hide + Seek is a **published game by [Jet Lag: The Game](https://jetlagthegame.com/)**.
> The pages here are an **unofficial convenience summary** compiled for quick reference and to
> explain the map tool — they are not a substitute for the rulebook, they may drift out of date,
> and where anything conflicts, **the official rules win**:
>
> - 📖 **Official rules:** <https://rules.jetlagthegame.com/>
> - 🛒 **Buy the game / support the creators:** <https://jetlagthegame.com/> · [Nebula](https://nebula.tv/jetlag)
>
> When in doubt during play — or when an agent is reasoning about game mechanics — **check the
> official rules rather than trusting these summaries.** The genuinely original content in this
> repo is the *Montréal adaptation* and the *question → map-filter mapping*
> ([`04`](04-montreal-adaptation.md), [`05`](05-map-tool.md)); the rest is just a cheat sheet
> over someone else's rulebook.

## Contents

| File | What it covers |
|------|----------------|
| [`01-game-overview.md`](01-game-overview.md) | Roles, round flow, hiding zones, endgame, win condition, game-size scaling |
| [`02-questions.md`](02-questions.md) | All six question categories, every question, and card rewards |
| [`03-curses-and-cards.md`](03-curses-and-cards.md) | Hider deck (time bonus / powerup / curse cards), the 24 standard curses, casting rules |
| [`04-montreal-adaptation.md`](04-montreal-adaptation.md) | How the rules map to Montreal: Metro + REM stations, ARTM zones, hiding-zone radius, house rules to settle |
| [`05-map-tool.md`](05-map-tool.md) | How this repo's map works, and the **question → map filter translation table** (the key seeker workflow) |

## Quick mental model

- One player **hides** at a transit station; the rest **seek**.
- Seekers **ask questions** from a fixed deck; the hider must answer truthfully but is
  rewarded with **cards** (time bonuses, powerups, curses) for every answer.
- Every answer is a **geometric constraint** on where the hider can be. The map tool in
  this repo turns those constraints into include/exclude **filters** that shrink the set
  of candidate stations until only one hiding zone remains.
- The game ends for a round when seekers **enter the hider's zone, leave transit, and get
  within 5 feet** of them. Longest hiding time across the game wins.

## Sources

The rules here are summarised from the official/community rules mirrors:

- Official-style rules: <https://jetlag.denull.ru/en/rules/> and its
  [questions page](https://jetlag.denull.ru/en/rules/questions/)
- Rules docs mirror: <https://www.lifack.ch/docs/> (curses, hider deck, quick start)
- Jet Lag Wiki: <https://jetlag.fandom.com/wiki/Hide_%2B_Seek>
- Official rules site: <https://rules.jetlagthegame.com/>

> ⚠️ The home game scales by size (Small / Medium / Large) and the creators explicitly
> encourage house rules. Numbers below are the published defaults — see
> [`04-montreal-adaptation.md`](04-montreal-adaptation.md) for the choices **we** need to
> lock in before playing Montreal.
