import { BLOG_TAGS, POSTS } from "../data/blog";
import { FRIEND_LINKS } from "../data/friends";
import { PRIMARY_GATEWAYS } from "../data/gateways";
import { PROJECT_TYPES, PROJECTS } from "../data/projects";
import { RESOURCES } from "../data/resources";

export function runSelfTests() {
  const tagSet = new Set(BLOG_TAGS);
  console.assert(
    POSTS.every((p) => tagSet.has(p.tag)),
    "[SelfTest] POSTS.tag should be included in BLOG_TAGS"
  );
  console.assert(
    PROJECT_TYPES.some((t) => t.key === "all"),
    "[SelfTest] PROJECT_TYPES should include key=all"
  );
  console.assert(
    PROJECTS.every((p) => Boolean(p.id) && Boolean(p.type) && Boolean(p.title)),
    "[SelfTest] PROJECTS must have id/type/title"
  );
  console.assert(
    POSTS.every((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.date)),
    "[SelfTest] POSTS.date should be YYYY-MM-DD"
  );
  console.assert(
    RESOURCES.every((r) => Boolean(r.id) && Boolean(r.type) && Boolean(r.title)),
    "[SelfTest] RESOURCES must have id/type/title"
  );
  console.assert(
    RESOURCES.every((r) => ["PUBLIC", "LIMITED", "RESTRICTED"].includes(r.clearance)),
    "[SelfTest] RESOURCES.clearance should be PUBLIC/LIMITED/RESTRICTED"
  );
  console.assert(
    FRIEND_LINKS.every((f) => Boolean(f.name) && Boolean(f.href)),
    "[SelfTest] FRIEND_LINKS must have name/href"
  );
  console.assert(
    Array.isArray(PRIMARY_GATEWAYS) && PRIMARY_GATEWAYS.length === 3,
    "[SelfTest] PRIMARY_GATEWAYS should have 3 routes"
  );
  console.assert(
    PRIMARY_GATEWAYS.every((g) => Boolean(g.code) && Boolean(g.cn) && Boolean(g.href)),
    "[SelfTest] PRIMARY_GATEWAYS items should include code/cn/href"
  );
}

export function runSelfTestsInDev() {
  const hasViteMeta = typeof import.meta !== "undefined" && typeof import.meta.env !== "undefined";
  const viteDev = hasViteMeta ? Boolean(import.meta.env.DEV) : undefined;
  const nodeEnv = (globalThis as any)?.process?.env?.NODE_ENV;
  const isDev = typeof viteDev === "boolean" ? viteDev : nodeEnv !== "production";

  if (isDev) runSelfTests();
}
