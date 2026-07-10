import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { setup } from "../util/Setup";
import { constructionExecution } from "../util/utils";

async function buildDefensePost(game: Game): Promise<{
  defender: Player;
  enemy: Player;
}> {
  const defender = game.player("p1");
  const enemy = game.player("p2");

  // Plains is an all-land map. Place the defense post and missile silo far
  // apart so they satisfy the structure minimum-distance requirement.
  defender.conquer(game.ref(10, 10));
  defender.conquer(game.ref(10, 40));
  enemy.conquer(game.ref(50, 50));

  // Missile silo gives the player a valid nuke launch source; the defense
  // post (with MAD) is what triggers the periodic launch.
  constructionExecution(game, defender, 10, 40, UnitType.MissileSilo);
  constructionExecution(game, defender, 10, 10, UnitType.DefensePost);

  return { defender, enemy };
}

describe("MAD Defense Post", () => {
  test("launches a nuke every minute when tech is owned", async () => {
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
    const { defender } = await buildDefensePost(game);

    defender.purchaseTech("defense_flare");

    let launched = false;
    for (let i = 0; i < 650; i++) {
      game.executeNextTick();
      if (game.units(UnitType.AtomBomb).length > 0) launched = true;
    }

    expect(launched).toBe(true);
  });

  test("does not launch a nuke without the tech", async () => {
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
    const { defender } = await buildDefensePost(game);

    let launched = false;
    for (let i = 0; i < 650; i++) {
      game.executeNextTick();
      if (game.units(UnitType.AtomBomb).length > 0) launched = true;
    }

    expect(launched).toBe(false);
  });
});
