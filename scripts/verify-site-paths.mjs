import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { withBasePath } from "./site-path.mjs";
import rehypeSitePath from "./rehype-site-path.mjs";
import remarkObsidian from "./remark-obsidian.mjs";

for (const base of ["/", "/yokiCloud/", "/another/nested/"]) {
  for (const value of ["/", "/#blog", "/algorithms/?tag=cpp", "/algorithm-assets/a.png", "/posts/test.md"]) {
    const actual = withBasePath(value, base);
    assert.equal(actual, base === "/" ? value : base.slice(0, -1) + value);
    assert.equal(withBasePath(actual, base), actual, "must not double-prefix");
  }
  for (const value of ["#标题", "?tag=cpp", "relative.md", "https://example.com/a", "//cdn.example.com/a", "mailto:a@example.com", "data:image/png;base64,a", undefined]) {
    assert.equal(withBasePath(value, base), value);
  }
  const tree = { type: "root", children: [{ type: "element", properties: { href: "/algorithms/a/", src: "/algorithm-assets/a.png" } }] };
  rehypeSitePath({ base })(tree);
  assert.equal(tree.children[0].properties.href, withBasePath("/algorithms/a/", base));
  assert.equal(tree.children[0].properties.src, withBasePath("/algorithm-assets/a.png", base));
}
const wiki = { type: "root", children: [{ type: "paragraph", children: [{ type: "text", value: "[[#标题]]" }] }] };
remarkObsidian()(wiki);
assert.equal(wiki.children[0].children[0].url, "#" + encodeURIComponent("标题"));

const base = process.env.SITE_BASE || "/yokiCloud/";
const prefix = withBasePath("/", base).replace(/\/$/, "");
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const pages = walk("dist").filter(f => f.endsWith(".html"));
let references = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)/g)) {
    const url = decodeURIComponent(match[1]);
    if (url.startsWith("//")) continue;
    assert(url === prefix || url.startsWith(prefix + "/"), `${file}: missing base in ${url}`);
    const local = url.slice(prefix.length) || "/";
    assert(!prefix || !local.startsWith(prefix + "/"), `double base: ${url}`);
    const target = path.join("dist", local);
    assert(fs.existsSync(target), `${file}: missing resource ${url}`);
    references++;
  }
}
console.log(`PASS: path unit tests; ${pages.length} pages, ${references} local references under ${base}`);
