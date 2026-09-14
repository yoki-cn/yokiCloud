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
    id: "p-04",
    type: "design",
    title: "Yoki Cloud UI Kit",
    tagline: "本站使用的终端档案式组件库。",
    year: "2024",
    role: "Design System",
    status: "LIBRARY",
    stack: ["Astro", "React", "Tailwind", "Tokens"],
    highlights: [
      "深浅主题 token",
      "切角面板与 HUD 标签",
      "列表、空态和动作按钮规范",
    ],
    links: {
      demo: "/ui-kit/",
      repo: "https://github.com/",
      case: "",
    },
  },
];
