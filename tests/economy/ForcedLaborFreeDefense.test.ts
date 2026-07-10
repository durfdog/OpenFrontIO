import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("Forced Labor free defense posts", () => {
  let game: Game;
  let defender: Player;
  const defenderInfo = new PlayerInfo(
    "defender",
    PlayerType.Human,
    null,
    "defender_id",
  );
  const otherInfo = new PlayerInfo("other", PlayerType.Human, null, "other_id");

  beforeEach(async () => {
    game = await setup(
      "plains",
      {
        infiniteGold: false,
        instantBuild: false,
        infiniteTroops: true,
      },
      [defenderInfo, otherInfo],
    );
    defender = game.player(defenderInfo.id);
    game.player(otherInfo.id).conquer(game.ref(10, 10));
    defender.conquer(game.ref(0, 10));
  });

  test("Defense posts are free after Forced Labor (defense_bunker)", () => {
    const costWithout = game.unitInfo(UnitType.DefensePost).cost(game, defender);
    defender.purchaseTech("defense_bunker");
    const costWith = game.unitInfo(UnitType.DefensePost).cost(game, defender);
    expect(costWithout).toBeGreaterThan(0n);
    expect(costWith).toBe(0n);
  });
});
