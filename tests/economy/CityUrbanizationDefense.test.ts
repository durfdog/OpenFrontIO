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

describe("city_urbanization defense post bonus", () => {
  let game: Game;
  let defender: Player;
  let attacker: Player;

  // Build a defender territory, place a structure near a border tile, and
  // return the border tile reference for attackLogic.
  async function buildNearBorder(structure: UnitType) {
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

    const structureTile = game.ref(4, 10);
    defender.buildUnit(structure, structureTile, {});
    const duration =
      game.unitInfo(structure).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();

    // Border tile is the one the attacker will conquer from row 9 into row 10.
    return game.ref(4, 10) as TileRef;
  }

  function lossAt(tile: TileRef): { attacker: number; defender: number } {
    const res = game
      .config()
      .attackLogic(game, 1000, attacker, defender, tile);
    return { attacker: res.attackerTroopLoss, defender: res.defenderTroopLoss };
  }

  test("city with city_urbanization boosts defender like a defense post", async () => {
    const cityTile = await buildNearBorder(UnitType.City);
    const base = lossAt(cityTile);

    defender.purchaseTech("city_urbanization");
    const urban = lossAt(cityTile);

    // Attacker troop loss is multiplied by 5 (same as a defense post).
    expect(urban.attacker).toBeCloseTo(base.attacker * 5, 5);
  });

  test("city without city_urbanization gives no defense bonus", async () => {
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

    // Wide territory so the city (x=4) is out of range of the control tile (x=40).
    for (let x = 0; x < 45; x++) {
      defender.conquer(game.ref(x, 10));
      attacker.conquer(game.ref(x, 9));
    }

    defender.buildUnit(UnitType.City, game.ref(4, 10), {});
    const d = game.unitInfo(UnitType.City).constructionDuration ?? 0;
    for (let i = 0; i <= d + 2; i++) game.executeNextTick();

    const nearCity = lossAt(game.ref(4, 10));
    const control = lossAt(game.ref(40, 10));

    // No tech => a city provides no defensive bonus (equal to a far control tile).
    expect(nearCity.attacker).toBeCloseTo(control.attacker, 5);
  });
});
