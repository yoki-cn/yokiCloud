import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { repoRoot, syncAlgorithms } from "./sync-algorithms.mjs";

const MANAGED_PATHS = ["src/content/algorithms", "public/algorithm-assets", "public/algorithm-pdfs", "docs/algorithm-publication-manifest.json"];

function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const isWindowsNpm = process.platform === "win32" && command === "npm";
    const executable = isWindowsNpm ? process.env.ComSpec || "cmd.exe" : command;
    const executableArgs = isWindowsNpm ? ["/d", "/s", "/c", "npm", ...args] : args;
    const child = spawn(executable, executableArgs, {
      cwd: repoRoot,
      shell: false,
      stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", rejectRun);
    child.on("close", (code) => resolveRun({ code: code ?? 1, stdout, stderr }));
  });
}

async function mustRun(command, args, options) {
  const result = await run(command, args, options);
  if (result.code !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} 执行失败。${detail ? `\n${detail}` : ""}`);
  }
  return result;
}

function parseArgs(argv) {
  const options = { sourceDir: "", message: "" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--source") {
      options.sourceDir = argv[index + 1] || "";
      index += 1;
    } else if (argv[index] === "--message") {
      options.message = argv[index + 1] || "";
      index += 1;
    }
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const remote = await run("git", ["remote", "get-url", "origin"], { capture: true });
  if (remote.code !== 0 || !remote.stdout.trim()) {
    throw new Error("当前仓库尚未配置 origin。请先连接 GitHub 仓库，再执行发布命令。");
  }

  const branchResult = await mustRun("git", ["branch", "--show-current"], { capture: true });
  const branch = branchResult.stdout.trim();
  if (!branch) throw new Error("当前处于 detached HEAD，无法安全推送算法板子。");

  const syncResult = await syncAlgorithms({ sourceDir: options.sourceDir, prune: true, requireMetadata: true });
  console.log(`[algorithms] 已读取 ${syncResult.boardCount} 份板子与 ${syncResult.assetCount} 个附件。`);

  await mustRun("npm", ["run", "check"]);
  await mustRun("npm", ["run", "build"]);
  await mustRun("git", ["add", "-A", "--", ...MANAGED_PATHS]);

  const changed = await run("git", ["diff", "--cached", "--quiet", "--", ...MANAGED_PATHS]);
  if (changed.code === 0) {
    console.log("[algorithms] 仓库中的板子已经是最新版本；正在确认远端分支同步状态。");
    await mustRun("git", ["push", "origin", branch]);
    console.log(`[algorithms] origin/${branch} 已是最新状态。`);
    return;
  }
  if (changed.code !== 1) throw new Error("无法检查算法板子的暂存变更。");

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
  const message = options.message || `content(algorithms): sync Obsidian boards ${timestamp}`;
  await mustRun("git", ["commit", "--only", "-m", message, "--", ...MANAGED_PATHS]);
  await mustRun("git", ["push", "origin", branch]);
  console.log(`[algorithms] 已推送到 origin/${branch}；GitHub 部署流程会使用这次提交更新网站。`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`[algorithms] ${error.message || error}`);
    process.exit(1);
  });
}
