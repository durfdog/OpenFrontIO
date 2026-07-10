export interface TechNode {
  id: string;
  nameKey: string;
  descKey: string;
  cost: number;
  /** 1-indexed layer. Layer 1 has 1 node, layer 2 has 2, layer 3 has 4. */
  layer: 1 | 2 | 3;
  /** Tech IDs that must be purchased before this one (the parent node). */
  prerequisites: string[];
  /** Tech IDs that are mutually exclusive with this one (siblings on the same branch). */
  mutuallyExclusiveWith: string[];
}

/**
 * Each structure has a 3-layer binary tech tree:
 *
 *   Layer 1: 1 root node
 *   Layer 2: 2 children (mutually exclusive with each other)
 *   Layer 3: each L2 node spawns 2 children = 4 total
 *
 * Total per structure: 7 nodes. Siblings at each fork are mutually exclusive.
 */
export const TECH_TREES: Record<string, TechNode[]> = {
  city: [
    { id: "city_development", nameKey: "tech_tree.city.development", descKey: "tech_tree.city.development_desc", cost: 150_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "city_militarization", nameKey: "tech_tree.city.militarization", descKey: "tech_tree.city.militarization_desc", cost: 400_000, layer: 2, prerequisites: ["city_development"], mutuallyExclusiveWith: ["city_urbanization"] },
    { id: "city_urbanization", nameKey: "tech_tree.city.urbanization", descKey: "tech_tree.city.urbanization_desc", cost: 400_000, layer: 2, prerequisites: ["city_development"], mutuallyExclusiveWith: ["city_militarization"] },
    { id: "city_fortifications", nameKey: "tech_tree.city.fortifications", descKey: "tech_tree.city.fortifications_desc", cost: 1_200_000, layer: 3, prerequisites: ["city_militarization"], mutuallyExclusiveWith: ["city_conscription"] },
    { id: "city_conscription", nameKey: "tech_tree.city.conscription", descKey: "tech_tree.city.conscription_desc", cost: 1_200_000, layer: 3, prerequisites: ["city_militarization"], mutuallyExclusiveWith: ["city_fortifications"] },
    { id: "city_trade_hub", nameKey: "tech_tree.city.trade_hub", descKey: "tech_tree.city.trade_hub_desc", cost: 1_200_000, layer: 3, prerequisites: ["city_urbanization"], mutuallyExclusiveWith: ["city_census"] },
    { id: "city_census", nameKey: "tech_tree.city.census", descKey: "tech_tree.city.census_desc", cost: 1_200_000, layer: 3, prerequisites: ["city_urbanization"], mutuallyExclusiveWith: ["city_trade_hub"] },
  ],
  factory: [
    { id: "factory_development", nameKey: "tech_tree.factory.development", descKey: "tech_tree.factory.development_desc", cost: 200_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "factory_mass_production", nameKey: "tech_tree.factory.mass_production", descKey: "tech_tree.factory.mass_production_desc", cost: 600_000, layer: 2, prerequisites: ["factory_development"], mutuallyExclusiveWith: ["factory_tooling"] },
    { id: "factory_tooling", nameKey: "tech_tree.factory.tooling", descKey: "tech_tree.factory.tooling_desc", cost: 600_000, layer: 2, prerequisites: ["factory_development"], mutuallyExclusiveWith: ["factory_mass_production"] },
    { id: "factory_assembly_line", nameKey: "tech_tree.factory.assembly_line", descKey: "tech_tree.factory.assembly_line_desc", cost: 1_500_000, layer: 3, prerequisites: ["factory_mass_production"], mutuallyExclusiveWith: ["factory_quality_control"] },
    { id: "factory_quality_control", nameKey: "tech_tree.factory.quality_control", descKey: "tech_tree.factory.quality_control_desc", cost: 1_500_000, layer: 3, prerequisites: ["factory_mass_production"], mutuallyExclusiveWith: ["factory_assembly_line"] },
    { id: "factory_prototyping", nameKey: "tech_tree.factory.prototyping", descKey: "tech_tree.factory.prototyping_desc", cost: 1_500_000, layer: 3, prerequisites: ["factory_tooling"], mutuallyExclusiveWith: ["fortified_factories"] },
    { id: "fortified_factories", nameKey: "tech_tree.factory.fortified_factories", descKey: "tech_tree.factory.fortified_factories_desc", cost: 1_500_000, layer: 3, prerequisites: ["factory_tooling"], mutuallyExclusiveWith: ["factory_prototyping"] },
  ],
  port: [
    { id: "port_development", nameKey: "tech_tree.port.development", descKey: "tech_tree.port.development_desc", cost: 200_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "port_navigation", nameKey: "tech_tree.port.navigation", descKey: "tech_tree.port.navigation_desc", cost: 600_000, layer: 2, prerequisites: ["port_development"], mutuallyExclusiveWith: ["port_shipbuilding"] },
    { id: "port_shipbuilding", nameKey: "tech_tree.port.shipbuilding", descKey: "tech_tree.port.shipbuilding_desc", cost: 600_000, layer: 2, prerequisites: ["port_development"], mutuallyExclusiveWith: ["port_navigation"] },
    { id: "port_convoy", nameKey: "tech_tree.port.convoy", descKey: "tech_tree.port.convoy_desc", cost: 1_500_000, layer: 3, prerequisites: ["port_navigation"], mutuallyExclusiveWith: ["port_logistics"] },
    { id: "port_logistics", nameKey: "tech_tree.port.logistics", descKey: "tech_tree.port.logistics_desc", cost: 1_500_000, layer: 3, prerequisites: ["port_navigation"], mutuallyExclusiveWith: ["port_convoy"] },
    { id: "port_dry_dock", nameKey: "tech_tree.port.dry_dock", descKey: "tech_tree.port.dry_dock_desc", cost: 1_500_000, layer: 3, prerequisites: ["port_shipbuilding"], mutuallyExclusiveWith: ["port_turret"] },
    { id: "port_turret", nameKey: "tech_tree.port.turret", descKey: "tech_tree.port.turret_desc", cost: 4_000_000, layer: 3, prerequisites: ["port_shipbuilding"], mutuallyExclusiveWith: ["port_dry_dock"] },
  ],
  defensepost: [
    { id: "defense_development", nameKey: "tech_tree.defense.development", descKey: "tech_tree.defense.development_desc", cost: 100_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "defense_reinforcements", nameKey: "tech_tree.defense.reinforcements", descKey: "tech_tree.defense.reinforcements_desc", cost: 300_000, layer: 2, prerequisites: ["defense_development"], mutuallyExclusiveWith: ["defense_watchtower"] },
    { id: "defense_watchtower", nameKey: "tech_tree.defense.watchtower", descKey: "tech_tree.defense.watchtower_desc", cost: 300_000, layer: 2, prerequisites: ["defense_development"], mutuallyExclusiveWith: ["defense_reinforcements"] },
    { id: "defense_bunker", nameKey: "tech_tree.defense.bunker", descKey: "tech_tree.defense.bunker_desc", cost: 800_000, layer: 3, prerequisites: ["defense_reinforcements"], mutuallyExclusiveWith: ["defense_militia"] },
    { id: "defense_militia", nameKey: "tech_tree.defense.militia", descKey: "tech_tree.defense.militia_desc", cost: 800_000, layer: 3, prerequisites: ["defense_reinforcements"], mutuallyExclusiveWith: ["defense_bunker"] },
    { id: "defense_radar", nameKey: "tech_tree.defense.radar", descKey: "tech_tree.defense.radar_desc", cost: 800_000, layer: 3, prerequisites: ["defense_watchtower"], mutuallyExclusiveWith: ["defense_flare"] },
    { id: "defense_flare", nameKey: "tech_tree.defense.flare", descKey: "tech_tree.defense.flare_desc", cost: 800_000, layer: 3, prerequisites: ["defense_watchtower"], mutuallyExclusiveWith: ["defense_radar"] },
  ],
  missilesilo: [
    { id: "silo_development", nameKey: "tech_tree.silo.development", descKey: "tech_tree.silo.development_desc", cost: 300_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "silo_propulsion", nameKey: "tech_tree.silo.propulsion", descKey: "tech_tree.silo.propulsion_desc", cost: 800_000, layer: 2, prerequisites: ["silo_development"], mutuallyExclusiveWith: ["silo_warhead"] },
    { id: "silo_warhead", nameKey: "tech_tree.silo.warhead", descKey: "tech_tree.silo.warhead_desc", cost: 800_000, layer: 2, prerequisites: ["silo_development"], mutuallyExclusiveWith: ["silo_propulsion"] },
    { id: "silo_efficiency", nameKey: "tech_tree.silo.efficiency", descKey: "tech_tree.silo.efficiency_desc", cost: 2_000_000, layer: 3, prerequisites: ["silo_propulsion"], mutuallyExclusiveWith: ["silo_guidance"] },
    { id: "silo_guidance", nameKey: "tech_tree.silo.guidance", descKey: "tech_tree.silo.guidance_desc", cost: 2_000_000, layer: 3, prerequisites: ["silo_propulsion"], mutuallyExclusiveWith: ["silo_efficiency"] },
    { id: "silo_payload", nameKey: "tech_tree.silo.payload", descKey: "tech_tree.silo.payload_desc", cost: 2_000_000, layer: 3, prerequisites: ["silo_warhead"], mutuallyExclusiveWith: ["silo_fusing"] },
    { id: "silo_fusing", nameKey: "tech_tree.silo.fusing", descKey: "tech_tree.silo.fusing_desc", cost: 2_000_000, layer: 3, prerequisites: ["silo_warhead"], mutuallyExclusiveWith: ["silo_payload"] },
  ],
  samlauncher: [
    { id: "sam_development", nameKey: "tech_tree.sam.development", descKey: "tech_tree.sam.development_desc", cost: 200_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "sam_tracking", nameKey: "tech_tree.sam.tracking", descKey: "tech_tree.sam.tracking_desc", cost: 600_000, layer: 2, prerequisites: ["sam_development"], mutuallyExclusiveWith: ["sam_payload"] },
    { id: "sam_payload", nameKey: "tech_tree.sam.payload", descKey: "tech_tree.sam.payload_desc", cost: 600_000, layer: 2, prerequisites: ["sam_development"], mutuallyExclusiveWith: ["sam_tracking"] },
    { id: "sam_radar_net", nameKey: "tech_tree.sam.radar_net", descKey: "tech_tree.sam.radar_net_desc", cost: 1_500_000, layer: 3, prerequisites: ["sam_tracking"], mutuallyExclusiveWith: ["sam_early_warning"] },
    { id: "sam_early_warning", nameKey: "tech_tree.sam.early_warning", descKey: "tech_tree.sam.early_warning_desc", cost: 1_500_000, layer: 3, prerequisites: ["sam_tracking"], mutuallyExclusiveWith: ["sam_radar_net"] },
    { id: "sam_autoloader", nameKey: "tech_tree.sam.autoloader", descKey: "tech_tree.sam.autoloader_desc", cost: 1_500_000, layer: 3, prerequisites: ["sam_payload"], mutuallyExclusiveWith: ["sam_fragmentation"] },
    { id: "sam_fragmentation", nameKey: "tech_tree.sam.fragmentation", descKey: "tech_tree.sam.fragmentation_desc", cost: 1_500_000, layer: 3, prerequisites: ["sam_payload"], mutuallyExclusiveWith: ["sam_autoloader"] },
  ],
  lab: [
    { id: "lab_development", nameKey: "tech_tree.lab.development", descKey: "tech_tree.lab.development_desc", cost: 250_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "lab_collaboration", nameKey: "tech_tree.lab.collaboration", descKey: "tech_tree.lab.collaboration_desc", cost: 750_000, layer: 2, prerequisites: ["lab_development"], mutuallyExclusiveWith: ["lab_specialization"] },
    { id: "lab_specialization", nameKey: "tech_tree.lab.specialization", descKey: "tech_tree.lab.specialization_desc", cost: 750_000, layer: 2, prerequisites: ["lab_development"], mutuallyExclusiveWith: ["lab_collaboration"] },
    { id: "lab_peer_review", nameKey: "tech_tree.lab.peer_review", descKey: "tech_tree.lab.peer_review_desc", cost: 2_000_000, layer: 3, prerequisites: ["lab_collaboration"], mutuallyExclusiveWith: ["lab_funding"] },
    { id: "lab_funding", nameKey: "tech_tree.lab.funding", descKey: "tech_tree.lab.funding_desc", cost: 2_000_000, layer: 3, prerequisites: ["lab_collaboration"], mutuallyExclusiveWith: ["lab_peer_review"] },
    { id: "lab_breakthrough", nameKey: "tech_tree.lab.breakthrough", descKey: "tech_tree.lab.breakthrough_desc", cost: 2_000_000, layer: 3, prerequisites: ["lab_specialization"], mutuallyExclusiveWith: ["lab_applied"] },
    { id: "lab_applied", nameKey: "tech_tree.lab.applied", descKey: "tech_tree.lab.applied_desc", cost: 2_000_000, layer: 3, prerequisites: ["lab_specialization"], mutuallyExclusiveWith: ["lab_breakthrough"] },
  ],
  warship: [
    { id: "warship_development", nameKey: "tech_tree.warship.development", descKey: "tech_tree.warship.development_desc", cost: 300_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "warship_armor", nameKey: "tech_tree.warship.armor", descKey: "tech_tree.warship.armor_desc", cost: 800_000, layer: 2, prerequisites: ["warship_development"], mutuallyExclusiveWith: ["warship_cannons"] },
    { id: "warship_cannons", nameKey: "tech_tree.warship.cannons", descKey: "tech_tree.warship.cannons_desc", cost: 800_000, layer: 2, prerequisites: ["warship_development"], mutuallyExclusiveWith: ["warship_armor"] },
    { id: "warship_speed", nameKey: "tech_tree.warship.speed", descKey: "tech_tree.warship.speed_desc", cost: 2_000_000, layer: 3, prerequisites: ["warship_armor"], mutuallyExclusiveWith: ["warship_plating"] },
    { id: "warship_plating", nameKey: "tech_tree.warship.plating", descKey: "tech_tree.warship.plating_desc", cost: 2_000_000, layer: 3, prerequisites: ["warship_armor"], mutuallyExclusiveWith: ["warship_speed"] },
    { id: "warship_fleet", nameKey: "tech_tree.warship.fleet", descKey: "tech_tree.warship.fleet_desc", cost: 2_000_000, layer: 3, prerequisites: ["warship_cannons"], mutuallyExclusiveWith: ["warship_bombardment"] },
    { id: "warship_bombardment", nameKey: "tech_tree.warship.bombardment", descKey: "tech_tree.warship.bombardment_desc", cost: 2_000_000, layer: 3, prerequisites: ["warship_cannons"], mutuallyExclusiveWith: ["warship_fleet"] },
  ],
  atombomb: [
    { id: "atombomb_development", nameKey: "tech_tree.atombomb.development", descKey: "tech_tree.atombomb.development_desc", cost: 500_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "atombomb_miniaturization", nameKey: "tech_tree.atombomb.miniaturization", descKey: "tech_tree.atombomb.miniaturization_desc", cost: 1_200_000, layer: 2, prerequisites: ["atombomb_development"], mutuallyExclusiveWith: ["atombomb_enrichment"] },
    { id: "atombomb_enrichment", nameKey: "tech_tree.atombomb.enrichment", descKey: "tech_tree.atombomb.enrichment_desc", cost: 1_200_000, layer: 2, prerequisites: ["atombomb_development"], mutuallyExclusiveWith: ["atombomb_miniaturization"] },
    { id: "atombomb_production_line", nameKey: "tech_tree.atombomb.production_line", descKey: "tech_tree.atombomb.production_line_desc", cost: 3_000_000, layer: 3, prerequisites: ["atombomb_miniaturization"], mutuallyExclusiveWith: ["atombomb_safety"] },
    { id: "atombomb_safety", nameKey: "tech_tree.atombomb.safety", descKey: "tech_tree.atombomb.safety_desc", cost: 3_000_000, layer: 3, prerequisites: ["atombomb_miniaturization"], mutuallyExclusiveWith: ["atombomb_production_line"] },
    { id: "atombomb_stealth", nameKey: "tech_tree.atombomb.stealth", descKey: "tech_tree.atombomb.stealth_desc", cost: 3_000_000, layer: 3, prerequisites: ["atombomb_enrichment"], mutuallyExclusiveWith: ["atombomb_delivery"] },
    { id: "atombomb_delivery", nameKey: "tech_tree.atombomb.delivery", descKey: "tech_tree.atombomb.delivery_desc", cost: 3_000_000, layer: 3, prerequisites: ["atombomb_enrichment"], mutuallyExclusiveWith: ["atombomb_stealth"] },
  ],
  hydrogenbomb: [
    { id: "hbomb_development", nameKey: "tech_tree.hbomb.development", descKey: "tech_tree.hbomb.development_desc", cost: 1_000_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "hbomb_thermonuclear", nameKey: "tech_tree.hbomb.thermonuclear", descKey: "tech_tree.hbomb.thermonuclear_desc", cost: 2_500_000, layer: 2, prerequisites: ["hbomb_development"], mutuallyExclusiveWith: ["hbomb_casing"] },
    { id: "hbomb_casing", nameKey: "tech_tree.hbomb.casing", descKey: "tech_tree.hbomb.casing_desc", cost: 2_500_000, layer: 2, prerequisites: ["hbomb_development"], mutuallyExclusiveWith: ["hbomb_thermonuclear"] },
    { id: "hbomb_emp", nameKey: "tech_tree.hbomb.emp", descKey: "tech_tree.hbomb.emp_desc", cost: 6_000_000, layer: 3, prerequisites: ["hbomb_thermonuclear"], mutuallyExclusiveWith: ["hbomb_yield"] },
    { id: "hbomb_yield", nameKey: "tech_tree.hbomb.yield", descKey: "tech_tree.hbomb.yield_desc", cost: 6_000_000, layer: 3, prerequisites: ["hbomb_thermonuclear"], mutuallyExclusiveWith: ["hbomb_emp"] },
    { id: "hbomb_precision", nameKey: "tech_tree.hbomb.precision", descKey: "tech_tree.hbomb.precision_desc", cost: 6_000_000, layer: 3, prerequisites: ["hbomb_casing"], mutuallyExclusiveWith: ["hbomb_delivery_vehicle"] },
    { id: "hbomb_delivery_vehicle", nameKey: "tech_tree.hbomb.delivery_vehicle", descKey: "tech_tree.hbomb.delivery_vehicle_desc", cost: 6_000_000, layer: 3, prerequisites: ["hbomb_casing"], mutuallyExclusiveWith: ["hbomb_precision"] },
  ],
  mirv: [
    { id: "mirv_development", nameKey: "tech_tree.mirv.development", descKey: "tech_tree.mirv.development_desc", cost: 1_500_000, layer: 1, prerequisites: [], mutuallyExclusiveWith: [] },
    { id: "mirv_reentry", nameKey: "tech_tree.mirv.reentry", descKey: "tech_tree.mirv.reentry_desc", cost: 3_500_000, layer: 2, prerequisites: ["mirv_development"], mutuallyExclusiveWith: ["mirv_decoys"] },
    { id: "mirv_decoys", nameKey: "tech_tree.mirv.decoys", descKey: "tech_tree.mirv.decoys_desc", cost: 3_500_000, layer: 2, prerequisites: ["mirv_development"], mutuallyExclusiveWith: ["mirv_reentry"] },
    { id: "mirv_warhead_count", nameKey: "tech_tree.mirv.warhead_count", descKey: "tech_tree.mirv.warhead_count_desc", cost: 8_000_000, layer: 3, prerequisites: ["mirv_reentry"], mutuallyExclusiveWith: ["mirv_maneuver"] },
    { id: "mirv_maneuver", nameKey: "tech_tree.mirv.maneuver", descKey: "tech_tree.mirv.maneuver_desc", cost: 8_000_000, layer: 3, prerequisites: ["mirv_reentry"], mutuallyExclusiveWith: ["mirv_warhead_count"] },
    { id: "mirv_stealth", nameKey: "tech_tree.mirv.stealth", descKey: "tech_tree.mirv.stealth_desc", cost: 8_000_000, layer: 3, prerequisites: ["mirv_decoys"], mutuallyExclusiveWith: ["mirv_penaid"] },
    { id: "mirv_penaid", nameKey: "tech_tree.mirv.penaid", descKey: "tech_tree.mirv.penaid_desc", cost: 8_000_000, layer: 3, prerequisites: ["mirv_decoys"], mutuallyExclusiveWith: ["mirv_stealth"] },
  ],
};

export function getTechTree(structureType: string): TechNode[] {
  return TECH_TREES[structureType] ?? [];
}

export function getTechNode(techId: string): TechNode | undefined {
  for (const tree of Object.values(TECH_TREES)) {
    const node = tree.find((n) => n.id === techId);
    if (node) return node;
  }
  return undefined;
}

/** Returns the tech-tree key (e.g. "city", "factory") that a node belongs to. */
export function getTechTreeKey(techId: string): string | undefined {
  for (const [key, tree] of Object.entries(TECH_TREES)) {
    if (tree.some((n) => n.id === techId)) return key;
  }
  return undefined;
}
