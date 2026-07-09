import { Execution, Game, UnitType } from "../game/Game";
import { GameUpdateType } from "../game/GameUpdates";
import { PseudoRandom } from "../PseudoRandom";

/**
 * New (non-legacy) research system.
 *
 * Instead of producing research when a train stops at a Lab (the legacy path in
 * TrainStation.ts), Labs are stackable, don't connect to the rail network, and
 * earn research through a per-tick lottery. Each tick every player with at
 * least one Lab draws a chance to win a burst of research. The per-tick odds
 * scale with the square root of the Lab count, which yields severe diminishing
 * returns: a single Lab lands a win roughly every ~30s, while the marginal
 * value of each additional Lab falls off fast. This lets small players compete
 * on research without needing a sprawling rail empire.
 *
 * Deterministic: the draw uses a PseudoRandom seeded by the current tick, so
 * replays are identical. The legacy system is untouched — this execution returns
 * early whenever legacyResearch() is true.
 */
export class ResearchLotteryExecution implements Execution {
  private active = true;
  private mg: Game | null = null;

  init(mg: Game, ticks: number): void {
    this.mg = mg;
  }

  tick(ticks: number): void {
    if (this.mg === null) throw new Error("ResearchLotteryExecution not init");
    const mg = this.mg;
    if (mg.config().legacyResearch()) return;

    // Per-tick deterministic stream. Player order is stable, so the shared
    // stream is fair in expectation and fully replayable.
    const rand = new PseudoRandom(ticks);

    for (const player of mg.players()) {
      const labCount = player.unitCount(UnitType.Lab);
      if (labCount === 0) continue;

      // Odds rise with sqrt(labCount) -> strong diminishing returns per Lab.
      // Cap keeps the per-tick win chance sane at very high Lab counts.
      const winChance = Math.min(Math.sqrt(labCount) / 300, 0.5);
      if (rand.next() >= winChance) continue;

      const labs = player.units(UnitType.Lab);
      const lab = labs.length > 0 ? rand.randElement(labs) : null;
      if (lab === null || lab.tile() === undefined) continue;

      const multiplier = mg.config().researchMultiplier();
      const base = rand.nextInt(10_000, 50_000);
      const award = Math.round(base * multiplier);
      player.addResearch(BigInt(award));

      mg.addUpdate({
        type: GameUpdateType.BonusEvent,
        player: player.id(),
        tile: lab.tile()!,
        gold: 0,
        troops: 0,
        research: award,
      });
    }
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
