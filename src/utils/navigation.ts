import { sitePath } from "./sitePath";
// Use the entry captured for this history entry, never a stale last-visited URL.
export function returnToSource(fallback: string) {
  const source = window.history.state?.yokiSource;
  if (typeof source === "string") {
    try {
      const url = new URL(source, window.location.href);
      if (["http:", "https:"].includes(url.protocol) && url.href !== window.location.href) {
        if (window.history.state?.yokiInternal && window.history.length > 1) window.history.back();
        else window.location.assign(url.href);
        return;
      }
    } catch { /* fall through to the page's parent */ }
  }
  window.location.assign(sitePath(fallback));
}
