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

describe("port_development trade ship generation", () => {
  async function playerTradeShips(withTech: boolean): Promise<number> {
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

    // Player port at a known-valid coastal tile.
    player.conquer(game.ref(7, 10));
    constructionExecution(game, player, 7, 10, UnitType.Port);
    const playerComps = adjacentWaterComponents(game, game.ref(7, 10));

    // Give the other player the rest of the map (leave the player's port tile
    // alone so it isn't destroyed) and find a valid port tile that shares a
    // water component with the player's port.
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

    if (withTech) player.purchaseTech("port_development");

    for (let i = 0; i < 400; i++) game.executeNextTick();

    return player.units(UnitType.TradeShip).length;
  }

  test("port_development increases trade ship generation", async () => {
    const without = await playerTradeShips(false);
    const withTech = await playerTradeShips(true);
    expect(withTech).toBeGreaterThan(without);
  });
});
