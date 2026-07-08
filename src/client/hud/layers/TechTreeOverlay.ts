import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { translateText } from "../../Utils";

export interface TechNode {
  id: string;
  nameKey: string;
  descKey: string;
  cost: number;
  prerequisites: string[];
}

/**
 * Placeholder tech tree data — will be moved to a shared config later.
 */
const TECH_TREE: TechNode[] = [
  {
    id: "efficiency",
    nameKey: "tech_tree.efficiency",
    descKey: "tech_tree.efficiency_desc",
    cost: 500_000,
    prerequisites: [],
  },
  {
    id: "logistics",
    nameKey: "tech_tree.logistics",
    descKey: "tech_tree.logistics_desc",
    cost: 1_000_000,
    prerequisites: ["efficiency"],
  },
  {
    id: "warfare",
    nameKey: "tech_tree.warfare",
    descKey: "tech_tree.warfare_desc",
    cost: 2_000_000,
    prerequisites: [],
  },
];

@customElement("tech-tree-overlay")
export class TechTreeOverlay extends LitElement {
  @state() private isVisible = false;

  constructor() {
    super();
    console.log("[TechTreeOverlay] constructed, custom element registered");
  }

  createRenderRoot() {
    return this;
  }

  toggle() {
    console.log("[TechTreeOverlay] toggle called, current state:", this.isVisible);
    this.isVisible = !this.isVisible;
    this.requestUpdate();
  }

  private close() {
    this.isVisible = false;
    this.requestUpdate();
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.currentTarget === e.target) {
      this.close();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleKeyDown);
    super.disconnectedCallback();
  }

  render() {
    if (!this.isVisible) return html``;

    return html`
      <div
        class="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click=${this.handleBackdropClick}
      >
        <div
          class="bg-gray-900/95 border border-white/10 rounded-2xl p-8 max-w-3xl w-[90vw] max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          <h2
            class="text-2xl font-bold text-white uppercase tracking-widest mb-6 text-center"
          >
            ${translateText("tech_tree.title")}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${TECH_TREE.map(
              (node) => html`
                <div
                  class="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3"
                >
                  <div class="flex items-center justify-between">
                    <span
                      class="text-sm font-bold text-white uppercase tracking-wider"
                    >
                      ${translateText(node.nameKey)}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 leading-relaxed">
                    ${translateText(node.descKey)}
                  </p>
                  <div
                    class="mt-auto flex items-center justify-between pt-3 border-t border-white/10"
                  >
                    <span class="text-xs text-cyan-300 font-bold">
                      ${translateText("tech_tree.cost")}:
                      ${node.cost.toLocaleString()}
                    </span>
                    <span class="text-xs text-gray-500">
                      ${node.prerequisites.length > 0
                        ? node.prerequisites
                            .map((p) => translateText(`tech_tree.${p}`))
                            .join(", ")
                        : translateText("tech_tree.no_prereq")}
                    </span>
                  </div>
                </div>
              `,
            )}
          </div>
          <div class="flex justify-center mt-6">
            <button
              class="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition-colors border border-white/10"
              @click=${this.close}
            >
              ${translateText("common.close")}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
