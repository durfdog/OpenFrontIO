import { Game, Player, PlayerInfo, PlayerType, UnitType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("Permanent Defenders tech (+5k max population per defense post)", () => {
  let game: Game;
  let defender: Player;

  beforeEach(async () => {
    game = await setup(
      "plains",
      { infiniteGold: true, infiniteTroops: false },
      [
        new PlayerInfo("def", PlayerType.Human, null, "def_id"),
        new PlayerInfo("atk", PlayerType.Human, null, "atk_id"),
      ],
    );
    defender = game.player("def_id");
    defender.conquer(game.ref(0, 10));
    defender.conquer(game.ref(1, 10));
    defender.conquer(game.ref(2, 10));
    defender.conquer(game.ref(3, 10));
  });

  let buildableTiles: import("../../src/core/game/GameMap").TileRef[] = [];

  function collectBuildableTiles(): void {
    buildableTiles = [];
    game.map().forEachTile((t) => {
      if (defender.canBuild(UnitType.DefensePost, t)) {
        buildableTiles.push(t);
      }
    });
    if (buildableTiles.length < 2) {
      throw new Error("not enough buildable defense post tiles found");
    }
  }

  function buildableDefensePostTile(i: number): import("../../src/core/game/GameMap").TileRef {
    return buildableTiles[i];
  }

  function buildDefensePost(i: number): void {
    const t = buildableDefensePostTile(i);
    defender.buildUnit(UnitType.DefensePost, t, {});
    const duration = game.unitInfo(UnitType.DefensePost).constructionDuration ?? 0;
    for (let j = 0; j <= duration + 2; j++) game.executeNextTick();
  }

  test("each completed defense post adds 5000 max troops once tech is purchased", () => {
    collectBuildableTiles();
    buildDefensePost(0);
    buildDefensePost(1);

    const base = game.config().maxTroops(defender);
    defender.purchaseTech("defense_militia");
    const boosted = game.config().maxTroops(defender);

    expect(boosted - base).toBe(5000 * 2);
  });
});
