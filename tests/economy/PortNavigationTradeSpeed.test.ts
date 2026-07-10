import {
  PlayerInfo,
  PlayerType,
  TerrainType,
  TileRef,
  UnitType,
} from "../../src/core/game/Game";
import { TradeShipExecution } from "../../src/core/execution/TradeShipExecution";
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

describe("port_navigation trade ship speed", () => {
  async function travelTicks(withTech: boolean): Promise<number> {
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

    if (withTech) player.purchaseTech("port_navigation");

    const srcPort = player.units(UnitType.Port)[0];
    const dstPort = other.units(UnitType.Port)[0];
    game.addExecution(new TradeShipExecution(player, srcPort, dstPort));

    let spawnedTick = -1;
    let arrivedTick = -1;
    for (let i = 0; i < 3000; i++) {
      game.executeNextTick();
      const n = game.unitCount(UnitType.TradeShip);
      if (n >= 1 && spawnedTick === -1) spawnedTick = i;
      if (spawnedTick !== -1 && n === 0 && arrivedTick === -1) {
        arrivedTick = i;
        break;
      }
    }
    if (arrivedTick === -1) throw new Error("trade ship never arrived");
    return arrivedTick - spawnedTick;
  }

  test("port_navigation makes trade ships travel twice as fast", async () => {
    const without = await travelTicks(false);
    const withTech = await travelTicks(true);
    expect(withTech).toBeLessThan(without);
    // Should be roughly half (allow rounding slack).
    expect(withTech).toBeLessThanOrEqual(Math.ceil(without * 0.6));
  });
});
