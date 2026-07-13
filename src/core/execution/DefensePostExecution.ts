import { Execution, Game, Unit } from "../game/Game";
import { ShellExecution } from "./ShellExecution";

export class DefensePostExecution implements Execution {
  private mg: Game;
  private active: boolean = true;

  private target: Unit | null = null;
  private lastShellAttack = 0;

  private alreadySentShell = new Set<Unit>();

  constructor(private post: Unit) {}

  init(mg: Game, ticks: number): void {
    this.mg = mg;
  }

  private shoot() {
    if (this.target === null) return;
    const shellAttackRate = this.mg.config().defensePostShellAttackRate();
    if (this.mg.ticks() - this.lastShellAttack > shellAttackRate) {
      this.lastShellAttack = this.mg.ticks();
      this.mg.addExecution(
        new ShellExecution(
          this.post.tile(),
          this.post.owner(),
          this.post,
          this.target,
        ),
      );
      if (!this.target.hasHealth()) {
        // Don't send multiple shells to target that can be oneshotted
        this.alreadySentShell.add(this.target);
        this.target = null;
        return;
      }
    }
  }

  tick(ticks: number): void {
    if (!this.post.isActive()) {
      this.active = false;
      return;
    }

    // Do nothing while the structure is under construction
    if (this.post.isUnderConstruction()) {
      return;
    }

    if (this.target !== null && !this.target.isActive()) {
      this.target = null;
    }

    // A defense post upgraded with the missile-silo tech (defense_flare) is
    // transformed into a manual nuke launcher: the player launches nukes
    // themselves (selecting a target) using the post as the launch source,
    // exactly like a missile silo. Reload the missile once the cooldown
    // expires, reusing the same mechanism as SAMs and missile silos.
    if (this.post.isInCooldown()) {
      const frontTime = this.post.missileTimerQueue()[0];
      if (frontTime !== undefined) {
        const cooldown =
          this.mg.config().defensePostNukeCooldown() -
          (this.mg.ticks() - frontTime);
        if (cooldown <= 0) {
          this.post.reloadMissile();
        }
      }
    }
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
