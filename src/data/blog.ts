export const BLOG_TAGS = ["UI", "Frontend", "Product", "Research", "Notes"] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export type Post = {
  id: string;
  title: string;
  date: string;
  tag: BlogTag;
  summary: string;
  link: string;
};

export const POSTS: Post[] = [
  {
    id: "b-01",
    title: "Designing Dense Interfaces Without Losing Calm",
    date: "2024-05-18",
    tag: "UI",
    summary: "Hierarchy rules for panel-heavy dashboards and game-inspired layouts.",
    link: "https://example.com/blog/1",
  },
  {
    id: "b-02",
    title: "State Machines for Real Products",
    date: "2024-02-03",
    tag: "Frontend",
    summary: "Predictable flows for multi-step apps with minimal coupling.",
    link: "https://example.com/blog/2",
  },
  {
    id: "b-03",
    title: "Mini Program Performance Checklist",
    date: "2023-11-21",
    tag: "Notes",
    summary: "Small changes that reliably improve first-load and interaction latency.",
    link: "https://example.com/blog/3",
  },
];
