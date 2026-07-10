import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  TerrainType,
  TileRef,
  UnitType,
} from "../../src/core/game/Game";
import { setup } from "../util/Setup";
import { UseRealAttackLogic } from "../util/TestConfig";

describe("fortified_factories attack terrain bonus", () => {
  let game: Game;
  let defender: Player;
  let attacker: Player;

  // Find a Mountain tile with a land 4-neighbor, have the defender own the
  // mountain and the attacker own the neighbor, then place an attacker factory
  // on the neighbor (well within fortifiedFactoryRange of the mountain).
  async function setupMountain(factoryOwnerIsAttacker: boolean) {
    game = await setup(
      "world",
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

    const { m, n } = findMountainWithLandNeighbor(game);
    defender.conquer(m);
    attacker.conquer(n);
    const owner = factoryOwnerIsAttacker ? attacker : defender;
    owner.buildUnit(UnitType.Factory, n, {});
    const duration = game.unitInfo(UnitType.Factory).constructionDuration ?? 0;
    for (let i = 0; i <= duration + 2; i++) game.executeNextTick();

    return m;
  }

  function lossAt(tile: TileRef): number {
    return game
      .config()
      .attackLogic(game, 1000, attacker, defender, tile).attackerTroopLoss;
  }

  test("fortified_factories removes terrain penalty for attacker's troops near a factory", async () => {
    const mountain = await setupMountain(true);

    const base = lossAt(mountain);
    attacker.purchaseTech("fortified_factories");
    const fortified = lossAt(mountain);

    // Mountain mag (120) is normalized to Plains mag (80) => loss drops to 2/3.
    expect(fortified).toBeLessThan(base);
    expect(fortified).toBeCloseTo((base * 80) / 120, 5);
  });

  test("factory owned by defender does not help the attacker", async () => {
    const mountain = await setupMountain(false);

    const base = lossAt(mountain);
    attacker.purchaseTech("fortified_factories");
    const fortified = lossAt(mountain);

    // The nearby factory belongs to the defender, so no benefit for the attacker.
    expect(fortified).toBeCloseTo(base, 5);
  });
});

function findMountainWithLandNeighbor(game: Game): {
  m: TileRef;
  n: TileRef;
} {
  const w = game.width();
  const h = game.height();
  const deltas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const m = game.ref(x, y);
      if (game.terrainType(m) !== TerrainType.Mountain) continue;
      for (const [dx, dy] of deltas) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = game.ref(nx, ny);
        const t = game.terrainType(n);
        if (t === TerrainType.Ocean || t === TerrainType.Impassable) continue;
        return { m, n };
      }
    }
  }
  throw new Error("no mountain tile with a land neighbor found");
}
