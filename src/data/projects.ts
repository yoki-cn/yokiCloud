export type ProjectType = {
  key: string;
  label: string;
};

export type ProjectLinks = {
  demo: string;
  repo: string;
  case: string;
};

export type Project = {
  id: string;
  type: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  status: string;
  stack: string[];
  highlights: string[];
  links: ProjectLinks;
};

export const PROJECT_TYPES: ProjectType[] = [
  { key: "all", label: "ALL" },
  { key: "web", label: "WEB" },
  { key: "app", label: "APP" },
  { key: "mini", label: "MINI" },
  { key: "design", label: "DESIGN" },
  { key: "research", label: "RESEARCH" },
];

export const PROJECTS: Project[] = [
  {
    id: "p-01",
    type: "web",
    title: "Operations Dashboard",
    tagline: "Modular analytics console for multi-role workflows.",
    year: "2024",
    role: "Product + Frontend",
    status: "DEPLOYED",
    stack: ["React", "TypeScript", "Tailwind", "ECharts"],
    highlights: [
      "Token-based permission matrix",
      "Real-time alert pipeline",
      "Table virtualization under load",
    ],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/",
      case: "https://example.com/case-study",
    },
  },
  {
    id: "p-02",
    type: "app",
    title: "Field Notes",
    tagline: "Offline-first mobile notes with structured tags.",
    year: "2023",
    role: "UX + Engineering",
    status: "BETA",
    stack: ["Flutter", "SQLite", "Sync"],
    highlights: [
      "Conflict-aware sync strategy",
      "Template-driven rapid capture",
      "Accessibility-first typography",
    ],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/",
      case: "",
    },
  },
  {
    id: "p-03",
    type: "mini",
    title: "Campus Helper",
    tagline: "Mini program for schedules, maps, and event check-ins.",
    year: "2022",
    role: "Frontend Lead",
    status: "MAINTAINED",
    stack: ["Taro", "WeChat", "Cloud Functions"],
    highlights: [
      "Map + queue visualization",
      "Multi-tenant admin portal",
      "Performance budget under 1.2s TTI",
    ],
    links: {
      demo: "https://example.com",
      repo: "",
      case: "",
    },
  },
  {
    id: "p-04",
    type: "design",
    title: "UI System: Vector Panels",
    tagline: "Cut-corner component kit with token layers.",
    year: "2024",
    role: "Design System",
    status: "LIBRARY",
    stack: ["Figma", "Tokens", "Storybook"],
    highlights: [
      "Semantic token layering",
      "Dark-mode-first contrast rules",
      "Reusable alert/action patterns",
    ],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/",
      case: "",
    },
  },
  {
    id: "p-05",
    type: "research",
    title: "Readable Density Study",
    tagline: "High-information layouts on small screens.",
    year: "2023",
    role: "Research",
    status: "PUBLISHED",
    stack: ["User Study", "A/B", "Eye Tracking"],
    highlights: [
      "Measured scanning patterns",
      "Derived spacing heuristics",
      "Open-sourced test scripts",
    ],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/",
      case: "https://example.com/paper",
    },
  },
];
