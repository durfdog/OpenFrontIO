import { Game, Player, PlayerInfo, PlayerType } from "../../src/core/game/Game";
import { setup } from "../util/Setup";

describe("defense_radar snipers defense post radius", () => {
  let game: Game;
  let defender: Player;

  beforeEach(async () => {
    game = await setup("plains", { infiniteGold: true }, [
      new PlayerInfo("def", PlayerType.Human, null, "def_id"),
      new PlayerInfo("atk", PlayerType.Human, null, "atk_id"),
    ]);
    defender = game.player("def_id");
  });

  test("snipers gives +50% defense post radius", () => {
    expect(game.config().defensePostRange(defender)).toBe(30);
    expect(game.config().defensePostTargettingRange(defender)).toBe(75);

    defender.purchaseTech("defense_radar");

    expect(game.config().defensePostRange(defender)).toBe(45);
    expect(game.config().defensePostTargettingRange(defender)).toBe(112.5);
  });
});
