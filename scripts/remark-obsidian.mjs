const CALLOUT_LABELS = {
  note: "笔记",
  abstract: "摘要",
  summary: "摘要",
  tldr: "摘要",
  info: "信息",
  todo: "待办",
  tip: "提示",
  hint: "提示",
  important: "重点",
  success: "完成",
  check: "完成",
  done: "完成",
  question: "问题",
  help: "帮助",
  faq: "常见问题",
  warning: "警告",
  caution: "注意",
  attention: "注意",
  failure: "失败",
  fail: "失败",
  missing: "缺失",
  danger: "危险",
  error: "错误",
  bug: "缺陷",
  example: "示例",
  quote: "引用",
  cite: "引用",
};

const IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
const INLINE_TOKEN = /(!?\[\[[^\]\n]+\]\]|==[^=\n]+==|%%[^%\n]*%%|(^|[\s(（，。；：、])#[\p{L}\p{N}_/-]+)/gu;

function mergeData(node, hName, classNames, properties = {}) {
  const data = node.data && typeof node.data === "object" ? node.data : {};
  const hProperties = data.hProperties && typeof data.hProperties === "object" ? data.hProperties : {};
  const previousClasses = Array.isArray(hProperties.className) ? hProperties.className : [];
  node.data = {
    ...data,
    ...(hName ? { hName } : {}),
    hProperties: {
      ...hProperties,
      ...properties,
      className: [...previousClasses, ...classNames],
    },
  };
}

function encodePath(value) {
  return value
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function headingId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function wikiTargetToUrl(rawTarget) {
  const target = rawTarget.trim();
  if (/^https?:\/\//i.test(target)) return target;

  const [rawPath, ...headingParts] = target.split("#");
  const cleanedPath = rawPath.replace(/\.md$/i, "").trim();
  const encodedPath = encodePath(cleanedPath);
  const base = encodedPath ? `/algorithms/${encodedPath}/` : "";
  const heading = headingParts.join("#").trim();
  return heading ? `${base}#${encodeURIComponent(headingId(heading))}` : base;
}

function embedTargetToUrl(rawTarget) {
  const [rawPath] = rawTarget.split("#");
  const cleaned = rawPath.trim().replace(/^(?:\.\.\/|\.\/)*(?:图片|attachments?)\//i, "");
  return `/algorithm-assets/${encodePath(cleaned)}`;
}

function wikiNode(raw, embedded) {
  const body = raw.slice(embedded ? 3 : 2, -2).trim();
  const divider = body.lastIndexOf("|");
  const target = (divider >= 0 ? body.slice(0, divider) : body).trim();
  const alias = (divider >= 0 ? body.slice(divider + 1) : "").trim();

  if (embedded && IMAGE_EXTENSIONS.test(target.split("#")[0])) {
    const dimensions = /^\d+(?:x\d+)?$/.test(alias) ? "" : alias;
    return {
      type: "image",
      url: embedTargetToUrl(target),
      alt: dimensions || target.split("/").at(-1) || "Obsidian image",
      title: null,
      data: {
        hProperties: {
          className: ["obsidian-embed-image"],
          loading: "lazy",
        },
      },
    };
  }

  const display = alias || target.replace(/\.md(?=#|$)/i, "");
  return {
    type: "link",
    url: wikiTargetToUrl(target),
    title: null,
    children: [{ type: "text", value: display }],
    data: {
      hProperties: {
        className: [embedded ? "obsidian-embed-link" : "obsidian-wiki-link"],
        ...(embedded ? { "data-embed": "note" } : {}),
      },
    },
  };
}

function parseInlineText(value) {
  const nodes = [];
  let cursor = 0;

  for (const match of value.matchAll(INLINE_TOKEN)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > cursor) nodes.push({ type: "text", value: value.slice(cursor, index) });

    if (token.startsWith("%%")) {
      // Obsidian comments are intentionally omitted from the rendered document.
    } else if (token.startsWith("![[")) {
      nodes.push(wikiNode(token, true));
    } else if (token.startsWith("[[")) {
      nodes.push(wikiNode(token, false));
    } else if (token.startsWith("==")) {
      nodes.push({
        type: "strong",
        children: [{ type: "text", value: token.slice(2, -2) }],
        data: {
          hName: "mark",
          hProperties: { className: ["obsidian-highlight"] },
        },
      });
    } else {
      const prefix = match[2] || "";
      const tag = token.slice(prefix.length + 1);
      if (prefix) nodes.push({ type: "text", value: prefix });
      nodes.push({
        type: "link",
        url: `/algorithms/?tag=${encodeURIComponent(tag)}`,
        title: null,
        children: [{ type: "text", value: `#${tag}` }],
        data: { hProperties: { className: ["obsidian-tag"] } },
      });
    }

    cursor = index + token.length;
  }

  if (cursor < value.length) nodes.push({ type: "text", value: value.slice(cursor) });
  return nodes.length ? nodes : [{ type: "text", value }];
}

function findFirstText(node) {
  if (!node || typeof node !== "object") return null;
  if (node.type === "text") return node;
  if (!Array.isArray(node.children)) return null;
  for (const child of node.children) {
    const match = findFirstText(child);
    if (match) return match;
  }
  return null;
}

function enhanceCallout(node) {
  if (node.type !== "blockquote" || !Array.isArray(node.children) || !node.children.length) return;
  const titleParagraph = node.children[0];
  if (titleParagraph?.type !== "paragraph") return;
  const firstText = findFirstText(titleParagraph);
  const match = firstText?.value?.match(/^\[!([\w-]+)\]([+-])?\s*(.*)$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const fold = match[2] || "";
  const title = match[3].trim() || CALLOUT_LABELS[type] || type.toUpperCase();
  firstText.value = title;

  const lineBreakIndex = titleParagraph.children.findIndex((child) => child?.type === "break");
  if (lineBreakIndex >= 0) {
    const bodyChildren = titleParagraph.children.slice(lineBreakIndex + 1);
    titleParagraph.children = titleParagraph.children.slice(0, lineBreakIndex);
    if (bodyChildren.length) {
      node.children.splice(1, 0, { type: "paragraph", children: bodyChildren });
    }
  }

  mergeData(node, fold ? "details" : "blockquote", ["obsidian-callout", `obsidian-callout-${type}`], {
    "data-callout": type,
    ...(fold === "+" ? { open: true } : {}),
  });
  mergeData(titleParagraph, fold ? "summary" : "p", ["obsidian-callout-title"]);
}

function addBlockId(node) {
  if (node.type !== "paragraph" || !Array.isArray(node.children) || !node.children.length) return;
  const last = node.children[node.children.length - 1];
  if (last?.type !== "text") return;
  const match = last.value.match(/\s+\^([A-Za-z0-9-]+)\s*$/);
  if (!match) return;
  last.value = last.value.slice(0, match.index).trimEnd();
  node.children.push({
    type: "text",
    value: "\u200b",
    data: {
      hName: "span",
      hProperties: { id: match[1], className: ["obsidian-block-id"], "aria-hidden": "true" },
    },
  });
}

function walk(node, parent = null) {
  if (!node || typeof node !== "object") return;
  enhanceCallout(node);
  addBlockId(node);

  if (!Array.isArray(node.children)) return;
  const skipInline = new Set(["code", "inlineCode", "link", "linkReference", "definition", "html", "heading"]);
  if (skipInline.has(node.type)) return;

  const children = [];
  for (const child of node.children) {
    if (child?.type === "text") children.push(...parseInlineText(child.value));
    else {
      walk(child, node);
      children.push(child);
    }
  }
  node.children = children;
}

export default function remarkObsidian() {
  return (tree) => walk(tree);
}
