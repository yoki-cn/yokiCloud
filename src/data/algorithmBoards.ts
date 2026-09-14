import { numberedAlgorithmTitle, sectionFromAlgorithmSlug, validateAlgorithmFrontmatter } from "./algorithmFrontmatter";
import type { AlgorithmBoardSummary } from "../pages/_AlgorithmArchive";

// Build-time metadata only; Markdown bodies are never sent to the homepage.
const modules = import.meta.glob<{ frontmatter?: Record<string, unknown> }>("../content/algorithms/**/*.md", { eager: true });
export const algorithmBoards: AlgorithmBoardSummary[] = Object.entries(modules).map(([path, module]) => {
  const slug = path.replace(/^\.\.\/content\/algorithms\//, "").replace(/\.md$/, "");
  const data = validateAlgorithmFrontmatter(module.frontmatter, slug);
  return { slug, title: numberedAlgorithmTitle(data.title, slug), section: sectionFromAlgorithmSlug(slug), status: data.status,
    updated: data.updated, tags: data.tags, order: data.order,
    href: `/algorithms/${slug.split("/").map(encodeURIComponent).join("/")}/`, markdownUrl: `/algorithms/${slug.split("/").map(encodeURIComponent).join("/")}.md` };
}).sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "zh-CN"));
