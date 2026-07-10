import {
  PlayerInfo,
  PlayerType,
  TerrainType,
  TileRef,
  UnitType,
} from "../../src/core/game/Game";
import { setup } from "../util/Setup";
import { constructionExecution } from "../util/utils";

function adjacentWaterComponents(game: any, tile: TileRef): Set<number> {
  const comps = new Set<number>();
  for (const n of game.neighbors(tile)) {
    if (game.isWater(n)) {
      const c = game.getWaterComponent(n);
      if (c !== null) comps.add(c);
    }
  }
  return comps;
}

describe("port_logistics piracy immunity", () => {
  async function immuneFraction(
    withTech: boolean,
  ): Promise<{ immune: number; total: number }> {
    const game: any = await setup(
      "half_land_half_ocean",
      { instantBuild: true, infiniteGold: true },
      [
        new PlayerInfo("player", PlayerType.Human, null, "player_id"),
        new PlayerInfo("other", PlayerType.Human, null, "other_id"),
      ],
    );
    const player = game.player("player_id");
    const other = game.player("other_id");
    game.config().structureMinDist = () => 10;

    player.conquer(game.ref(7, 10));
    constructionExecution(game, player, 7, 10, UnitType.Port);
    const playerComps = adjacentWaterComponents(game, game.ref(7, 10));

    for (let y = 0; y < game.height(); y++) {
      for (let x = 0; x < game.width(); x++) {
        if (x === 7 && y === 10) continue;
        const t = game.ref(x, y);
        if (game.terrainType(t) === TerrainType.Ocean) continue;
        if (game.terrainType(t) === TerrainType.Impassable) continue;
        other.conquer(t);
      }
    }
    let otherX = -1;
    let otherY = -1;
    for (let y = 0; y < game.height() && otherY === -1; y++) {
      for (let x = 0; x < game.width() && otherY === -1; x++) {
        if (x === 7 && y === 10) continue;
        const t = game.ref(x, y);
        if (game.terrainType(t) === TerrainType.Ocean) continue;
        if (other.canBuild(UnitType.Port, t) === false) continue;
        const comps = adjacentWaterComponents(game, t);
        for (const c of comps) {
          if (playerComps.has(c)) {
            otherX = x;
            otherY = y;
            break;
          }
        }
      }
    }
    if (otherY === -1) throw new Error("no connected port tile for other");
    constructionExecution(game, other, otherX, otherY, UnitType.Port);

    if (withTech) player.purchaseTech("port_logistics");

    // Observe every trade ship the player owns over a long window; record
    // whether each was immune to piracy.
    const seen = new Map<number, boolean>();
    for (let i = 0; i < 5000; i++) {
      game.executeNextTick();
      for (const s of player.units(UnitType.TradeShip)) {
        seen.set(s.id(), s.immuneToPiracy());
      }
    }
    let immune = 0;
    for (const v of seen.values()) if (v) immune++;
    return { immune, total: seen.size };
  }

  test("port_logistics makes ~half of trade ships immune to piracy", async () => {
    const without = await immuneFraction(false);
    expect(without.immune).toBe(0);

    const withTech = await immuneFraction(true);
    expect(withTech.total).toBeGreaterThan(0);
    const frac = withTech.immune / withTech.total;
    expect(frac).toBeGreaterThan(0.3);
    expect(frac).toBeLessThan(0.7);
  });
});
