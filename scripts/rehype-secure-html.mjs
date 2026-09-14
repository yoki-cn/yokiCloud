const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const URL_PROPERTIES = new Set(["href", "src", "xLinkHref", "formAction"]);

function isSafeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim(), "https://yoki.invalid/");
    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

function sanitizeProperties(properties) {
  if (!properties || typeof properties !== "object") return;
  for (const key of Object.keys(properties)) {
    if (/^on/i.test(key) || key === "srcDoc" || key === "dangerouslySetInnerHTML") {
      delete properties[key];
      continue;
    }
    if (URL_PROPERTIES.has(key) && !isSafeUrl(properties[key])) {
      delete properties[key];
      continue;
    }
    if (
      key === "style" &&
      typeof properties[key] === "string" &&
      /(?:url\s*\(|expression\s*\(|behavior\s*:|-moz-binding\s*:)/i.test(properties[key])
    ) {
      delete properties[key];
    }
  }
}

function sanitizeNode(node) {
  if (!node || typeof node !== "object") return node;
  if (node.type === "raw") {
    return { type: "text", value: String(node.value || "") };
  }
  if (node.type === "element") sanitizeProperties(node.properties);
  if (Array.isArray(node.children)) {
    node.children = node.children.map(sanitizeNode);
  }
  return node;
}

export default function rehypeSecureHtml() {
  return sanitizeNode;
}
