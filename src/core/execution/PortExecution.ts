import { Execution, Game, Unit, UnitType } from "../game/Game";
import { PseudoRandom } from "../PseudoRandom";
import { ShellExecution } from "./ShellExecution";
import { TradeShipExecution } from "./TradeShipExecution";
import { TrainStationExecution } from "./TrainStationExecution";

/** Unit types a port turret can fire at (same as the warship gun). */
const TURRET_TARGET_TYPES = [
  UnitType.TransportShip,
  UnitType.Warship,
  UnitType.TradeShip,
];

export class PortExecution implements Execution {
  private active = true;
  private mg: Game;
  private port: Unit;
  private random: PseudoRandom;
  private checkOffset: number;
  private tradeShipSpawnRejections = 0;

  private turretTarget: Unit | null = null;
  private lastShellAttack = 0;
  private alreadySentShell = new Set<Unit>();

  constructor(port: Unit) {
    this.port = port;
  }

  init(mg: Game, ticks: number): void {
    this.mg = mg;
    this.random = new PseudoRandom(mg.ticks());
    this.checkOffset = mg.ticks() % 10;
  }

  tick(ticks: number): void {
    if (this.mg === null || this.random === null || this.checkOffset === null) {
      throw new Error("Not initialized");
    }

    if (!this.port.isActive()) {
      this.active = false;
      return;
    }

    if (this.port.isUnderConstruction()) {
      return;
    }

    this.tickTurret();

    if (!this.port.hasTrainStation()) {
      this.createStation();
    }

    // Only check every 10 ticks for performance.
    if ((this.mg.ticks() + this.checkOffset) % 10 !== 0) {
      return;
    }

    if (!this.shouldSpawnTradeShip()) {
      return;
    }

    const ports = this.tradingPorts();

    if (ports.length === 0) {
      return;
    }

    const port = this.random.randElement(ports);
    this.mg.addExecution(
      new TradeShipExecution(this.port.owner(), this.port, port),
    );
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }

  shouldSpawnTradeShip(): boolean {
    const numTradeShips = this.mg.unitCount(UnitType.TradeShip);
    const spawnRate = this.mg
      .config()
      .tradeShipSpawnRate(this.tradeShipSpawnRejections, numTradeShips);
    // port_development increases trade ship generation speed by 20%, which
    // lowers the spawn odds (probability = 1 / odds) by the same factor.
    const bonus = this.port
      .owner()
      .hasTech("port_development")
      ? this.mg.config().portDevelopmentTradeShipBonus()
      : 1;
    const effectiveRate = spawnRate / bonus;
    for (let i = 0; i < this.port!.level(); i++) {
      if (this.random.chance(effectiveRate)) {
        this.tradeShipSpawnRejections = 0;
        return true;
      }
      this.tradeShipSpawnRejections++;
    }
    return false;
  }

  createStation(): void {
    const nearbyFactory = this.mg.hasUnitNearby(
      this.port.tile()!,
      this.mg.config().trainStationMaxRange(),
      UnitType.Factory,
    );
    if (nearbyFactory) {
      this.mg.addExecution(new TrainStationExecution(this.port));
    }
  }

  // It's a probability list, so if an element appears twice it's because it's
  // twice more likely to be picked later.
  tradingPorts(): Unit[] {
    const sourceComponents = new Set<number>();
    for (const neighbor of this.mg.neighbors(this.port!.tile())) {
      if (!this.mg.isWater(neighbor)) continue;
      const comp = this.mg.getWaterComponent(neighbor);
      if (comp !== null) sourceComponents.add(comp);
    }
    const ports = this.mg
      .players()
      .filter((p) => p !== this.port!.owner() && p.canTrade(this.port!.owner()))
      .flatMap((p) => p.units(UnitType.Port))
      .filter((p) => {
        for (const comp of sourceComponents) {
          if (this.mg.hasWaterComponent(p.tile(), comp)) return true;
        }
        return false;
      })
      .sort((p1, p2) => {
        return (
          this.mg.manhattanDist(this.port!.tile(), p1.tile()) -
          this.mg.manhattanDist(this.port!.tile(), p2.tile())
        );
      });

    const weightedPorts: Unit[] = [];

    for (const [i, otherPort] of ports.entries()) {
      const expanded = new Array(otherPort.level()).fill(otherPort);
      weightedPorts.push(...expanded);
      const tooClose =
        this.mg.manhattanDist(this.port!.tile(), otherPort.tile()) <
        this.mg.config().tradeShipShortRangeDebuff();
      const closeBonus =
        i < this.mg.config().proximityBonusPortsNb(ports.length);
      if (!tooClose && closeBonus) {
        // If the port is close, but not too close, add it again
        // to increase the chances of trading with it.
        weightedPorts.push(...expanded);
      }
      if (!tooClose && this.port!.owner().isFriendly(otherPort.owner())) {
        weightedPorts.push(...expanded);
      }
    }
    return weightedPorts;
  }

  private tickTurret(): void {
    const owner = this.port.owner();
    if (!owner.hasTech("port_turret")) return;

    if (this.turretTarget === null || !this.turretTarget.isActive()) {
      this.turretTarget = this.findTurretTarget();
    }

    if (this.turretTarget !== null) {
      this.shootTurret(this.turretTarget);
    }
  }

  private findTurretTarget(): Unit | null {
    const owner = this.port.owner();
    const candidates = this.mg.nearbyUnits(
      this.port.tile(),
      this.mg.config().portTurretRange(),
      TURRET_TARGET_TYPES,
    );

    let best: Unit | null = null;
    let bestTypePriority = Infinity;
    let bestDistSquared = Infinity;

    for (const { unit, distSquared } of candidates) {
      if (unit === this.port) continue;
      if (unit.owner() === owner) continue;
      if (!owner.canAttackPlayer(unit.owner(), true)) continue;
      if (this.alreadySentShell.has(unit)) continue;

      // Prioritize TransportShip, then Warship, then TradeShip.
      const typePriority =
        unit.type() === UnitType.TransportShip
          ? 0
          : unit.type() === UnitType.Warship
            ? 1
            : 2;

      if (
        best === null ||
        typePriority < bestTypePriority ||
        (typePriority === bestTypePriority && distSquared < bestDistSquared)
      ) {
        best = unit;
        bestTypePriority = typePriority;
        bestDistSquared = distSquared;
      }
    }

    return best;
  }

  private shootTurret(target: Unit): void {
    const shellAttackRate = this.mg.config().portTurretShellAttackRate();
    if (this.mg.ticks() - this.lastShellAttack > shellAttackRate) {
      // Same as the warship gun: don't reload while firing at transport ships.
      if (target.type() !== UnitType.TransportShip) {
        this.lastShellAttack = this.mg.ticks();
      }
      this.mg.addExecution(
        new ShellExecution(
          this.port.tile(),
          this.port.owner(),
          this.port,
          target,
        ),
      );
      if (!target.hasHealth()) {
        // Don't send multiple shells to a target that can be oneshotted.
        this.alreadySentShell.add(target);
        this.turretTarget = null;
      }
    }
  }
}
