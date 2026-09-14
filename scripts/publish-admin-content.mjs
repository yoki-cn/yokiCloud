#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const BLOG_TAGS = ["UI", "Frontend", "Product", "Research", "Notes"];
const ADMIN_SESSION_COOKIE = "yoki_admin_session_v1";
const ADMIN_SESSION_HOURS = 12;
const ADMIN_PASSWORD_ITERATIONS = 210_000;
const DATASET_LIMITS = {
  posts: 500,
  bulletins: 200,
  bookmarks: 1_000,
  resources: 1_000,
  gateways: 3,
  adminUsers: 50,
  markdownBytes: 2 * 1024 * 1024,
};
const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const ADMIN_PERMISSION_GROUPS = [
  {
    id: "content",
    label: "内容维护",
    detail: "控制公开内容的上传、修改与删除。",
    permissions: [
      { key: "content.posts", label: "Blog 文章", detail: "上传、修改、删除 Markdown 文章。" },
      { key: "content.bulletins", label: "侧栏公告", detail: "增删改门户侧边栏公告。" },
      { key: "content.bookmarks", label: "侧栏书签", detail: "增删改门户侧边栏书签。" },
      { key: "content.resources", label: "资源节点", detail: "维护资源节点卡片与外链。" },
      { key: "content.gateways", label: "门户路由", detail: "编辑门户页面主入口。" },
    ],
  },
  {
    id: "security",
    label: "安全与账号",
    detail: "控制管理者账号、密码与登录态。",
    permissions: [
      { key: "security.admins", label: "管理员维护", detail: "增删改管理员账号与权限。" },
      { key: "security.password", label: "密码修改", detail: "修改自己或其他管理员密码。" },
      { key: "security.sessions", label: "登录状态", detail: "使用和清理本地 Cookie 登录态。" },
    ],
  },
  {
    id: "system",
    label: "系统操作",
    detail: "控制本地草稿、导入导出、发布构建与重置。",
    permissions: [
      { key: "system.import", label: "导入数据", detail: "导入管理台 JSON 数据包。" },
      { key: "system.export", label: "导出数据", detail: "导出 JSON、TS 与 Markdown 源文件。" },
      { key: "system.publish", label: "发布构建", detail: "写入静态源码并重新构建站点。" },
      { key: "system.reset", label: "重置草稿", detail: "恢复为源码内置初始数据。" },
    ],
  },
];

const DEFAULT_ADMIN_PERMISSIONS = Object.fromEntries(
  ADMIN_PERMISSION_GROUPS.flatMap((group) => group.permissions.map((permission) => [permission.key, true]))
);

function serialize(value) {
  return JSON.stringify(value, null, 2);
}

function ensureArray(value, field, limit) {
  if (!Array.isArray(value)) throw new Error(`Invalid admin dataset: ${field} must be an array.`);
  if (value.length > limit) throw new Error(`Invalid admin dataset: ${field} exceeds ${limit} items.`);
  return value;
}

function requiredString(value, field, maxLength = 500) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid admin dataset: ${field} must be a non-empty string.`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new Error(`Invalid admin dataset: ${field} exceeds ${maxLength} characters.`);
  }
  return normalized;
}

function optionalString(value, field, maxLength = 5_000) {
  if (value == null || value === "") return undefined;
  if (typeof value !== "string" || value.length > maxLength) {
    throw new Error(`Invalid admin dataset: ${field} must be a string up to ${maxLength} characters.`);
  }
  return value;
}

function safeHref(value, field, allowPlaceholder = false) {
  const href = requiredString(value, field, 2_048);
  if (href === "#") {
    if (allowPlaceholder) return href;
    throw new Error(`Invalid admin dataset: ${field} cannot be a placeholder.`);
  }
  try {
    const parsed = new URL(href, "https://yoki.invalid/");
    if (!SAFE_URL_PROTOCOLS.has(parsed.protocol)) throw new Error("unsafe protocol");
  } catch {
    throw new Error(`Invalid admin dataset: ${field} uses an unsafe or malformed URL.`);
  }
  return href;
}

function normalizePost(post, index) {
  if (!post || typeof post !== "object") throw new Error(`Invalid admin dataset: posts[${index}] must be an object.`);
  const link = requiredString(post.link, `posts[${index}].link`, 220);
  const match = link.match(/^\/posts\/([^/?#]+)\/?$/);
  if (!match) throw new Error(`Invalid admin dataset: posts[${index}].link must use /posts/<slug>/.`);
  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(match[1]);
  } catch {
    throw new Error(`Invalid admin dataset: posts[${index}].link contains invalid encoding.`);
  }
  const slug = safeSlug(decodedSlug);
  if (!slug) throw new Error(`Invalid admin dataset: posts[${index}].link has an empty slug.`);
  const date = requiredString(post.date, `posts[${index}].date`, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Invalid admin dataset: posts[${index}].date must be YYYY-MM-DD.`);
  const tag = requiredString(post.tag, `posts[${index}].tag`, 32);
  if (!BLOG_TAGS.includes(tag)) throw new Error(`Invalid admin dataset: posts[${index}].tag is unsupported.`);
  const markdown = optionalString(post.markdown, `posts[${index}].markdown`, DATASET_LIMITS.markdownBytes);
  return {
    id: requiredString(post.id, `posts[${index}].id`, 80),
    title: requiredString(post.title, `posts[${index}].title`, 240),
    date,
    tag,
    summary: requiredString(post.summary, `posts[${index}].summary`, 2_000),
    link: `/posts/${slug}/`,
    ...(markdown === undefined ? {} : { markdown }),
    ...(post.markdownFilename
      ? { markdownFilename: requiredString(post.markdownFilename, `posts[${index}].markdownFilename`, 180) }
      : {}),
  };
}

function normalizeAdminUsers(users) {
  if (!Array.isArray(users)) return null;
  ensureArray(users, "adminUsers", DATASET_LIMITS.adminUsers);
  const seen = new Set();
  return users.map((user, index) => {
    if (!user || typeof user !== "object") throw new Error(`Invalid admin dataset: adminUsers[${index}] must be an object.`);
    const username = requiredString(user.username, `adminUsers[${index}].username`, 64);
    if (seen.has(username)) throw new Error(`Invalid admin dataset: duplicate administrator ${username}.`);
    seen.add(username);
    const passwordHash = requiredString(user.passwordHash, `adminUsers[${index}].passwordHash`, 64).toLowerCase();
    const passwordSalt = typeof user.passwordSalt === "string" ? user.passwordSalt.trim().toLowerCase() : "";
    const passwordIterations = Number(user.passwordIterations || 0);
    if (!/^[a-f0-9]{64}$/.test(passwordHash)) throw new Error(`Invalid admin dataset: adminUsers[${index}].passwordHash is invalid.`);
    if (passwordSalt && !/^[a-f0-9]{32,128}$/.test(passwordSalt)) throw new Error(`Invalid admin dataset: adminUsers[${index}].passwordSalt is invalid.`);
    if (passwordSalt && (!Number.isInteger(passwordIterations) || passwordIterations < 100_000 || passwordIterations > 2_000_000)) {
      throw new Error(`Invalid admin dataset: adminUsers[${index}].passwordIterations is invalid.`);
    }
    return {
      id: requiredString(user.id, `adminUsers[${index}].id`, 100),
      username,
      displayName: requiredString(user.displayName || username, `adminUsers[${index}].displayName`, 120),
      passwordHash,
      passwordSalt,
      passwordIterations: passwordSalt ? passwordIterations : 0,
      permissions: mergePermissions(user.permissions),
      updatedAt: requiredString(user.updatedAt || new Date().toISOString().slice(0, 10), `adminUsers[${index}].updatedAt`, 32),
    };
  });
}

function normalizeDataset(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid admin dataset: root value must be an object.");
  }
  const posts = ensureArray(input.posts, "posts", DATASET_LIMITS.posts).map(normalizePost);
  const bulletins = ensureArray(input.bulletins, "bulletins", DATASET_LIMITS.bulletins).map((item, index) => ({
    id: requiredString(item?.id, `bulletins[${index}].id`, 100),
    title: requiredString(item?.title, `bulletins[${index}].title`, 240),
    ...(optionalString(item?.detail, `bulletins[${index}].detail`) === undefined
      ? {}
      : { detail: optionalString(item.detail, `bulletins[${index}].detail`) }),
    ...(item?.href ? { href: safeHref(item.href, `bulletins[${index}].href`) } : {}),
    tone: ["info", "warn", "maint"].includes(item?.tone) ? item.tone : "info",
  }));
  const bookmarks = ensureArray(input.bookmarks, "bookmarks", DATASET_LIMITS.bookmarks).map((item, index) => ({
    title: requiredString(item?.title, `bookmarks[${index}].title`, 240),
    url: safeHref(item?.url, `bookmarks[${index}].url`),
    ...(item?.icon ? { icon: safeHref(item.icon, `bookmarks[${index}].icon`) } : {}),
  }));
  const resources = ensureArray(input.resources, "resources", DATASET_LIMITS.resources).map((item, index) => ({
    id: requiredString(item?.id, `resources[${index}].id`, 100),
    type: requiredString(item?.type, `resources[${index}].type`, 80),
    title: requiredString(item?.title, `resources[${index}].title`, 240),
    summary: requiredString(item?.summary, `resources[${index}].summary`, 2_000),
    tags: ensureArray(item?.tags, `resources[${index}].tags`, 30).map((tag, tagIndex) =>
      requiredString(tag, `resources[${index}].tags[${tagIndex}]`, 80)
    ),
    clearance: ["PUBLIC", "LIMITED", "RESTRICTED"].includes(item?.clearance) ? item.clearance : "PUBLIC",
    link: safeHref(item?.link, `resources[${index}].link`, true),
  }));
  const gateways = ensureArray(input.gateways, "gateways", DATASET_LIMITS.gateways).map((item, index) => ({
    code: requiredString(item?.code, `gateways[${index}].code`, 40),
    cn: requiredString(item?.cn, `gateways[${index}].cn`, 120),
    en: requiredString(item?.en, `gateways[${index}].en`, 120),
    desc: requiredString(item?.desc, `gateways[${index}].desc`, 1_000),
    href: safeHref(item?.href, `gateways[${index}].href`, true),
  }));
  if (gateways.length !== 3) throw new Error("Invalid admin dataset: gateways must contain exactly 3 items.");
  return { posts, bulletins, bookmarks, resources, gateways, adminUsers: normalizeAdminUsers(input.adminUsers) };
}

function plainPosts(posts) {
  return posts.map(({ markdown: _markdown, markdownFilename: _markdownFilename, ...post }) => post);
}

function generateBlogTs(posts) {
  return `export const BLOG_TAGS = ${serialize([...BLOG_TAGS])} as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export type Post = {
  id: string;
  title: string;
  date: string;
  tag: BlogTag;
  summary: string;
  link: string;
};

export const POSTS: Post[] = ${serialize(plainPosts(posts))};
`;
}

function generateSidebarTs(items) {
  return `export type SidebarFeedItem = {
  id: string;
  title: string;
  detail?: string;
  href?: string;
  tone?: "info" | "warn" | "maint";
};

export const SIDEBAR_BULLETINS: SidebarFeedItem[] = ${serialize(items)};
`;
}

function generateBookmarksTs(items) {
  return `export type BookmarkSeed = {
  title: string;
  url: string;
  icon?: string;
};

export const BOOKMARKS: BookmarkSeed[] = ${serialize(items)};
`;
}

function generateResourcesTs(items) {
  return `export type ResourceItem = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  clearance: "PUBLIC" | "LIMITED" | "RESTRICTED";
  link: string;
};

export const RESOURCES: ResourceItem[] = ${serialize(items)};
`;
}

function generateGatewaysTs(items) {
  const fallback = [
    { code: "EXT-01", cn: "完整作品集", en: "ARCHIVE", desc: "Full portfolio archive. 全量项目 / Case / 系统说明。", href: "#" },
    { code: "EXT-02", cn: "完整博客", en: "LOG", desc: "Long-form articles. 完整文章站点入口。", href: "#" },
    { code: "EXT-03", cn: "资源站", en: "DEPOT", desc: "Resources depot. 索引 / 收藏 / 下载入口。", href: "#" },
  ];
  const gateways = [items[0] ?? fallback[0], items[1] ?? fallback[1], items[2] ?? fallback[2]];

  return `export type Gateway = {
  code: string;
  cn: string;
  en: string;
  desc: string;
  href: string;
};

export const ARCHIVE_SITE_URL = ${JSON.stringify(gateways[0].href)};
export const LOG_SITE_URL = ${JSON.stringify(gateways[1].href)};
export const DEPOT_SITE_URL = ${JSON.stringify(gateways[2].href)};

export const PRIMARY_GATEWAYS: Gateway[] = [
  ${serialize({ ...gateways[0], href: "__ARCHIVE_SITE_URL__" }).replace('"__ARCHIVE_SITE_URL__"', "ARCHIVE_SITE_URL")},
  ${serialize({ ...gateways[1], href: "__LOG_SITE_URL__" }).replace('"__LOG_SITE_URL__"', "LOG_SITE_URL")},
  ${serialize({ ...gateways[2], href: "__DEPOT_SITE_URL__" }).replace('"__DEPOT_SITE_URL__"', "DEPOT_SITE_URL")}
];
`;
}

function mergePermissions(input) {
  const permissions = { ...DEFAULT_ADMIN_PERMISSIONS };
  for (const group of ADMIN_PERMISSION_GROUPS) {
    for (const permission of group.permissions) {
      if (typeof input?.[permission.key] === "boolean") permissions[permission.key] = input[permission.key];
    }
  }
  return permissions;
}

function plainAdminUsers(users) {
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    passwordHash: user.passwordHash,
    passwordSalt: user.passwordSalt || "",
    passwordIterations: user.passwordIterations || 0,
    permissions: mergePermissions(user.permissions),
    updatedAt: user.updatedAt,
  }));
}

function generateAdminAuthTs(users) {
  return `export const ADMIN_SESSION_COOKIE = ${JSON.stringify(ADMIN_SESSION_COOKIE)};
export const ADMIN_SESSION_HOURS = ${ADMIN_SESSION_HOURS};
export const ADMIN_PASSWORD_ITERATIONS = ${ADMIN_PASSWORD_ITERATIONS};

export const ADMIN_PERMISSION_GROUPS = ${serialize(ADMIN_PERMISSION_GROUPS)} as const;

export type AdminPermissionGroup = (typeof ADMIN_PERMISSION_GROUPS)[number];
export type AdminPermissionKey = AdminPermissionGroup["permissions"][number]["key"];
export type AdminPermissionMap = Record<AdminPermissionKey, boolean>;

export type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  permissions: AdminPermissionMap;
  updatedAt: string;
};

export const DEFAULT_ADMIN_PERMISSIONS = Object.fromEntries(
  ADMIN_PERMISSION_GROUPS.flatMap((group) => group.permissions.map((permission) => [permission.key, true]))
) as AdminPermissionMap;

export const DEFAULT_ADMIN_USERS: AdminUser[] = ${serialize(plainAdminUsers(users))};
`;
}

function safeSlug(input) {
  const value = String(input || "").trim();
  return value
    .replace(/[\\/:*?"<>|#%{}\[\]^`;\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function slugFromPost(post) {
  const link = typeof post.link === "string" ? post.link.trim() : "";
  const match = link.match(/^\/posts\/([^/?#]+)\/?$/);
  if (!match) return null;
  const slug = safeSlug(decodeURIComponent(match[1]));
  return slug || null;
}

function generatedMarkdown(post) {
  const tag = BLOG_TAGS.includes(post.tag) ? post.tag : "Notes";
  return `---
title: ${JSON.stringify(post.title || "未命名文章")}
description: ${JSON.stringify(post.summary || "新建文章摘要。")}
date: ${post.date || new Date().toISOString().slice(0, 10)}
updated: ${post.date || new Date().toISOString().slice(0, 10)}
category: ${tag}
tags: [${tag}]
layout: ../../layouts/ArticleLayout.astro
---

## 正文

在这里补充文章内容。
`;
}

function normalizeArticleMarkdown(markdown) {
  return markdown
    .replace(/\\begin\{align\*?\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\*?\}/g, "\\end{aligned}")
    .replace(/\$\$\s*(\\begin\{aligned\})/g, "$$\n$1")
    .replace(/(\\end\{aligned\})\s*\$\$/g, "$1\n$$");
}

function ensureInside(root, target) {
  const rel = relative(root, target);
  if (rel.startsWith("..") || rel === "" || rel.includes("..\\") || rel.includes("../")) {
    throw new Error(`Refusing to write outside repository: ${target}`);
  }
}

function relPath(root, target) {
  return relative(root, target).replace(/\\/g, "/");
}

async function stageWrite(staged, root, relativePath, content) {
  const target = resolve(root, relativePath);
  ensureInside(root, target);
  staged.set(target, content.replace(/\r\n/g, "\n"));
}

async function markdownForPost(root, post, slug) {
  if (typeof post.markdown === "string" && post.markdown.trim()) {
    return `${normalizeArticleMarkdown(post.markdown).replace(/\r\n/g, "\n").trimEnd()}\n`;
  }
  const existing = resolve(root, "src/pages/posts", `${slug}.md`);
  if (existsSync(existing)) {
    return normalizeArticleMarkdown(await readFile(existing, "utf8"));
  }
  return generatedMarkdown(post);
}

function run(command, args, cwd) {
  return new Promise((resolveRun) => {
    const isWindowsNpm = process.platform === "win32" && command === "npm";
    const executable = isWindowsNpm ? process.env.ComSpec || "cmd.exe" : command;
    const executableArgs = isWindowsNpm ? ["/d", "/s", "/c", "npm", ...args] : args;
    const child = spawn(executable, executableArgs, {
      cwd,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      resolveRun({ code: 1, stdout, stderr: `${stderr}\n${error.message}`.trim() });
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      resolveRun({ code: code ?? 1, stdout, stderr });
    });
  });
}

function tail(value, limit = 4000) {
  return value.length > limit ? value.slice(-limit) : value;
}

async function captureOriginalFiles(targets) {
  const originals = new Map();
  for (const target of targets) {
    originals.set(target, existsSync(target) ? await readFile(target, "utf8") : null);
  }
  return originals;
}

async function restoreOriginalFiles(originals) {
  for (const [target, content] of originals) {
    if (content === null) {
      await rm(target, { force: true });
      continue;
    }
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content, "utf8");
  }
}

export async function publishAdminContent(input, options = {}) {
  const root = resolve(options.root || repoRoot);
  const build = options.build ?? true;
  const dryRun = options.dryRun ?? false;
  const prune = options.prune ?? true;
  const dataset = normalizeDataset(input);
  const staged = new Map();
  const removed = [];
  const localSlugs = new Set();

  await stageWrite(staged, root, "src/data/blog.ts", generateBlogTs(dataset.posts));
  await stageWrite(staged, root, "src/data/sidebar.ts", generateSidebarTs(dataset.bulletins));
  await stageWrite(staged, root, "src/data/bookmarks.ts", generateBookmarksTs(dataset.bookmarks));
  await stageWrite(staged, root, "src/data/resources.ts", generateResourcesTs(dataset.resources));
  await stageWrite(staged, root, "src/data/gateways.ts", generateGatewaysTs(dataset.gateways));
  if (dataset.adminUsers) {
    await stageWrite(staged, root, "src/data/adminAuth.ts", generateAdminAuthTs(dataset.adminUsers));
  }

  const postsDir = resolve(root, "src/pages/posts");
  ensureInside(root, postsDir);
  if (!dryRun) await mkdir(postsDir, { recursive: true });

  for (const post of dataset.posts) {
    const slug = slugFromPost(post);
    if (!slug) continue;
    localSlugs.add(slug);
    const markdown = await markdownForPost(root, post, slug);
    await stageWrite(staged, root, `src/pages/posts/${slug}.md`, markdown);
  }

  if (prune && existsSync(postsDir)) {
    const files = await readdir(postsDir, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".md")) continue;
      const slug = basename(file.name, ".md");
      if (localSlugs.has(slug)) continue;
      const target = resolve(postsDir, file.name);
      ensureInside(root, target);
      removed.push(target);
    }
  }

  let buildResult = null;
  if (!dryRun) {
    const originals = await captureOriginalFiles(new Set([...staged.keys(), ...removed]));
    try {
      for (const [target, content] of staged) {
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, content, "utf8");
      }
      for (const target of removed) {
        await rm(target, { force: true });
      }
      if (build) {
        buildResult = await run("npm", ["run", "build"], root);
        if (buildResult.code !== 0) {
          const error = new Error("Build failed after publishing admin content; source files were restored.");
          error.build = buildResult;
          throw error;
        }
      }
    } catch (error) {
      try {
        await restoreOriginalFiles(originals);
        error.rolledBack = true;
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
      error.filesWritten = [...staged.keys()].map((target) => relPath(root, target));
      error.filesRemoved = removed.map((target) => relPath(root, target));
      throw error;
    }
  }

  return {
    ok: true,
    dryRun,
    filesWritten: [...staged.keys()].map((target) => relPath(root, target)),
    filesRemoved: removed.map((target) => relPath(root, target)),
    build: buildResult
      ? {
          code: buildResult.code,
          stdoutTail: tail(buildResult.stdout),
          stderrTail: tail(buildResult.stderr),
        }
      : null,
  };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function parseArgs(argv) {
  const args = {
    input: "",
    skipBuild: false,
    dryRun: false,
    noPrune: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--input") {
      args.input = argv[index + 1] || "";
      index += 1;
    } else if (item === "--skip-build") {
      args.skipBuild = true;
    } else if (item === "--dry-run") {
      args.dryRun = true;
    } else if (item === "--no-prune") {
      args.noPrune = true;
    } else if (item === "--help" || item === "-h") {
      args.help = true;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: npm run admin:publish -- --input yoki-admin-dataset.json [--skip-build] [--dry-run] [--no-prune]");
    return;
  }
  const raw = args.input ? await readFile(resolve(process.cwd(), args.input), "utf8") : await readStdin();
  if (!raw.trim()) {
    throw new Error("No admin dataset received. Pass --input <file> or pipe JSON into stdin.");
  }
  const result = await publishAdminContent(JSON.parse(raw), {
    build: !args.skipBuild,
    dryRun: args.dryRun,
    prune: !args.noPrune,
  });
  console.log(serialize(result));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message || error);
    if (error.build) {
      console.error(tail(error.build.stdout));
      console.error(tail(error.build.stderr));
    }
    process.exit(1);
  });
}
