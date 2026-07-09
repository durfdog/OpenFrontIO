import { PlayerExecution } from "../../src/core/execution/PlayerExecution";
import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { executeTicks } from "../util/utils";
import { setup } from "../util/Setup";

let game: Game;
let alice: Player;
let bob: Player;

async function initGame() {
  game = await setup(
    "big_plains",
    { infiniteGold: true, instantBuild: true },
    [
      new PlayerInfo("alice", PlayerType.Human, "client1", "alice_id"),
      new PlayerInfo("bob", PlayerType.Human, "client2", "bob_id"),
    ],
  );
  alice = game.player("alice_id");
  bob = game.player("bob_id");
  game.addExecution(new PlayerExecution(alice));
  game.addExecution(new PlayerExecution(bob));
}

describe("city_trade_hub — city self-destruct on capture", () => {
  beforeEach(async () => {
    await initGame();
  });

  test("city without city_trade_hub is transferred to captor", () => {
    const tile = game.ref(50, 50);
    alice.conquer(tile);
    const city = alice.buildUnit(UnitType.City, tile, {});

    bob.conquer(tile);
    executeTicks(game, 2);

    expect(city.owner()).toBe(bob);
    expect(city.isActive()).toBe(true);
  });

  test("city with city_trade_hub is destroyed (not transferred) when captured", () => {
    const tile = game.ref(50, 50);
    alice.conquer(tile);
    const city = alice.buildUnit(UnitType.City, tile, {});
    alice.purchaseTech("city_trade_hub");

    bob.conquer(tile);
    executeTicks(game, 2);

    expect(city.isActive()).toBe(false);
  });

  test("self-destruct explosion destroys tiles in blast radius after the delay", () => {
    const cityTile = game.ref(50, 50);
    alice.conquer(cityTile);
    alice.buildUnit(UnitType.City, cityTile, {});
    alice.purchaseTech("city_trade_hub");

    // Tile just next to the city (within inner radius 12).
    const nearbyTile = game.ref(50, 48);
    alice.conquer(nearbyTile);

    // Bob captures the city tile.
    bob.conquer(cityTile);
    executeTicks(game, 2);

    // Should still be owned by alice (explosion hasn't happened yet).
    expect(game.owner(nearbyTile).isPlayer()).toBe(true);

    // Wait past the self-destruct delay (30 ticks) + margin.
    executeTicks(game, 35);

    // Tile near the city should have been relinquished.
    expect(game.owner(nearbyTile).isPlayer()).toBe(false);

    // The city center tile should also be unowned.
    expect(game.owner(cityTile).isPlayer()).toBe(false);
  });

  test("self-destruct explosion destroys units in blast radius", () => {
    const cityTile = game.ref(50, 50);
    alice.conquer(cityTile);
    alice.buildUnit(UnitType.City, cityTile, {});
    alice.purchaseTech("city_trade_hub");

    // Build a factory on a tile within inner blast radius.
    const factoryTile = game.ref(50, 55);
    alice.conquer(factoryTile);
    const factory = alice.buildUnit(UnitType.Factory, factoryTile, {});

    // Bob captures the city.
    bob.conquer(cityTile);
    executeTicks(game, 2);

    expect(factory.isActive()).toBe(true);

    // Wait for the explosion.
    executeTicks(game, 35);

    // Factory should be destroyed by the blast.
    expect(factory.isActive()).toBe(false);
  });
});
