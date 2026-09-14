export type ResourceItem = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  clearance: "PUBLIC" | "LIMITED" | "RESTRICTED";
  link: string;
};

// Resources depot (curated subset)
export const RESOURCES: ResourceItem[] = [
  {
    id: "r-01",
    type: "UI KIT",
    title: "Panel Token Sheet",
    summary: "Cut-corner / stroke / glow token references for dense UIs.",
    tags: ["Tokens", "UI"],
    clearance: "PUBLIC",
    link: "#",
  },
];
