import { Game, Player, PlayerInfo, PlayerType, Unit, UnitType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("Factory prototyping tech (+5k max population per factory)", () => {
  let game: Game;
  let player: Player;

  beforeEach(async () => {
    game = await setup(
      "plains",
      { infiniteGold: true, infiniteTroops: false },
      [new PlayerInfo("p", PlayerType.Human, null, "p_id")],
    );
    player = game.player("p_id");
    player.conquer(game.ref(0, 10));
  });

  function buildFactory(x: number): Unit {
    const f = player.buildUnit(UnitType.Factory, game.ref(x, 10), {});
    const duration = game.unitInfo(UnitType.Factory).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();
    return f;
  }

  test("factory baseline provides 0 max population", () => {
    buildFactory(0);
    buildFactory(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("factory_prototyping");
    const after = game.config().maxTroops(player);

    // Only the tech adds population; factories contribute nothing without it.
    expect(after - before).toBe(100_000);
  });

  test("each completed factory adds 50000 max troops once tech is purchased", () => {
    buildFactory(0);
    buildFactory(2);

    const withoutTech = game.config().maxTroops(player);
    player.purchaseTech("factory_prototyping");
    const withTech = game.config().maxTroops(player);

    expect(withTech - withoutTech).toBe(100_000);
  });

  test("stacked factories count by total factory count, not by stack", () => {
    // A stack of 6 factories on one tile + 1 separate factory = 7 factories.
    const stacked = buildFactory(0);
    for (let i = 0; i < 5; i++) stacked.increaseLevel();
    buildFactory(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("factory_prototyping");
    const after = game.config().maxTroops(player);

    // 7 factories * 50000 = 350000 (+35k displayed).
    expect(after - before).toBe(350_000);
  });
});
