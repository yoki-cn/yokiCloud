import { existsSync, watch as watchDirectory } from "node:fs";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const scriptDir = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(scriptDir, "..");
const configPath = resolve(repoRoot, "algorithm-sync.config.json");
const VALID_STATUSES = new Set(["optimizing", "usable", "verified", "draft", "deprecated"]);
const ASSET_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const MANUAL_FRONTMATTER_FIELDS = ["kind", "title", "status", "order", "tags"];

function toPosix(value) {
  return value.split(sep).join("/");
}

function assertInside(root, target, label) {
  const rel = relative(root, target);
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`${label} 必须位于项目目录内：${target}`);
  }
}

async function readConfig(sourceOverride) {
  const raw = await readFile(configPath, "utf8");
  const config = JSON.parse(raw);
  const configuredSource = sourceOverride || process.env.YOKI_ALGORITHM_SOURCE || config.sourceDir;
  if (!configuredSource || typeof configuredSource !== "string") {
    throw new Error("未配置算法板子源目录。请设置 algorithm-sync.config.json 或 YOKI_ALGORITHM_SOURCE。");
  }

  const sourceDir = resolve(configuredSource);
  const contentDir = resolve(repoRoot, config.contentDir || "src/content/algorithms");
  const assetTargetDir = resolve(repoRoot, config.assetTargetDir || "public/algorithm-assets");
  assertInside(repoRoot, contentDir, "contentDir");
  assertInside(repoRoot, assetTargetDir, "assetTargetDir");

  return {
    ...config,
    sourceDir,
    contentDir,
    assetTargetDir,
    assetSourceDir: resolve(sourceDir, config.assetDirectory || "图片"),
  };
}

async function walkFiles(root) {
  if (!existsSync(root)) return [];
  const output = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) output.push(absolute);
    }
  }

  await visit(root);
  return output;
}

function parseFrontmatter(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { frontmatter: {}, body: normalized };
  const closing = normalized.indexOf("\n---\n", 4);
  if (closing < 0) return { frontmatter: {}, body: normalized };

  const yaml = normalized.slice(4, closing);
  const parsed = parseYaml(yaml);
  const frontmatter = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return { frontmatter, body: normalized.slice(closing + 5) };
}

function plainHeading(value) {
  return String(value || "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

function removeLeadingDocumentTitle(body, title) {
  const lines = body.split("\n");
  const firstContent = lines.findIndex((line) => line.trim());
  const heading = firstContent < 0 ? null : lines[firstContent].match(/^#{1,2}\s+(.+?)\s*#*$/);
  if (!heading || plainHeading(heading[1]) !== plainHeading(title)) return body;

  lines.splice(firstContent, 1);
  while (firstContent < lines.length && !lines[firstContent].trim()) lines.splice(firstContent, 1);
  if (lines[firstContent]?.trim() === "---") lines.splice(firstContent, 1);
  while (firstContent < lines.length && !lines[firstContent].trim()) lines.splice(firstContent, 1);
  return lines.join("\n");
}

function rewriteAssetLinks(body, assetSourceDir) {
  const rewritten = body.replace(/(!\[[^\]]*\]\()([^)]+)(\))/g, (full, opening, destination, closing) => {
    const normalized = destination.trim().replace(/\\/g, "/");
    const imageMarker = normalized.lastIndexOf("图片/");
    if (imageMarker < 0) {
      if (!normalized.includes("/") && ASSET_EXTENSIONS.has(extname(normalized).toLowerCase()) && existsSync(resolve(assetSourceDir, normalized))) {
        return `${opening}/algorithm-assets/${encodeURIComponent(normalized)}${closing}`;
      }
      return full;
    }
    const asset = normalized.slice(imageMarker + "图片/".length);
    return `${opening}/algorithm-assets/${asset}${closing}`;
  });
  return rewritten.replace(/\$O\(([\p{Script=Han}]+)\)\$/gu, (_full, label) => `$O(\\text{${label}})$`);
}

function dateString(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function validateManualFrontmatter(frontmatter) {
  const issues = [];
  if (frontmatter.kind !== "algorithm") issues.push("kind: algorithm");
  if (typeof frontmatter.title !== "string" || !frontmatter.title.trim()) issues.push("title");
  if (!VALID_STATUSES.has(frontmatter.status)) issues.push("status");
  if (typeof frontmatter.order !== "number" || !Number.isFinite(frontmatter.order)) issues.push("order（数字）");
  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.some((tag) => typeof tag !== "string")) {
    issues.push("tags（字符串数组）");
  }
  return issues;
}

async function transformBoard(sourcePath, assetSourceDir) {
  const source = await readFile(sourcePath, "utf8");
  const fileInfo = await stat(sourcePath);
  const { frontmatter: sourceFrontmatter, body: rawBody } = parseFrontmatter(source);
  const issues = validateManualFrontmatter(sourceFrontmatter);
  if (issues.length) return { content: null, issues };

  const body = rewriteAssetLinks(removeLeadingDocumentTitle(rawBody, sourceFrontmatter.title), assetSourceDir).trim();

  const frontmatter = {
    kind: sourceFrontmatter.kind,
    title: sourceFrontmatter.title.trim(),
    updated: dateString(fileInfo.mtime),
    status: sourceFrontmatter.status,
    order: sourceFrontmatter.order,
    tags: sourceFrontmatter.tags,
  };

  const yaml = stringifyYaml(frontmatter, { lineWidth: 0 }).trimEnd();
  return { content: `---\n${yaml}\n---\n\n${body}\n`, issues: [] };
}

async function sameContent(target, content) {
  try {
    const existing = await readFile(target);
    const next = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    return existing.equals(next);
  } catch {
    return false;
  }
}

async function writeExpectedFiles(expected, dryRun) {
  let created = 0;
  let updated = 0;

  for (const [target, content] of expected) {
    if (await sameContent(target, content)) continue;
    const existed = existsSync(target);
    if (!dryRun) {
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    if (existed) updated += 1;
    else created += 1;
  }

  return { created, updated };
}

async function pruneUnexpectedFiles(root, expectedPaths, allowedExtensions, dryRun) {
  if (!existsSync(root)) return 0;
  const files = await walkFiles(root);
  let removed = 0;

  for (const file of files) {
    if (!allowedExtensions.has(extname(file).toLowerCase()) || expectedPaths.has(file)) continue;
    if (!dryRun) await rm(file, { force: true });
    removed += 1;
  }
  return removed;
}

function compileExcludes(patterns) {
  return (Array.isArray(patterns) ? patterns : []).map((pattern) => new RegExp(pattern, "i"));
}

export async function syncAlgorithms(options = {}) {
  const config = await readConfig(options.sourceDir);
  if (!existsSync(config.sourceDir)) {
    if (options.allowMissing) {
      return { skipped: true, reason: `源目录不存在：${config.sourceDir}` };
    }
    throw new Error(`算法板子源目录不存在：${config.sourceDir}`);
  }

  const chapterPattern = new RegExp(config.chapterDirectoryPattern || "^\\d+\\.\\s");
  const excludes = compileExcludes(config.excludeFileNamePatterns);
  const sourceFiles = await walkFiles(config.sourceDir);
  const manifest = config.manifest ? JSON.parse(await readFile(resolve(repoRoot, config.manifest), "utf8")) : null;
  const selected = manifest ? new Set(manifest.files.map((file) => file.path)) : null;
  const boardFiles = sourceFiles.filter((file) => {
    if (extname(file).toLowerCase() !== ".md") return false;
    const rel = toPosix(relative(config.sourceDir, file));
    if (selected) return selected.has(rel);
    const [topLevel] = rel.split("/");
    return chapterPattern.test(topLevel) && !excludes.some((pattern) => pattern.test(basename(file)));
  });
  if (selected && boardFiles.length !== selected.size) {
    throw new Error("发布清单中的文件缺失，请先核对源目录和清单。同步尚未写入。");
  }

  const expectedBoards = new Map();
  const metadataIssues = [];
  for (const sourceFile of boardFiles) {
    const rel = toPosix(relative(config.sourceDir, sourceFile));
    const target = resolve(config.contentDir, ...rel.split("/"));
    assertInside(config.contentDir, target, "算法板子目标文件");
    const transformed = await transformBoard(sourceFile, config.assetSourceDir);
    if (transformed.issues.length) {
      metadataIssues.push({ path: rel, fields: transformed.issues });
      if (existsSync(target)) expectedBoards.set(target, await readFile(target));
      continue;
    }
    expectedBoards.set(target, transformed.content);
  }

  if ((options.requireMetadata || manifest) && metadataIssues.length) {
    const examples = metadataIssues
      .slice(0, 5)
      .map((issue) => `- ${issue.path}：${issue.fields.join("、")}`)
      .join("\n");
    throw new Error(
      `${metadataIssues.length} 份板子尚未填写完整的手动 YAML 字段，已停止发布。\n${examples}` +
      `${metadataIssues.length > 5 ? `\n- 另有 ${metadataIssues.length - 5} 份……` : ""}`
    );
  }

  const expectedAssets = new Map();
  for (const sourceFile of await walkFiles(config.assetSourceDir)) {
    const extension = extname(sourceFile).toLowerCase();
    if (!ASSET_EXTENSIONS.has(extension)) continue;
    const rel = toPosix(relative(config.assetSourceDir, sourceFile));
    const target = resolve(config.assetTargetDir, ...rel.split("/"));
    assertInside(config.assetTargetDir, target, "算法配图目标文件");
    expectedAssets.set(target, await readFile(sourceFile));
  }

  const boardWrites = await writeExpectedFiles(expectedBoards, Boolean(options.dryRun));
  if (manifest && !options.dryRun) {
    for (const directory of manifest.directories) {
      const target = resolve(config.contentDir, directory);
      assertInside(config.contentDir, target, "目录占位");
      await mkdir(target, { recursive: true });
      if (!manifest.files.some((file) => file.path.startsWith(directory + "/"))) {
        await writeFile(resolve(target, ".gitkeep"), "");
      }
    }
  }
  const assetWrites = await writeExpectedFiles(expectedAssets, Boolean(options.dryRun));
  const shouldPrune = options.prune !== false;
  const removedBoards = shouldPrune && metadataIssues.length === 0
    ? await pruneUnexpectedFiles(config.contentDir, new Set(expectedBoards.keys()), new Set([".md"]), Boolean(options.dryRun))
    : 0;
  const removedAssets = shouldPrune
    ? await pruneUnexpectedFiles(config.assetTargetDir, new Set(expectedAssets.keys()), ASSET_EXTENSIONS, Boolean(options.dryRun))
    : 0;

  return {
    skipped: false,
    sourceDir: config.sourceDir,
    boardCount: boardFiles.length,
    validBoardCount: boardFiles.length - metadataIssues.length,
    metadataIssues,
    requiredFields: MANUAL_FRONTMATTER_FIELDS,
    assetCount: expectedAssets.size,
    created: boardWrites.created + assetWrites.created,
    updated: boardWrites.updated + assetWrites.updated,
    removed: removedBoards + removedAssets,
    dryRun: Boolean(options.dryRun),
  };
}

function parseArgs(argv) {
  const options = { watch: false, dryRun: false, prune: true, allowMissing: false, sourceDir: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--watch") options.watch = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--no-prune") options.prune = false;
    else if (arg === "--allow-missing") options.allowMissing = true;
    else if (arg === "--source") {
      options.sourceDir = argv[index + 1] || "";
      index += 1;
    }
  }
  return options;
}

function printResult(result) {
  if (result.skipped) {
    console.warn(`[algorithms] 已跳过同步：${result.reason}`);
    return;
  }
  const mode = result.dryRun ? "预检完成" : "同步完成";
  console.log(
    `[algorithms] ${mode}：${result.boardCount} 份板子，${result.assetCount} 个附件；` +
    `新增 ${result.created}，更新 ${result.updated}，移除 ${result.removed}。`
  );
  if (result.metadataIssues.length) {
    console.warn(
      `[algorithms] ${result.metadataIssues.length} 份板子尚未补齐手动 YAML，已保留其现有网站镜像，不会覆盖或删除。`
    );
    for (const issue of result.metadataIssues.slice(0, 5)) {
      console.warn(`[algorithms] - ${issue.path}：${issue.fields.join("、")}`);
    }
    if (result.metadataIssues.length > 5) {
      console.warn(`[algorithms] - 另有 ${result.metadataIssues.length - 5} 份……`);
    }
  }
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));
  const initial = await syncAlgorithms(options);
  printResult(initial);
  if (!options.watch || initial.skipped) return;

  const config = await readConfig(options.sourceDir);
  let timer = null;
  let running = false;
  let rerun = false;

  async function executeQueuedSync() {
    if (running) {
      rerun = true;
      return;
    }
    running = true;
    try {
      printResult(await syncAlgorithms(options));
    } catch (error) {
      console.error(`[algorithms] 同步失败：${error.message || error}`);
    } finally {
      running = false;
      if (rerun) {
        rerun = false;
        await executeQueuedSync();
      }
    }
  }

  const watcher = watchDirectory(config.sourceDir, { recursive: true }, () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(executeQueuedSync, 350);
  });

  console.log(`[algorithms] 正在监听：${config.sourceDir}`);
  const close = () => watcher.close();
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(`[algorithms] ${error.message || error}`);
    process.exit(1);
  });
}
