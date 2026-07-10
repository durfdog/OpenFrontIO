import { ConstructionExecution } from "../../src/core/execution/ConstructionExecution";
import {
  Game,
  Player,
  PlayerInfo,
  PlayerType,
  UnitType,
} from "../../src/core/game/Game";
import { TileRef } from "../../src/core/game/GameMap";
import { setup } from "../util/Setup";

describe("Dig In instant defense post build", () => {
  let game: Game;
  let def: Player;
  const defInfo = new PlayerInfo(
    "def",
    PlayerType.Human,
    null,
    "def_id",
  );
  const otherInfo = new PlayerInfo("other", PlayerType.Human, null, "other_id");

  beforeEach(async () => {
    game = await setup(
      "plains",
      {
        infiniteGold: false,
        instantBuild: false,
        infiniteTroops: true,
      },
      [defInfo, otherInfo],
    );
    def = game.player(defInfo.id);
    for (let dx = -18; dx <= 18; dx++) {
      for (let dy = -18; dy <= 18; dy++) {
        const t = game.ref(50 + dx, 50 + dy);
        if (game.isValidRef(t) && !game.isWater(t)) {
          def.conquer(t);
        }
      }
    }
    def.addGold(10_000_000n);
  });

  function buildableTiles(): TileRef[] {
    const seen = new Set<TileRef>();
    const tiles: TileRef[] = [];
    for (const t of def.tiles()) {
      const r = def.canBuild(UnitType.DefensePost, t);
      if (r !== false && !seen.has(r)) {
        seen.add(r);
        tiles.push(r);
      }
      if (tiles.length >= 2) break;
    }
    return tiles;
  }

  test("defense posts build instantly after Dig In tech", () => {
    const [tile1] = buildableTiles();
    expect(tile1).toBeDefined();

    game.addExecution(new ConstructionExecution(def, UnitType.DefensePost, tile1));
    game.executeNextTick();
    game.executeNextTick();
    const post = def.units(UnitType.DefensePost)[0];
    expect(post.isUnderConstruction()).toBe(true);

    def.purchaseTech("defense_reinforcements");

    const [tile2] = buildableTiles();
    expect(tile2).toBeDefined();
    game.addExecution(new ConstructionExecution(def, UnitType.DefensePost, tile2));
    game.executeNextTick();
    game.executeNextTick();
    const post2 = def.units(UnitType.DefensePost)[1];
    expect(post2.isUnderConstruction()).toBe(false);
  });
});
