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
    id: "b-00",
    title: "斜率优化",
    date: "2026-05-12",
    tag: "Notes",
    summary: "DP 斜率优化的几何映射、双单调条件、单调队列维护与 C++ 模板。",
    link: "/posts/slope-optimization/",
  },
];
