import { ALGORITHM_STATUS_ORDER, type AlgorithmStatus } from "./algorithmStatus";
import { formatDateOnly } from "../utils/formatDate";

export type AlgorithmFrontmatter = {
  kind: "algorithm";
  title: string;
  updated: string;
  status: AlgorithmStatus;
  order: number;
  tags: string[];
};

export function validateAlgorithmFrontmatter(
  value: Record<string, unknown> | undefined,
  source = "算法板子",
): AlgorithmFrontmatter {
  const frontmatter = value ?? {};
  const issues: string[] = [];

  if (frontmatter.kind !== "algorithm") issues.push("kind: algorithm");
  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) issues.push("title");
  if (typeof frontmatter.updated !== "string" || !frontmatter.updated.trim()) issues.push("updated");
  if (
    typeof frontmatter.status !== "string" ||
    !ALGORITHM_STATUS_ORDER.includes(frontmatter.status as AlgorithmStatus)
  ) issues.push("status");
  if (typeof frontmatter.order !== "number" || !Number.isFinite(frontmatter.order)) issues.push("order（数字）");
  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.some((tag) => typeof tag !== "string")) {
    issues.push("tags（字符串数组）");
  }

  if (issues.length) {
    throw new Error(`${source} 缺少或错误的 YAML 字段：${issues.join("、")}`);
  }

  return {
    kind: "algorithm",
    title: (frontmatter.title as string).trim(),
    updated: formatDateOnly(frontmatter.updated),
    status: frontmatter.status as AlgorithmStatus,
    order: frontmatter.order as number,
    tags: frontmatter.tags as string[],
  };
}

export function sectionFromAlgorithmSlug(slug: string): string {
  const parts = slug.replace(/\\/g, "/").split("/").filter(Boolean);
  if (parts.length < 2) return "未分类";
  const topLevel = parts[0];
  return topLevel;
}

export function numberedAlgorithmTitle(title: string, slug: string) {
  const number = slug.split("/").at(-1)?.match(/^\d+(?:\.\d+)*/)?.[0];
  return number && !title.startsWith(number + " ") ? `${number} ${title}` : title;
}
