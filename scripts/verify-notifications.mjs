import fs from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";

// DOM/timer contract test; does not claim visual animation verification.
class Element {
  children = []; events = {}; dataset = {}; attributes = {}; classes = new Set();
  classList = { add: value => this.classes.add(value) };
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, callback) { this.events[key] = callback; }
  append(...children) { children.forEach(child => { child.parent = this; this.children.push(child); }); }
  prepend(child) { child.parent = this; this.children.unshift(child); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); }
  get firstElementChild() { return this.children[0]; }
  get lastElementChild() { return this.children.at(-1); }
}
const body = new Element();
globalThis.document = { body, createElement: () => new Element(), getElementById: id => body.children.find(el => el.id === id) };
const timers = new Map(); let id = 0;
globalThis.setTimeout = (fn, delay) => { timers.set(++id, { fn, delay }); return id; };
globalThis.clearTimeout = key => timers.delete(key);
const code = ts.transpile(fs.readFileSync("src/utils/notifications.ts", "utf8"), { module: ts.ModuleKind.ESNext });
const { notify, adminNotice } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
notify("测试消息", "success");
const host = body.children[0];
const card = host.children[0];
assert.equal(card.dataset.tone, "success");
assert.equal(card.children[0].children[1].textContent, "PRTS 任务回执：测试消息");
assert.equal(card.children[1].attributes["aria-label"], "关闭此消息");
assert([...timers.values()].some(t => t.delay === 6500));
card.events.mouseenter(); assert.equal(timers.size, 0);
card.events.mouseleave(); assert.equal(timers.size, 1);
card.children[1].events.click(); assert(card.classes.has("is-leaving"));
[...timers.values()].find(t => t.delay === 380).fn(); assert.equal(host.children.length, 0);
adminNotice("下载失败"); assert.equal(host.children[0].dataset.tone, "error");
for (let i = 0; i < 6; i++) notify(`消息 ${i}`);
assert.equal(host.children.length, 4);
assert.deepEqual(host.children.map(card => card.children[0].children[1].textContent),
  [5, 4, 3, 2].map(i => `PRTS 终端通报：消息 ${i}`));
const last = host.children.at(-1);
[...timers.values()].filter(t => t.delay === 6500).forEach(t => t.fn());
assert(last.classes.has("is-leaving"));
console.log("PASS: notification content, tones, close, timeout, hover pause, stack limit");
