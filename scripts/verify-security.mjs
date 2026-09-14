#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { publishAdminContent } from "./publish-admin-content.mjs";
import rehypeSecureHtml from "./rehype-secure-html.mjs";

const tree = {
  type: "root",
  children: [
    { type: "raw", value: '<script>alert("xss")</script>' },
    {
      type: "element",
      tagName: "a",
      properties: { href: "javascript:alert(1)", onClick: "alert(1)" },
      children: [{ type: "text", value: "unsafe" }],
    },
  ],
};

rehypeSecureHtml()(tree);
assert.equal(tree.children[0].type, "text");
assert.equal(tree.children[1].properties.href, undefined);
assert.equal(tree.children[1].properties.onClick, undefined);

const validDataset = {
  posts: [
    {
      id: "b-test",
      title: "Security check",
      date: "2026-07-10",
      tag: "Notes",
      summary: "Dry-run validation.",
      link: "/posts/security-check/",
      markdown: "---\ntitle: Security check\n---\n\n## Test\n",
    },
  ],
  bulletins: [],
  bookmarks: [],
  resources: [],
  gateways: [
    { code: "EXT-01", cn: "作品集", en: "ARCHIVE", desc: "Archive", href: "#" },
    { code: "EXT-02", cn: "Blog", en: "LOG", desc: "Blog", href: "#" },
    { code: "EXT-03", cn: "资源", en: "DEPOT", desc: "Resources", href: "#" },
  ],
};

const dryRun = await publishAdminContent(validDataset, {
  root: process.cwd(),
  build: false,
  dryRun: true,
  prune: false,
});
assert.equal(dryRun.ok, true);
assert.ok(dryRun.filesWritten.includes("src/pages/posts/security-check.md"));

await assert.rejects(
  publishAdminContent(
    {
      ...validDataset,
      bookmarks: [{ title: "Unsafe", url: "javascript:alert(1)" }],
    },
    { root: process.cwd(), build: false, dryRun: true, prune: false }
  ),
  /unsafe or malformed URL/
);

const rollbackRoot = await mkdtemp(join(tmpdir(), "yoki-publish-rollback-"));
try {
  await mkdir(join(rollbackRoot, "src", "data"), { recursive: true });
  await writeFile(join(rollbackRoot, "src", "data", "blog.ts"), "ORIGINAL\n", "utf8");
  await writeFile(
    join(rollbackRoot, "package.json"),
    JSON.stringify({ private: true, scripts: { build: "node -e \"process.exit(1)\"" } }),
    "utf8"
  );
  await assert.rejects(
    publishAdminContent(validDataset, {
      root: rollbackRoot,
      build: true,
      dryRun: false,
      prune: true,
    }),
    /source files were restored/
  );
  assert.equal(await readFile(join(rollbackRoot, "src", "data", "blog.ts"), "utf8"), "ORIGINAL\n");
  await assert.rejects(readFile(join(rollbackRoot, "src", "pages", "posts", "security-check.md"), "utf8"));
} finally {
  await rm(rollbackRoot, { recursive: true, force: true });
}

const successRoot = await mkdtemp(join(tmpdir(), "yoki-publish-success-"));
try {
  await writeFile(
    join(successRoot, "package.json"),
    JSON.stringify({ private: true, scripts: { build: "node -e \"process.exit(0)\"" } }),
    "utf8"
  );
  const result = await publishAdminContent(validDataset, {
    root: successRoot,
    build: true,
    dryRun: false,
    prune: true,
  });
  assert.equal(result.build?.code, 0);
  assert.match(
    await readFile(join(successRoot, "src", "pages", "posts", "security-check.md"), "utf8"),
    /Security check/
  );
} finally {
  await rm(successRoot, { recursive: true, force: true });
}

console.log("Security verification passed: HTML escaping, URL validation, publishing, and rollback.");
