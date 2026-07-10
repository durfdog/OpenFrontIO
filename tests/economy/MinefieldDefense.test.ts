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

describe("defense_development minefield bonus", () => {
  let game: Game;
  let defender: Player;
  let attacker: Player;

  async function setup_game() {
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
    const duration = game.unitInfo(UnitType.DefensePost).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();

    return postTile as TileRef;
  }

  function lossAt(tile: TileRef): { attacker: number; defender: number } {
    const res = game
      .config()
      .attackLogic(game, 1000, attacker, defender, tile);
    return { attacker: res.attackerTroopLoss, defender: res.defenderTroopLoss };
  }

  test("minefield doubles enemy troop loss near defense post", async () => {
    const tile = await setup_game();
    const base = lossAt(tile);
    expect(base.attacker).toBeGreaterThan(0);

    defender.purchaseTech("defense_development");
    const mfd = lossAt(tile);

    // Minefield: +100% (double) enemy troop loss.
    expect(mfd.attacker).toBeCloseTo(base.attacker * 2, 5);
  });
});
