import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ChevronDown, ChevronLeft, LayoutGrid, Newspaper, Radio } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { BOOKMARKS } from "../../data/bookmarks";
import { SIDEBAR_BULLETINS } from "../../data/sidebar";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { IconButton } from "../ui/Buttons";
import CutCorner from "../ui/CutCorner";
import Panel from "../ui/Panel";
import { cx } from "../ui/cx";

export type BookmarkLink = {
  id: string;
  title: string;
  url: string;
  icon?: string;
};

export type BookmarksSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    try {
      const candidate = `https://${trimmed}`;
      new URL(candidate);
      return candidate;
    } catch {
      return trimmed;
    }
  }
}

function seedBookmarks(): BookmarkLink[] {
  return BOOKMARKS.map((b, idx) => {
    const url = normalizeUrl(b.url);
    if (!url) return null;
    return {
      id: `seed_${idx}_${url}`,
      title: String(b.title || "").trim() || "BOOKMARK",
      url,
      icon: String(b.icon || "").trim() || undefined,
    } satisfies BookmarkLink;
  }).filter(Boolean) as BookmarkLink[];
}

function displayUrl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname && u.pathname !== "/" ? u.pathname : "";
    return `${host}${path}` || url;
  } catch {
    return url;
  }
}

function hostLabel(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function toneDotClass(tone?: "info" | "warn" | "maint") {
  if (tone === "warn") return "bg-orange-300/80";
  if (tone === "maint") return "bg-cyan-300/70";
  return "bg-white/40";
}

function encodePathSegment(pathPart: string) {
  return pathPart
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function resolveCustomIconUrl(icon: string) {
  const raw = String(icon || "").trim();
  if (!raw) return "";

  if (/^(?:https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;

  const normalized = raw.replace(/^\/+/, "");
  const filePart = normalized.replace(/^logo\//i, "");
  const encoded = encodePathSegment(filePart);
  const base = String(import.meta.env.BASE_URL || "/");
  const basePrefix = base.endsWith("/") ? base : `${base}/`;
  return `${basePrefix}logo/${encoded}`;
}

function faviconCandidates(url: string, icon?: string) {
  const list: string[] = [];

  const custom = icon ? resolveCustomIconUrl(icon) : "";
  if (custom) list.push(custom);

  list.push(`https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`);
  try {
    const u = new URL(url);
    list.push(`${u.origin}/favicon.ico`);
    list.push(`${u.origin}/favicon.png`);
  } catch {
    // ignore
  }
  return list;
}

function FaviconMark({ url, label, icon }: { url: string; label: string; icon?: string }) {
  const candidates = useMemo(() => faviconCandidates(url, icon), [url, icon]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [url, icon]);

  const src = candidates[idx];
  if (!src) {
    return (
      <span className="bm-icon-fallback" aria-hidden="true">
        <Bookmark className="w-4 h-4" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      className="bm-favicon"
      loading="lazy"
      decoding="async"
      onError={() => setIdx((s) => Math.min(s + 1, candidates.length))}
    />
  );
}

export type SidebarBlockProps = {
  id: string;
  icon: (props: { className?: string }) => ReactNode;
  label: string;
  sublabel?: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function SidebarBlock({ id, icon: Icon, label, sublabel, badge, open, onToggle, children }: SidebarBlockProps) {
  const contentId = `${id}__content`;
  return (
    <CutCorner className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-3">
      <button
        type="button"
        className="sidebar-block-head w-full text-left flex items-start justify-between gap-2"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 border border-white/10 shrink-0">
            <Icon className="w-3.5 h-3.5 text-white/70" />
          </span>
          <div className="leading-none min-w-0">
            <div className="text-[10px] tracking-[0.24em] text-white/50 truncate">{label}</div>
            {sublabel ? <div className="mt-1 text-[9px] tracking-[0.18em] text-white/30 truncate">{sublabel}</div> : null}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          {badge ? <span className="proj-hud-chip">{badge}</span> : null}
          <ChevronDown
            className={cx(
              "w-4 h-4 text-white/55 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CutCorner>
  );
}

export default function BookmarksSidebar({ open, onOpenChange }: BookmarksSidebarProps) {
  const bookmarks = useMemo(() => seedBookmarks(), []);
  const recentLinks = useMemo(() => bookmarks.slice(-6).reverse(), [bookmarks]);
  const [bulletinOpen, setBulletinOpen] = useLocalStorageState<boolean>(
    "ark.portal.sidebar.block.bulletin.open.v1",
    true
  );
  const [recentOpen, setRecentOpen] = useLocalStorageState<boolean>("ark.portal.sidebar.block.recent.open.v1", true);
  const [bookmarksExpanded, setBookmarksExpanded] = useLocalStorageState<boolean>(
    "ark.portal.sidebar.block.bookmarks.open.v1",
    true
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <motion.aside
            className={cx(
              "bookmarks-sidebar",
              "fixed z-30",
              "top-16 bottom-4",
              "max-w-[calc(100vw-1.5rem)]"
            )}
            style={{ width: "var(--sidebar-w)", left: "var(--sidebar-offset)" }}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Panel
              className="bookmarks-panel h-full"
              label="SIDE PANEL / 侧栏"
              sublabel="READONLY · 只读"
              icon={LayoutGrid}
              right={<IconButton onClick={() => onOpenChange(false)} icon={ChevronLeft} label="Hide" />}
            >
              <div className="relative overflow-hidden h-full flex flex-col min-h-0">
                <div className="scanline" />

                <div className="bm-scroll mt-1 flex-1 min-h-0 overflow-auto">
                  <div className="flex flex-col gap-3 pr-1 pb-2">
                    <SidebarBlock
                      id="sidebar_bulletin"
                      icon={Radio}
                      label="BULLETIN / 公告"
                      sublabel="MAINTENANCE / 维护提示"
                      badge="NOTICE"
                      open={bulletinOpen}
                      onToggle={() => setBulletinOpen((s) => !s)}
                    >
                      {SIDEBAR_BULLETINS.length ? (
                        <ul className="flex flex-col gap-2">
                          {SIDEBAR_BULLETINS.map((item) => (
                            <li key={item.id}>
                              <CutCorner className="inner-elevated sidebar-item-card rounded-lg border border-white/10 bg-white/5 p-2.5">
                                <div className="flex items-start gap-2">
                                  <span
                                    className={cx("mt-1.5 inline-block w-1.5 h-1.5 rounded-full", toneDotClass(item.tone))}
                                    aria-hidden="true"
                                  />
                                  <div className="min-w-0 flex-1">
                                    {item.href ? (
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] tracking-[0.18em] text-white/75 hover:text-white/95 truncate"
                                        title={item.title}
                                      >
                                        {item.title}
                                      </a>
                                    ) : (
                                      <div
                                        className="text-[10px] tracking-[0.18em] text-white/75 truncate"
                                        title={item.title}
                                      >
                                        {item.title}
                                      </div>
                                    )}
                                    {item.detail ? (
                                      <div className="mt-1 text-xs leading-relaxed text-white/55 text-muted-block">
                                        {item.detail}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </CutCorner>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[10px] tracking-[0.22em] text-white/40">NO BULLETIN / 暂无公告</div>
                      )}
                    </SidebarBlock>

                    <SidebarBlock
                      id="sidebar_recent"
                      icon={Newspaper}
                      label="RECENT / 最近更新"
                      sublabel="NEW LINKS / 新收录"
                      badge="LATEST"
                      open={recentOpen}
                      onToggle={() => setRecentOpen((s) => !s)}
                    >
                      {recentLinks.length ? (
                        <ul className="flex flex-col gap-2">
                          {recentLinks.map((b) => {
                            const host = hostLabel(b.url);
                            return (
                              <li key={b.id}>
                                <CutCorner className="inner-elevated sidebar-item-card rounded-lg border border-white/10 bg-white/5 p-2.5">
                                  <a
                                    href={b.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block"
                                    title={`${b.title} · ${displayUrl(b.url)}`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span
                                        className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300/60"
                                        aria-hidden="true"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="text-[10px] tracking-[0.18em] text-white/75 hover:text-white/95 truncate">
                                          {b.title}
                                        </div>
                                        {host ? (
                                          <div
                                            className="mt-1 text-[9px] tracking-[0.16em] text-white/35 truncate"
                                            title={host}
                                          >
                                            {host}
                                          </div>
                                        ) : null}
                                      </div>
                                      <span className="proj-hud-chip">NEW</span>
                                    </div>
                                  </a>
                                </CutCorner>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-[10px] tracking-[0.22em] text-white/40">EMPTY / 暂无</div>
                      )}
                    </SidebarBlock>

                    <SidebarBlock
                      id="sidebar_bookmarks"
                      icon={Bookmark}
                      label="BOOKMARKS / 书签"
                      sublabel="OPEN: NEW TAB"
                      badge="LINKS"
                      open={bookmarksExpanded}
                      onToggle={() => setBookmarksExpanded((s) => !s)}
                    >
                      {bookmarks.length ? (
                        <ul className="bm-grid">
                          {bookmarks.map((b) => (
                            <li key={b.id} className="bm-tile-shell">
                              <a
                                href={b.url}
                                target="_blank"
                                rel="noreferrer"
                                className="bm-tile"
                                title={`${b.title} · ${displayUrl(b.url)}`}
                              >
                                <span className="bm-icon-wrap" aria-hidden="true">
                                  <FaviconMark url={b.url} label={b.title} icon={b.icon} />
                                </span>
                                <span className="bm-label">{b.title}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="py-10 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-[10px] tracking-[0.28em] text-white/50">EMPTY / 空</div>
                            <div className="mt-2 text-xs text-white/55">由站点维护者配置书签列表</div>
                          </div>
                        </div>
                      )}
                    </SidebarBlock>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
