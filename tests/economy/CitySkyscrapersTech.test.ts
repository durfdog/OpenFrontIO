import { Game, Player, PlayerInfo, PlayerType, UnitType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("City skyscrapers tech (+5k max population per city)", () => {
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

  function buildCity(x: number) {
    player.buildUnit(UnitType.City, game.ref(x, 10), {});
    const duration = game.unitInfo(UnitType.City).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();
  }

  test("purchasing city_development adds 50000 max troops per completed city", () => {
    buildCity(0);
    buildCity(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("city_development");
    const after = game.config().maxTroops(player);

    expect(after - before).toBe(100_000);
  });

  test("two cities yield 10000 and tech gates the bonus", () => {
    buildCity(0);
    buildCity(2);

    const withoutTech = game.config().maxTroops(player);
    player.purchaseTech("city_development");
    const withTech = game.config().maxTroops(player);

    expect(withTech - withoutTech).toBe(100_000);
  });

  test("purchasing city_militarization adds 50000 max troops per completed city", () => {
    buildCity(0);
    buildCity(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("city_militarization");
    const after = game.config().maxTroops(player);

    expect(after - before).toBe(100_000);
  });

  test("city_fortifications adds 50000 max troops per completed city", () => {
    buildCity(0);
    buildCity(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("city_fortifications");
    const after = game.config().maxTroops(player);

    expect(after - before).toBe(100_000);
  });

  test("all three city techs stack per city", () => {
    buildCity(0);
    buildCity(2);

    const before = game.config().maxTroops(player);
    player.purchaseTech("city_development");
    player.purchaseTech("city_militarization");
    player.purchaseTech("city_fortifications");
    const after = game.config().maxTroops(player);

    expect(after - before).toBe(300_000);
  });

  test("city_conscription increases troop generation rate by 10%", () => {
    buildCity(0);

    const base = game.config().troopIncreaseRate(player);
    player.purchaseTech("city_conscription");
    const boosted = game.config().troopIncreaseRate(player);

    expect(boosted).toBeCloseTo(base * 1.1, 5);
  });
});
