import { renderNumber } from "../../client/Utils";
import {
  Execution,
  Game,
  MessageType,
  Player,
  Unit,
  UnitType,
} from "../game/Game";
import { TileRef } from "../game/GameMap";
import { WaterPathFinder } from "../pathfinding/PathFinder";
import { PathStatus } from "../pathfinding/types";
import { findClosestBy } from "../Util";

// Returns a path covering the same route but with one entry every `speed`
// tiles, so a client whose motion plan advances 1 entry/tick renders a unit
// moving `speed` tiles/tick (motion-plan ticksPerStep is integer-only).
function downsamplePath(path: readonly TileRef[], speed: number): TileRef[] {
  if (speed <= 1) return path as TileRef[];
  const out: TileRef[] = [];
  for (let i = 0; i < path.length; i += speed) {
    out.push(path[i]);
  }
  const last = path[path.length - 1];
  if (out[out.length - 1] !== last) {
    out.push(last);
  }
  return out;
}

export class TradeShipExecution implements Execution {
  private active = true;
  private mg: Game;
  private tradeShip: Unit | undefined;
  private wasCaptured = false;
  private pathFinder: WaterPathFinder;
  private tilesTraveled = 0;
  private motionPlanId = 1;
  private motionPlanDst: TileRef | null = null;

  private static _staggerCounter = 0;

  constructor(
    private origOwner: Player,
    private srcPort: Unit,
    private _dstPort: Unit,
  ) {}

  init(mg: Game, ticks: number): void {
    this.mg = mg;
    const stagger =
      TradeShipExecution._staggerCounter++ % WaterPathFinder.STAGGER_SPREAD;
    this.pathFinder = new WaterPathFinder(mg, stagger);
  }

  tick(ticks: number): void {
    if (this.pathFinder.rebuilt) {
      this.motionPlanDst = null; // Force motion plan re-recording
    }

    if (this.tradeShip === undefined) {
      const spawn = this.origOwner.canBuild(
        UnitType.TradeShip,
        this.srcPort.tile(),
      );
      if (spawn === false) {
        console.warn(`cannot build trade ship`);
        this.active = false;
        return;
      }
      this.tradeShip = this.origOwner.buildUnit(UnitType.TradeShip, spawn, {
        targetUnit: this._dstPort,
        lastSetSafeFromPirates: ticks,
      });
      this.mg.stats().boatSendTrade(this.origOwner, this._dstPort.owner());
    }

    if (!this.tradeShip.isActive()) {
      this.active = false;
      return;
    }

    const tradeShipOwner = this.tradeShip.owner();
    const dstPortOwner = this._dstPort.owner();
    if (this.wasCaptured !== true && this.origOwner !== tradeShipOwner) {
      // Store as variable in case ship is recaptured by previous owner
      this.wasCaptured = true;
      this.mg.displayMessage(
        "events_display.trade_ship_captured",
        MessageType.UNIT_DESTROYED,
        this.origOwner.id(),
        undefined,
        { name: tradeShipOwner.displayName() },
        this.tradeShip.id(),
      );
    }

    // If a player captures another player's port while trading we should delete
    // the ship.
    if (dstPortOwner.id() === this.srcPort.owner().id()) {
      this.tradeShip.delete(false);
      this.active = false;
      return;
    }

    if (
      !this.wasCaptured &&
      (!this._dstPort.isActive() || !tradeShipOwner.canTrade(dstPortOwner))
    ) {
      this.tradeShip.delete(false);
      this.active = false;
      return;
    }

    const curTile = this.tradeShip.tile();

    if (
      this.wasCaptured &&
      (tradeShipOwner !== dstPortOwner || !this._dstPort.isActive())
    ) {
      const myComponent = this.mg.getWaterComponent(curTile);
      const nearestPort = findClosestBy(
        tradeShipOwner.units(UnitType.Port),
        (port) => this.mg.manhattanDist(port.tile(), curTile),
        (port) =>
          port.isActive() &&
          !port.isMarkedForDeletion() &&
          !port.isUnderConstruction() &&
          myComponent !== null &&
          this.mg.hasWaterComponent(port.tile(), myComponent),
      );
      if (nearestPort === null) {
        this.tradeShip.delete(false);
        this.active = false;
        return;
      } else {
        this._dstPort = nearestPort;
        this.tradeShip.setTargetUnit(this._dstPort);
        // Plan-driven units don't emit per-tick unit updates, so force a sync for the new target.
        this.tradeShip.touch();
      }
    }

    // port_navigation makes the owner's trade ships travel twice as fast,
    // i.e. advance two tiles per tick.
    const speed = this.mg.config().tradeShipSpeed(this.tradeShip.owner());
    for (let step = 0; step < speed; step++) {
      if (this.stepTradeShip(ticks + step)) {
        return;
      }
    }
  }

  private stepTradeShip(ticks: number): boolean {
    const ship = this.tradeShip;
    if (ship === undefined || !ship.isActive()) {
      this.active = false;
      return true;
    }

    const curTile = ship.tile();
    if (curTile === this.dstPort()) {
      this.complete();
      return true;
    }

    const dst = this._dstPort.tile();
    const result = this.pathFinder.next(curTile, dst);

    switch (result.status) {
      case PathStatus.NEXT: {
        if (dst !== this.motionPlanDst) {
          this.motionPlanId++;
          const from = result.node;
          const full = this.pathFinder.findPath(from, dst) ?? [from];
          if (full.length === 0 || full[0] !== from) {
            full.unshift(from);
          }
          // Downsample the plan path so the client renders at the same
          // tiles/tick as the simulation (motion-plan ticksPerStep is integer).
          const speed = this.mg.config().tradeShipSpeed(ship.owner());
          this.mg.recordMotionPlan({
            kind: "grid",
            unitId: ship.id(),
            planId: this.motionPlanId,
            startTick: ticks + 1,
            ticksPerStep: 1,
            path: downsamplePath(full, speed),
          });
          this.motionPlanDst = dst;
        }
        // Update safeFromPirates status
        if (this.mg.isWater(result.node) && this.mg.isShoreline(result.node)) {
          ship.setSafeFromPirates();
        }
        ship.move(result.node);
        this.tilesTraveled++;
        return false;
      }
      case PathStatus.COMPLETE:
        this.complete();
        return true;
      case PathStatus.NOT_FOUND:
        console.warn("captured trade ship cannot find route");
        if (ship.isActive()) {
          ship.delete(false);
        }
        this.active = false;
        return true;
    }
  }

  private complete() {
    this.active = false;
    this.tradeShip!.delete(false);
    const gold = this.mg
      .config()
      .tradeShipGold(this.tilesTraveled, this.tradeShip!.owner());

    if (this.wasCaptured) {
      this.tradeShip!.owner().addGold(gold, this._dstPort.tile());
      this.mg.displayMessage(
        "events_display.received_gold_from_captured_ship",
        MessageType.CAPTURED_ENEMY_UNIT,
        this.tradeShip!.owner().id(),
        gold,
        {
          gold: renderNumber(gold),
          name: this.origOwner.displayName(),
        },
      );
      // Record stats
      this.mg
        .stats()
        .boatCapturedTrade(this.tradeShip!.owner(), this.origOwner, gold);
    } else {
      this.srcPort.owner().addGold(gold, this.srcPort.tile());
      this._dstPort.owner().addGold(gold, this._dstPort.tile());
      // Record stats
      this.mg
        .stats()
        .boatArriveTrade(this.srcPort.owner(), this._dstPort.owner(), gold);
    }
    return;
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }

  dstPort(): TileRef {
    return this._dstPort.tile();
  }
}
