# Plan: Mirror Build-Keybind Labels into Tech-Tree Nav Bar

## Goal
The bottom task bar (`UnitDisplay.ts`) shows each structure icon with its build keybind
in the **top-left** corner. Mirror that exact behavior in the Tech-Tree overlay's
horizontal structure-navigation bar (`TechTreeOverlay.ts`, the `STRUCTURE_SLUGS` row).
Keybinds must NOT be hardcoded — they must be read live from user settings.

## Source of truth — the bottom bar (`src/client/hud/layers/UnitDisplay.ts`)
- Keybind label is rendered at lines 304-306:
  ```ts
  ${html`<div class="ml-0.5 text-[10px] relative -top-1 text-gray-400">
    ${displayHotkey}
  </div>`}
  ```
- `displayHotkey` is derived (lines 223-226) from `this.keybinds["buildCity"]?.key ?? "1"`
  then formatted:
  ```ts
  const displayHotkey = hotkey.replace("Digit", "").replace("Key", "").toUpperCase();
  ```
- `this.keybinds = new UserSettings().parsedUserKeybinds()` is read once in `init()` (line 57).

## Fully-dynamic keybind resolution (no hardcoding)
`UserSettings.keybinds(isMac)` (UserSettings.ts:430) returns the **merged** map
`{ action: code }` = `getDefaultKeybinds(isMac)` (build defaults: `buildCity:"Digit1"`,
`buildFactory:"Digit2"`, …) overlaid with the user's rebinds. Reading this map means
there is **no per-structure hardcoded fallback**; defaults come from the same table the
InputHandler uses. Format the code with the same `replace("Digit","").replace("Key","").toUpperCase()`
logic used by `UnitDisplay`.

## slug → build-keybind action mapping
TechTreeOverlay's `STRUCTURE_SLUGS` (city, factory, port, defensepost, missilesilo,
samlauncher, warship, atombomb, hydrogenbomb, mirv, lab) map to InputHandler's build
actions (`resolveBuildKeybind`, InputHandler.ts:1024-1039):
```
city→buildCity, factory→buildFactory, port→buildPort, defensepost→buildDefensePost,
missilesilo→buildMissileSilo, samlauncher→buildSamLauncher, warship→buildWarship,
atombomb→buildAtomBomb, hydrogenbomb→buildHydrogenBomb, mirv→buildMIRV, lab→buildLab
```

## Changes in `src/client/hud/layers/TechTreeOverlay.ts`
1. Imports:
   - `import { UserSettings } from "../../../core/game/UserSettings";`
   - `import { Platform } from "../../Platform";` (same path as `WinModal.ts`/`GameLeftSidebar.ts`)
2. Add a `private keybinds: Record<string, string> = {};` field, populated in
   `connectedCallback()` (mirrors `UnitDisplay.init()` reading once per element life):
   `this.keybinds = new UserSettings().keybinds(Platform.isMac);`
3. Add a constant `SLUG_TO_BUILD_KEY: Record<string, string>` (the mapping above).
4. Add a helper:
   ```ts
   private keybindForSlug(slug: string): string {
     const code = this.keybinds[SLUG_TO_BUILD_KEY[slug]];
     return code ? code.replace("Digit", "").replace("Key", "").toUpperCase() : "";
   }
   ```
5. In the nav-button `STRUCTURE_SLUGS.map(...)` block (lines 305-321), make the
   `<button>` `relative` and prepend the keybind label in the top-left:
   ```ts
   <button
     class="relative flex items-center justify-center p-2 rounded-xl transition-colors ${...}"
     title=${translateText(`structures.${slug}`)}
     @click=${() => this.selectStructure(slug)}
   >
     <span class="absolute top-0 left-0.5 text-[9px] leading-none text-gray-400 pointer-events-none"
       >${this.keybindForSlug(slug)}</span
     >
     <img src=${ICON_MAP[slug]} alt="" class="size-7" />
   </button>
   ```

6. **Press-to-navigate:** The overlay already listens for `keydown` on `document` via
   `handleKeyDown` (currently only Escape). Extend it so that, while the overlay is
   visible (`this.isVisible`), pressing a build keybind navigates to that structure's
   tree — i.e. the same effect as clicking the nav button.
   - Add a reverse lookup helper that finds which build-keybind action matches the
     pressed `e.code`, using the same merged `keybinds` map (do NOT hardcode keys):
     ```ts
     private slugForBuildKey(code: string): string | null {
       for (const [slug, action] of Object.entries(SLUG_TO_BUILD_KEY)) {
         if (this.keybinds[action] === code) return slug;
       }
       return null;
     }
     ```
   - In `handleKeyDown`, for non-Escape keys, when `this.isVisible`, resolve
     `const slug = this.slugForBuildKey(e.code);` and if found call
     `this.selectStructure(slug)` (which already resets `selectedNodeId`/pending and
     `requestUpdate()`s). Do NOT call `e.preventDefault()` so the global `InputHandler`
     build-keybind behavior (ghost-structure) continues to work unchanged.
   - Rationale: build keybinds are simple digit/letter codes (`Digit1`, `KeyQ`, …) with no
     `Shift+`/`Alt+` prefixes, so an exact `e.code === keybinds[action]` match is
     sufficient and mirrors `InputHandler.resolveBuildKeybind`'s primary path.

## Notes / risks
- `TechTreeOverlay` is not a `Controller` and has no `init()`; reading keybinds in
  `connectedCallback()` is correct (localStorage is synchronous).
- The overlay re-renders on a 200ms poll; keybinds only change via UserSettings storage,
  so reading once on connect is sufficient and matches `UnitDisplay` (read once in `init()`).
- Do NOT add literal key letters in markup — all values come from `keybinds(isMac)`.
- Press-to-navigate only fires while the overlay is open; Escape behavior is unchanged.
- The global `InputHandler` will still set a ghost structure on the same keypress — that
  is acceptable and intended (we add navigation on top, not replace it).
- No i18n string changes needed (labels are key codes, not text).

## Validation
- `npm run lint` and `npm run build-prod` (or `npm run typecheck`) must pass.
- Manual: open tech tree (toggle key), confirm each nav button shows the same keybind
  in its top-left as the bottom task bar; press that keybind and confirm the overlay
  navigates to that structure's tree (button highlight moves). Rebind a build key in
  User Settings, reopen the tech tree, and confirm both the nav label and the
  press-to-navigate behavior use the new key.
