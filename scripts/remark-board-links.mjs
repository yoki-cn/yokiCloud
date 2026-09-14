import fs from "node:fs";
import path from "node:path";
const root = path.resolve("src/content/algorithms");
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? files(path.join(dir, entry.name)) : entry.name.endsWith(".md") ? [path.join(dir, entry.name)] : []);
}
export default function remarkBoardLinks() {
  // Rebuild the index for each processor: sync may have added or removed boards.
  const slugs = files(root).map((file) => path.relative(root, file).replaceAll("\\", "/").replace(/\.md$/, ""));
  return (tree, file) => {
    const current = path.relative(root, String(file.path || "")).replaceAll("\\", "/").replace(/\.md$/, "");
    function walk(node) {
      if ((node.type === "link" || node.type === "definition") && typeof node.url === "string") {
        let url;
        try { url = decodeURIComponent(node.url); } catch { url = node.url; }
        if (url.startsWith("/algorithms/") && !url.includes("?")) url = url.slice(12);
        else if (/^(?:[a-z]+:|\/|#)/i.test(url)) { node.children?.forEach(walk); return; }
        const [raw, hash] = url.split("#");
        const target = raw.replace(/\/$/, "").replace(/\.md$/i, "");
        const candidates = slugs.filter((slug) => slug === target || slug === path.posix.normalize(path.posix.join(path.posix.dirname(current), target)));
        const byName = slugs.filter((slug) => slug.split("/").at(-1) === target.split("/").at(-1));
        const match = candidates.length === 1 ? candidates[0] : byName.length === 1 ? byName[0] : null;
        if (match) node.url = `/algorithms/${match.split("/").map(encodeURIComponent).join("/")}/${hash ? `#${encodeURIComponent(hash)}` : ""}`;
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}
