import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { setup } from "../util/Setup";
import { constructionExecution, executeTicks } from "../util/utils";

async function buildMadDefensePostOnly(game: Game): Promise<{
  defender: Player;
  enemy: Player;
}> {
  const defender = game.player("p1");
  const enemy = game.player("p2");

  defender.conquer(game.ref(10, 10));
  enemy.conquer(game.ref(50, 50));

  // Build a defense post but NO missile silo, then buy MAD.
  constructionExecution(game, defender, 10, 10, UnitType.DefensePost);
  defender.purchaseTech("defense_flare");

  return { defender, enemy };
}

describe("MAD Defense Post manual launch", () => {
  test("allows a player with defense post + defense_flare to launch a nuke without a missile silo", async () => {
    const game = await setup(
      "plains",
      {
        infiniteGold: true,
        instantBuild: true,
      },
      [
        new PlayerInfo("p1", PlayerType.Human, null, "p1"),
        new PlayerInfo("p2", PlayerType.Human, null, "p2"),
      ],
    );
    const { defender } = await buildMadDefensePostOnly(game);

    // Sanity: no missile silo owned.
    expect(defender.units(UnitType.MissileSilo).length).toBe(0);

    // Let spawn immunity lapse so a manual launch can resolve a source.
    executeTicks(game, 5);

    let launched = false;
    for (let i = 0; i < 20; i++) {
      if (game.units(UnitType.AtomBomb).length > 0) {
        launched = true;
        break;
      }
      constructionExecution(game, defender, 50, 50, UnitType.AtomBomb);
      executeTicks(game, 5);
    }

    expect(launched).toBe(true);
  });
});
