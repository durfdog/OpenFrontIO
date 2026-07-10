import { PortExecution } from "../src/core/execution/PortExecution";
import { getTechNode, getTechTree } from "../src/core/tech/TechTreeData";
import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../src/core/game/Game";
import { setup } from "./util/Setup";
import { constructionExecution, executeTicks } from "./util/utils";

let game: Game;
let player: Player;
let other: Player;

describe("PortExecution", () => {
  beforeEach(async () => {
    game = await setup("half_land_half_ocean", { instantBuild: true }, [
      new PlayerInfo("player", PlayerType.Human, null, "player_id"),
      new PlayerInfo("other", PlayerType.Human, null, "other_id"),
    ]);

    player = game.player("player_id");
    player.addGold(BigInt(1000000));
    other = game.player("other_id");

    game.config().structureMinDist = () => 10;
  });

  test("Destination ports chances scale with level", () => {
    game.config().proximityBonusPortsNb = () => 0;
    game.config().tradeShipShortRangeDebuff = () => 0;

    player.conquer(game.ref(7, 10));
    const spawn = player.canBuild(UnitType.Port, game.ref(7, 10));
    if (spawn === false) {
      throw new Error("Unable to build port for test");
    }
    const port = player.buildUnit(UnitType.Port, spawn, {});
    const execution = new PortExecution(port);
    execution.init(game, 0);
    execution.tick(0);

    other.conquer(game.ref(0, 0));
    const otherPort = other.buildUnit(UnitType.Port, game.ref(0, 0), {});
    otherPort.increaseLevel();
    otherPort.increaseLevel();

    const ports = execution.tradingPorts();

    expect(ports.length).toBe(3);
  });

  test("Trade ship proximity bonus", () => {
    game.config().proximityBonusPortsNb = () => 10;
    game.config().tradeShipShortRangeDebuff = () => 0;

    player.conquer(game.ref(7, 10));
    const spawn = player.canBuild(UnitType.Port, game.ref(7, 10));
    if (spawn === false) {
      throw new Error("Unable to build port for test");
    }
    const port = player.buildUnit(UnitType.Port, spawn, {});
    const execution = new PortExecution(port);
    execution.init(game, 0);
    execution.tick(0);

    other.conquer(game.ref(0, 0));
    other.buildUnit(UnitType.Port, game.ref(0, 0), {});

    const ports = execution.tradingPorts();

    expect(ports.length).toBe(2);
  });

  test("Trade ship short range debuff", () => {
    game.config().proximityBonusPortsNb = () => 10;
    // Short range debuff cancels out the proximity bonus.
    game.config().tradeShipShortRangeDebuff = () => 100;

    player.conquer(game.ref(7, 10));
    const spawn = player.canBuild(UnitType.Port, game.ref(7, 10));
    if (spawn === false) {
      throw new Error("Unable to build port for test");
    }
    const port = player.buildUnit(UnitType.Port, spawn, {});
    const execution = new PortExecution(port);
    execution.init(game, 0);
    execution.tick(0);

    other.conquer(game.ref(0, 0));
    other.buildUnit(UnitType.Port, game.ref(0, 0), {});

    const ports = execution.tradingPorts();

    expect(ports.length).toBe(1);
  });
});

describe("port_turret tech node", () => {
  test("replaces repair_yard at L3d under port_shipbuilding", () => {
    const node = getTechNode("port_turret");
    expect(node).toBeDefined();
    expect(node!.layer).toBe(3);
    expect(node!.prerequisites).toEqual(["port_shipbuilding"]);
    expect(node!.mutuallyExclusiveWith).toEqual(["port_dry_dock"]);

    const dryDock = getTechNode("port_dry_dock");
    expect(dryDock!.mutuallyExclusiveWith).toEqual(["port_turret"]);

    // The port tree still has exactly 7 nodes (1/2/4).
    const portTree = getTechTree("port");
    expect(portTree).toHaveLength(7);
    expect(portTree.filter((n) => n.layer === 1)).toHaveLength(1);
    expect(portTree.filter((n) => n.layer === 2)).toHaveLength(2);
    expect(portTree.filter((n) => n.layer === 3)).toHaveLength(4);
    expect(portTree.some((n) => n.id === "port_repair_yard")).toBe(false);
  });
});

describe("PortExecution turret", () => {
  let game: Game;
  let player: Player;
  let other: Player;

  beforeEach(async () => {
    game = await setup(
      "half_land_half_ocean",
      { infiniteGold: true, instantBuild: true },
      [
        new PlayerInfo("player", PlayerType.Human, null, "player_id"),
        new PlayerInfo("other", PlayerType.Human, null, "other_id"),
      ],
    );
    player = game.player("player_id");
    other = game.player("other_id");
    player.conquer(game.ref(3, 10));
    player.conquer(game.ref(7, 10));
    other.conquer(game.ref(3, 11));
    game.config().structureMinDist = () => 10;
    // Fire the turret every tick for fast, deterministic tests.
    game.config().portTurretShellAttackRate = () => 1;
  });

  function buildTurretPort(): void {
    constructionExecution(game, player, 7, 10, UnitType.Port);
    player.purchaseTech("port_turret");
  }

  function spawnEnemyWarship(x: number, y: number) {
    return other.buildUnit(UnitType.Warship, game.ref(x, y), {
      patrolTile: game.ref(x, y),
    });
  }

  test("fires at an enemy warship within range", () => {
    buildTurretPort();
    const warship = spawnEnemyWarship(8, 10);
    const initialHealth = warship.health();

    executeTicks(game, 40);

    expect(warship.health()).toBeLessThan(initialHealth);
  });

  test("does not fire without the port_turret tech", () => {
    constructionExecution(game, player, 7, 10, UnitType.Port);
    // Intentionally do NOT purchase port_turret.
    const warship = spawnEnemyWarship(8, 10);
    const initialHealth = warship.health();

    executeTicks(game, 40);

    expect(warship.health()).toBe(initialHealth);
  });

  test("does not fire at warships beyond turret range", () => {
    // The test map is only 16x16, so shrink the range to test the cutoff.
    game.config().portTurretRange = () => 2;
    buildTurretPort();
    // ~3 tiles away: outside the 2-tile turret range.
    const warship = spawnEnemyWarship(8, 13);
    const initialHealth = warship.health();

    executeTicks(game, 40);

    expect(warship.health()).toBe(initialHealth);
  });
});
