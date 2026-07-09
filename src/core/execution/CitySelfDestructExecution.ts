import {
  Execution,
  Game,
  MessageType,
  Player,
  Unit,
  UnitType,
} from "../game/Game";
import { TileRef } from "../game/GameMap";
import { PseudoRandom } from "../PseudoRandom";

/**
 * When a player with the `city_trade_hub` tech upgrade has a city captured
 * by an enemy, this execution is spawned. After a configurable delay, it
 * triggers an atom-bomb-scale explosion at the city's location — no missile,
 * just the blast.
 */
export class CitySelfDestructExecution implements Execution {
  private active = true;
  private mg!: Game;
  private countdownTicks: number;

  constructor(
    private originalOwner: Player,
    private cityTile: TileRef,
    delayTicks: number,
  ) {
    this.countdownTicks = delayTicks;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }

  owner(): Player {
    return this.originalOwner;
  }

  isActive(): boolean {
    return this.active;
  }

  init(mg: Game, _ticks: number): void {
    this.mg = mg;
  }

  tick(_ticks: number): void {
    if (this.countdownTicks > 0) {
      this.countdownTicks--;
      return;
    }
    this.detonate();
    this.active = false;
  }

  private detonate(): void {
    const mg = this.mg;
    const config = mg.config();
    const dst = this.cityTile;

    // Atom-bomb magnitudes (matching Config.nukeMagnitudes for UnitType.AtomBomb).
    const inner = 12;
    const outer = 30;
    const inner2 = inner * inner;
    const outer2 = outer * outer;

    // Probabilistic tile destruction matching the atom-bomb pattern.
    const rand = new PseudoRandom(mg.ticks());
    const toDestroy = mg.bfs(dst, (_, n: TileRef) => {
      const d2 = mg.euclideanDistSquared(dst, n);
      return (
        d2 <= outer2 &&
        (d2 <= inner2 || rand.chance(2)) &&
        !mg.isImpassable(n)
      );
    });

    // Relinquish ownership of destroyed tiles and queue fallout / water.
    const tilesPerPlayers = new Map<Player, number>();
    for (const tile of toDestroy) {
      const owner = mg.owner(tile);
      if (owner.isPlayer()) {
        owner.relinquish(tile);
        tilesPerPlayers.set(owner, (tilesPerPlayers.get(owner) ?? 0) + 1);
      }
      if (mg.isLand(tile)) {
        mg.queueWaterConversion(tile);
      }
    }

    // Kill troops on affected tiles using the nuke troop-death formula.
    for (const [player, numImpactedTiles] of tilesPerPlayers) {
      const tilesBeforeNuke = player.numTilesOwned() + numImpactedTiles;
      const maxTroops = config.maxTroops(player);
      for (let i = 0; i < numImpactedTiles; i++) {
        const numTilesLeft = tilesBeforeNuke - i;
        player.removeTroops(
          config.nukeDeathFactor(
            UnitType.AtomBomb,
            player.troops(),
            numTilesLeft,
            maxTroops,
          ),
        );
      }
    }

    // Destroy all non-nuke units in the blast radius.
    for (const unit of mg.units()) {
      const type = unit.type();
      if (
        type === UnitType.AtomBomb ||
        type === UnitType.HydrogenBomb ||
        type === UnitType.MIRVWarhead ||
        type === UnitType.MIRV ||
        type === UnitType.SAMMissile
      ) {
        continue;
      }
      if (mg.euclideanDistSquared(dst, unit.tile()) < outer2) {
        unit.delete(true, this.originalOwner);
      }
    }

    // Notify impacted players.
    for (const [impactedPlayer] of tilesPerPlayers) {
      mg.displayMessage(
        "events_display.atom_bomb_detonated",
        MessageType.NUKE_DETONATED,
        impactedPlayer.id(),
        undefined,
        { name: this.originalOwner.displayName() },
        undefined,
        this.originalOwner.id(),
      );
    }
  }
}
