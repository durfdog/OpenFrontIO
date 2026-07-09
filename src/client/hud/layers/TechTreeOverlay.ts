import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { assetUrl } from "../../../core/AssetUrls";
import { EventBus } from "../../../core/EventBus";
import { getTechTree, TechNode } from "../../../core/tech/TechTreeData";
import { GameView } from "../../view";
import { renderNumber, translateText } from "../../Utils";
import { SendPurchaseTechIntentEvent } from "../../Transport";

const cityIcon = assetUrl("images/CityIconWhite.svg");
const factoryIcon = assetUrl("images/FactoryIconWhite.svg");
const portIcon = assetUrl("images/PortIcon.svg");
const shieldIcon = assetUrl("images/ShieldIconWhite.svg");
const missileSiloIcon = assetUrl("images/MissileSiloIconWhite.svg");
const samlauncherIcon = assetUrl("images/SamLauncherIconWhite.svg");
const labIcon = assetUrl("images/BeakerIconWhite.svg");
const warshipIcon = assetUrl("images/BattleshipIconWhite.svg");
const atomBombIcon = assetUrl("images/NukeIconWhite.svg");
const hydrogenBombIcon = assetUrl("images/MushroomCloudIconWhite.svg");
const mirvIcon = assetUrl("images/MIRVIcon.svg");

const ICON_MAP: Record<string, string> = {
  city: cityIcon,
  factory: factoryIcon,
  port: portIcon,
  defensepost: shieldIcon,
  missilesilo: missileSiloIcon,
  samlauncher: samlauncherIcon,
  lab: labIcon,
  warship: warshipIcon,
  atombomb: atomBombIcon,
  hydrogenbomb: hydrogenBombIcon,
  mirv: mirvIcon,
};

const STRUCTURE_SLUGS = [
  "city", "factory", "port", "defensepost", "missilesilo",
  "samlauncher", "warship", "atombomb", "hydrogenbomb", "mirv", "lab",
];

@customElement("tech-tree-overlay")
export class TechTreeOverlay extends LitElement {
  @property({ attribute: false }) game: GameView | null = null;
  @property({ attribute: false }) eventBus: EventBus | null = null;

  @state() private isVisible = false;
  @state() private selectedStructure: string = "city";
  @state() private selectedNodeId: string | null = null;
  @state() private pendingTechs = new Set<string>();

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super();
    console.log("[TechTreeOverlay] constructed, custom element registered");
  }

  createRenderRoot() {
    return this;
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.selectedNodeId = null;
    this.pendingTechs.clear();
    if (this.isVisible) {
      this.startPolling();
    } else {
      this.stopPolling();
    }
    this.requestUpdate();
  }

  private startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => this.requestUpdate(), 200);
  }

  private stopPolling() {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private close() {
    this.isVisible = false;
    this.selectedNodeId = null;
    this.pendingTechs.clear();
    this.stopPolling();
    this.requestUpdate();
  }

  private handleWheel = (e: WheelEvent) => {
    if (!this.isVisible) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      this.cycleStructure(-1);
    } else {
      this.cycleStructure(1);
    }
  };

  private cycleStructure(direction: -1 | 1) {
    const idx = STRUCTURE_SLUGS.indexOf(this.selectedStructure);
    const next =
      (idx + direction + STRUCTURE_SLUGS.length) % STRUCTURE_SLUGS.length;
    this.selectedStructure = STRUCTURE_SLUGS[next];
    this.selectedNodeId = null;
    this.requestUpdate();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (this.selectedNodeId) {
        this.selectedNodeId = null;
        this.requestUpdate();
      } else {
        this.close();
      }
    }
  };

  private wheelEl: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeyDown);
    if (this.wheelEl) {
      this.wheelEl.removeEventListener("wheel", this.handleWheel);
      this.wheelEl = null;
    }
    this.stopPolling();
    super.disconnectedCallback();
  }

  /** After each render, attach non-passive wheel listener to the scrollable panel. */
  updated() {
    if (!this.isVisible) {
      if (this.wheelEl) {
        this.wheelEl.removeEventListener("wheel", this.handleWheel);
        this.wheelEl = null;
      }
      return;
    }
    this.drawConnectors();
    const panel = this.querySelector(".tech-tree-scroll") as HTMLElement | null;
    if (panel && panel !== this.wheelEl) {
      this.wheelEl?.removeEventListener("wheel", this.handleWheel);
      panel.addEventListener("wheel", this.handleWheel, { passive: false });
      this.wheelEl = panel;
    }
  }

  private selectStructure(slug: string) {
    this.selectedStructure = slug;
    this.selectedNodeId = null;
    this.pendingTechs.clear();
    this.requestUpdate();
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.currentTarget === e.target) {
      this.selectedNodeId = null;
      this.pendingTechs.clear();
      this.requestUpdate();
    }
  }

  private handleNodeClick(
    e: MouseEvent,
    node: TechNode,
    purchased: boolean,
    canInteract: boolean,
  ) {
    e.stopPropagation();
    if (purchased || !canInteract) return;
    if (this.pendingTechs.has(node.id)) return;
    if (this.selectedNodeId === node.id) {
      this.eventBus?.emit(new SendPurchaseTechIntentEvent(node.id));
      this.pendingTechs.add(node.id);
      this.selectedNodeId = null;
      this.requestUpdate();
    } else {
      this.selectedNodeId = node.id;
      this.requestUpdate();
    }
  }

  private get research(): number {
    return Number(this.game?.myPlayer()?.research() ?? 0n);
  }

  private get purchasedTechs(): Set<string> {
    const techs = new Set(this.game?.myPlayer()?.state.purchasedTechs ?? []);
    for (const t of this.pendingTechs) techs.add(t);
    return techs;
  }

  private nodeState(
    node: TechNode,
  ): "locked" | "affordable" | "unaffordable" | "purchased" | "selected" {
    const purchased = this.purchasedTechs;
    if (purchased.has(node.id)) return "purchased";
    for (const prereq of node.prerequisites) {
      if (!purchased.has(prereq)) return "locked";
    }
    for (const excl of node.mutuallyExclusiveWith) {
      if (purchased.has(excl)) return "locked";
    }
    if (this.selectedNodeId === node.id) return "selected";
    if (this.research >= node.cost) return "affordable";
    return "unaffordable";
  }

  private drawConnectors() {
    const treeEl = this.querySelector(".tech-tree-area") as HTMLElement | null;
    const svg = this.querySelector(".connector-svg") as SVGElement | null;
    if (!treeEl || !svg) return;

    const treeRect = treeEl.getBoundingClientRect();
    const tree = getTechTree(this.selectedStructure);
    const l1 = tree.filter((n) => n.layer === 1);
    const l2 = tree.filter((n) => n.layer === 2);
    const l3 = tree.filter((n) => n.layer === 3);

    const paths: string[] = [];

    const addPaths = (parents: TechNode[], children: TechNode[]) => {
      for (const child of children) {
        const parentId = child.prerequisites[0];
        if (!parentId) continue;
        const path = this.computeConnector(parentId, child.id, treeRect);
        if (path) paths.push(path);
      }
    };

    addPaths(l1, l2);
    addPaths(l2, l3);

    svg.innerHTML = paths.join("");
  }

  private computeConnector(
    parentId: string,
    childId: string,
    containerRect: DOMRect,
  ): string | null {
    const pEl = this.querySelector(
      `[data-node-id="${parentId}"]`,
    ) as HTMLElement | null;
    const cEl = this.querySelector(
      `[data-node-id="${childId}"]`,
    ) as HTMLElement | null;
    if (!pEl || !cEl) return null;

    const pRect = pEl.getBoundingClientRect();
    const cRect = cEl.getBoundingClientRect();

    const x1 = pRect.left + pRect.width / 2 - containerRect.left;
    const y1 = pRect.bottom - containerRect.top;
    const x2 = cRect.left + cRect.width / 2 - containerRect.left;
    const y2 = cRect.top - containerRect.top;

    const midY = (y1 + y2) / 2;
    return `<path d="M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>`;
  }

  render() {
    if (!this.isVisible) return html``;

    const tree = getTechTree(this.selectedStructure);
    const l1 = tree.filter((n) => n.layer === 1);
    const l2 = tree.filter((n) => n.layer === 2);
    const l3 = tree.filter((n) => n.layer === 3);

    return html`
      <div
        class="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-[2px] tech-tree-backdrop"
        @click=${this.handleBackdropClick}
      >
        <div
          class="bg-gray-900/80 border border-white/10 rounded-2xl p-5 w-[95vw] max-w-[1200px] max-h-[92vh] shadow-2xl flex flex-col overflow-y-auto tech-tree-scroll"
          @click=${(e: MouseEvent) => e.stopPropagation()}
        >
          <!-- Header row: title + research widget -->
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div class="flex items-center gap-2">
              <img src=${ICON_MAP[this.selectedStructure]} alt="" class="size-7" />
              <h2 class="text-lg font-bold text-white uppercase tracking-widest">
                ${translateText("tech_tree.title")}
              </h2>
            </div>
            <div class="flex items-center gap-1.5">
              <img src=${labIcon} width="16" height="16" class="shrink-0" />
              <span class="text-cyan-300 font-bold tabular-nums text-base">${renderNumber(this.research)}</span>
            </div>
          </div>

          <!-- Structure selector — big game icons -->
          <div class="flex gap-3 overflow-x-auto pb-3 mb-3 shrink-0 border-b border-white/10 items-center min-h-[52px]">
            ${STRUCTURE_SLUGS.map(
              (slug) => html`
                <button
                  class="flex items-center justify-center p-2 rounded-xl transition-colors ${
                    this.selectedStructure === slug
                      ? "bg-malibu-blue/20 border-2 border-malibu-blue/50"
                      : "bg-gray-800 border-2 border-transparent hover:bg-gray-700"
                  }"
                  title=${translateText(`structures.${slug}`)}
                  @click=${() => this.selectStructure(slug)}
                >
                  <img src=${ICON_MAP[slug]} alt="" class="size-7" />
                </button>
              `,
            )}
          </div>

          <!-- Tree area (relative container for SVG connectors) -->
          <div class="tech-tree-area relative grow py-6">
            <svg class="connector-svg absolute inset-0 w-full h-full pointer-events-none z-0"></svg>

            <!-- Layer 1: 1 node -->
            <div class="flex justify-center mb-14 relative z-10">
              <div class="w-full max-w-[220px]" data-node-id=${l1[0]?.id ?? ""}>
                ${l1.map((n) => this.renderNode(n))}
              </div>
            </div>

            <!-- Layer 2: 2 nodes -->
            <div class="flex justify-center gap-10 mb-14 relative z-10">
              ${l2.map(
                (n) => html`
                  <div class="flex-1 max-w-[200px]" data-node-id=${n.id}>
                    ${this.renderNode(n)}
                  </div>
                `,
              )}
            </div>

            <!-- Layer 3: 4 nodes -->
            <div class="flex justify-center gap-4 relative z-10">
              ${l3.map(
                (n) => html`
                  <div class="flex-1 max-w-[180px]" data-node-id=${n.id}>
                    ${this.renderNode(n)}
                  </div>
                `,
              )}
            </div>
          </div>

          <!-- Selected node description card -->
          ${this.renderDescriptionCard(tree)}

          <!-- Close -->
          <div class="flex justify-center mt-3 shrink-0">
            <button
              class="px-5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors border border-white/10"
              @click=${this.close}
            >
              ${translateText("common.close")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderDescriptionCard(tree: TechNode[]) {
    if (!this.selectedNodeId) return html``;

    const node = tree.find((n) => n.id === this.selectedNodeId);
    if (!node) return html``;

    const state = this.nodeState(node);
    const isPurchased = state === "purchased";
    const isLocked = state === "locked";
    const canInteract = !isPurchased && !isLocked && state !== "unaffordable";

    return html`
      <div
        class="mt-3 border border-white/10 rounded-xl bg-gray-800/60 p-4 flex items-start gap-4 shrink-0"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-bold text-white uppercase tracking-wider">
              ${translateText(node.nameKey)}
            </span>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">
            ${translateText(node.descKey)}
          </p>
          <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span class="font-bold">${translateText("tech_tree.cost")}: ${node.cost.toLocaleString()}</span>
            ${isPurchased
              ? html`<span class="text-green-400 font-bold">&#10003;</span>`
              : isLocked
                ? html`<span class="text-red-400 font-bold">&#128274;</span>`
                : ""}
          </div>
        </div>
        ${!isPurchased && canInteract
          ? html`
              <button
                class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors shrink-0"
                @click=${(e: MouseEvent) => {
                  e.stopPropagation();
                  this.eventBus?.emit(new SendPurchaseTechIntentEvent(node.id));
                  this.pendingTechs.add(node.id);
                  this.selectedNodeId = null;
                  this.requestUpdate();
                }}
              >
                Purchase
              </button>
            `
          : ""}
      </div>
    `;
  }

  private renderNode(node: TechNode) {
    const state = this.nodeState(node);
    const isPurchased = state === "purchased";
    const canInteract = state !== "locked" && state !== "unaffordable";

    let borderCls = "border-white/10 bg-gray-800/90";
    if (state === "purchased")
      borderCls = "border-green-400/60 bg-green-500/15";
    else if (state === "selected")
      borderCls = "border-amber-400 bg-amber-500/15";

    const cursorCls =
      isPurchased || !canInteract ? "cursor-not-allowed" : "cursor-pointer";

    return html`
      <div
        class="rounded-lg border ${borderCls} ${cursorCls} p-3 flex flex-col gap-1.5 transition-colors duration-150 text-center ${
          !isPurchased && canInteract ? "hover:border-white/30" : ""
        }"
        @click=${(e: MouseEvent) =>
          this.handleNodeClick(e, node, isPurchased, canInteract)}
      >
        <div class="flex items-center justify-center gap-1">
          <span
            class="text-xs font-bold text-white uppercase tracking-wider leading-tight"
          >
            ${translateText(node.nameKey)}
          </span>
          ${isPurchased
            ? html`<span class="text-green-400 text-xs font-bold shrink-0"
                >✓</span
              >`
            : ""}
        </div>
        <div
          class="flex items-center justify-center gap-1 pt-1 border-t border-white/10"
        >
          <span
            class="text-[10px] font-bold ${state === "unaffordable"
              ? "text-red-400"
              : "text-cyan-300"}"
          >
            ${node.cost.toLocaleString()}
          </span>
          ${state === "locked"
            ? html`<span class="text-[10px] text-gray-500">🔒</span>`
            : ""}
        </div>
      </div>
    `;
  }
}
