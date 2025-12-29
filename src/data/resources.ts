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
  {
    id: "r-02",
    type: "DOC",
    title: "Interaction Recipes",
    summary: "Hover sweep / tick flash / route transitions: recipes & rationale.",
    tags: ["Motion", "Frontend"],
    clearance: "PUBLIC",
    link: "#",
  },
  {
    id: "r-03",
    type: "LINK",
    title: "Reading List",
    summary: "Typography, dense layout, information design бк long-term refs.",
    tags: ["Research"],
    clearance: "LIMITED",
    link: "#",
  },
  {
    id: "r-04",
    type: "TOOL",
    title: "Project Templates",
    summary: "Starter kits for portfolio/blog/resource sites.",
    tags: ["Dev", "Ops"],
    clearance: "PUBLIC",
    link: "#",
  },
  {
    id: "r-05",
    type: "ASSET",
    title: "Icon/Mark Set",
    summary: "Minimal HUD marks, divider lines, stamps, and micro-labels.",
    tags: ["Design"],
    clearance: "RESTRICTED",
    link: "#",
  },
];
