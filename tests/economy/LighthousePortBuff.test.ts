import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  Unit,
  UnitType,
} from "../../src/core/game/Game";
import { WarshipExecution } from "../../src/core/execution/WarshipExecution";
import { AllianceRequestExecution } from "../../src/core/execution/alliance/AllianceRequestExecution";
import { setup } from "../util/Setup";

const coastX = 7;

describe("Lighthouse (port_shipbuilding) buff", () => {
  async function makeGame(
    extraPlayers = 0,
  ): Promise<{ game: Game; players: Player[] }> {
    const infos = [
      new PlayerInfo("player", PlayerType.Human, null, "player_id"),
      new PlayerInfo("ally", PlayerType.Human, null, "ally_id"),
      new PlayerInfo("other", PlayerType.Human, null, "other_id"),
    ].slice(0, 2 + extraPlayers);
    const game = await setup(
      "half_land_half_ocean",
      { infiniteGold: true, instantBuild: true },
      infos,
    );
    const players = infos.map((i) => game.player(i.id));
    // Give each player a tile so they are "alive" (alliances require it).
    infos.forEach((_, idx) => players[idx].conquer(game.ref(3, 10 + idx)));
    return { game, players };
  }

  function spawnWarship(game: Game, owner: Player, x: number, y: number): Unit {
    const warship = owner.buildUnit(UnitType.Warship, game.ref(x, y), {
      patrolTile: game.ref(x, y),
    });
    game.addExecution(new WarshipExecution(warship));
    return warship;
  }

  test("grants buff within range of owner's port when tech is researched", async () => {
    const { game, players } = await makeGame();
    const player = players[0];
    player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
    const warship = spawnWarship(game, player, coastX + 1, 10);

    expect(game.config().lighthouseBuffActive(game, warship)).toBe(false);
    player.purchaseTech("port_shipbuilding");
    expect(game.config().lighthouseBuffActive(game, warship)).toBe(true);
  });

  test("does not grant buff without the tech", async () => {
    const { game, players } = await makeGame();
    const player = players[0];
    player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
    const warship = spawnWarship(game, player, coastX + 1, 10);

    expect(player.hasTech("port_shipbuilding")).toBe(false);
    expect(game.config().lighthouseBuffActive(game, warship)).toBe(false);
  });

  test("does not grant buff when no port is in range", async () => {
    const { game, players } = await makeGame();
    const player = players[0];
    player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
    player.purchaseTech("port_shipbuilding");
    const warship = spawnWarship(game, player, coastX + 1, 10);

    expect(game.config().lighthouseBuffActive(game, warship)).toBe(true);
    // Removing the only nearby port drops the warship out of range.
    player.units(UnitType.Port).forEach((p) => p.delete());
    expect(game.config().lighthouseBuffActive(game, warship)).toBe(false);
  });

  test("grants buff within range of an ally's port", async () => {
    const { game, players } = await makeGame();
    const player = players[0];
    const ally = players[1];
    player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
    ally.buildUnit(UnitType.Port, game.ref(coastX + 2, 10), {});
    player.purchaseTech("port_shipbuilding");

    game.addExecution(new AllianceRequestExecution(player, ally.id()));
    game.executeNextTick();
    game.addExecution(new AllianceRequestExecution(ally, player.id()));
    game.executeNextTick();
    expect(player.isFriendly(ally)).toBe(true);

    const warship = spawnWarship(game, player, coastX + 1, 10);
    // Remove the owner's own port so the only nearby port is the ally's.
    player.units(UnitType.Port).forEach((p) => p.delete());

    expect(game.config().lighthouseBuffActive(game, warship)).toBe(true);
  });

  test("reduces shell attack cooldown and boosts move speed when active", async () => {
    const { game, players } = await makeGame();
    const player = players[0];
    player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
    const warship = spawnWarship(game, player, coastX + 1, 10);

    const baseRate = game.config().warshipShellAttackRate();
    expect(game.config().warshipShellAttackRateFor(game, warship)).toBe(
      baseRate,
    );
    expect(game.config().warshipMoveSpeedFor(game, warship)).toBe(1);

    player.purchaseTech("port_shipbuilding");
    expect(game.config().warshipShellAttackRateFor(game, warship)).toBeLessThan(
      baseRate,
    );
    expect(game.config().warshipMoveSpeedFor(game, warship)).toBe(1.5);
  });

  test("warships move faster near a port with the Lighthouse", async () => {
    async function tilesTravelled(withTech: boolean): Promise<number> {
      const { game, players } = await makeGame();
      const player = players[0];
      player.buildUnit(UnitType.Port, game.ref(coastX, 10), {});
      const warship = spawnWarship(game, player, coastX + 1, 10);
      if (withTech) player.purchaseTech("port_shipbuilding");

      // Short window so the warship stays within the 30-tile Lighthouse range
      // (it patrols ~1 tile/tick, so 20 ticks keeps it near the port) and the
      // same deterministic patrol path is followed in both runs.
      let prev = warship.tile();
      let travelled = 0;
      for (let i = 0; i < 20; i++) {
        game.executeNextTick();
        for (const ts of game.units(UnitType.TradeShip)) ts.delete();
        const cur = warship.tile();
        travelled += game.manhattanDist(prev, cur);
        prev = cur;
      }
      return travelled;
    }

    const without = await tilesTravelled(false);
    const withTech = await tilesTravelled(true);
    expect(without).toBeGreaterThan(0);
    expect(withTech).toBeGreaterThan(without);
    expect(withTech).toBeGreaterThanOrEqual(Math.floor(without * 1.1));
  });
});
