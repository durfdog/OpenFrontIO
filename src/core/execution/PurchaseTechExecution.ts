import { getTechNode } from "../tech/TechTreeData";
import { Execution, Game, Player } from "../game/Game";

export class PurchaseTechExecution implements Execution {
  private active = true;

  constructor(
    private player: Player,
    private techId: string,
  ) {}

  init(mg: Game, _ticks: number): void {
    const node = getTechNode(this.techId);
    if (!node) {
      console.warn(`[PurchaseTechExecution] unknown tech: ${this.techId}`);
      this.active = false;
      return;
    }

    // Already purchased?
    if (this.player.hasTech(this.techId)) {
      console.warn(
        `[PurchaseTechExecution] tech already purchased: ${this.techId}`,
      );
      this.active = false;
      return;
    }

    // Enough research?
    const cost = BigInt(node.cost);
    if (this.player.research() < cost) {
      console.warn(
        `[PurchaseTechExecution] insufficient research for ${this.techId}: need ${cost}, have ${this.player.research()}`,
      );
      this.active = false;
      return;
    }

    // Prerequisites met?
    for (const prereqId of node.prerequisites) {
      if (!this.player.hasTech(prereqId)) {
        console.warn(
          `[PurchaseTechExecution] prerequisite not met for ${this.techId}: missing ${prereqId}`,
        );
        this.active = false;
        return;
      }
    }

    // Mutually exclusive check?
    for (const exclId of node.mutuallyExclusiveWith) {
      if (this.player.hasTech(exclId)) {
        console.warn(
          `[PurchaseTechExecution] mutually exclusive tech already owned for ${this.techId}: ${exclId}`,
        );
        this.active = false;
        return;
      }
    }

    // Purchase!
    this.player.removeResearch(cost);
    this.player.purchaseTech(this.techId);
    this.active = false;
  }

  tick(_ticks: number): void {
    // No per-tick behavior
  }

  isActive(): boolean {
    return this.active;
  }

  activeDuringSpawnPhase(): boolean {
    return false;
  }
}
