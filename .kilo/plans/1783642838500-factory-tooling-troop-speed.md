# Plan: Change `factory_tooling` to "+0.1% troop generation speed per factory"

## Context
The factory tech tree has two mutually-exclusive Layer‑2 nodes: `factory_mass_production`
(trains yield +5k gold) and `factory_tooling`. Currently `factory_tooling` is a placeholder
with no real effect — its description is "Unlocks efficiency and protection for your industry."

We want `factory_tooling` to instead grant **+0.1% troop generation speed for each factory the
player owns**. Troop generation is computed centrally in `Config.troopIncreaseRate()`
(`src/core/configuration/Config.ts:953`), which already applies a multiplicative bonus for
other tech (e.g. `city_conscription` → ×1.1). The tech-tree "upgrade cards" UI
(`src/client/hud/layers/TechTreeOverlay.ts`) renders each node's name/description purely from
i18n keys, so the UI change is just updating the translation entry — no component-code change
is required (the live rate readout in `ControlPanel.ts` already calls `troopIncreaseRate`, so
it updates for free once the core logic changes).

## Relevant files (confirmed via grep + git history)
- `src/core/configuration/Config.ts` — `troopIncreaseRate()` at line 953 (analogous `hasTech` bonus pattern used for `city_conscription` at line 984). Git commit `8667a32c` ("Added the first four train upgrades") shows the established pattern for adding a `hasTech`-gated effect to `Config`.
- `src/core/tech/TechTreeData.ts` — `factory_tooling` definition (line 36); no structural change needed (id/cost/layers stay).
- `src/client/view/PlayerView.ts` — `troopIncreaseRate` takes `Player | PlayerView`; `PlayerView` currently has no factory-count method (only `Player` has `unitCount`). Must add `unitCount(type)` so the union type can count factories (needed for both sim and `ControlPanel` display).
- `resources/lang/en.json` — `tech_tree.factory.tooling` entry at line 1433‑1434 (UI text per CLAUDE.md i18n rule).
- `src/client/hud/layers/ControlPanel.ts` — reads `troopIncreaseRate` for the HUD rate display (lines 128, 309); no change, but should reflect the new bonus automatically.
- Tests: mirror `tests/economy/CitySkyscrapersTech.test.ts` (esp. the `city_conscription` +10% rate test at line 81).

## Implementation steps

### 1. Implement the bonus in `Config.troopIncreaseRate()`
In `src/core/configuration/Config.ts`, add after the existing `city_conscription` block (line 984‑986), before the `return`:

```ts
if (player.hasTech("factory_tooling")) {
  const factories = player.unitCount(UnitType.Factory);
  toAdd *= 1 + 0.001 * factories;
}
```

Notes:
- Multiplicative (stacks with `city_conscription` and the diminishing `ratio` term).
- Uses `player.unitCount(UnitType.Factory)`, which (per `PlayerImpl.unitCount`) counts only
  completed (non-under-construction) factories and sums their levels. Factories are level 1, so
  this equals "number of owned factories." If you prefer a strict unit count regardless of level,
  switch to counting `units(UnitType.Factory)` excluding `isUnderConstruction()` — but `unitCount`
  matches the existing codebase convention.
- No cap; many factories → larger bonus. Flagged as an open question below.
- `toInt`/max cap at line 988 still bounds the result, preserving determinism (function already uses float math like `Math.pow`).

### 2. Add `unitCount` to `PlayerView`
In `src/client/view/PlayerView.ts`, add a method mirroring `Player.unitCount` so the
`Player | PlayerView` union in `troopIncreaseRate` compiles and `ControlPanel` shows an accurate
live rate:

```ts
unitCount(type: UnitType): number {
  return this.units(type)
    .filter((u) => !u.isUnderConstruction())
    .map((u) => u.level())
    .reduce((a, b) => a + b, 0);
}
```

(Place near the existing `totalUnitLevels` method at line 493.)

### 3. Update UI text in `resources/lang/en.json`
Change `tech_tree.factory.tooling_desc` (line 1434) to describe the new effect, e.g.:
`"tooling_desc": "Each of your factories increases troop generation speed by 0.1% (stacks per factory)."`
Keep the `name` ("Tooling") or optionally rename — leave as-is unless preferred. Per CLAUDE.md,
only `en.json` is edited (Crowdin manages other languages).

## Validation
- New test file `tests/economy/FactoryToolingTech.test.ts` modeled on `CitySkyscrapersTech.test.ts`:
  - `buildFactory(x)` helper (use `UnitType.Factory`, compare with `unitInfo(UnitType.Factory).constructionDuration`).
  - Test A: with 0 factories, `troopIncreaseRate(base)` ≈ `troopIncreaseRate(after tech)` (no change).
  - Test B: with N completed factories, after `purchaseTech("factory_tooling")`, `boosted ≈ base * (1 + 0.001*N)`.
  - Test C: factory still under construction does NOT count (build but don't tick past constructionDuration).
- Run: `npx vitest tests/economy/FactoryToolingTech.test.ts --run`, `npm run lint`, `npm run test` (full suite to ensure no regression in `Disconnected.test.ts` / `ControlPanel` paths).
- Manual: dev server, purchase `factory_tooling`, confirm HUD troop rate increases per owned factory and tech-tree card shows new description.

## Open questions / risks
- **Cap:** No upper bound on the per-factory bonus (e.g. 100 factories = +10%). Acceptable, or add a cap? (Recommend none unless balance review requires it.)
- **Level vs count:** `unitCount` sums levels; factories are level 1 so equivalent. If factories ever gain levels, semantics shift to "level-weighted." Acceptable.
- **Determinism:** change stays within existing float-based `troopIncreaseRate`; no new nondeterminism introduced.
