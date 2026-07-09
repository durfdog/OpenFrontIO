import { ResearchLotteryExecution } from "../../../src/core/execution/ResearchLotteryExecution";
import { Player, PlayerInfo, PlayerType, UnitType } from "../../../src/core/game/Game";
import { setup } from "../../util/Setup";
import { executeTicks } from "../../util/utils";

/**
 * The research lottery replaces train-based Lab research in the new (non-legacy)
 * system. Labs are stackable and disconnected from the rail network. A player
 * with Labs should accrue research over time via random wins, with severe
 * diminishing returns per additional Lab, while legacy games are unaffected.
 */
describe("Research lottery (new research system)", () => {
  let game: Awaited<ReturnType<typeof setup>>;
  let player: Player;

  beforeEach(async () => {
    game = await setup(
      "half_land_half_ocean",
      { legacyResearch: false, instantBuild: true, infiniteGold: true },
      [new PlayerInfo("player", PlayerType.Human, null, "player_id")],
    );
    player = game.player("player_id");
  });

  function buildLab(x: number, y: number): void {
    player.conquer(game.ref(x, y));
    const spawn = player.canBuild(UnitType.Lab, game.ref(x, y));
    if (spawn === false) {
      throw new Error(`Unable to build lab at ${x},${y}`);
    }
    player.buildUnit(UnitType.Lab, spawn, {});
  }

  test("player with no labs earns no research from the lottery", () => {
    game.addExecution(new ResearchLotteryExecution());
    executeTicks(game, 200);
    expect(player.research()).toBe(0n);
  });

  test("a single lab earns research over time via lottery wins", () => {
    buildLab(5, 5);
    game.addExecution(new ResearchLotteryExecution());
    executeTicks(game, 600); // ~60 seconds of ticks
    expect(player.research()).toBeGreaterThan(0n);
  });

  test("more labs earn more total research (diminishing but positive)", async () => {
    player.conquer(game.ref(5, 5));
    const first = player.canBuild(UnitType.Lab, game.ref(5, 5));
    if (first === false) throw new Error("first lab build failed");
    player.buildUnit(UnitType.Lab, first, {});
    // Stack two more labs onto the same location (upgrade, not new units).
    for (const t of [game.ref(5, 5), game.ref(5, 5)]) {
      const toUpgrade = player.findUnitToUpgrade(UnitType.Lab, t);
      if (toUpgrade === false) throw new Error("expected existing lab to upgrade");
      player.upgradeUnit(toUpgrade);
    }
    expect(player.unitCount(UnitType.Lab)).toBe(3);

    const g = await setup(
      "half_land_half_ocean",
      { legacyResearch: false, instantBuild: true, infiniteGold: true },
      [new PlayerInfo("p", PlayerType.Human, null, "p_id")],
    );
    const p = g.player("p_id");
    p.conquer(g.ref(5, 5));
    const spawn = p.canBuild(UnitType.Lab, g.ref(5, 5));
    if (spawn === false) throw new Error("build failed");
    p.buildUnit(UnitType.Lab, spawn, {});
    g.addExecution(new ResearchLotteryExecution());
    executeTicks(g, 600);

    game.addExecution(new ResearchLotteryExecution());
    executeTicks(game, 600);

    expect(player.research()).toBeGreaterThan(p.research());
  });

  test("no lottery awards under the legacy research system", async () => {
    const legacyGame = await setup(
      "half_land_half_ocean",
      { legacyResearch: true, instantBuild: true, infiniteGold: true },
      [new PlayerInfo("player", PlayerType.Human, null, "player_id")],
    );
    const legacyPlayer = legacyGame.player("player_id");
    legacyPlayer.conquer(legacyGame.ref(5, 5));
    const spawn = legacyPlayer.canBuild(UnitType.Lab, legacyGame.ref(5, 5));
    if (spawn === false) throw new Error("build failed");
    legacyPlayer.buildUnit(UnitType.Lab, spawn, {});
    legacyGame.addExecution(new ResearchLotteryExecution());
    executeTicks(legacyGame, 600);
    expect(legacyPlayer.research()).toBe(0n);
  });

  test("labs stack into an existing lab (snap to upgrade) in the new system", () => {
    player.conquer(game.ref(5, 5));
    const first = player.canBuild(UnitType.Lab, game.ref(5, 5));
    if (first === false) throw new Error("first lab build failed");
    player.buildUnit(UnitType.Lab, first, {});

    // Placing a second lab on/near the existing one should upgrade it (one
    // physical unit, rising level), not create a separate unit.
    const toUpgrade = player.findUnitToUpgrade(UnitType.Lab, game.ref(5, 5));
    expect(toUpgrade).not.toBe(false);
    if (toUpgrade !== false) {
      player.upgradeUnit(toUpgrade);
    }
    // Still a single physical lab unit, but its level is 2 -> unitCount 2.
    expect(player.units(UnitType.Lab).length).toBe(1);
    expect(player.unitCount(UnitType.Lab)).toBe(2);
  });

  test("labs are NOT stackable/upgradable under the legacy system", async () => {
    const legacyGame = await setup(
      "half_land_half_ocean",
      { legacyResearch: true, instantBuild: true, infiniteGold: true },
      [new PlayerInfo("player", PlayerType.Human, null, "player_id")],
    );
    const legacyPlayer = legacyGame.player("player_id");
    legacyPlayer.conquer(legacyGame.ref(5, 5));
    const first = legacyPlayer.canBuild(UnitType.Lab, legacyGame.ref(5, 5));
    if (first === false) throw new Error("first lab build failed");
    legacyPlayer.buildUnit(UnitType.Lab, first, {});
    expect(legacyPlayer.findUnitToUpgrade(UnitType.Lab, legacyGame.ref(5, 5))).toBe(false);
  });
});
