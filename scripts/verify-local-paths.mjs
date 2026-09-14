import assert from "node:assert/strict";
import { localPathRedirect } from "./local-path-redirect.mjs";

function run(url, base = "/yokiCloud/", method = "GET", originalUrl) {
  const result = { next: false, statusCode: 200, headers: {} };
  const response = { set statusCode(value) { result.statusCode = value; }, setHeader(key, value) { result.headers[key] = value; }, end() {} };
  localPathRedirect(base)({ url, method, originalUrl }, response, () => { result.next = true; });
  return result;
}
for (const url of ["/", "/?q=abc", "/algorithms/", "/algorithms/?tag=cpp", "/posts/test/", "/admin/", "/ui-kit/"]) {
  const result = run(url);
  assert.equal(result.statusCode, 302);
  assert.equal(result.headers.Location, `/yokiCloud${url}`);
  assert.equal(result.headers["Cache-Control"], "no-store");
}
for (const url of ["/yokiCloud/", "/yokiCloud/algorithms/", "/@vite/client", "/src/utils/sitePath.ts", "/node_modules/x.js", "//example.com", "/algorithms-other/", "/missing"]) assert(run(url).next);
assert(run("/", "/").next);
assert(run("/admin/", "/yokiCloud/", "POST").next);
assert(run("/", "/yokiCloud/", "GET", "/yokiCloud/").next, "rewritten requests must not loop");
console.log("PASS: local legacy routes, query preservation, no redirect loops, Vite module exclusions");
