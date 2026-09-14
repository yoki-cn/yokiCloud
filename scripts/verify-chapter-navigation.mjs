import fs from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";

const source = fs.readFileSync("src/components/algorithm/ChapterNavigation.tsx", "utf8");
const ast = ts.createSourceFile("chapter.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const fn = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "positionChapterMenu");
assert(fn);
const code = ts.transpile(fn.getText(ast), { module: ts.ModuleKind.ESNext });
const { positionChapterMenu: place } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const rightEdge = { left: 900, right: 1140, top: 100, bottom: 136 };
assert.equal(place(rightEdge, 310, 400, 1200, 800, true).left, 590, "flip left at right edge");
assert.equal(place(rightEdge, 310, 400, 1600, 800, true).left, 1140, "return to right when space allows");
for (const vw of [320, 390, 768, 1366, 1920]) {
  for (const nested of [false, true]) {
    const width = Math.min(310, vw - 16);
    const pos = place({ left: vw - 80, right: vw - 8, top: 700, bottom: 736 }, width, 500, vw, 760, nested);
    assert(pos.left >= 8 && pos.left + width <= vw - 8);
    assert(pos.top >= 8 && pos.top + 500 <= 752);
  }
}
const chrome = fs.readFileSync("src/components/article/ArticleChrome.tsx", "utf8");
const header = chrome.slice(chrome.indexOf("<HeaderTopBar"), chrome.indexOf("<AnimatePresence>"));
assert(!header.includes("downloadPdf") && !header.includes("download={"), "downloads must not be in header");
assert(chrome.includes("onClick={downloadPdf}"), "PDF download stays in sidebar");
assert(source.includes('path.split("/")[0] !== "图片"'));
console.log("PASS: menu viewport bounds at 5 widths, left flip/right recovery, sidebar-only downloads, hidden image directory");
