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

  // Plains is an all-land map.
  defender.conquer(game.ref(10, 10));
  enemy.conquer(game.ref(50, 50));
  // A second, far-away enemy tile that survives the first nuke (outer radius
  // ~30) so we can verify reloading against a still-valid target.
  enemy.conquer(game.ref(50, 90));

  // The upgraded defense post itself is the launch source; no missile silo.
  constructionExecution(game, defender, 10, 10, UnitType.DefensePost);

  return { defender, enemy };
}

describe("MAD Defense Post (transformed into a manual missile silo)", () => {
  test("does NOT auto-launch a nuke when the tech is owned", async () => {
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
    for (let i = 0; i < 700; i++) {
      game.executeNextTick();
      if (game.units(UnitType.AtomBomb).length > 0) launched = true;
    }

    expect(launched).toBe(false);
  });

  test("allows a manual nuke launch and goes on cooldown", async () => {
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
    const { defender, enemy } = await buildDefensePost(game);

    defender.purchaseTech("defense_flare");

    constructionExecution(game, defender, 50, 50, UnitType.AtomBomb);
    game.executeNextTick();

    expect(game.units(UnitType.AtomBomb).length).toBeGreaterThanOrEqual(1);

    const post = defender.units(UnitType.DefensePost)[0];
    expect(post.isInCooldown()).toBe(true);
  });

  test("enforces a 1-minute cooldown between launches", async () => {
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
    const { defender, enemy } = await buildDefensePost(game);

    defender.purchaseTech("defense_flare");

    const enemyTile = enemy.tiles()[0];

    // First manual launch succeeds.
    constructionExecution(game, defender, 50, 50, UnitType.AtomBomb);
    game.executeNextTick();
    expect(game.units(UnitType.AtomBomb).length).toBeGreaterThanOrEqual(1);

    const post = defender.units(UnitType.DefensePost)[0];
    expect(post.isInCooldown()).toBe(true);
    // While on cooldown, nukeSpawn refuses to provide a launch source.
    expect(defender.nukeSpawn(enemyTile, UnitType.AtomBomb)).toBe(false);

    // Let the nuke detonate and the cooldown elapse (~1 minute = 600 ticks).
    for (let i = 0; i < 620; i++) game.executeNextTick();

    expect(post.isInCooldown()).toBe(false);
    // After reloading, the post can launch again (target a still-valid tile).
    const reloadedEnemyTile = game.ref(50, 90);
    expect(defender.nukeSpawn(reloadedEnemyTile, UnitType.AtomBomb)).not.toBe(
      false,
    );
  });
});
