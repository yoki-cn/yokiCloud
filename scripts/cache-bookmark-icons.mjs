import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
const source = await fs.readFile("src/data/bookmarks.ts", "utf8");
const js = ts.transpile(source, { module: ts.ModuleKind.ESNext });
const { BOOKMARKS } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const known = {
  "cxyonly.fans": "/daguan-curve-icon.png",
  "www.algowiki.cn": "/favicon.svg",
  "kenkoooo.com": "/atcoder/favicon.ico",
  "anacc22.github.io": "/another_graph_editor/favicon.png",
};
await fs.mkdir("public/logo/bookmarks", { recursive: true });
await Promise.all(BOOKMARKS.map(async (bookmark) => {
  if (bookmark.icon) return;
  const url = new URL(bookmark.url);
  const output = path.join("public/logo/bookmarks", `${url.hostname}.ico`);
  try { await fs.access(output); return; } catch {}
  for (const candidate of [known[url.hostname] ? `${url.origin}${known[url.hostname]}` : `${url.origin}/favicon.ico`, `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`, `https://www.google.com/s2/favicons?sz=64&domain=${url.hostname}`]) {
    try {
      const result = await fetch(candidate, { signal: AbortSignal.timeout(15000) });
      if (!result.ok || !result.headers.get("content-type")?.startsWith("image/")) continue;
      const bytes = Buffer.from(await result.arrayBuffer());
      if (!bytes.length || bytes.length > 1024 * 1024) continue;
      await fs.writeFile(result.headers.get("content-type")?.includes("svg") ? output.replace(/\.ico$/, ".svg") : output, bytes);
      console.log(`Cached: ${bookmark.title}`);
      return;
    } catch {}
  }
  console.log(`Unavailable: ${bookmark.title}`);
}));
