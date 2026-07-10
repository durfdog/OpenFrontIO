import { Game, Player, PlayerInfo, PlayerType, UnitType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("Factory tooling tech (+0.1% troop generation speed per factory)", () => {
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

  function buildFactory(x: number) {
    player.buildUnit(UnitType.Factory, game.ref(x, 10), {});
    const duration = game.unitInfo(UnitType.Factory).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();
  }

  test("no effect without any factories", () => {
    const base = game.config().troopIncreaseRate(player);
    player.purchaseTech("factory_tooling");
    const boosted = game.config().troopIncreaseRate(player);

    expect(boosted).toBeCloseTo(base, 5);
  });

  test("one factory grants +0.1% troop generation speed", () => {
    buildFactory(0);

    const base = game.config().troopIncreaseRate(player);
    player.purchaseTech("factory_tooling");
    const boosted = game.config().troopIncreaseRate(player);

    expect(boosted).toBeCloseTo(base * 1.001, 5);
  });

  test("factory under construction does not count", () => {
    player.buildUnit(UnitType.Factory, game.ref(2, 10), {});
    // Simulate a factory that is still being built (mirrors ConstructionExecution
    // marking the unit under construction until it completes).
    player.units(UnitType.Factory)[0].setUnderConstruction(true);

    const base = game.config().troopIncreaseRate(player);
    player.purchaseTech("factory_tooling");
    const boosted = game.config().troopIncreaseRate(player);

    expect(boosted).toBeCloseTo(base, 5);
  });

  test("multiple factories stack (N factories => +0.1% * N)", () => {
    const n = 5;
    for (let i = 0; i < n; i++) {
      buildFactory(i * 2);
    }

    const base = game.config().troopIncreaseRate(player);
    player.purchaseTech("factory_tooling");
    const boosted = game.config().troopIncreaseRate(player);

    expect(boosted).toBeCloseTo(base * (1 + 0.001 * n), 5);
  });
});
