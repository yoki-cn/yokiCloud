import type { MouseEvent } from "react";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function normalizeSafeHref(href?: string) {
  const normalized = href?.trim() || "";
  if (!normalized || normalized === "#" || CONTROL_CHARACTERS.test(normalized)) return "";
  try {
    const parsed = new URL(normalized, "https://yoki.invalid/");
    return SAFE_PROTOCOLS.has(parsed.protocol) ? normalized : "";
  } catch {
    return "";
  }
}

export function isPlaceholderHref(href?: string) {
  return !normalizeSafeHref(href);
}

export function handleExternalLinkClick(e: MouseEvent<HTMLAnchorElement>, href?: string) {
  const normalized = href?.trim() || "";

  if (isPlaceholderHref(normalized)) {
    e.preventDefault();
  }
}
