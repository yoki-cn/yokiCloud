export type NoticeTone = "info" | "success" | "error";

function animateStack(host: HTMLElement, change: () => void) {
  const positions = new Map(Array.from(host.children).map(node => [node, node.getBoundingClientRect?.().top]));
  change();
  if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (const [node, top] of positions) {
    if (!host.contains?.(node) || top === undefined) continue;
    const delta = top - node.getBoundingClientRect().top;
    if (delta) node.animate?.([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
      { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
  }
}

export function notify(message: string, tone: NoticeTone = "info") {
  if (!message || typeof document === "undefined") return;
  let host = document.getElementById("prts-notifications");
  if (!host) {
    host = document.createElement("section");
    host.id = "prts-notifications";
    host.setAttribute("aria-label", "PRTS 实时通讯");
    document.body.append(host);
  }
  const card = document.createElement("div");
  card.className = "prts-toast";
  card.dataset.tone = tone;
  const content = document.createElement("div");
  content.setAttribute("role", tone === "error" ? "alert" : "status");
  const label = document.createElement("div");
  label.className = "prts-toast-label";
  label.textContent = "PRTS / 实时通讯";
  const text = document.createElement("p");
  text.textContent = message.startsWith("PRTS") ? message : `PRTS ${tone === "error" ? "行动受阻" : tone === "success" ? "任务回执" : "终端通报"}：${message}`;
  content.append(label, text);
  const close = document.createElement("button");
  close.type = "button";
  close.className = "prts-toast-close";
  close.textContent = "×";
  close.setAttribute("aria-label", "关闭此消息");
  let timer: ReturnType<typeof setTimeout>;
  let closing = false;
  function dismiss() {
    if (closing) return;
    closing = true;
    clearTimeout(timer);
    card.classList.add("is-leaving");
    setTimeout(() => animateStack(host!, () => card.remove()), 380);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(dismiss, 6500); }
  close.addEventListener("click", dismiss);
  card.addEventListener("mouseenter", () => clearTimeout(timer));
  card.addEventListener("mouseleave", schedule);
  card.addEventListener("focusin", () => clearTimeout(timer));
  card.addEventListener("focusout", schedule);
  card.append(content, close);
  animateStack(host, () => {
    host!.prepend(card);
    while (host!.children.length > 4) host!.lastElementChild?.remove();
  });
  schedule();
}

export function adminNotice(message: string) {
  const tone = /失败|错误|不正确|不能|没有.*权限|至少|不一致|需要|不存在/.test(message) ? "error" : /已|完成/.test(message) ? "success" : "info";
  notify(message, tone);
}

export function installNotifications() {
  window.addEventListener("prts:notice", event => {
    const { message, tone } = (event as CustomEvent).detail || {};
    if (typeof message === "string") notify(message, tone);
  });
  const pending = new Set<string>();
  document.addEventListener("click", async event => {
    const anchor = (event.target as Element)?.closest?.("a[download]") as HTMLAnchorElement | null;
    if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(anchor.href, location.href);
    // Blob downloads are already handled by their originating operation.
    if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) return;
    event.preventDefault();
    if (pending.has(url.href)) return;
    pending.add(url.href);
    notify("PRTS 档案调取中，请稍候。");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok || response.headers.get("content-type")?.includes("text/html")) throw new Error("Unavailable");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = anchor.download || decodeURIComponent(url.pathname.split("/").at(-1) || "archive");
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      notify("PRTS 档案已交付浏览器，请确认下载记录。", "success");
    } catch {
      notify("PRTS 档案传输中断：文件暂不可用或通讯受阻，请稍后重试。", "error");
    } finally { clearTimeout(timer); pending.delete(url.href); }
  });
}
