# src/ Directory Map

Auto-generated map of every file in `src/` with a short summary of its contents.
Organized by top-level directory (`client`, `core`, `server`) and subdirectories.

> Note: `src/client/utilities/Utils.ts` does not exist in this repo (only `Diagnostic.ts`,
> `DisableSafariPinchZoom.ts`, `GameConfigHelpers.ts`, `ReplaySpeedMultiplier.ts` are present).
> Shared utilities live in `src/core/Util.ts`.

---

# src/client/ — Browser / Frontend

## src/client/ (root .ts files)
- `src/client/Main.ts` — Client bootstrap entry point that imports and initializes layout, modals, and navigation.
- `src/client/Api.ts` — Backend API client for players, games, leaderboards, news, and store/subscription checkout.
- `src/client/Auth.ts` — Authentication: Discord/Google login, JWT refresh/caching, account linking, logout, and auth headers.
- `src/client/ClanApi.ts` — API client for clan operations (browse, join/leave, manage, members, requests, bans).
- `src/client/ClanModal.ts` — Lit modal driving the full clan UI (lists, detail, manage, transfer, requests, bans).
- `src/client/ClientEnv.ts` — Reads and exposes bootstrap configuration from `window.BOOTSTRAP_CONFIG`.
- `src/client/ClientGameRunner.ts` — Game-session orchestrator wiring the worker, renderer, input, and transport.
- `src/client/Controller.ts` — `Controller` interface for main-thread controllers with `init`/`tick` lifecycle hooks.
- `src/client/Cosmetics.ts` — Fetches/parses cosmetics and resolves ownership/purchase relationships.
- `src/client/CrazyGamesSDK.ts` — Wrapper around the CrazyGames platform SDK (auth, ads, banners, invites).
- `src/client/EffectsInput.ts` — Lit button previewing the selected trail effect and opening the effects modal.
- `src/client/EffectsModal.ts` — Lit modal for selecting player effects (boat/nuke trails) with tabs and search.
- `src/client/FlagInputModal.ts` — Lit modal for picking a country flag or owned cosmetic flag via a searchable grid.
- `src/client/FlagInput.ts` — Lit button previewing the chosen flag and opening the flag modal.
- `src/client/FriendsApi.ts` — API client for friend operations (list, requests, add/accept/delete).
- `src/client/GameInfoModal.ts` — Lit modal showing end-of-game info: map preview, final ranking, leaderboards.
- `src/client/GameModeSelector.ts` — Homepage element for choosing game modes and launching singleplayer/host/join.
- `src/client/GameStartingModal.ts` — Lightweight overlay shown while a game is starting (credits/license).
- `src/client/GoogleAdElement.ts` — Lit component rendering a Google AdSense ad unit (skipped on Electron).
- `src/client/HelpModal.ts` — Lit help modal with tutorial video, keybind reference, and troubleshooting link.
- `src/client/HomepagePromos.ts` — Lit component managing homepage promotional/gutter ads and bottom-rail ads.
- `src/client/HostLobbyModal.ts` — Lit modal for creating a lobby with configurable game settings.
- `src/client/JoinLobbyModal.ts` — Lit modal for joining an existing lobby by ID or public-lobby details.
- `src/client/LangSelector.ts` — Lit UI for switching languages, including debug translation mode.
- `src/client/LanguageModal.ts` — Lit modal presenting the grid of selectable languages.
- `src/client/Layout.ts` — Sets up the responsive mobile/desktop sidebar hamburger menu and backdrop behavior.
- `src/client/LeaderboardModal.ts` — Lit modal with player/clan leaderboard tabs and date-range selection.
- `src/client/LobbySocket.ts` — `PublicLobbySocket` managing WebSocket/polling for live public lobby updates.
- `src/client/LocalPersistantStats.ts` — Persists per-game lobby/stats records to `localStorage` for replay/history.
- `src/client/LocalServer.ts` — Replays a recorded game locally as a `Server` analog driving turns from a saved record.
- `src/client/Markdown.ts` — Renders markdown strings to sanitized lit templates via marked + DOMPurify.
- `src/client/Matchmaking.ts` — Lit modal handling ranked matchmaking: ELO display and WebSocket match search.
- `src/client/ModalRouter.ts` — Two-way sync between URL hash (`#modal=...`) and registered modal state.
- `src/client/MultiTabDetector.ts` — Detects multiple open tabs via a localStorage heartbeat lock and applies a penalty.
- `src/client/NewsMarkdown.ts` — Normalizes news markdown (headers, PR/compare/mention links) before rendering.
- `src/client/NewsModal.ts` — Lit modal displaying rendered news markdown with version info.
- `src/client/PatternInput.ts` — Lit button previewing the selected territory pattern and opening the patterns modal.
- `src/client/Platform.ts` — Detects platform/OS/browser/device capabilities via a singleton `Platform`.
- `src/client/SinglePlayerModal.ts` — Lit modal for configuring/starting a single-player (vs bots) game.
- `src/client/TerrainMapFileLoader.ts` — Singleton `FetchGameMapLoader` loading terrain map files from asset URLs.
- `src/client/TerritoryPatternsModal.ts` — Lit modal for selecting/buying territory patterns, palettes, and skins.
- `src/client/TokenLoginModal.ts` — Lit modal completing email magic-link/temp-token login with retry polling.
- `src/client/TransformHandler.ts` — Handles camera transforms (pan/zoom/go-to) for the game view canvas.
- `src/client/Transport.ts` — Client transport layer serializing/deserializing messages and bridging to the game runner.
- `src/client/TroubleshootingModal.ts` — Lit modal collecting/displaying graphics/WebGL diagnostics.
- `src/client/UsernameInput.ts` — Lit input for player username and clan tag with ownership validation.
- `src/client/UserSettingModal.ts` — Lit modal for user settings: keybinds, toggles, sliders, easter eggs.
- `src/client/WebGLFrameBuilder.ts` — Builds per-frame WebGL data (palettes, patterns, effects) uploaded to the GPU.
- `src/client/vite-env.d.ts` — Vite ambient type declarations for asset imports (`*.md`, `*.bin`, etc.).
- `src/client/Store.ts` — Lit cosmetic store modal for browsing/purchasing patterns, flags, effects, packs, subscriptions.
- `src/client/InputHandler.ts` — Captures mouse/touch/keyboard input and defines the GameEvent classes that drive interactions.
- `src/client/Navigation.ts` — Manages client-side page/modal navigation, mobile sidebar, and page-change events.
- `src/client/UIState.ts` — Small shared interface for transient UI state (attack ratio, ghost structure, rocket direction).

## src/client/components/
- `src/client/components/BaseModal.ts` — Abstract base LitElement wrapping the `<o-modal>` shell with lifecycle/tabs.
- `src/client/components/CapIcon.ts` — LitElement rendering the soft-currency (bottle-cap) icon at a configurable size.
- `src/client/components/ConfirmDialog.ts` — Reusable portal confirm/acknowledge dialog with optional textarea and danger variants.
- `src/client/components/CopyButton.ts` — Button copying lobby ID/text to clipboard with optional masking and feedback.
- `src/client/components/CosmeticButton.ts` — Card button for a single cosmetic with select/purchase flow and rarity glow.
- `src/client/components/CosmeticContainer.ts` — Visual container rendering rarity gradients/glow/shimmer for cosmetic cards.
- `src/client/components/CosmeticInfo.ts` — Hover popover showing a cosmetic's artist, rarity, and color palette.
- `src/client/components/CurrencyDisplay.ts` — Displays hard/soft currency balances with icons.
- `src/client/components/CustomCurrencyCard.ts` — Store card for custom plutonium purchase with clamped amount and checkout redirect.
- `src/client/components/DesktopNavBar.ts` — Desktop nav bar with active-page highlight and notification dots.
- `src/client/components/Difficulties.ts` — Displays a game's difficulty via skull SVG icons by difficulty key.
- `src/client/components/DoomsdayClockPanel.ts` — In-game HUD panel showing the Doomsday Clock bar, stage, and wave countdown.
- `src/client/components/EffectPreview.ts` — Registers trail/shockwave/sparkles effect swatch preview elements.
- `src/client/components/EffectsGrid.ts` — Renders effect cosmetics grouped by type with select/purchase modes.
- `src/client/components/FluentSlider.ts` — Slider-with-number-input control dispatching value-change events.
- `src/client/components/Footer.ts` — Site footer with GitHub, Reddit, Discord, and other external links.
- `src/client/components/FriendsList.ts` — Friends management UI with requests, add, search, and pagination.
- `src/client/components/GameConfigSettings.ts` — Builds the lobby game-configuration UI (difficulty, mode, map, teams, etc.).
- `src/client/components/IOSAddToHomeScreenBanner.ts` — iOS "add to home screen" prompt banner with dismiss/guide states.
- `src/client/components/InputCard.ts` — Card wrapper with label and optional numeric/text input for config settings.
- `src/client/components/InputCardStyles.ts` — Shared style constants and `cardClass` helper for input cards.
- `src/client/components/InsufficientCurrencyDialog.ts` — Dialog for failed cosmetic purchases with a top-up path.
- `src/client/components/LobbyConfigItem.ts` — Small labeled tile displaying one lobby configuration value.
- `src/client/components/LobbyPlayerView.ts` — Renders lobby player/team preview with name reveal, kicking, and team colors.
- `src/client/components/MainLayout.ts` — Top-level `<main>` layout shell preserving light-DOM children.
- `src/client/components/MobileNavBar.ts` — Mobile nav bar mirroring the desktop one with active state and dots.
- `src/client/components/ModalOverlay.ts` — Full-cover overlay element toggling visibility behind modals.
- `src/client/components/NavNotificationsController.ts` — Lit controller tracking help/store/news "new" notification indicators.
- `src/client/components/NewsBox.ts` — Rotating news/announcement box with fetch and dismiss support.
- `src/client/components/NotLoggedInWarning.ts` — Warning button shown when account is unlinked, linking to account page.
- `src/client/components/PatternPreview.ts` — Generates/renders a data-URL preview for a player's territory pattern.
- `src/client/components/PlayPage.ts` — Main landing "Play" page composing news, lobby UI, and start controls.
- `src/client/components/PlutoniumIcon.ts` — Animated plutonium (hard currency) icon at configurable size.
- `src/client/components/PurchaseButton.ts` — Buy button handling cosmetic purchase and insufficient-currency flow.
- `src/client/components/RankedModal.ts` — Modal showing player ELO/ranked stats and ranked entry.
- `src/client/components/SubscriptionPanel.ts` — Panel for managing a user's subscription (manage/change/cancel).
- `src/client/components/ToggleInputCard.ts` — Card with enable toggle plus optional numeric input, autofocusing on enable.
- `src/client/components/WebGLGate.ts` — Troubleshooting screen when GPU-accelerated WebGL2 is unavailable.
- `src/client/components/baseComponents/Button.ts` — Generic `<o-button>` with variant/size/icon options.
- `src/client/components/baseComponents/Modal.ts` — Core `<o-modal>` shell (tabs, maximize, header, close) used by BaseModal.
- `src/client/components/baseComponents/SharedStyles.ts` — Live CSSStyleSheet mirroring global styles for shadow-DOM components.
- `src/client/components/baseComponents/ranking/GameInfoRanking.ts` — Rank types and `PlayerInfo` shape plus ranking-row helpers.
- `src/client/components/baseComponents/ranking/PlayerRow.ts` — Renders one ranking-list player row with score bar and highlights.
- `src/client/components/baseComponents/ranking/RankingControls.ts` — Sort-control buttons emitting a `sort` event for ranking views.
- `src/client/components/baseComponents/ranking/RankingHeader.ts` — Ranking header row whose labels change by active `RankType`.
- `src/client/components/baseComponents/setting/SettingKeybind.ts` — Settings row to capture and rebind a keyboard key.
- `src/client/components/baseComponents/setting/SettingNumber.ts` — Settings row with a labeled numeric input.
- `src/client/components/baseComponents/setting/SettingSelect.ts` — Settings row with a dropdown `<select>`.
- `src/client/components/baseComponents/setting/SettingSlider.ts` — Settings row with a styled range slider.
- `src/client/components/baseComponents/setting/SettingToggle.ts` — Settings row with a boolean toggle switch.
- `src/client/components/baseComponents/stats/DiscordUserHeader.ts` — Displays a Discord user's avatar and display name.
- `src/client/components/baseComponents/stats/GameHistoryDates.ts` — Day-grouping/formatting helpers for game-history lists.
- `src/client/components/baseComponents/stats/GameTypeLabels.ts` — Derives human-readable game-type labels (FFA/team/HvN/ranked).
- `src/client/components/baseComponents/stats/PlayerGameHistoryView.ts` — Paginated, filterable player game-history list.
- `src/client/components/baseComponents/stats/PlayerStatsGrid.ts` — Compact 4-cell grid of headline player stats.
- `src/client/components/baseComponents/stats/PlayerStatsTable.ts` — Table of player building/unit stats.
- `src/client/components/baseComponents/stats/PlayerStatsTree.ts` — Tree view of cumulative player stats by type/mode/difficulty/ranked.
- `src/client/components/clan/ClanBansView.ts` — Clan admin bans list with search/pagination/unban.
- `src/client/components/clan/ClanBrowseView.ts` — Browse/discover-clans view with search, caching, and join-request state.
- `src/client/components/clan/ClanCard.ts` — Card summarizing a clan with role/pending badges.
- `src/client/components/clan/ClanDetailView.ts` — Detailed clan view: stats, members, join/leave, Discord invite.
- `src/client/components/clan/ClanGameHistoryView.ts` — Paginated, filterable clan game-history list.
- `src/client/components/clan/ClanManageView.ts` — Clan management: edit, promote/demote/kick/ban, disband.
- `src/client/components/clan/ClanMyRequestsView.ts` — View of the user's outgoing join requests with withdraw.
- `src/client/components/clan/ClanRequestsView.ts` — Clan admin incoming join-request view with approve/deny.
- `src/client/components/clan/ClanShared.ts` — Shared clan helpers/renderers (roles, rows, pagination, toasts).
- `src/client/components/clan/ClanStatsBreakdown.ts` — Renders a clan member's W/L breakdown by team size and ranked type.
- `src/client/components/clan/ClanTransferView.ts` — Leader view to transfer clan ownership with confirmation.
- `src/client/components/leaderboard/LeaderboardClanTable.ts` — Sortable clan leaderboard table.
- `src/client/components/leaderboard/LeaderboardPlayerList.ts` — Infinite-scroll player leaderboard with sticky current-user row.
- `src/client/components/map/MapDisplay.ts` — Lazy-loading map card with preview, medals, and favorite toggle.
- `src/client/components/map/MapFavorites.ts` — Utilities for reading/toggling favorite maps in localStorage.
- `src/client/components/map/MapPicker.ts` — Map selection UI with tabs, search, random option, and medals.
- `src/client/components/map/Medals.ts` — Difficulty-medal icon rendering and color/order constants.
- `src/client/components/ui/ActionButton.ts` — Compact icon+label action button factory with color variants.
- `src/client/components/ui/Divider.ts` — `<ui-divider>` separator element with spacing/color options.
- `src/client/components/ui/ModalHeader.ts` — `modalHeader` renderer factory for a consistent modal header.

## src/client/controllers/
- `src/client/Controller.ts` — `Controller` interface for main-thread game controllers (lifecycle hooks).
- `src/client/controllers/AttackingTroopsController.ts` — Pushes interpolated attack-troop labels to the WebGL `WorldTextPass`.
- `src/client/controllers/BuildPreviewController.ts` — Manages the build-ghost state machine and click-to-build flow (validity, ranges, rail snap, nuke preview).
- `src/client/controllers/HoverHighlightController.ts` — Forwards hovered tile owner ID so territory/border passes highlight the player.
- `src/client/controllers/LiveStatsController.ts` — Reports opt-in per-client live stats snapshot to the server (~10s).
- `src/client/controllers/SoundEffectController.ts` — Watches game updates and emits sound-effect events for the local player.
- `src/client/controllers/StructureHighlightController.ts` — Forwards `UnitDisplay` hover events so matching structures glow.
- `src/client/controllers/ViewModeController.ts` — Forwards alternate-view/grid-toggle events for affiliation recolor and grid overlays.
- `src/client/controllers/WarshipSelectionController.ts` — Handles warship selection (single/box/all) and move intents.

## src/client/hud/ (root)
- `src/client/hud/FrameProfiler.ts` — Static utility recording named timing spans (ms) for frame/layer profiling.
- `src/client/hud/GameRenderer.ts` — Factory/class wiring HUD layers/controllers and ticking them on an interval loop.
- `src/client/hud/NameBoxCalculator.ts` — Computes where to draw a player's name via largest inscribed rectangle + font size.
- `src/client/hud/PlayerIcons.ts` — Builds/manages status icons for a player (crown, traitor, alliance, nuke, embargo, etc.).
- `src/client/hud/SpriteLoader.ts` — Preloads unit/train sprite bitmaps and provides cached, colorized variants.
- `src/client/hud/ui/TextIndicator.ts` — `UIElement` rendering a floating text label that rises and fades over its lifetime.
- `src/client/hud/ui/UIElement.ts` — Minimal interface for a HUD UI element with position and `render` method.

## src/client/hud/layers/
- `src/client/hud/layers/ActionableEvents.ts` — Shows actionable alliance alerts with accept/reject/extend buttons.
- `src/client/hud/layers/AlertFrame.ts` — Red/orange screen-border alert animation on betrayal/land attack.
- `src/client/hud/layers/AttacksDisplay.ts` — Lists incoming/outgoing attacks, naval invasions, and transport ships.
- `src/client/hud/layers/BuildMenu.ts` — Build/upgrade grid of structures and units with costs and intents.
- `src/client/hud/layers/ChatDisplay.ts` — In-game chat message log with hide/show toggle and unread counter.
- `src/client/hud/layers/ChatIntegration.ts` — Wires ChatModal into the radial menu via quick-chat submenus.
- `src/client/hud/layers/ChatModal.ts` — Quick-chat composer with category/phrase/player selection.
- `src/client/hud/layers/ControlPanel.ts` — Bottom command bar: troop/gold/research readouts, attack-ratio slider, popups.
- `src/client/hud/layers/EmojiTable.ts` — Popover grid of emoji buttons for sending emoji reactions.
- `src/client/hud/layers/EventsDisplay.ts` — Scrolling game event feed (alliances, attacks, donations, emojis).
- `src/client/hud/layers/GameLeftSidebar.ts` — Left sidebar with leaderboard/team-stats toggles, game ID, team label.
- `src/client/hud/layers/GameRightSidebar.ts` — Right sidebar with timer, settings/fullscreen/exit, pause, replay controls.
- `src/client/hud/layers/GraphicsSettingsModal.ts` — Modal exposing graphics/render overrides persisted via UserSettings.
- `src/client/hud/layers/HeadsUpMessage.ts` — Central status banners (spawn, paused, immunity, catching-up) and toasts.
- `src/client/hud/layers/ImmunityTimer.ts` — Top progress bar showing remaining spawn-immunity duration.
- `src/client/hud/layers/InGamePromo.ts` — Manages in-game ad placements (Playwire/CrazyGames).
- `src/client/hud/layers/Leaderboard.ts` — Sortable player leaderboard with click-to-focus and team highlighting.
- `src/client/hud/layers/MainRadialMenu.ts` — Orchestrates the radial context menu from player actions.
- `src/client/hud/layers/MultiTabModal.ts` — Penalty modal shown when multi-tab play is detected.
- `src/client/hud/layers/PerformanceOverlay.ts` — Draggable overlay displaying FPS/TPS/tick metrics and timing breakdowns.
- `src/client/hud/layers/PlayerActionHandler.ts` — Translates UI intents into Transport bus events.
- `src/client/hud/layers/PlayerInfoOverlay.ts` — Hover/context info card for a player or unit.
- `src/client/hud/layers/PlayerModerationModal.ts` — Modal letting a lobby admin kick a human player.
- `src/client/hud/layers/PlayerPanel.ts` — Detailed target-player panel (identity, resources, actions, moderation).
- `src/client/hud/layers/RadialMenu.ts` — D3-based radial menu engine (nested arcs, tooltips, navigation).
- `src/client/hud/layers/RadialMenuElements.ts` — Menu element data model and root/attack/build/ally/info/delete elements.
- `src/client/hud/layers/RelationSmiley.ts` — SVG smiley indicating a nation's relation to the player.
- `src/client/hud/layers/ReplayPanel.ts` — Replay/game speed multiplier buttons (×0.5/×1/×2/fastest).
- `src/client/hud/layers/SendResourceModal.ts` — Modal with slider/presets for donating troops or gold.
- `src/client/hud/layers/SettingsModal.ts` — Modal with general user settings and link to graphics settings.
- `src/client/hud/layers/SpawnTimer.ts` — Top bar showing spawn-phase countdown and team-territory share bar.
- `src/client/hud/layers/TeamStats.ts` — Team leaderboard (scores, gold, troops, unit counts) for team games.
- `src/client/hud/layers/TechTreeOverlay.ts` — Overlay displaying the per-structure tech tree with purchase interaction.
- `src/client/hud/layers/UnitDisplay.ts` — Buildable unit hotbar with counts, costs, hotkeys, and tooltips.
- `src/client/hud/layers/WinModal.ts` — Win/death modals with promotion, tutorial, and exit/requeue buttons.

## src/client/render/frame/
- `src/client/render/frame/index.ts` — Re-exports `FrameData` type and `uploadFrameData` along with contract types.
- `src/client/render/frame/RailroadCache.ts` — Accumulates railroad delta events into a per-tile state for GPU upload.
- `src/client/render/frame/TrailManager.ts` — Stamps per-tile "last owner" trail values for tracked units.
- `src/client/render/frame/Upload.ts` — `FrameUploadTarget` GPU view contract and per-frame push loop.
- `src/client/render/frame/derive/AllianceClusters.ts` — Computes alliance clusters (union-find) for SAM radius coloring.
- `src/client/render/frame/derive/AttackRings.ts` — Extracts attack-ring indicators for the local player's transport ships.
- `src/client/render/frame/derive/NukeTelegraphs.ts` — Extracts nuke telegraph circles classified as self/friendly/enemy.
- `src/client/render/frame/derive/PlayerStatus.ts` — Computes per-player status flags (crown, traitor, disconnected, nuke, etc.).
- `src/client/render/frame/derive/RelationMatrix.ts` — Builds player relationship matrix for border/telegraph coloring.

## src/client/render/gl/ (core)
- `src/client/render/gl/Camera.ts` — 2D camera with pan/zoom producing a `mat3` (world→clip) for WebGL2 shaders.
- `src/client/render/gl/DynamicBuffer.ts` — Grow-on-demand WebGL2 instance buffer manager.
- `src/client/render/gl/GraphicsOverrides.ts` — Zod `GraphicsOverridesSchema` for user-tweakable graphics settings.
- `src/client/render/gl/index.ts` — Public barrel/entry re-exporting the renderer's public API (excludes debug GUI).
- `src/client/render/gl/initGL.ts` — Acquires a GPU-accelerated WebGL2 context (rejecting SwiftShader) and gates on failure.
- `src/client/render/gl/MapRenderer.ts` — Public facade over `GPURenderer` handling context loss/restore.
- `src/client/render/gl/Renderer.ts` — Core `GPURenderer` implementing the multi-pass WebGL2 render pipeline.
- `src/client/render/gl/RenderOverrides.ts` — Applies a `GraphicsOverrides` object onto `RenderSettings`.
- `src/client/render/gl/RenderSettings.ts` — `RenderSettings`/`ThemeSettings` interfaces and load/dump helpers.
- `src/client/render/gl/SettingsUtils.ts` — `deepAssign`/`deepDiff` utilities for merging/persisting `RenderSettings`.
- `src/client/render/gl/default-theme.json` — Default player/team color palette and theme knobs.
- `src/client/render/gl/colorblind-theme.json` — Colorblind-safe (Okabe-Ito) palette and theme knobs.
- `src/client/render/gl/render-settings.json` — Base default render-settings values merged with the active theme.
- `src/client/render/gl/utils/Affiliation.ts` — `AffiliationPalette` mapping each ownerID to alt-view affiliation colors.
- `src/client/render/gl/utils/ColorUtils.ts` — GPU color utilities: palette constants, hex parsing, terrain RGBA encoding.
- `src/client/render/gl/utils/Dpr.ts` — `renderDpr()` helper capped at 2 for high-DPI displays.
- `src/client/render/gl/utils/GlUtils.ts` — Low-level WebGL2 helpers: shader/texture creation, VAOs, `#define` injection.
- `src/client/render/gl/utils/GpuResources.ts` — Creates/disposes shared GPU textures (`tileTex`, `trailTex`, `borderTex`, heat).
- `src/client/render/gl/utils/HeatManager.ts` — GPU-side fallout heat manager via ping-pong shader decay.
- `src/client/render/gl/utils/NukeTrajectory.ts` — Computes nuke trajectory Bézier control points and SAM-intercept thresholds.
- `src/client/render/gl/utils/TileCodec.ts` — Single source of truth for the R16UI tile bit layout shared by TS and GLSL.

## src/client/render/gl/passes/ (root)
- `src/client/render/gl/passes/BarPass.ts` — Instanced health/progress bars and veterancy pips.
- `src/client/render/gl/passes/BorderComputePass.ts` — Fullscreen pass computing per-tile border type flags.
- `src/client/render/gl/passes/BorderScatterPass.ts` — Incremental recompute of changed border tiles via POINT draws.
- `src/client/render/gl/passes/BorderStampPass.ts` — Stamps borders and defense checkerboard at full brightness.
- `src/client/render/gl/passes/CoordinateGridPass.ts` — Procedural grid overlay with A-Z/0-9 cell labels.
- `src/client/render/gl/passes/CrosshairPass.ts` — Crosshair at cursor during warship/MIRV ghost placement.
- `src/client/render/gl/passes/DefenseCoveragePass.ts` — Stamps per-tile "defended" flags via instanced circles.
- `src/client/render/gl/passes/FalloutBloomPass.ts` — Extracts/blurs/composites radioactive bloom around irradiated tiles.
- `src/client/render/gl/passes/FalloutLightPass.ts` — Extracts fallout/ember light into the night lightmap FBO.
- `src/client/render/gl/passes/LightmapPass.ts` — Orchestrates point + fallout lights into the final lightmap.
- `src/client/render/gl/passes/MoveIndicatorPass.ts` — Converging chevron animation at a warship's move target.
- `src/client/render/gl/passes/NightCompositePass.ts` — Composites the scene with the blurred lightmap for day/night.
- `src/client/render/gl/passes/NukeTelegraphPass.ts` — Animated inner/outer blast-radius circles at nuke targets.
- `src/client/render/gl/passes/NukeTrajectoryPass.ts` — Nuke build-mode trajectory arc plus zone/interception markers.
- `src/client/render/gl/passes/PointLightPass.ts` — Instanced radial-falloff quads as light sources for the lightmap.
- `src/client/render/gl/passes/RailroadPass.ts` — GPU railroad overlay with detailed/AA LODs and ghost rails.
- `src/client/render/gl/passes/RangeCirclePass.ts` — Translucent range circle for build-mode ghost previews.
- `src/client/render/gl/passes/SamRadiusPass.ts` — Rotating dashed SAM radius circles with allied union merging.
- `src/client/render/gl/passes/SelectionBoxPass.ts` — Stippled pulsating selection boxes around selected warships.
- `src/client/render/gl/passes/SkinAtlasArray.ts` — TEXTURE_2D_ARRAY holding per-player territory skin PNGs.
- `src/client/render/gl/passes/SpawnOverlayPass.ts` — Spawn-phase tile highlights and breathing rings.
- `src/client/render/gl/passes/StructureLevelPass.ts` — Instanced level digits above structures (bitmap/MSDF).
- `src/client/render/gl/passes/StructurePass.ts` — Instanced structure icons with zoom LODs and ghost preview.
- `src/client/render/gl/passes/TerrainPass.ts` — Renders the terrain map as a camera-transformed textured quad.
- `src/client/render/gl/passes/TerritoryPass.ts` — Territory fill + stale-nuke ground with drip-bucket uploads.
- `src/client/render/gl/passes/TileScatterPass.ts` — GPU POINTS scatter writer patching tiles into the R16UI tile texture.
- `src/client/render/gl/passes/TrailPass.ts` — Boat/nuke trail breadcrumb lines via an R16UI trail texture.
- `src/client/render/gl/passes/UnitPass.ts` — Instanced mobile-unit sprites split into ground and missile layers.
- `src/client/render/gl/passes/WorldTextPass.ts` — MSDF world-space text for popups, ghost costs, attack-troop labels.

## src/client/render/gl/passes/fx-pass/
- `src/client/render/gl/passes/fx-pass/FxAttackRingPass.ts` — Persistent animated dashed rings at transport ship target tiles.
- `src/client/render/gl/passes/fx-pass/FxShockwavePass.ts` — Instanced nuke/SAM shockwave rings (classic/EMP/sparkle).
- `src/client/render/gl/passes/fx-pass/FxSpritePass.ts` — Instanced sprite-atlas explosions, dust, and conquest effects.
- `src/client/render/gl/passes/fx-pass/index.ts` — FxPass orchestrator coordinating sub-passes.

## src/client/render/gl/passes/name-pass/
- `src/client/render/gl/passes/name-pass/AtlasData.ts` — Parses MSDF atlas JSON and builds glyph/kerning/emoji tables.
- `src/client/render/gl/passes/name-pass/DataTextures.ts` — Builds glyph/string/player-data GL data textures.
- `src/client/render/gl/passes/name-pass/DebugProgram.ts` — Wireframe bounding-box debug overlay for name/flag layout.
- `src/client/render/gl/passes/name-pass/FlagAtlasArray.ts` — Runtime TEXTURE_2D_ARRAY of player flags fetched by URL.
- `src/client/render/gl/passes/name-pass/IconProgram.ts` — Instanced flag + emoji icons beside player names.
- `src/client/render/gl/passes/name-pass/StatusIconProgram.ts` — Instanced status icons (crown, traitor, alliance) above names.
- `src/client/render/gl/passes/name-pass/TextLayout.ts` — Pure-CPU MSDF text shaping (cursor positions, centering).
- `src/client/render/gl/passes/name-pass/TextProgram.ts` — MSDF text shader for player names and troop counts.
- `src/client/render/gl/passes/name-pass/Types.ts` — Shared BMFont/atlas types, `PlayerSlot` interface, NamePass constants.
- `src/client/render/gl/passes/name-pass/index.ts` — NamePass orchestrator doing GPU text/icons/flags.

## src/client/render/gl/shaders/ (glsl)
- `src/client/render/gl/shaders/bar/bar.frag.glsl` — Draws progress bars and solid veterancy pips with colored fill.
- `src/client/render/gl/shaders/bar/bar.vert.glsl` — Positions instanced bar quads at world coords with progress.
- `src/client/render/gl/shaders/border-compute/border-compute.frag.glsl` — Computes per-tile border flags and relationship from tile/relation textures.
- `src/client/render/gl/shaders/border-compute/border-scatter.vert.glsl` — Rasterizes one point per tile for the border-compute pass.
- `src/client/render/gl/shaders/crosshair/crosshair.frag.glsl` — Renders a crosshair with two perpendicular anti-aliased arms.
- `src/client/render/gl/shaders/crosshair/crosshair.vert.glsl` — Places the crosshair quad at a world tile in screen pixels.
- `src/client/render/gl/shaders/day-night/border-stamp.frag.glsl` — Stamps full-brightness border color with highlight/relationship tint.
- `src/client/render/gl/shaders/day-night/border-stamp.vert.glsl` — Pass-through vertex mapping tiles to world space.
- `src/client/render/gl/shaders/day-night/composite.frag.glsl` — Multiplies scene by day/night light buffer.
- `src/client/render/gl/shaders/day-night/fallout-composite.frag.glsl` — Copies fallout texture sample to output.
- `src/client/render/gl/shaders/day-night/fallout-composite.vert.glsl` — Pass-through vertex mapping tiles to UVs.
- `src/client/render/gl/shaders/day-night/fallout-light.frag.glsl` — Produces green fallout glow and ember light for the night buffer.
- `src/client/render/gl/shaders/day-night/light.frag.glsl` — Draws a single radial point-light with falloff.
- `src/client/render/gl/shaders/day-night/light.vert.glsl` — Positions instanced radial light quads by type.
- `src/client/render/gl/shaders/defense-coverage/defense-coverage.frag.glsl` — Writes 1.0 into coverage texture for owned tiles in a post's range.
- `src/client/render/gl/shaders/defense-coverage/defense-coverage.vert.glsl` — Emits one instanced quad per defense post sized to range.
- `src/client/render/gl/shaders/fallout-bloom/composite.frag.glsl` — Composites fallout bloom texture scaled by coverage.
- `src/client/render/gl/shaders/fallout-bloom/composite.vert.glsl` — Pass-through vertex mapping tiles to UVs.
- `src/client/render/gl/shaders/fallout-bloom/extract.frag.glsl` — Extracts animated fallout bloom per tile into the bloom buffer.
- `src/client/render/gl/shaders/fallout-bloom/heat-decay.frag.glsl` — Decays per-tile heat value over time.
- `src/client/render/gl/shaders/fx/attack-ring.frag.glsl` — Red double concentric ring with counter-rotating dashes.
- `src/client/render/gl/shaders/fx/attack-ring.vert.glsl` — Positions instanced attack-ring quad in screen pixels.
- `src/client/render/gl/shaders/fx/shockwave.frag.glsl` — Expanding shockwaves (classic/EMP/sparkle) by cosmetics.
- `src/client/render/gl/shaders/fx/shockwave.vert.glsl` — Positions instanced shockwave quads forwarding style/color.
- `src/client/render/gl/shaders/fx/sprite.frag.glsl` — Samples an FX atlas sprite with per-instance alpha.
- `src/client/render/gl/shaders/fx/sprite.vert.glsl` — Places instanced FX sprite quads with atlas UVs.
- `src/client/render/gl/shaders/grid/grid.frag.glsl` — Draws grid lines and alphanumeric cell labels from a glyph atlas.
- `src/client/render/gl/shaders/map-overlay/overlay.vert.glsl` — Generic full-map quad vertex shader for overlay passes.
- `src/client/render/gl/shaders/map-overlay/territory.frag.glsl` — Renders territory fill, skins/patterns, hover, defense darkening.
- `src/client/render/gl/shaders/map-overlay/tile-scatter.frag.glsl` — Writes integer tile state into an R16UI target.
- `src/client/render/gl/shaders/map-overlay/tile-scatter.vert.glsl` — Scatters one point per tile carrying tile state.
- `src/client/render/gl/shaders/map-overlay/trail.frag.glsl` — Renders boat/nuke trails using player colors or effects.
- `src/client/render/gl/shaders/move-indicator/move-indicator.frag.glsl` — Converging inward chevrons animating over time.
- `src/client/render/gl/shaders/move-indicator/move-indicator.vert.glsl` — Centers move-indicator quad on a world position.
- `src/client/render/gl/shaders/name/debug-box.frag.glsl` — Wireframe debug bounding boxes for name/flag plates.
- `src/client/render/gl/shaders/name/debug-box.vert.glsl` — Positions instanced debug boxes using name sizing pipeline.
- `src/client/render/gl/shaders/name/icon.frag.glsl` — Samples flag/emoji atlas icons with hover-fade alpha.
- `src/client/render/gl/shaders/name/icon.vert.glsl` — Lays out flag/emoji icons beside/above each name.
- `src/client/render/gl/shaders/name/name.frag.glsl` — Renders player name text (MSDF) with outline and hover glow.
- `src/client/render/gl/shaders/name/name.vert.glsl` — Builds per-character name/troop text quads from glyph metrics.
- `src/client/render/gl/shaders/name/status-icon.frag.glsl` — Samples status icons with alliance-drain clipping and outline.
- `src/client/render/gl/shaders/name/status-icon.vert.glsl` — Positions instanced status-icon quads with animation.
- `src/client/render/gl/shaders/nuke-telegraph/nuke-telegraph.frag.glsl` — Pulsing telegraphed nuke target with inner/outer rings.
- `src/client/render/gl/shaders/nuke-telegraph/nuke-telegraph.vert.glsl` — Positions instanced nuke-telegraph quads by radius.
- `src/client/render/gl/shaders/nuke-trajectory/nuke-trajectory-marker.frag.glsl` — Circle marker (untargetable) and X marker (SAM intercept).
- `src/client/render/gl/shaders/nuke-trajectory/nuke-trajectory-marker.vert.glsl` — Places a marker quad at t along a Bézier trajectory.
- `src/client/render/gl/shaders/nuke-trajectory/nuke-trajectory.frag.glsl` — Dashed Bézier trajectory with outline and zone/intercept recolor.
- `src/client/render/gl/shaders/nuke-trajectory/nuke-trajectory.vert.glsl` — Expands the Bézier into a screen-width strip.
- `src/client/render/gl/shaders/railroad/railroad.frag.glsl` — Renders railroad tracks, bridges, ghost rails, overlap highlights.
- `src/client/render/gl/shaders/range-circle/range-circle.frag.glsl` — Translucent filled circle with stroked edge.
- `src/client/render/gl/shaders/range-circle/range-circle.vert.glsl` — Centers range-circle quad on a world-space center.
- `src/client/render/gl/shaders/sam-radius/sam-radius.frag.glsl` — Dashed/rotating SAM-radius ring with arc clipping.
- `src/client/render/gl/shaders/sam-radius/sam-radius.vert.glsl` — Positions instanced SAM-radius rings by radius.
- `src/client/render/gl/shaders/selection-box/selection-box.frag.glsl` — Pulsating stippled selection-box border.
- `src/client/render/gl/shaders/selection-box/selection-box.vert.glsl` — Centers selection-box quad on a world tile.
- `src/client/render/gl/shaders/shared/blur.frag.glsl` — Separable Gaussian-style blur along a direction.
- `src/client/render/gl/shaders/shared/fullscreen-no-uv.vert.glsl` — Fullscreen quad vertex shader outputting no UVs.
- `src/client/render/gl/shaders/shared/fullscreen.vert.glsl` — Fullscreen quad vertex shader outputting 0–1 UVs.
- `src/client/render/gl/shaders/spawn-overlay/spawn-overlay.frag.glsl` — Spawn overlays: enemy highlights and self/teammate rings.
- `src/client/render/gl/shaders/spawn-overlay/spawn-overlay.vert.glsl` — Positions instanced spawn-overlay quads by kind.
- `src/client/render/gl/shaders/structure/structure.frag.glsl` — Renders structure icons as colored shapes with glyph/states.
- `src/client/render/gl/shaders/structure/structure.vert.glsl` — Positions instanced structure icon quads with zoom scaling.
- `src/client/render/gl/shaders/structure-level/structure-level.frag.glsl` — Renders structure level numbers with dimming.
- `src/client/render/gl/shaders/structure-level/structure-level.vert.glsl` — Positions instanced level glyphs above icons.
- `src/client/render/gl/shaders/terrain/terrain.frag.glsl` — Samples and outputs the precomputed terrain basemap texture.
- `src/client/render/gl/shaders/terrain/terrain.vert.glsl` — Maps full-map quad to 0–1 UVs for terrain sampling.
- `src/client/render/gl/shaders/unit/unit.frag.glsl` — Recolors unit sprites by player/affiliation with flag states and H-bomb glow.
- `src/client/render/gl/shaders/unit/unit.vert.glsl` — Places instanced unit sprite quads, enlarging H-bomb instances.
- `src/client/render/gl/shaders/world-text/world-text.frag.glsl` — Renders world-space text (MSDF) with outline and glow.
- `src/client/render/gl/shaders/world-text/world-text.vert.glsl` — Lays out instanced world-text glyph quads with zoom-aware scale.
- `src/client/render/gl/shaders/glsl.d.ts` — Ambient module declaration for `*.glsl?raw` imports resolving to a string.

## src/client/render/gl/debug/
- `src/client/render/gl/debug/ConfigProp.ts` — Interface for a single debug-GUI configurable property.
- `src/client/render/gl/debug/Folder.ts` — Folder node type and builder for grouping debug controls.
- `src/client/render/gl/debug/Layout.ts` — Builds the full debug control tree from settings.
- `src/client/render/gl/debug/Tree.ts` — Walks the debug node tree, drawing onto the lil-gui GUI.
- `src/client/render/gl/debug/Wiring.ts` — Wires draggable GUI, JSON load/save, reset, modified-indicator.
- `src/client/render/gl/debug/index.ts` — Creates the lil-gui debug panel by building/walking the tree.
- `src/client/render/gl/debug/props/Color.ts` — Color picker ConfigProp bound to rgb settings fields.
- `src/client/render/gl/debug/props/Select.ts` — Dropdown Select ConfigProp bound to a string field.
- `src/client/render/gl/debug/props/Slider.ts` — Numeric Slider ConfigProp bound to a numeric field.
- `src/client/render/gl/debug/props/Toggle.ts` — Boolean Toggle ConfigProp bound to a boolean field.

## src/client/render/types/ + CLAUDE.md
- `src/client/render/types/FrameData.ts` — Long-lived FrameData boundary contract built by GameView for the renderer.
- `src/client/render/types/FrameEvents.ts` — FrameEvents interface holding per-frame ephemeral FX events.
- `src/client/render/types/index.ts` — Barrel re-exporting all renderer type interfaces/enums/constants.
- `src/client/render/types/Renderer.ts` — Core renderer data shapes (PlayerState, UnitState, nuke/ghost/trajectory inputs).
- `src/client/render/types/UnitType.ts` — Canonical unit-type string constants and derived sets for the renderer.
- `src/client/render/CLAUDE.md` — Documents the WebGL2 renderer pipeline, conventions, and FrameData upload contract.

## src/client/sound/
- `src/client/sound/SoundManager.ts` — Howler-based manager loading/playing music and capped-concurrency SFX via EventBus.
- `src/client/sound/Sounds.ts` — Defines the SoundEffect type, effect→URL map, and sound GameEvent classes.

## src/client/styles/
- `src/client/styles.css` — Root Tailwind/theme stylesheet importing base layers and global component styles.
- `src/client/styles/components/controls.css` — Styles for keyboard/mouse control visuals and keybind listening states.
- `src/client/styles/components/setting.css` — Styles for the settings panel (sliders, switches, keybind boxes).
- `src/client/styles/core/flag-animation.css` — Keyframe flag animations for cosmetic flag colors.
- `src/client/styles/core/typography.css` — Minimal link/white-text typography helper classes.
- `src/client/styles/core/variables.css` — Root CSS custom properties for theme mode, breakpoints, colors, medals.
- `src/client/styles/layout/container.css` — Flexbox container/row layout utility classes for modals/panels.
- `src/client/styles/layout/header.css` — Header layout/logo styles with blur backdrop and brand gradient.
- `src/client/styles/modal/chat.css` — Chat modal styles (columns, scroll areas, send buttons).

## src/client/theme/
- `src/client/theme/ColorAllocator.ts` — Allocates stable, perceptually-distinct colors from a pool to each id.
- `src/client/theme/ThemeProvider.ts` — Client theme source-of-truth computing colors from ThemeSettings.

## src/client/view/
- `src/client/view/GameView.ts` — Client-side game mirror implementing GameMap and building FrameData for the renderer.
- `src/client/view/index.ts` — Barrel re-exporting GameView, PlayerView, and UnitView.
- `src/client/view/PlayerView.ts` — Wraps engine player state into renderer-facing PlayerState/PlayerStatic.
- `src/client/view/UnitView.ts` — Wraps engine unit updates into renderer UnitState with position/train/missile helpers.

## src/client/utilities/
- `src/client/utilities/Diagnostic.ts` — Collects browser/rendering/GPU/power diagnostics via WebGL/battery probing.
- `src/client/utilities/DisableSafariPinchZoom.ts` — Installs WebKit gesture listeners blocking Safari pinch zoom.
- `src/client/utilities/GameConfigHelpers.ts` — Helpers mapping sliders/configs and selecting random maps.
- `src/client/utilities/ReplaySpeedMultiplier.ts` — Enum of replay speed multipliers and the default normal value.

---

# src/core/ — Game Simulation / Shared Logic

## src/core/ (root schemas & utilities)
- `src/core/ApiSchemas.ts` — Zod schemas for API/auth responses (JWT, user/clan/friend/leaderboard profiles).
- `src/core/AssetUrls.ts` — Builds, normalizes, and CDN-prefixes asset URLs from a manifest.
- `src/core/Base64.ts` — Converts UUIDs to/from base64url encoding for compact IDs.
- `src/core/ClanApiSchemas.ts` — Zod schemas for clan API responses and Discord invite parsing.
- `src/core/configuration/Config.ts` — `Config` class with all tunable game-balance constants resolved from a GameConfig.
- `src/core/CosmeticSchemas.ts` — Zod schemas for the cosmetics catalog plus effect-resolution helpers.
- `src/core/EventBus.ts` — Minimal typed pub/sub EventBus for GameEvent instances.
- `src/core/GameRunner.ts` — Creates/drives the per-tick game simulation, executing turns and emitting updates.
- `src/core/PatternDecoder.ts` — Decodes base64url player pattern bitmaps into width/height/scale metadata.
- `src/core/PseudoRandom.ts` — Deterministic SFC32 PRNG with seed-based int/float/ID/shuffle helpers.
- `src/core/Schemas.ts` — Central Zod schemas for config, intents, client/server messages, player records.
- `src/core/StatsSchemas.ts` — Zod schemas and constants for player stats and unit-type short codes.
- `src/core/Util.ts` — Misc utilities: math, hashing, ID generation, sanitization, emoji table, anonymized names.
- `src/core/validations/username.ts` — Validates usernames and clan tags against Zod schemas with localized errors.
- `src/core/WorkerSchemas.ts` — Zod schemas for worker game-creation/game-input payloads.

## src/core/tech/
- `src/core/tech/TechTreeData.ts` — Static per-structure 3-layer binary tech-tree definitions (TECH_TREES) plus lookups.

## src/core/worker/
- `src/core/worker/WorkerClient.ts` — Main-thread WorkerClient spawning the inline worker with promise-based methods.
- `src/core/worker/WorkerMessages.ts` — Type definitions for all main-thread↔worker messages.
- `src/core/worker/Worker.worker.ts` — Web Worker entry point initializing GameRunner and draining turns into batched updates.

## src/core/execution/ (root)
- `src/core/execution/AttackExecution.ts` — Conducts a land attack, conquering tiles and resolving troop losses.
- `src/core/execution/BoatRetreatExecution.ts` — Marks an outgoing transport ship as retreating.
- `src/core/execution/CityExecution.ts` — On city creation, attaches a train station if a factory is nearby.
- `src/core/execution/CitySelfDestructExecution.ts` — Detonates an atom-scale blast at a captured trade-hub city after countdown.
- `src/core/execution/ConstructionExecution.ts` — Handles building any unit/structure, charging gold and delegating on completion.
- `src/core/execution/DefensePostExecution.ts` — Makes a defense post periodically fire shells at enemy units in range.
- `src/core/execution/DeleteUnitExecution.ts` — Validates and marks one of the player's own units for deletion.
- `src/core/execution/DonateGoldExecution.ts` — Transfers gold between players, adjusting relations and triggering emoji replies.
- `src/core/execution/DonateTroopExecution.ts` — Transfers troops to a recipient with a relation bump.
- `src/core/execution/DoomsdayClockExecution.ts` — Anti-stall mechanic flagging/bleeding sides below a rising territory threshold.
- `src/core/execution/EmbargoAllExecution.ts` — Starts/stops embargoes against all other eligible players.
- `src/core/execution/EmbargoExecution.ts` — Starts/stops a trade embargo against a single target.
- `src/core/execution/EmojiExecution.ts` — Sends an emoji to a recipient (or all) and triggers AI responses.
- `src/core/execution/ExecutionManager.ts` — Maps player intents to the correct Execution subclass and spawns executions.
- `src/core/execution/FactoryExecution.ts` — On factory creation, creates train stations for itself and nearby structures.
- `src/core/execution/LabExecution.ts` — On lab creation (legacy mode), wires a train station if a factory is nearby.
- `src/core/execution/MIRVExecution.ts` — Launches a MIRV that separates into many warhead strikes at target.
- `src/core/execution/MarkDisconnectedExecution.ts` — Marks a player as disconnected/connected for state tracking.
- `src/core/execution/MissileSiloExecution.ts` — Reloads the missile silo's missile once cooldown expires.
- `src/core/execution/MoveWarshipExecution.ts` — Updates owned warships' patrol tiles to a new water-connected location.
- `src/core/execution/NationExecution.ts` — Drives an AI nation's per-tick behavior via its alliance/attack/structure/nuke behaviors.
- `src/core/execution/NoOpExecution.ts` — No-op execution when an intent cannot be resolved.
- `src/core/execution/NukeExecution.ts` — Launches/detonates an atom/hydrogen/MIRV bomb along a parabola.
- `src/core/execution/PauseExecution.ts` — Toggles game pause (lobby creator or singleplayer only).
- `src/core/execution/PlayerExecution.ts` — Per-tick player upkeep: growth, cluster cleanup, capture, expiry, death cleanup.
- `src/core/execution/PortExecution.ts` — Periodically spawns trade ships from a port to trade in the same water body.
- `src/core/execution/PurchaseTechExecution.ts` — Validates and purchases a tech node (cost/prereqs/conflicts).
- `src/core/execution/QuickChatExecution.ts` — Sends a quick-chat message from one player to a recipient.
- `src/core/execution/RecomputeRailClusterExecution.ts` — Recomputes rail network connected station clusters on topology change.
- `src/core/execution/ResearchLotteryExecution.ts` — Awards research via a per-tick lottery scaled by sqrt(lab count).
- `src/core/execution/RetreatExecution.ts` — Orders an in-progress attack to retreat after a short cancel delay.
- `src/core/execution/SAMLauncherExecution.ts` — Smart SAM targeting that preshoots and launches interceptors at nukes.
- `src/core/execution/SAMMissileExecution.ts` — Flies a SAM missile to intercept and destroy an incoming bomb.
- `src/core/execution/ShellExecution.ts` — Fires a defense-post/warship shell at a target unit, dealing scaled damage.
- `src/core/execution/SpawnExecution.ts` — Spawns/respawns a player at a tile, creating their Player/Tribe executions.
- `src/core/execution/SpawnTimerExecution.ts` — Ends the spawn phase once its duration elapses.
- `src/core/execution/TargetPlayerExecution.ts` — Sets a player as the requestor's targeted enemy and lowers relations.
- `src/core/execution/TradeShipExecution.ts` — Sails a trade ship delivering gold and handling capture.
- `src/core/execution/TrainExecution.ts` — Runs a train along a rail path between stations, trading at cities/ports.
- `src/core/execution/TrainStationExecution.ts` — Registers a structure as a rail station and spawns trains to destinations.
- `src/core/execution/TransportShipExecution.ts` — Launches a naval invasion ferrying troops to a target tile.
- `src/core/execution/TribeExecution.ts` — AI behavior for bot "tribes": alliances, deleting spares, attacking neighbors.
- `src/core/execution/TribeSpawner.ts` — Generates random-named bot tribe players and their spawn executions.
- `src/core/execution/UpgradeStructureExecution.ts` — Upgrades one of the player's structures if allowed.
- `src/core/execution/Util.ts` — Shared execution helpers: nuke blast/alliance computations, spawn search, math.
- `src/core/execution/WarshipExecution.ts` — AI warship behavior: patrol, shoot, hunt trade ships, heal/retreat, capture.
- `src/core/execution/WinCheckExecution.ts` — Checks win conditions for FFA/team modes and declares a winner.

## src/core/execution/alliance/
- `src/core/execution/alliance/AllianceExtensionExecution.ts` — Records/renews an alliance when both parties agree.
- `src/core/execution/alliance/AllianceRejectExecution.ts` — Rejects a pending incoming alliance request.
- `src/core/execution/alliance/AllianceRequestExecution.ts` — Sends an alliance request (or auto-accepts reciprocal) and cancels nukes.
- `src/core/execution/alliance/BreakAllianceExecution.ts` — Breaks an alliance, applies relation penalties, informs neighbors.

## src/core/execution/nation/ (AI behaviors)
- `src/core/execution/nation/NationAllianceBehavior.ts` — AI logic for accepting/rejecting alliance requests and extensions.
- `src/core/execution/nation/NationEmojiBehavior.ts` — AI emoji reactions (greetings, attacks, threats, donations, MIRV).
- `src/core/execution/nation/NationMIRVBehavior.ts` — AI decision logic for when to launch a MIRV at a target.
- `src/core/execution/nation/NationNukeBehavior.ts` — AI logic for when/where to launch bombs and upgrade silos.
- `src/core/execution/nation/NationStructureBehavior.ts` — AI logic for which structures to build and upgrade.
- `src/core/execution/nation/NationUtils.ts` — Utility to pick territory tiles within a nation's bounding box.
- `src/core/execution/nation/NationWarshipBehavior.ts` — AI logic for spawning warships and retaliating against ships.
- `src/core/execution/nation/SharedWaterCache.ts` — Caches water bodies each nation shares with trade partners.

## src/core/execution/utils/
- `src/core/execution/utils/AiAttackBehavior.ts` — Shared AI attack decision logic for nations and tribes.
- `src/core/execution/utils/FlatBinaryHeap.ts` — Lightweight min-heap (Float32 priorities + parallel tile array).
- `src/core/execution/utils/PlayerSpawner.ts` — Creates SpawnExecutions for all human players at game start.
- `src/core/execution/utils/TribeNames.ts` — Static lists of tribe name prefixes/suffixes for bot names.

## src/core/game/
- `src/core/game/AllianceImpl.ts` — Concrete implementation of an alliance between two players.
- `src/core/game/AllianceRequestImpl.ts` — Concrete implementation of a pending alliance request.
- `src/core/game/AttackImpl.ts` — Concrete implementation of an attack/unit movement action.
- `src/core/game/BinaryLoaderGameMapLoader.ts` — `GameMapLoader` reading maps from a compact binary source.
- `src/core/game/DoomsdayClock.ts` — Computes doomsday clock wave schedules, tile requirements, and drain curves.
- `src/core/game/FetchGameMapLoader.ts` — `GameMapLoader` fetching map data remotely.
- `src/core/game/Game.ts` — Core domain types, enums, and interfaces (Player, Unit, Game, GameType).
- `src/core/game/GameImpl.ts` — Main game-state implementation plus `createGame` factory.
- `src/core/game/GameMap.ts` — Map geometry: tiles, neighbors, distances, terrain queries.
- `src/core/game/GameMapLoader.ts` — `GameMapLoader` interface and `MapData` payload contract.
- `src/core/game/GameUpdateUtils.ts` — Utilities for diffing/applying player updates and packing attack deltas.
- `src/core/game/GameUpdates.ts` — All `GameUpdate` message types emitted to clients.
- `src/core/game/Maps.gen.ts` — Generated registry of available maps and categories.
- `src/core/game/MotionPlans.ts` — Encodes/decodes unit grid-path and train rail-path motion plans.
- `src/core/game/NationCreation.ts` — Creates nations and procedurally generates nation names.
- `src/core/game/PlayerImpl.ts` — Concrete player implementation with resources/borders/actions.
- `src/core/game/RailNetwork.ts` — Rail network interface for train routing.
- `src/core/game/RailNetworkImpl.ts` — Rail network implementation with stations and pathfinding.
- `src/core/game/Railroad.ts` — Railroad segment and orientation representation.
- `src/core/game/RailroadSpatialGrid.ts` — Spatial grid indexing railroads for fast queries.
- `src/core/game/Stats.ts` — Per-player statistics interface.
- `src/core/game/StatsImpl.ts` — Player statistics tracking implementation.
- `src/core/game/TeamAssignment.ts` — Assigns players to teams and computes team sizes.
- `src/core/game/TerraNulliusImpl.ts` — Neutral (unowned) territory owner implementation.
- `src/core/game/TerrainMapLoader.ts` — Loads terrain map metadata and nation placement data.
- `src/core/game/TerrainSearchMap.ts` — Searchable terrain grid for pathfinding.
- `src/core/game/TileSet.ts` — Efficient set data structure for tracking collections of tiles.
- `src/core/game/TileTraversalScratch.ts` — Reusable scratch buffers for tile traversal.
- `src/core/game/TrainStation.ts` — Train stations, clusters, and trade/production stop handlers.
- `src/core/game/TransportShipUtils.ts` — Helpers for building transport ships and finding shore deployment tiles.
- `src/core/game/UnitGrid.ts` — Spatial grid indexing units for fast lookup.
- `src/core/game/UnitImpl.ts` — Concrete implementation of a single unit.
- `src/core/game/UserSettings.ts` — Manages persistent player user settings.
- `src/core/game/Veterancy.ts` — Computes unit max-health bonuses from veterancy levels.
- `src/core/game/WaterManager.ts` — Tracks water/shore connectivity graph for naval movement.

## src/core/pathfinding/
- `src/core/pathfinding/PathFinder.Air.ts` — `AirPathFinder`: pseudo-random-walk stepping from source toward destination.
- `src/core/pathfinding/PathFinder.Parabola.ts` — `ParabolaUniversalPathFinder`: Bezier parabolic arc between tiles (projectiles/nukes).
- `src/core/pathfinding/PathFinder.Station.ts` — `StationPathFinder`: routes between train stations via A* over the rail graph.
- `src/core/pathfinding/PathFinder.ts` — Central factory wiring algorithms + transformers into shared pathfinders with caching.
- `src/core/pathfinding/PathFinderBuilder.ts` — Fluent builder composing transformers and optionally a stepper.
- `src/core/pathfinding/PathFinderStepper.ts` — Wraps a PathFinder with cached incremental step-by-step traversal.
- `src/core/pathfinding/types.ts` — Core shared types: `PathStatus`, `PathResult`, `PathFinder`/`SteppingPathFinder` interfaces.
- `src/core/pathfinding/algorithms/AStar.AbstractGraph.ts` — Generic A* over an AbstractGraph with multi-source support.
- `src/core/pathfinding/algorithms/AStar.Rail.ts` — A* for rail networks penalizing water/direction changes.
- `src/core/pathfinding/algorithms/AStar.Water.ts` — Inlined performance-critical A* over the full water grid.
- `src/core/pathfinding/algorithms/AStar.WaterBounded.ts` — Bounds-limited A* searching only a local rectangular region.
- `src/core/pathfinding/algorithms/AStar.WaterHierarchical.ts` — Hierarchical water pathfinder combining bounded A*, abstract A*, BFS.
- `src/core/pathfinding/algorithms/AStar.ts` — Generic adapter-driven A* (default BucketQueue) for less critical throughput.
- `src/core/pathfinding/algorithms/AbstractGraph.ts` — `AbstractGraph` data structure and `AbstractGraphBuilder` via BFS gateways.
- `src/core/pathfinding/algorithms/BFS.Grid.ts` — Stamp-based 4-directional grid BFS with visitor pattern.
- `src/core/pathfinding/algorithms/BFS.ts` — Generic adapter-based BFS with visitor pattern.
- `src/core/pathfinding/algorithms/ConnectedComponents.ts` — Flood-fill connected-component labeling of water tiles.
- `src/core/pathfinding/algorithms/PriorityQueue.ts` — MinHeap (float) and BucketQueue (integer) priority queues.
- `src/core/pathfinding/spatial/SpatialQuery.ts` — BFS/nearest-shore queries for finding shore/water tiles.
- `src/core/pathfinding/transformers/ComponentCheckTransformer.ts` — Fails fast when endpoints are in different connected components.
- `src/core/pathfinding/transformers/MiniMapTransformer.ts` — Runs pathfinding on a downscaled minimap then upscales.
- `src/core/pathfinding/transformers/ShoreCoercingTransformer.ts` — Coerces shore tiles to adjacent water before/after pathfinding.
- `src/core/pathfinding/transformers/SmoothingWaterTransformer.ts` — Smooths raw water paths via line-of-sight and bounded-A* refinement.

---

# src/server/ — Backend / Multiplayer

- `src/server/AdminBotRoutes.ts` — Authenticated admin-bot HTTP API (`/api/adminbot/*`) for private games and stats.
- `src/server/Archive.ts` — Archives/finalizes finished game records to the central API, stripping untrusted flag URLs.
- `src/server/Client.ts` — `Client` class for one connected websocket player with identity, cosmetics, ping, hashes.
- `src/server/ClientMsgRateLimiter.ts` — Per-client rate limiter for intents/byte caps to prevent abuse and RAM bloat.
- `src/server/GameManager.ts` — Manages all `GameServer` instances on a worker: create/join/rejoin and pruning.
- `src/server/GamePreviewBuilder.ts` — Builds OpenGraph/social-preview metadata for a game from lobby/public info.
- `src/server/GamePreviewRoute.ts` — Serves `/game/:id` HTML with injected meta tags (or JSON fallback) for link previews.
- `src/server/GameServer.ts` — Core per-game class: lobby→active→finished lifecycle, turns, intents, desync, consensus.
- `src/server/IPCBridgeSchema.ts` — Zod schemas for master↔worker IPC messages including hosted-lobby info.
- `src/server/Logger.ts` — Configures and exports the shared winston + OpenTelemetry logger.
- `src/server/MapLandTiles.ts` — Returns cached land-tile counts per map from manifest files for player scaling.
- `src/server/MapPlaylist.ts` — Generates scheduled public game configs (FFA/team/special/1v1) with weighted maps.
- `src/server/Master.ts` — Master process entry: forks cluster workers, serves SPA/static, health, restart.
- `src/server/MasterLobbyService.ts` — Coordinates cross-worker lobby scheduling, dedup, broadcast, creation.
- `src/server/NoStoreHeaders.ts` — Sets no-store/no-cache headers on API responses.
- `src/server/OtelResource.ts` — Builds OpenTelemetry resource and Prometheus labels for logs/metrics.
- `src/server/PollingLoop.ts` — Generic recursive setTimeout polling loop re-running an async task.
- `src/server/Privilege.ts` — Censors profane names and validates cosmetics/clan-tag ownership via flares.
- `src/server/PrivilegeRefresher.ts` — Periodically refreshes the PrivilegeChecker from the API, failing open on error.
- `src/server/PublicAssetManifest.ts` — Builds hashed public-asset manifest and emits derived static assets.
- `src/server/RenderHtml.ts` — Renders the EJS app-shell HTML with injected env/asset/CDN config.
- `src/server/RuntimeAssetManifest.ts` — Loads/caches the runtime asset-manifest.json for hashed URLs.
- `src/server/Server.ts` — Top-level entry point starting master or worker by cluster role.
- `src/server/ServerEnv.ts` — Central server env/config accessor and game-ID sharding helpers.
- `src/server/StaticAssetCache.ts` — Computes immutable cache-control for hashed static assets.
- `src/server/Turnstile.ts` — Verifies Cloudflare Turnstile tokens to gate first-time joins.
- `src/server/VoteTally.ts` — IP-weighted single-round voting primitive for winner/live-stats consensus.
- `src/server/Worker.ts` — Worker process: Express + WebSocket server, game APIs, join/auth, matchmaking.
- `src/server/WorkerLobbyService.ts` — Worker-side lobby WebSocket and master IPC (broadcasts, delist, limits).
- `src/server/WorkerMetrics.ts` — Initializes OpenTelemetry worker metrics (games, clients, desyncs, memory).
- `src/server/jwt.ts` — Verifies client JWT/bearer tokens and fetches the `/users/@me` profile.
- `src/server/README.md` — One-line "Gatekeeper" stub describing the directory's security focus.
