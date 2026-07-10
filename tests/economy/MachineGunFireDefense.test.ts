import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { TileRef } from "../../src/core/game/GameMap";
import { UseRealAttackLogic } from "../util/TestConfig";
import { setup } from "../util/Setup";

describe("machine_gun_fire defense post attack-speed bonus", () => {
  let game: Game;
  let defender: Player;
  let attacker: Player;

  async function buildWithDefensePost(): Promise<TileRef> {
    game = await setup(
      "plains",
      { infiniteGold: true, infiniteTroops: false },
      [
        new PlayerInfo("def", PlayerType.Human, null, "def_id"),
        new PlayerInfo("atk", PlayerType.Human, null, "atk_id"),
      ],
      __dirname,
      UseRealAttackLogic,
    );
    defender = game.player("def_id");
    attacker = game.player("atk_id");

    // Defender owns a horizontal strip; attacker owns the row just above.
    for (let x = 0; x < 8; x++) {
      defender.conquer(game.ref(x, 10));
    }
    for (let x = 0; x < 8; x++) {
      attacker.conquer(game.ref(x, 9));
    }

    const postTile = game.ref(4, 10);
    defender.buildUnit(UnitType.DefensePost, postTile, {});
    const duration =
      game.unitInfo(UnitType.DefensePost).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();

    // Border tile is the one the attacker will conquer from row 9 into row 10.
    return game.ref(4, 10) as TileRef;
  }

  function speedAt(tile: TileRef): number {
    const res = game
      .config()
      .attackLogic(game, 1000, attacker, defender, tile);
    return res.tilesPerTickUsed;
  }

  test("defense_watchtower slows enemy advance 33% near defense post", async () => {
    const postTile = await buildWithDefensePost();
    const base = speedAt(postTile);

    defender.purchaseTech("defense_watchtower");
    const mgs = speedAt(postTile);

    // Base advance speed must be positive.
    expect(base).toBeGreaterThan(0);
    // Machine Gun Fire multiplies advance speed by 2/3.
    expect(mgs).toBeCloseTo(base * (2 / 3), 5);
  });
});
