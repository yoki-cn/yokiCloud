import fs from "node:fs";
import assert from "node:assert/strict";
import remarkObsidian from "./remark-obsidian.mjs";
import remarkBoardLinks from "./remark-board-links.mjs";
import ts from "typescript";
import { withBasePath } from "./site-path.mjs";
const base = process.env.SITE_BASE || "/yokiCloud/";

const file = "dist/algorithms/3. 数据结构/3.5 基础 SegTree/3.5.3 函数复合线段树/index.html";
const html = fs.readFileSync(file, "utf8");
assert(html.includes("--shiki-dark"), "Shiki colors must be emitted");
assert(html.includes('class="line"'), "Code lines must be emitted");
assert(html.includes("3.5.3 函数复合线段树"), "Numbered title must be visible");
const target = "3. 数据结构/3.5 基础 SegTree/3.5.2 非递归线段树（ZKW 风格）";
assert(html.includes(withBasePath(`/algorithms/${target.split('/').map(encodeURIComponent).join('/')}/`, base)), "Wiki link must include base and full chapter path");
for (const value of ['[[3.5.2 非递归线段树（ZKW 风格）]]', '[[3.5.2 非递归线段树（ZKW 风格）|别名]]']) {
  const tree = { type: "root", children: [{ type: "paragraph", children: [{ type: "text", value }] }] };
  remarkObsidian()(tree);
  remarkBoardLinks()(tree, { path: file });
  assert.equal(tree.children[0].children[0].url, `/algorithms/${target.split('/').map(encodeURIComponent).join('/')}/`);
}
const source = fs.readFileSync("src/utils/navigation.ts", "utf8");
const pathModule = new URL('./site-path.mjs', import.meta.url).href;
const js = ts.transpile(source, { module: ts.ModuleKind.ESNext }).replace(/import \{ sitePath \} from "\.\/sitePath";/, `import { withBasePath } from ${JSON.stringify(pathModule)}; const sitePath = value => withBasePath(value, ${JSON.stringify(base)});`);
const { returnToSource } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
let result;
globalThis.window = { history: { state: {}, length: 3, back: () => result = "back" }, location: { href: "https://test.local/algorithms/board/", assign: (url) => result = url } };
returnToSource('/algorithms/'); assert.equal(result, withBasePath('/algorithms/', base));
window.history.state = { yokiSource: "https://test.local/#algorithms", yokiInternal: true };
returnToSource('/algorithms/'); assert.equal(result, 'back');
window.history.state = { yokiSource: "https://test.local/algorithms/?status=usable", yokiInternal: false };
returnToSource('/algorithms/'); assert.equal(result, "https://test.local/algorithms/?status=usable");
window.history.state = { yokiSource: "javascript:alert(1)" };
returnToSource('/algorithms/'); assert.equal(result, withBasePath('/algorithms/', base));
console.log("PASS: code tokens/lines, numbered titles, nested wiki links, source return and direct-entry fallback");
const missing = new Set();
function checkLinks(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${item.name}`;
    if (item.isDirectory()) checkLinks(full);
    else if (item.name.endsWith('.html')) {
      for (const match of fs.readFileSync(full, 'utf8').matchAll(/href="(\/[^"?#]*)/g)) {
        const raw = decodeURIComponent(match[1]);
        const prefix = withBasePath('/', base).replace(/\/$/, '');
        const url = prefix && raw.startsWith(prefix + '/') ? raw.slice(prefix.length) : raw;
        if (!url.startsWith('/algorithms/')) continue;
        const target = `dist${url.endsWith('/') ? url + 'index.html' : url}`;
        if (!fs.existsSync(target)) missing.add(url);
      }
    }
  }
}
checkLinks('dist/algorithms');
console.log('Unresolved published links:', [...missing]);
assert.equal(missing.size, 0, 'All published board links must resolve');
