import { sitePath } from "../utils/sitePath";
import { notify, adminNotice as setNotice } from "../utils/notifications";
import {
  BookOpen,
  Bookmark,
  Database,
  Download,
  FileDown,
  FileText,
  FolderInput,
  KeyRound,
  LayoutGrid,
  LogOut,
  Pencil,
  Plus,
  Radio,
  RotateCcw,
  Rocket,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserCog,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import BackLink from "../components/ui/BackLink";

import {
  ADMIN_PASSWORD_ITERATIONS,
  ADMIN_PERMISSION_GROUPS,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_HOURS,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_ADMIN_USERS,
  type AdminPermissionKey,
  type AdminPermissionMap,
  type AdminUser,
} from "../data/adminAuth";
import { BLOG_TAGS, POSTS, type BlogTag, type Post } from "../data/blog";
import { BOOKMARKS, type BookmarkSeed } from "../data/bookmarks";
import { PRIMARY_GATEWAYS, type Gateway } from "../data/gateways";
import { RESOURCES, type ResourceItem } from "../data/resources";
import { SIDEBAR_BULLETINS, type SidebarFeedItem } from "../data/sidebar";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useSessionStorageState } from "../hooks/useSessionStorageState";
import { useTheme } from "../hooks/useTheme";
import LocalStyles from "../styles/localStyles";
import {
  clearAdminSession,
  createAdminPasswordSalt,
  deriveAdminPasswordHash,
  verifyAdminPassword,
  verifyAdminSession,
  writeAdminSession,
} from "../utils/adminAuth";
import { normalizeSafeHref } from "../utils/linkActions";
import {
  AdminButton,
  AdminField,
  AdminListButton,
  AdminModal,
  AdminPanel,
  AdminSelect,
  AdminStatStrip,
  AdminSwitch,
  AdminTextInput,
  AdminTextarea,
  AdminToolbar,
  HudChip,
  MetaRail,
  SystemState,
  ThemeToggleButton,
  UnboundedSurface,
} from "../components/ui";

type ManagedPost = Post & {
  markdown?: string;
  markdownFilename?: string;
};

type AdminDataset = {
  posts: ManagedPost[];
  bulletins: SidebarFeedItem[];
  bookmarks: BookmarkSeed[];
  resources: ResourceItem[];
  gateways: Gateway[];
};

type ContentSectionKey = keyof AdminDataset;
type SectionKey = ContentSectionKey | "admins";
type AdminExportPackage = AdminDataset & {
  adminUsers?: AdminUser[];
};

const STORAGE_KEY = "ark.portal.admin.dataset.v1";
const ADMIN_USERS_STORAGE_KEY = "ark.portal.admin.users.v1";
const PUBLISH_TOKEN_STORAGE_KEY = "ark.portal.admin.publishToken.v1";
const LOCAL_PUBLISH_ENDPOINT = "http://127.0.0.1:4317/publish";
const today = () => new Date().toISOString().slice(0, 10);

const clearanceOptions: ResourceItem["clearance"][] = ["PUBLIC", "LIMITED", "RESTRICTED"];
const bulletinToneOptions: Array<NonNullable<SidebarFeedItem["tone"]>> = ["info", "warn", "maint"];

const sectionPermissionMap: Record<SectionKey, AdminPermissionKey> = {
  posts: "content.posts",
  bulletins: "content.bulletins",
  bookmarks: "content.bookmarks",
  resources: "content.resources",
  gateways: "content.gateways",
  admins: "security.admins",
};

function createInitialSelected(): Record<SectionKey, number> {
  return {
    posts: 0,
    bulletins: 0,
    bookmarks: 0,
    resources: 0,
    gateways: 0,
    admins: 0,
  };
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function mergePermissions(input: Partial<AdminPermissionMap> | undefined): AdminPermissionMap {
  const permissions = { ...DEFAULT_ADMIN_PERMISSIONS };
  for (const group of ADMIN_PERMISSION_GROUPS) {
    for (const permission of group.permissions) {
      const value = input?.[permission.key];
      if (typeof value === "boolean") permissions[permission.key] = value;
    }
  }
  return permissions;
}

function createInitialAdminUsers(): AdminUser[] {
  return DEFAULT_ADMIN_USERS.map((user) => ({
    ...deepClone(user),
    permissions: mergePermissions(user.permissions),
  }));
}

function normalizeAdminUser(value: unknown, index: number): AdminUser | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<AdminUser>;
  const username = String(record.username || "").trim();
  const passwordHash = String(record.passwordHash || "").trim();
  const passwordSalt = String(record.passwordSalt || "").trim();
  const passwordIterations = Number(record.passwordIterations || 0);
  if (!username || !/^[a-f0-9]{64}$/i.test(passwordHash)) return null;
  if (passwordSalt && !/^[a-f0-9]{32,128}$/i.test(passwordSalt)) return null;
  if (
    passwordSalt &&
    (!Number.isInteger(passwordIterations) || passwordIterations < 100_000 || passwordIterations > 2_000_000)
  ) {
    return null;
  }
  return {
    id: String(record.id || `admin-${index}`),
    username,
    displayName: String(record.displayName || username),
    passwordHash: passwordHash.toLowerCase(),
    passwordSalt: passwordSalt.toLowerCase(),
    passwordIterations: passwordSalt ? passwordIterations : 0,
    permissions: mergePermissions(record.permissions),
    updatedAt: String(record.updatedAt || today()),
  };
}

function coerceAdminUsers(value: unknown): AdminUser[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  const users = value
    .map((item, index) => normalizeAdminUser(item, index))
    .filter((item): item is AdminUser => Boolean(item))
    .filter((item) => {
      if (seen.has(item.username)) return false;
      seen.add(item.username);
      return true;
    });
  return users.length ? users : null;
}

function slugFromPostLink(link: string) {
  const trimmed = link.replace(/\/$/, "");
  const parts = trimmed.split("/").filter(Boolean);
  return parts[parts.length - 1] || "article";
}

function markdownUrlForPost(post: Pick<Post, "link">) {
  if (!post.link.startsWith("/posts/")) return "";
  return `${post.link.replace(/\/$/, "")}.md`;
}

function markdownFilenameForPost(post: Pick<Post, "title" | "link">) {
  const slug = post.link.startsWith("/posts/") ? slugFromPostLink(post.link) : slugify(post.title || "article");
  return `${slug}.md`;
}

function normalizeArticleMarkdown(markdown: string) {
  return markdown
    .replace(/\\begin\{align\*?\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\*?\}/g, "\\end{aligned}")
    .replace(/\$\$\s*(\\begin\{aligned\})/g, "$$\n$1")
    .replace(/(\\end\{aligned\})\s*\$\$/g, "$1\n$$");
}

function createInitialDataset(): AdminDataset {
  return {
    posts: POSTS.map((post) => ({
      ...deepClone(post),
      markdown: "",
      markdownFilename: markdownFilenameForPost(post),
    })),
    bulletins: deepClone(SIDEBAR_BULLETINS),
    bookmarks: deepClone(BOOKMARKS),
    resources: deepClone(RESOURCES),
    gateways: deepClone(PRIMARY_GATEWAYS),
  };
}

function slugify(input: string) {
  const value = input
    .trim()
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return value || "article";
}

function nextId(prefix: string, ids: string[]) {
  const max = ids.reduce((acc, id) => {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, -1);
  return `${prefix}-${String(max + 1).padStart(2, "0")}`;
}

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---/);
  const result: Record<string, string | string[]> = {};
  if (!match) return result;

  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    const key = pair[1];
    const raw = pair[2].trim();
    if (raw.startsWith("[") && raw.endsWith("]")) {
      result[key] = raw
        .slice(1, -1)
        .split(",")
        .map((item) => stripQuotes(item))
        .filter(Boolean);
    } else {
      result[key] = stripQuotes(raw);
    }
  }

  return result;
}

function firstMarkdownParagraph(markdown: string) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---/, "").trim();
  const paragraph = body
    .split(/\n{2,}/)
    .map((block) => block.replace(/^#+\s*/, "").trim())
    .find((block) => block && !block.startsWith("```"));
  return paragraph?.slice(0, 92) || "新导入的 Markdown 文章。";
}

function postFromMarkdown(fileName: string, markdown: string, existing: ManagedPost[]): ManagedPost {
  const normalizedMarkdown = normalizeArticleMarkdown(markdown);
  const frontmatter = parseFrontmatter(normalizedMarkdown);
  const slug = slugify(fileName);
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const candidateTag = [frontmatter.tag, frontmatter.category, ...tags].find(
    (tag): tag is BlogTag => typeof tag === "string" && (BLOG_TAGS as readonly string[]).includes(tag)
  );

  return {
    id: nextId("b", existing.map((post) => post.id)),
    title: String(frontmatter.title || slug.replace(/-/g, " ")),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(frontmatter.date || "")) ? String(frontmatter.date) : today(),
    tag: candidateTag || "Notes",
    summary: String(frontmatter.description || firstMarkdownParagraph(normalizedMarkdown)),
    link: `/posts/${slug}/`,
    markdown: normalizedMarkdown,
    markdownFilename: `${slug}.md`,
  };
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function plainPosts(posts: ManagedPost[]): Post[] {
  return posts.map(({ markdown: _markdown, markdownFilename: _markdownFilename, ...post }) => post);
}

function generateBlogTs(posts: ManagedPost[]) {
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

function generateSidebarTs(items: SidebarFeedItem[]) {
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

function generateBookmarksTs(items: BookmarkSeed[]) {
  return `export type BookmarkSeed = {
  title: string;
  url: string;
  icon?: string;
};

export const BOOKMARKS: BookmarkSeed[] = ${serialize(items)};
`;
}

function generateResourcesTs(items: ResourceItem[]) {
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

function generateGatewaysTs(items: Gateway[]) {
  const fallback = createInitialDataset().gateways;
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

function plainAdminUsers(users: AdminUser[]): AdminUser[] {
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    passwordHash: user.passwordHash,
    passwordSalt: user.passwordSalt,
    passwordIterations: user.passwordIterations,
    permissions: mergePermissions(user.permissions),
    updatedAt: user.updatedAt,
  }));
}

function generateAdminAuthTs(users: AdminUser[]) {
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

function generatedMarkdown(post: ManagedPost) {
  if (post.markdown?.trim()) return normalizeArticleMarkdown(post.markdown);
  return `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.summary)}
date: ${post.date}
updated: ${post.date}
category: ${post.tag}
tags: [${post.tag}]
layout: ../../layouts/ArticleLayout.astro
---

## 正文

在这里补充文章内容。
`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdownPreviewHtml(markdown: string) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---/, "").trim();
  const lines = body.split(/\r?\n/);
  const html: string[] = [];
  let inCode = false;
  let inList = false;
  let codeLines: string[] = [];

  function closeList() {
    if (!inList) return;
    html.push("</ul>");
    inList = false;
  }

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      return;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    if (listItem) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInlineMarkdown(listItem[1])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  });

  if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  closeList();
  return html.join("\n");
}

function downloadText(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  notify("PRTS 导出档案已交付浏览器，请确认下载记录。", "success");
}

function validDatasetHref(value: unknown, allowPlaceholder = false) {
  if (allowPlaceholder && value === "#") return "#";
  return typeof value === "string" ? normalizeSafeHref(value) : "";
}

function coerceDataset(value: unknown): AdminDataset | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<AdminDataset>;
  if (
    !Array.isArray(record.posts) ||
    !Array.isArray(record.bulletins) ||
    !Array.isArray(record.bookmarks) ||
    !Array.isArray(record.resources) ||
    !Array.isArray(record.gateways)
  ) {
    return null;
  }
  const posts = record.posts.filter((item): item is ManagedPost => {
    if (!item || typeof item !== "object") return false;
    return (
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.date === "string" &&
      (BLOG_TAGS as readonly string[]).includes(item.tag) &&
      typeof item.summary === "string" &&
      /^\/posts\/[^/?#]+\/?$/.test(item.link)
    );
  });
  const bulletins = record.bulletins.filter((item): item is SidebarFeedItem => {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || typeof item.title !== "string") return false;
    return !item.href || Boolean(validDatasetHref(item.href));
  });
  const bookmarks = record.bookmarks.filter((item): item is BookmarkSeed =>
    Boolean(item && typeof item === "object" && typeof item.title === "string" && validDatasetHref(item.url))
  );
  const resources = record.resources.filter((item): item is ResourceItem =>
    Boolean(
      item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.type === "string" &&
        typeof item.title === "string" &&
        typeof item.summary === "string" &&
        Array.isArray(item.tags) &&
        ["PUBLIC", "LIMITED", "RESTRICTED"].includes(item.clearance) &&
        validDatasetHref(item.link, true)
    )
  );
  const gateways = record.gateways.filter((item): item is Gateway =>
    Boolean(
      item &&
        typeof item === "object" &&
        typeof item.code === "string" &&
        typeof item.cn === "string" &&
        typeof item.en === "string" &&
        typeof item.desc === "string" &&
        validDatasetHref(item.href, true)
    )
  );
  if (
    posts.length !== record.posts.length ||
    bulletins.length !== record.bulletins.length ||
    bookmarks.length !== record.bookmarks.length ||
    resources.length !== record.resources.length ||
    gateways.length !== record.gateways.length ||
    gateways.length !== 3
  ) {
    return null;
  }
  return { posts, bulletins, bookmarks, resources, gateways };
}

function createExportPackage(data: AdminDataset, adminUsers: AdminUser[]): AdminExportPackage {
  return {
    ...data,
    adminUsers: plainAdminUsers(adminUsers),
  };
}

export default function AdminConsole({ algorithmImages = [] }: { algorithmImages?: string[] }) {
  const { isLight, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useLocalStorageState<AdminDataset>(STORAGE_KEY, createInitialDataset, {
    parse: (raw) => coerceDataset(JSON.parse(raw)) ?? createInitialDataset(),
  });
  const [adminUsers, setAdminUsers] = useLocalStorageState<AdminUser[]>(ADMIN_USERS_STORAGE_KEY, createInitialAdminUsers, {
    parse: (raw) => coerceAdminUsers(JSON.parse(raw)) ?? createInitialAdminUsers(),
  });
  const [publishToken, setPublishToken] = useSessionStorageState(PUBLISH_TOKEN_STORAGE_KEY, "", {
    parse: (raw) => {
      const parsed = JSON.parse(raw);
      return typeof parsed === "string" ? parsed : "";
    },
  });
  const [activeSection, setActiveSection] = useState<SectionKey>("posts");
  const [selected, setSelected] = useState<Record<SectionKey, number>>(createInitialSelected);
  const [authReady, setAuthReady] = useState(false);
  const [sessionUsername, setSessionUsername] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "yoki", password: "" });
  const [loginError, updateLoginError] = useState("");
  function setLoginError(message: string) {
    updateLoginError(message);
    if (message) notify(message, "error");
  }
  const [passwordDraft, setPasswordDraft] = useState({ next: "", confirm: "" });
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [bulletinEditorOpen, setBulletinEditorOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const currentAdmin = useMemo(
    () => (sessionUsername ? adminUsers.find((user) => user.username === sessionUsername) ?? null : null),
    [adminUsers, sessionUsername]
  );

  const stats = useMemo(
    () => [
      { label: "Blog 文章", value: data.posts.length, tone: "accent" as const },
      { label: "公告", value: data.bulletins.length, tone: "warm" as const },
      { label: "书签", value: data.bookmarks.length, tone: "neutral" as const },
      { label: "资源", value: data.resources.length, tone: "success" as const },
      { label: "管理员", value: adminUsers.length, tone: "neutral" as const },
    ],
    [adminUsers.length, data]
  );

  const activePost = data.posts[selected.posts] ?? null;
  const activeBulletin = data.bulletins[selected.bulletins] ?? null;
  const activeBookmark = data.bookmarks[selected.bookmarks] ?? null;
  const activeResource = data.resources[selected.resources] ?? null;
  const activeGateway = data.gateways[selected.gateways] ?? null;
  const activeAdmin = adminUsers[selected.admins] ?? null;

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      const user = await verifyAdminSession(adminUsers);
      if (cancelled) return;
      if (!user) {
        clearAdminSession();
        setSessionUsername(null);
        setAuthReady(true);
        return;
      }
      setSessionUsername(user.username);
      setAuthReady(true);
    }
    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, [adminUsers]);

  function can(permission: AdminPermissionKey) {
    return Boolean(currentAdmin?.permissions[permission]);
  }

  function persistDataset(next: AdminDataset) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialize(next));
    } catch {
      // The regular hook write will still try later if the browser allows it.
    }
  }

  function setDataPersisted(updater: (current: AdminDataset) => AdminDataset) {
    setData((current) => {
      const next = updater(current);
      persistDataset(next);
      return next;
    });
  }

  function selectIndex(section: SectionKey, index: number) {
    setSelected((current) => ({ ...current, [section]: Math.max(0, index) }));
  }

  function updatePost(patch: Partial<ManagedPost>) {
    setDataPersisted((current) => {
      const posts = [...current.posts];
      const item = posts[selected.posts];
      if (!item) return current;
      posts[selected.posts] = { ...item, ...patch };
      return { ...current, posts };
    });
  }

  function updateBulletin(patch: Partial<SidebarFeedItem>) {
    setDataPersisted((current) => {
      const bulletins = [...current.bulletins];
      const item = bulletins[selected.bulletins];
      if (!item) return current;
      bulletins[selected.bulletins] = { ...item, ...patch };
      return { ...current, bulletins };
    });
  }

  function updateBookmark(patch: Partial<BookmarkSeed>) {
    setDataPersisted((current) => {
      const bookmarks = [...current.bookmarks];
      const item = bookmarks[selected.bookmarks];
      if (!item) return current;
      bookmarks[selected.bookmarks] = { ...item, ...patch };
      return { ...current, bookmarks };
    });
  }

  function updateResource(patch: Partial<ResourceItem>) {
    setDataPersisted((current) => {
      const resources = [...current.resources];
      const item = resources[selected.resources];
      if (!item) return current;
      resources[selected.resources] = { ...item, ...patch };
      return { ...current, resources };
    });
  }

  function updateGateway(patch: Partial<Gateway>) {
    setDataPersisted((current) => {
      const gateways = [...current.gateways];
      const item = gateways[selected.gateways];
      if (!item) return current;
      gateways[selected.gateways] = { ...item, ...patch };
      return { ...current, gateways };
    });
  }

  function updateActiveAdmin(patch: Partial<AdminUser>) {
    if (!activeAdmin) return;
    const nextUsername = patch.username?.trim();
    const usernameTaken =
      nextUsername &&
      adminUsers.some((user) => user.id !== activeAdmin.id && user.username === nextUsername);
    if (usernameTaken) {
      setNotice("管理员账号已存在，请换一个账号名。");
      return;
    }

    setAdminUsers((current) =>
      current.map((user) => {
        if (user.id !== activeAdmin.id) return user;
        const nextUser = {
          ...user,
          ...patch,
          username: nextUsername || user.username,
          displayName: patch.displayName === undefined ? user.displayName : patch.displayName,
          permissions: patch.permissions ? mergePermissions(patch.permissions) : mergePermissions(user.permissions),
          updatedAt: today(),
        };
        return nextUser;
      })
    );

    if (currentAdmin?.id === activeAdmin.id && nextUsername && nextUsername !== currentAdmin.username) {
      void writeAdminSession(nextUsername, activeAdmin.passwordHash).then(() => {
        setSessionUsername(nextUsername);
      });
    }
  }

  function updateActiveAdminPermission(permission: AdminPermissionKey, checked: boolean) {
    if (!activeAdmin) return;
    updateActiveAdmin({
      permissions: {
        ...mergePermissions(activeAdmin.permissions),
        [permission]: checked,
      },
    });
  }

  function addPost() {
    setDataPersisted((current) => {
      const stamp = Date.now();
      const post: ManagedPost = {
        id: nextId("b", current.posts.map((item) => item.id)),
        title: "未命名文章",
        date: today(),
        tag: "Notes",
        summary: "新建文章摘要。",
        link: `/posts/new-${stamp}/`,
        markdown: generatedMarkdown({
          id: "draft",
          title: "未命名文章",
          date: today(),
          tag: "Notes",
          summary: "新建文章摘要。",
          link: "/posts/new/",
        }),
        markdownFilename: `new-${stamp}.md`,
      };
      setSelected((currentSelected) => ({ ...currentSelected, posts: current.posts.length }));
      return { ...current, posts: [...current.posts, post] };
    });
    setActiveSection("posts");
    setPostEditorOpen(true);
    setNotice("已创建文章本地草稿。刷新管理台会保留；公开 Blog 需要导出源文件并重新构建。");
  }

  function addBulletin() {
    setDataPersisted((current) => {
      const item: SidebarFeedItem = {
        id: `notice-${Date.now()}`,
        title: "新公告 / NEW NOTICE",
        detail: "在这里填写公告说明。",
        tone: "info",
      };
      setSelected((currentSelected) => ({ ...currentSelected, bulletins: current.bulletins.length }));
      return { ...current, bulletins: [...current.bulletins, item] };
    });
    setActiveSection("bulletins");
    setBulletinEditorOpen(true);
  }

  function addBookmark() {
    setDataPersisted((current) => {
      const item: BookmarkSeed = { title: "新书签", url: "https://example.com/" };
      setSelected((currentSelected) => ({ ...currentSelected, bookmarks: current.bookmarks.length }));
      return { ...current, bookmarks: [...current.bookmarks, item] };
    });
  }

  function addResource() {
    setDataPersisted((current) => {
      const item: ResourceItem = {
        id: nextId("r", current.resources.map((resource) => resource.id)),
        type: "LINK",
        title: "新资源节点",
        summary: "资源说明。",
        tags: ["Resource"],
        clearance: "PUBLIC",
        link: "#",
      };
      setSelected((currentSelected) => ({ ...currentSelected, resources: current.resources.length }));
      return { ...current, resources: [...current.resources, item] };
    });
  }

  function uniqueAdminUsername(base: string) {
    let index = 1;
    let candidate = base;
    const names = new Set(adminUsers.map((user) => user.username));
    while (names.has(candidate)) {
      index += 1;
      candidate = `${base}-${index}`;
    }
    return candidate;
  }

  function addAdminUser() {
    const username = uniqueAdminUsername("new-admin");
    const user: AdminUser = {
      id: `admin-${Date.now()}`,
      username,
      displayName: "新管理员",
      passwordHash: DEFAULT_ADMIN_USERS[0]?.passwordHash || "",
      passwordSalt: DEFAULT_ADMIN_USERS[0]?.passwordSalt || "",
      passwordIterations: DEFAULT_ADMIN_USERS[0]?.passwordIterations || ADMIN_PASSWORD_ITERATIONS,
      permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
      updatedAt: today(),
    };
    setAdminUsers((current) => {
      setSelected((currentSelected) => ({ ...currentSelected, admins: current.length }));
      return [...current, user];
    });
    setNotice(`已创建管理员 ${username}，初始密码为 suzuran，请尽快修改。`);
  }

  function removeActiveAdmin() {
    if (!activeAdmin) return;
    if (adminUsers.length <= 1) {
      setNotice("至少需要保留一个管理员。");
      return;
    }
    if (currentAdmin?.id === activeAdmin.id) {
      setNotice("不能删除当前登录的管理员账号。");
      return;
    }
    const index = selected.admins;
    setAdminUsers((current) => current.filter((user) => user.id !== activeAdmin.id));
    setSelected((current) => ({ ...current, admins: Math.max(0, Math.min(index, adminUsers.length - 2)) }));
    setNotice(`已删除管理员 ${activeAdmin.username}。`);
  }

  function removeCurrent(section: SectionKey) {
    if (section === "admins") {
      removeActiveAdmin();
      return;
    }
    if (section === "posts") setPostEditorOpen(false);
    if (section === "bulletins") setBulletinEditorOpen(false);
    setDataPersisted((current) => {
      const contentSection = section as ContentSectionKey;
      const index = selected[section];
      const next = { ...current };
      next[contentSection] = current[contentSection].filter((_, itemIndex) => itemIndex !== index) as never;
      setSelected((currentSelected) => ({
        ...currentSelected,
        [section]: Math.max(0, Math.min(index, next[contentSection].length - 1)),
      }));
      return next;
    });
  }

  async function handleMarkdownUpload(files: FileList | null) {
    if (!files?.length) return;
    const loaded: ManagedPost[] = [];
    for (const file of Array.from(files)) {
      const text = await file.text();
      loaded.push(postFromMarkdown(file.name, text, [...data.posts, ...loaded]));
    }
    setDataPersisted((current) => ({ ...current, posts: [...current.posts, ...loaded] }));
    setSelected((current) => ({ ...current, posts: data.posts.length }));
    setActiveSection("posts");
    setNotice(`已导入 ${loaded.length} 个 Markdown 文件并保存为本地草稿。公开 Blog 需要导出源文件并重新构建。`);
    if (markdownInputRef.current) markdownInputRef.current.value = "";
  }

  async function loadMarkdownSource() {
    if (!activePost) return;
    const url = markdownUrlForPost(activePost);
    if (!url) {
      setNotice("当前文章不是本地 /posts/ 路由，无法自动拉取 Markdown。");
      return;
    }
    try {
      const response = await fetch(sitePath(url), { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const markdown = normalizeArticleMarkdown(await response.text());
      updatePost({ markdown, markdownFilename: markdownFilenameForPost(activePost) });
      setNotice(`已读取 ${markdownFilenameForPost(activePost)}。`);
    } catch {
      setNotice("读取 Markdown 源文件失败，请确认开发服务或构建产物包含 /posts/[slug].md。");
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const username = loginForm.username.trim();
    const user = adminUsers.find((item) => item.username === username);
    if (!user) {
      setLoginError("账号或密码不正确。");
      return;
    }
    try {
      if (!(await verifyAdminPassword(user, loginForm.password))) {
        setLoginError("账号或密码不正确。");
        return;
      }
      await writeAdminSession(user.username, user.passwordHash);
      setSessionUsername(user.username);
      setLoginError("");
      setLoginForm((current) => ({ ...current, password: "" }));
      setNotice(`已登录为 ${user.username}，Cookie 保留 ${ADMIN_SESSION_HOURS} 小时。`);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "登录失败，请检查浏览器环境。");
    }
  }

  function handleLogout() {
    clearAdminSession();
    setPublishToken("");
    setSessionUsername(null);
    setPasswordDraft({ next: "", confirm: "" });
    setPostEditorOpen(false);
    setBulletinEditorOpen(false);
    setNotice("已退出管理台。");
  }

  async function updateActiveAdminPassword() {
    if (!activeAdmin) return;
    if (!can("security.password")) {
      setNotice("当前管理员没有修改密码权限。");
      return;
    }
    if (passwordDraft.next.length < 8) {
      setNotice("新密码至少需要 8 个字符。");
      return;
    }
    if (passwordDraft.next !== passwordDraft.confirm) {
      setNotice("两次输入的新密码不一致。");
      return;
    }
    try {
      const passwordSalt = createAdminPasswordSalt();
      const passwordHash = await deriveAdminPasswordHash(
        passwordDraft.next,
        passwordSalt,
        ADMIN_PASSWORD_ITERATIONS
      );
      if (currentAdmin?.id === activeAdmin.id) {
        await writeAdminSession(activeAdmin.username, passwordHash);
      }
      updateActiveAdmin({
        passwordHash,
        passwordSalt,
        passwordIterations: ADMIN_PASSWORD_ITERATIONS,
      });
      setPasswordDraft({ next: "", confirm: "" });
      setNotice(`已更新 ${activeAdmin.username} 的密码摘要。`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "密码更新失败。");
    }
  }

  async function importDataset(file: File | undefined) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as unknown;
      const parsed = coerceDataset(raw);
      if (!parsed) throw new Error("invalid");
      persistDataset(parsed);
      setData(parsed);
      const importedUsers = coerceAdminUsers((raw as Partial<AdminExportPackage>).adminUsers);
      if (importedUsers) setAdminUsers(importedUsers);
      setSelected(createInitialSelected());
      setNotice("已导入管理台数据包。");
    } catch {
      setNotice("导入失败，文件必须是管理台导出的 JSON 数据包。");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function exportActiveSection() {
    const generators: Record<SectionKey, [string, string]> = {
      posts: ["blog.ts", generateBlogTs(data.posts)],
      bulletins: ["sidebar.ts", generateSidebarTs(data.bulletins)],
      bookmarks: ["bookmarks.ts", generateBookmarksTs(data.bookmarks)],
      resources: ["resources.ts", generateResourcesTs(data.resources)],
      gateways: ["gateways.ts", generateGatewaysTs(data.gateways)],
      admins: ["adminAuth.ts", generateAdminAuthTs(adminUsers)],
    };
    const [filename, content] = generators[activeSection];
    downloadText(filename, content, "text/typescript;charset=utf-8");
  }

  function exportAllSources() {
    downloadText(
      "yoki-admin-export.txt",
      [
        "=== src/data/blog.ts ===",
        generateBlogTs(data.posts),
        "=== src/data/sidebar.ts ===",
        generateSidebarTs(data.bulletins),
        "=== src/data/bookmarks.ts ===",
        generateBookmarksTs(data.bookmarks),
        "=== src/data/resources.ts ===",
        generateResourcesTs(data.resources),
        "=== src/data/gateways.ts ===",
        generateGatewaysTs(data.gateways),
        "=== src/data/adminAuth.ts ===",
        generateAdminAuthTs(adminUsers),
      ].join("\n\n"),
      "text/plain;charset=utf-8"
    );
  }

  async function publishStaticBuild() {
    if (!can("system.publish")) {
      setNotice("当前管理员没有发布构建权限。");
      return;
    }
    if (!publishToken.trim()) {
      setNotice("发布构建需要本地发布令牌。请从 start-local.ps1 启动输出中复制令牌，填入「发布令牌」。");
      return;
    }
    setPublishing(true);
    setNotice("正在写入静态源码并重新构建，请等待本地发布服务返回结果。");
    try {
      const response = await fetch(LOCAL_PUBLISH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Yoki-Publish-Token": publishToken.trim(),
        },
        body: serialize(createExportPackage(data, adminUsers)),
      });
      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            filesWritten?: string[];
            filesRemoved?: string[];
            build?: { code?: number; stderrTail?: string };
          }
        | null;
      if (!response.ok || !result?.ok) {
        const message = result?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }
      const written = result.filesWritten?.length ?? 0;
      const removed = result.filesRemoved?.length ?? 0;
      setNotice(`发布完成：写入 ${written} 个文件，移除 ${removed} 个旧 Markdown，构建已完成。`);
    } catch (error) {
      setNotice(
        `发布失败：${error instanceof Error ? error.message : "未知错误"}。请确认已在本机运行发布服务，并且发布令牌正确。`
      );
    } finally {
      setPublishing(false);
    }
  }

  function renderSectionList() {
    if (activeSection === "admins") {
      return adminUsers.map((user, index) => (
        <AdminListButton
          key={user.id}
          variant="unbounded"
          active={selected.admins === index}
          titleText={user.displayName || user.username}
          meta={`ADMIN / ${user.username}`}
          detail={`更新: ${user.updatedAt} / 权限: ${
            Object.values(mergePermissions(user.permissions)).filter(Boolean).length
          }`}
          badge={currentAdmin?.id === user.id ? "当前" : "ADMIN"}
          onClick={() => selectIndex("admins", index)}
        />
      ));
    }

    if (activeSection === "posts") {
      return data.posts.map((post, index) => (
        <AdminListButton
          key={post.id}
          variant="unbounded"
          active={selected.posts === index}
          titleText={post.title}
          meta={`${post.date} / ${post.id.toUpperCase()}`}
          detail={post.summary}
          badge={post.tag}
          onClick={() => selectIndex("posts", index)}
        />
      ));
    }

    if (activeSection === "bulletins") {
      return data.bulletins.map((item, index) => (
        <AdminListButton
          key={item.id || index}
          variant="unbounded"
          active={selected.bulletins === index}
          titleText={item.title}
          meta={item.id}
          detail={item.detail}
          badge={(item.tone || "info").toUpperCase()}
          onClick={() => selectIndex("bulletins", index)}
        />
      ));
    }

    if (activeSection === "bookmarks") {
      return data.bookmarks.map((item, index) => (
        <AdminListButton
          key={`${item.title}-${index}`}
          variant="unbounded"
          active={selected.bookmarks === index}
          titleText={item.title}
          meta={`BOOKMARK / ${index + 1}`}
          detail={item.url}
          badge={item.icon ? "ICON" : "LINK"}
          onClick={() => selectIndex("bookmarks", index)}
        />
      ));
    }

    if (activeSection === "resources") {
      return data.resources.map((item, index) => (
        <AdminListButton
          key={item.id}
          variant="unbounded"
          active={selected.resources === index}
          titleText={item.title}
          meta={`${item.type} / ${item.id.toUpperCase()}`}
          detail={item.summary}
          badge={item.clearance}
          onClick={() => selectIndex("resources", index)}
        />
      ));
    }

    return data.gateways.map((item, index) => (
      <AdminListButton
        key={item.code}
        variant="unbounded"
        active={selected.gateways === index}
        titleText={item.cn}
        meta={`${item.code} / ${item.en}`}
        detail={item.desc}
        badge="ROUTE"
        onClick={() => selectIndex("gateways", index)}
      />
    ));
  }

  function renderListActions() {
    if (activeSection === "admins") {
      return (
        <AdminButton icon={Plus} tone="accent" onClick={addAdminUser} disabled={!can("security.admins")}>
          新建管理员
        </AdminButton>
      );
    }

    if (activeSection === "posts") {
      return (
        <AdminToolbar>
          <AdminButton icon={Plus} tone="accent" onClick={addPost} disabled={!can("content.posts")}>
            新建文章
          </AdminButton>
          <AdminButton icon={Upload} onClick={() => markdownInputRef.current?.click()} disabled={!can("content.posts")}>
            上传 MD
          </AdminButton>
        </AdminToolbar>
      );
    }

    if (activeSection === "bulletins") {
      return (
        <AdminButton icon={Plus} tone="accent" onClick={addBulletin} disabled={!can("content.bulletins")}>
          新建公告
        </AdminButton>
      );
    }

    if (activeSection === "bookmarks") {
      return (
        <AdminButton icon={Plus} tone="accent" onClick={addBookmark} disabled={!can("content.bookmarks")}>
          新建书签
        </AdminButton>
      );
    }

    if (activeSection === "resources") {
      return (
        <AdminButton icon={Plus} tone="accent" onClick={addResource} disabled={!can("content.resources")}>
          新建资源
        </AdminButton>
      );
    }

    return <HudChip tone="warm">固定 3 个入口</HudChip>;
  }

  function renderEditor() {
    if (activeSection === "admins") {
      if (!activeAdmin) return <SystemState title="没有管理员" desc="新增管理员后可编辑。" />;
      const editable = can("security.admins");
      return (
        <>
          <AdminToolbar>
            <HudChip tone={currentAdmin?.id === activeAdmin.id ? "success" : "neutral"}>
              {currentAdmin?.id === activeAdmin.id ? "当前账号" : "管理员"}
            </HudChip>
            <AdminButton
              icon={Trash2}
              tone="danger"
              onClick={() => removeCurrent("admins")}
              disabled={!editable || currentAdmin?.id === activeAdmin.id || adminUsers.length <= 1}
            >
              删除管理员
            </AdminButton>
          </AdminToolbar>

          <UnboundedSurface className="rounded-[var(--yc-radius-md)] p-3">
            <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">登录保护 / AUTH GATE</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--yc-muted)]">
              密码使用带独立盐值的 PBKDF2-SHA-256 摘要保存，Cookie 只保存本地会话信息。静态页面的前端保护适合防止普通用户误入，不等同于服务器鉴权。
            </p>
          </UnboundedSurface>

          <div className="grid gap-3 md:grid-cols-2">
            <AdminField label="账号">
              <AdminTextInput
                value={activeAdmin.username}
                disabled={!editable}
                onChange={(event) => updateActiveAdmin({ username: event.target.value })}
              />
            </AdminField>
            <AdminField label="显示名称">
              <AdminTextInput
                value={activeAdmin.displayName}
                disabled={!editable}
                onChange={(event) => updateActiveAdmin({ displayName: event.target.value })}
              />
            </AdminField>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start">
            <AdminField label="新密码">
                <AdminTextInput
                  type="password"
                  autoComplete="new-password"
                  value={passwordDraft.next}
                disabled={!can("security.password")}
                onChange={(event) => setPasswordDraft((current) => ({ ...current, next: event.target.value }))}
              />
            </AdminField>
            <AdminField label="确认密码">
                <AdminTextInput
                  type="password"
                  autoComplete="new-password"
                  value={passwordDraft.confirm}
                disabled={!can("security.password")}
                onChange={(event) => setPasswordDraft((current) => ({ ...current, confirm: event.target.value }))}
              />
            </AdminField>
            <AdminButton
              icon={KeyRound}
              tone="warm"
              className="h-9 md:mt-[22px]"
              onClick={updateActiveAdminPassword}
              disabled={!can("security.password")}
            >
              更新密码
            </AdminButton>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--yc-dim)]">不会保存明文，只保存密码摘要。</p>

          <div className="grid gap-4">
            {ADMIN_PERMISSION_GROUPS.map((group) => (
              <UnboundedSurface
                key={group.id}
                className="rounded-[var(--yc-radius-md)] p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold tracking-wide text-[var(--yc-text)]">{group.label}</div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--yc-muted)]">{group.detail}</p>
                  </div>
                  <HudChip tone="accent">{group.permissions.length} 项</HudChip>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {group.permissions.map((permission) => (
                    <AdminSwitch
                      key={permission.key}
                      checked={Boolean(mergePermissions(activeAdmin.permissions)[permission.key])}
                      label={permission.label}
                      desc={permission.detail}
                      disabled={!editable}
                      onCheckedChange={(checked) => updateActiveAdminPermission(permission.key, checked)}
                    />
                  ))}
                </div>
              </UnboundedSurface>
            ))}
          </div>
        </>
      );
    }

    if (activeSection === "posts") {
      if (!activePost) return <SystemState title="没有文章节点" desc="新建或上传 Markdown 后可编辑。" />;
      return (
        <>
          <AdminToolbar>
            <AdminButton icon={Pencil} tone="accent" onClick={() => setPostEditorOpen(true)}>
              编辑正文
            </AdminButton>
            <AdminButton icon={FolderInput} onClick={loadMarkdownSource}>
              读取源文件
            </AdminButton>
            <AdminButton
              icon={Download}
              tone="accent"
              onClick={() => downloadText(activePost.markdownFilename || markdownFilenameForPost(activePost), generatedMarkdown(activePost), "text/markdown;charset=utf-8")}
            >
              下载 MD
            </AdminButton>
            <AdminButton icon={Trash2} tone="danger" onClick={() => removeCurrent("posts")}>
              删除
            </AdminButton>
          </AdminToolbar>

          <UnboundedSurface className="rounded-[var(--yc-radius-md)] p-3">
            <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">构建能力 / BUILD PIPELINE</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--yc-muted)]">
              文章由 Markdown 构建，支持 KaTeX 公式与 Shiki 代码高亮。该信息只供维护时确认，不在公开文章页展示。
            </p>
          </UnboundedSurface>

          <div className="grid gap-3 md:grid-cols-2">
            <AdminField label="ID">
              <AdminTextInput value={activePost.id} onChange={(event) => updatePost({ id: event.target.value })} />
            </AdminField>
            <AdminField label="日期">
              <AdminTextInput type="date" value={activePost.date} onChange={(event) => updatePost({ date: event.target.value })} />
            </AdminField>
            <AdminField label="标签">
              <AdminSelect value={activePost.tag} onChange={(event) => updatePost({ tag: event.target.value as BlogTag })}>
                {BLOG_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="页面链接">
              <AdminTextInput value={activePost.link} onChange={(event) => updatePost({ link: event.target.value })} />
            </AdminField>
          </div>

          <AdminField label="标题">
            <AdminTextInput value={activePost.title} onChange={(event) => updatePost({ title: event.target.value })} />
          </AdminField>
          <AdminField label="摘要">
            <AdminTextarea rows={3} value={activePost.summary} onChange={(event) => updatePost({ summary: event.target.value })} />
          </AdminField>
          <AdminField label="源文件名" hint="管理台用于显示和导出 Markdown 源文件，公开 Blog 侧栏不展示该路径。">
            <AdminTextInput
              value={activePost.markdownFilename || markdownFilenameForPost(activePost)}
              onChange={(event) => updatePost({ markdownFilename: event.target.value })}
            />
          </AdminField>
          <UnboundedSurface className="rounded-[var(--yc-radius-md)] p-3">
            <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">正文编辑 / FLOATING EDITOR</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--yc-muted)]">
              Markdown 正文已移入浮窗，左侧编辑原文本，右侧查看渲染预览。新增文章会先保存为管理台本地草稿，公开页面需要导出并重建。
            </p>
          </UnboundedSurface>
        </>
      );
    }

    if (activeSection === "bulletins") {
      if (!activeBulletin) return <SystemState title="没有公告" desc="新增公告后可编辑。" />;
      return (
        <>
          <AdminToolbar>
            <AdminButton icon={Pencil} tone="accent" onClick={() => setBulletinEditorOpen(true)}>
              编辑公告
            </AdminButton>
            <AdminButton icon={Trash2} tone="danger" onClick={() => removeCurrent("bulletins")}>
              删除
            </AdminButton>
          </AdminToolbar>
          <UnboundedSurface className="rounded-[var(--yc-radius-md)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="yc-hud-text break-words text-[9px] text-[var(--yc-dim)] [overflow-wrap:anywhere]">
                  {activeBulletin.id || "未设置 ID"}
                </div>
                <div className="mt-2 break-words text-base font-semibold tracking-wide text-[var(--yc-text)] [overflow-wrap:anywhere]">
                  {activeBulletin.title}
                </div>
              </div>
              <HudChip tone="warm">{(activeBulletin.tone || "info").toUpperCase()}</HudChip>
            </div>
            {activeBulletin.detail ? (
              <p className="mt-3 break-words text-sm leading-relaxed text-[var(--yc-muted)] [overflow-wrap:anywhere]">
                {activeBulletin.detail}
              </p>
            ) : null}
            {activeBulletin.href ? (
              <p className="mt-3 break-words text-xs leading-relaxed text-[var(--yc-dim)] [overflow-wrap:anywhere]">
                链接: {activeBulletin.href}
              </p>
            ) : null}
          </UnboundedSurface>
        </>
      );
    }

    if (activeSection === "bookmarks") {
      if (!activeBookmark) return <SystemState title="没有书签" desc="新增书签后可编辑。" />;
      return (
        <>
          <AdminToolbar>
            <AdminButton icon={Trash2} tone="danger" onClick={() => removeCurrent("bookmarks")}>
              删除
            </AdminButton>
          </AdminToolbar>
          <AdminField label="标题">
            <AdminTextInput value={activeBookmark.title} onChange={(event) => updateBookmark({ title: event.target.value })} />
          </AdminField>
          <AdminField label="URL">
            <AdminTextInput value={activeBookmark.url} onChange={(event) => updateBookmark({ url: event.target.value })} />
          </AdminField>
          <AdminField label="图标文件" hint="放在 public/logo 下时填写文件名，例如 openai.svg。">
            <AdminTextInput value={activeBookmark.icon || ""} onChange={(event) => updateBookmark({ icon: event.target.value })} />
          </AdminField>
        </>
      );
    }

    if (activeSection === "resources") {
      if (!activeResource) return <SystemState title="没有资源节点" desc="新增资源后可编辑。" />;
      return (
        <>
          <AdminToolbar>
            <AdminButton icon={Trash2} tone="danger" onClick={() => removeCurrent("resources")}>
              删除
            </AdminButton>
          </AdminToolbar>
          <div className="grid gap-3 md:grid-cols-3">
            <AdminField label="ID">
              <AdminTextInput value={activeResource.id} onChange={(event) => updateResource({ id: event.target.value })} />
            </AdminField>
            <AdminField label="类型">
              <AdminTextInput value={activeResource.type} onChange={(event) => updateResource({ type: event.target.value })} />
            </AdminField>
            <AdminField label="权限">
              <AdminSelect value={activeResource.clearance} onChange={(event) => updateResource({ clearance: event.target.value as ResourceItem["clearance"] })}>
                {clearanceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
          </div>
          <AdminField label="标题">
            <AdminTextInput value={activeResource.title} onChange={(event) => updateResource({ title: event.target.value })} />
          </AdminField>
          <AdminField label="摘要">
            <AdminTextarea rows={4} value={activeResource.summary} onChange={(event) => updateResource({ summary: event.target.value })} />
          </AdminField>
          <AdminField label="标签">
            <AdminTextInput value={activeResource.tags.join(", ")} onChange={(event) => updateResource({ tags: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
          </AdminField>
          <AdminField label="链接">
            <AdminTextInput value={activeResource.link} onChange={(event) => updateResource({ link: event.target.value })} />
          </AdminField>
        </>
      );
    }

    if (!activeGateway) return <SystemState title="没有门户路由" desc="默认门户路由需要保留 3 项。" />;
    return (
      <>
        <HudChip tone="warm">主入口固定 3 项</HudChip>
        <div className="grid gap-3 md:grid-cols-3">
          <AdminField label="CODE">
            <AdminTextInput value={activeGateway.code} onChange={(event) => updateGateway({ code: event.target.value })} />
          </AdminField>
          <AdminField label="CN">
            <AdminTextInput value={activeGateway.cn} onChange={(event) => updateGateway({ cn: event.target.value })} />
          </AdminField>
          <AdminField label="EN">
            <AdminTextInput value={activeGateway.en} onChange={(event) => updateGateway({ en: event.target.value })} />
          </AdminField>
        </div>
        <AdminField label="说明">
          <AdminTextarea rows={4} value={activeGateway.desc} onChange={(event) => updateGateway({ desc: event.target.value })} />
        </AdminField>
        <AdminField label="链接">
          <AdminTextInput value={activeGateway.href} onChange={(event) => updateGateway({ href: event.target.value })} />
        </AdminField>
      </>
    );
  }

  function renderFloatingEditors() {
    const markdown = activePost ? generatedMarkdown(activePost) : "";

    return (
      <>
        <AdminModal
          open={postEditorOpen && Boolean(activePost)}
          label="文章正文 / MARKDOWN EDITOR"
          sublabel={activePost?.markdownFilename || "MD SOURCE"}
          size="xl"
          onClose={() => setPostEditorOpen(false)}
          right={
            <AdminToolbar>
              <AdminButton icon={FolderInput} onClick={loadMarkdownSource} disabled={!activePost}>
                读取源文件
              </AdminButton>
              <AdminButton
                icon={Download}
                tone="accent"
                disabled={!activePost}
                onClick={() => {
                  if (!activePost) return;
                  downloadText(
                    activePost.markdownFilename || markdownFilenameForPost(activePost),
                    generatedMarkdown(activePost),
                    "text/markdown;charset=utf-8"
                  );
                }}
              >
                下载 MD
              </AdminButton>
              <AdminButton icon={X} onClick={() => setPostEditorOpen(false)}>
                关闭
              </AdminButton>
            </AdminToolbar>
          }
        >
          {activePost ? (
            <div className="grid min-w-0 gap-4 lg:grid-cols-2">
              <AdminField label="原文本">
                <AdminTextarea
                  rows={22}
                  value={markdown}
                  placeholder="点击读取源文件，或直接粘贴 Markdown。"
                  className="min-h-[58vh] font-mono text-xs leading-relaxed"
                  onChange={(event) => updatePost({ markdown: event.target.value })}
                />
              </AdminField>
              <div className="grid min-w-0 gap-2">
                <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">渲染视图</div>
                <div
                  className="min-h-[58vh] overflow-auto rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] p-4 text-sm leading-relaxed text-[var(--yc-text)] [&_code]:rounded [&_code]:bg-[var(--yc-surface)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[var(--yc-text)] [&_em]:text-[var(--yc-muted)] [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h4]:font-semibold [&_li]:mb-1.5 [&_p]:mb-3 [&_pre]:mb-4 [&_pre]:overflow-auto [&_pre]:rounded-[var(--yc-radius-sm)] [&_pre]:border [&_pre]:border-[var(--yc-line)] [&_pre]:bg-[var(--yc-bg-1)] [&_pre]:p-3 [&_strong]:text-[var(--yc-text)] [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: renderMarkdownPreviewHtml(markdown) }}
                />
              </div>
            </div>
          ) : null}
        </AdminModal>

        <AdminModal
          open={bulletinEditorOpen && Boolean(activeBulletin)}
          label="公告编辑 / BULLETIN EDITOR"
          sublabel={activeBulletin?.id || "NOTICE"}
          size="md"
          onClose={() => setBulletinEditorOpen(false)}
          right={
            <AdminToolbar>
              <AdminButton icon={X} onClick={() => setBulletinEditorOpen(false)}>
                关闭
              </AdminButton>
            </AdminToolbar>
          }
        >
          {activeBulletin ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="ID">
                  <AdminTextInput value={activeBulletin.id} onChange={(event) => updateBulletin({ id: event.target.value })} />
                </AdminField>
                <AdminField label="提示类型">
                  <AdminSelect value={activeBulletin.tone || "info"} onChange={(event) => updateBulletin({ tone: event.target.value as SidebarFeedItem["tone"] })}>
                    {bulletinToneOptions.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone.toUpperCase()}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
              </div>
              <AdminField label="标题">
                <AdminTextInput value={activeBulletin.title} onChange={(event) => updateBulletin({ title: event.target.value })} />
              </AdminField>
              <AdminField label="说明">
                <AdminTextarea rows={5} value={activeBulletin.detail || ""} onChange={(event) => updateBulletin({ detail: event.target.value })} />
              </AdminField>
              <AdminField label="链接">
                <AdminTextInput value={activeBulletin.href || ""} onChange={(event) => updateBulletin({ href: event.target.value })} />
              </AdminField>
            </>
          ) : null}
        </AdminModal>
      </>
    );
  }

  const sectionDefs: Array<{
    key: SectionKey;
    label: string;
    meta: string;
    detail: string;
    count: number;
  }> = [
    { key: "posts", label: "Blog 文章", meta: "文章", detail: "上传、编辑、删除 Markdown 文章。", count: data.posts.length },
    { key: "bulletins", label: "侧栏公告", meta: "公告", detail: "管理门户侧边栏公告。", count: data.bulletins.length },
    { key: "bookmarks", label: "侧栏书签", meta: "书签", detail: "管理常用入口与图标文件名。", count: data.bookmarks.length },
    { key: "resources", label: "资源节点", meta: "资源", detail: "管理资源站卡片数据。", count: data.resources.length },
    { key: "gateways", label: "门户路由", meta: "入口", detail: "编辑首页三项主入口。", count: data.gateways.length },
    { key: "admins", label: "管理员", meta: "账号", detail: "维护账号、密码摘要与权限开关。", count: adminUsers.length },
  ];

  const activeSectionIcon =
    activeSection === "posts"
      ? BookOpen
      : activeSection === "bookmarks"
        ? Bookmark
        : activeSection === "resources"
          ? Database
          : activeSection === "admins"
            ? UserCog
            : Radio;

  if (!authReady) {
    return (
      <div className="app-root min-h-screen bg-[var(--yc-bg-0)] text-[var(--yc-text)]">
        <LocalStyles />
        <div className="bg-grid fixed inset-0 pointer-events-none" />
        <main className="relative mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
          <SystemState kind="loading" title="正在检查登录状态" desc="读取本地 Cookie 并确认管理员账号。" />
        </main>
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <div className="app-root min-h-screen bg-[var(--yc-bg-0)] text-[var(--yc-text)]">
        <LocalStyles />
        <div className="bg-grid fixed inset-0 pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none opacity-20 grain" />
        <main className="relative mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
          <AdminPanel
            label="管理台登录 / ADMIN LOGIN"
            sublabel={`COOKIE: ${ADMIN_SESSION_HOURS}H`}
            icon={ShieldCheck}
            right={<ThemeToggleButton isLight={isLight} onToggle={toggleTheme} />}
            className="w-full"
          >
            <form className="grid gap-4" onSubmit={handleLogin}>
              <div><BackLink /></div>
              <div>
                <MetaRail items={["需要验证", "密码摘要", "本地会话"]} tone="warm" />
                <h1 className="mt-3 text-2xl font-semibold tracking-wide text-[var(--yc-text)] md:text-3xl">
                  内容管理台
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[var(--yc-muted)]">
                  请输入管理员账号和密码。密码会在浏览器中计算 PBKDF2-SHA-256 摘要后再比对，Cookie 不保存明文密码。
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="账号">
                  <AdminTextInput
                    autoComplete="username"
                    value={loginForm.username}
                    onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  />
                </AdminField>
                <AdminField label="密码" error={loginError}>
                  <AdminTextInput
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  />
                </AdminField>
              </div>

              <UnboundedSurface className="rounded-[var(--yc-radius-md)] p-3 text-xs leading-relaxed text-[var(--yc-muted)]">
                当前静态站保护用于避免普通用户误入。若部署后需要真正的访问控制，需要把登录校验放到服务器或边缘中间件。
              </UnboundedSurface>

              <AdminToolbar className="justify-between">
                <HudChip tone="neutral">Cookie: {ADMIN_SESSION_COOKIE}</HudChip>
                <AdminButton type="submit" icon={KeyRound} tone="accent">
                  登录管理台
                </AdminButton>
              </AdminToolbar>
            </form>
          </AdminPanel>
        </main>
      </div>
    );
  }

  return (
    <div className="app-root min-h-screen bg-[var(--yc-bg-0)] text-[var(--yc-text)]">
      <LocalStyles />
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-20 grain" />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => importDataset(event.target.files?.[0])}
      />
      <input
        ref={markdownInputRef}
        type="file"
        accept=".md,text/markdown,text/plain"
        multiple
        className="hidden"
        onChange={(event) => handleMarkdownUpload(event.target.files)}
      />

      <main className="relative mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        <details className="mb-6 rounded-xl border border-[var(--yc-line)] bg-[var(--yc-surface)] p-4">
          <summary className="cursor-pointer text-sm text-[var(--yc-text)]">板子图片管理（{algorithmImages.length}）</summary>
          <p className="my-3 text-xs text-[var(--yc-muted)]">图片目录仅在管理台列出。正文引用的图片仍可通过图片地址读取；修改图片后使用本地同步更新。</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {algorithmImages.map((name) => <a key={name} href={sitePath(`/algorithm-assets/${encodeURIComponent(name)}`)} target="_blank" rel="noreferrer" className="min-w-0 rounded-lg border border-[var(--yc-line)] p-3">
              <img src={sitePath(`/algorithm-assets/${encodeURIComponent(name)}`)} alt={name} loading="lazy" className="h-28 w-full object-contain" />
              <span className="mt-2 block break-all text-xs">{name}</span>
            </a>)}
          </div>
        </details>
        <div className="mb-6 flex flex-col gap-4 border-b border-[var(--yc-line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MetaRail items={["内容管理", "本地草稿", "可导出"]} tone="warm" />
            <h1 className="mt-4 text-3xl font-semibold tracking-wide text-[var(--yc-text)] md:text-4xl">
              内容管理台
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--yc-muted)]">
              上传和维护 Blog、公告、书签、资源节点与门户路由。本地发布服务启动后，可直接写入静态源码并重新构建。
            </p>
          </div>

          <AdminToolbar>
            <BackLink />
            <ThemeToggleButton isLight={isLight} onToggle={toggleTheme} />
            <HudChip tone="success">当前: {currentAdmin.username}</HudChip>
            <AdminButton icon={FolderInput} onClick={() => fileInputRef.current?.click()} disabled={!can("system.import")}>
              导入 JSON
            </AdminButton>
            <AdminButton
              icon={Save}
              tone="accent"
              disabled={!can("system.export")}
              onClick={() => downloadText("yoki-admin-dataset.json", serialize(createExportPackage(data, adminUsers)), "application/json;charset=utf-8")}
            >
              导出 JSON
            </AdminButton>
            <AdminButton icon={FileDown} tone="warm" onClick={exportAllSources} disabled={!can("system.export")}>
              导出全部
            </AdminButton>
            <AdminButton
              icon={Rocket}
              tone="success"
              onClick={publishStaticBuild}
              disabled={!can("system.publish") || publishing}
            >
              {publishing ? "发布中" : "发布构建"}
            </AdminButton>
            <AdminButton
              icon={RotateCcw}
              disabled={!can("system.reset")}
              onClick={() => {
                const initial = createInitialDataset();
                persistDataset(initial);
                setData(initial);
                setSelected(createInitialSelected());
                setNotice("已恢复为源码中的初始数据。");
              }}
            >
              重置
            </AdminButton>
            <AdminButton icon={LogOut} tone="danger" onClick={handleLogout}>
              退出
            </AdminButton>
          </AdminToolbar>
        </div>

        <AdminStatStrip items={stats} />

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
          <UnboundedSurface className="rounded-[var(--yc-radius-md)] px-3 py-2 text-xs leading-relaxed text-[var(--yc-muted)]">
            管理台草稿保存在当前浏览器；公开内容需要发布构建。操作回执将在顶部通讯窗口显示。
          </UnboundedSurface>
          <UnboundedSurface tone="warm" className="rounded-[var(--yc-radius-md)] p-3">
            <AdminField
              label="发布令牌"
               hint="start-local.ps1 启动时会显示本次令牌；令牌只保留到当前标签会话结束。"
            >
              <AdminTextInput
                type="password"
                autoComplete="off"
                value={publishToken}
                placeholder="粘贴本地发布令牌"
                onChange={(event) => setPublishToken(event.target.value)}
              />
            </AdminField>
          </UnboundedSurface>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
          <AdminPanel label="管理路由 / ADMIN ROUTER" sublabel="选择数据集" icon={LayoutGrid} variant="unbounded">
            {sectionDefs.map((section) => (
              <AdminListButton
                key={section.key}
                variant="unbounded"
                active={activeSection === section.key}
                titleText={section.label}
                meta={section.meta}
                detail={section.detail}
                badge={String(section.count)}
                onClick={() => {
                  if (!can(sectionPermissionMap[section.key])) {
                    setNotice(`当前管理员没有访问「${section.label}」的权限。`);
                    return;
                  }
                  setActiveSection(section.key);
                }}
              />
            ))}
          </AdminPanel>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(280px,0.8fr)_minmax(360px,1.2fr)]">
            <AdminPanel
              label="节点索引 / NODE INDEX"
              sublabel="选择条目"
              icon={activeSectionIcon}
              right={renderListActions()}
              variant="unbounded"
            >
              {renderSectionList().length ? renderSectionList() : <SystemState title="列表为空" desc="使用上方动作创建新的节点。" />}
            </AdminPanel>

            <AdminPanel
              label="节点详情 / NODE DETAIL"
              sublabel="本地草稿"
              icon={FileText}
              right={
                <AdminButton icon={Download} tone="accent" onClick={exportActiveSection} disabled={!can("system.export")}>
                  导出 TS
                </AdminButton>
              }
            >
              {renderEditor()}
            </AdminPanel>
          </div>
        </div>
      </main>
      {renderFloatingEditors()}
    </div>
  );
}
