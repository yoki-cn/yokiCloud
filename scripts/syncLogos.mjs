import path from "node:path";
import { fileURLToPath } from "node:url";
import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function existsDir(dirPath) {
  const s = await stat(dirPath).catch(() => null);
  return Boolean(s?.isDirectory());
}

async function copyDir(srcDir, dstDir) {
  await mkdir(dstDir, { recursive: true });
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dst = path.join(dstDir, e.name);
    if (e.isDirectory()) {
      await copyDir(src, dst);
      continue;
    }
    if (e.isFile()) {
      await copyFile(src, dst);
    }
  }
}

async function main() {
  const logDir = path.resolve(__dirname, "..");
  const srcLogosDir = path.resolve(logDir, "..", "logo");
  const publicLogoDir = path.resolve(logDir, "public", "logo");

  const hasSrc = await existsDir(srcLogosDir);
  if (!hasSrc) {
    process.stdout.write(`[sync-logos] Skip: source not found: ${srcLogosDir}\n`);
    return;
  }

  await rm(publicLogoDir, { recursive: true, force: true });
  await copyDir(srcLogosDir, publicLogoDir);
  process.stdout.write(`[sync-logos] Synced: ${srcLogosDir} -> ${publicLogoDir}\n`);
}

main().catch((err) => {
  process.stderr.write(`[sync-logos] ${err?.message || String(err)}\n`);
  process.exitCode = 1;
});
