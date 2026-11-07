import { matchAlgorithmBoard, type AlgorithmSearchMatch } from "../utils/algorithmSearch";
import { algorithmDownloads } from "../data/algorithmDownloads";
import { sitePath } from "../utils/sitePath";
import { ArrowRight, BookOpen, Download, FolderTree, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TerminalPageShell } from "../components/layout";
import { AlgorithmStatusBadge, Panel, Pill, SectionTitle } from "../components/ui";
import { ALGORITHM_STATUS_ORDER, getAlgorithmStatusMeta, type AlgorithmStatus } from "../data/algorithmStatus";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useTheme } from "../hooks/useTheme";
import DirectoryTree from "../components/algorithm/DirectoryTree";

export type AlgorithmBoardSummary = {
  slug: string;
  title: string;
  section: string;
  status: AlgorithmStatus;
  updated: string;
  tags: string[];
  order: number;
  href: string;
  markdownUrl: string;
  headings: string[];
  symbols: string[];
  aliases: string[];
};

export type AlgorithmArchiveProps = {
  boards: AlgorithmBoardSummary[];
  directories: string[];
  brandName: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
};

const ARCHIVE_NAV = [
  { id: "home", label: "HOME", href: "/" },
  { id: "blog", label: "BLOG", href: "/#blog" },
  { id: "boards", label: "BOARDS", href: "/algorithms/" },
];

export default function AlgorithmArchive({
  boards,
  directories,
  brandName,
  githubUrl,
  linkedinUrl,
  email,
}: AlgorithmArchiveProps) {
  const [query, updateQuery] = useState("");
  const [activeSection, updateSection] = useState("ALL");
  const [activeStatus, updateStatus] = useState<"ALL" | AlgorithmStatus>("ALL");
  const [resultLimit, setResultLimit] = useState(36);
  function saveFilter(key: string, value: string) {
    const url = new URL(window.location.href);
    if (key === "q") url.searchParams.delete("tag");
    if (!value || value === "ALL") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    // Preserve navigation provenance and update this entry, not the history stack.
    window.history.replaceState(window.history.state, "", url);
  }
  function setQuery(value: string) { updateQuery(value); setResultLimit(36); saveFilter("q", value); }
  function setActiveSection(value: string) { updateSection(value); setResultLimit(36); saveFilter("section", value); }
  function setActiveStatus(value: "ALL" | AlgorithmStatus) { updateStatus(value); setResultLimit(36); saveFilter("status", value); }
  const [bookmarksOpen, setBookmarksOpen] = useLocalStorageState<boolean>(
    "ark.portal.bookmarks.sidebarOpen.v1",
    () => false
  );
  const { isLight, toggleTheme } = useTheme();

  useEffect(() => {
    function restoreFilters() {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || params.get("tag") || "";
    const initialStatus = params.get("status");
    const initialSection = params.get("section");
    updateSection(initialSection && directories.includes(initialSection) ? initialSection : "ALL");
    updateQuery(initialQuery);
    updateStatus(initialStatus && ALGORITHM_STATUS_ORDER.includes(initialStatus as AlgorithmStatus) ? initialStatus as AlgorithmStatus : "ALL");
    }
    restoreFilters();
    window.addEventListener("popstate", restoreFilters);
    window.addEventListener("pageshow", restoreFilters);
    return () => {
      window.removeEventListener("popstate", restoreFilters);
      window.removeEventListener("pageshow", restoreFilters);
    };
  }, [directories]);

  const sections = useMemo(() => {
    return directories.filter((path) => !path.includes("/") && path !== "图片");
  }, [directories]);

  const visibleStatuses = useMemo(
    () => ALGORITHM_STATUS_ORDER.filter((status) => boards.some((board) => board.status === status)),
    [boards]
  );

  const queryActive = query.trim().length > 0;
  const searchResults = useMemo(() => {
    const ranked: Array<{ board: AlgorithmBoardSummary; match: AlgorithmSearchMatch | null }> = [];
    for (const board of boards) {
      if (activeSection !== "ALL" && !board.slug.startsWith(activeSection + "/")) continue;
      if (activeStatus !== "ALL" && board.status !== activeStatus) continue;
      const match = queryActive ? matchAlgorithmBoard(board, query) : null;
      if (queryActive && !match) continue;
      ranked.push({ board, match });
    }
    if (queryActive) ranked.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0) || a.board.order - b.board.order);
    return ranked;
  }, [activeSection, activeStatus, boards, query, queryActive]);
  const filteredBoards = searchResults.slice(0, resultLimit);
  const resultCount = searchResults.length;
  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.matches("input, textarea, select, [contenteditable='true']");
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("algorithm-search-input")?.focus();
      } else if (event.key === "/" && !typing && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        document.getElementById("algorithm-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", openSearch);
    return () => document.removeEventListener("keydown", openSearch);
  }, []);

  const verifiedCount = boards.filter((board) => board.status === "verified" || board.status === "usable").length;
  return (
    <TerminalPageShell
      brandName={brandName}
      tagline="ALGORITHM ARCHIVE / 算法板子"
      navItems={ARCHIVE_NAV}
      isLight={isLight}
      onToggleTheme={toggleTheme}
      bookmarksOpen={bookmarksOpen}
      onBookmarksOpenChange={setBookmarksOpen}
      onScrollTo={() => undefined}
      githubUrl={githubUrl}
      linkedinUrl={linkedinUrl}
      email={email}
      className="algorithm-root"
      backHref="/#algorithms"
      mainClassName="pb-16"
    >
      <section className="pt-7 md:pt-10">
        <div className="algorithm-hero yc-cut-corner">
          <div className="algorithm-hero-grid">
            <div>
              <div className="yc-hud-text text-[10px] text-[var(--yc-cyan)]">KNOWLEDGE DEPOT / 知识板库</div>
              <h1 className="algorithm-title heading-main">算法板子</h1>
              <p className="algorithm-lead">
                以知识点与章节组织的模块化算法档案。网页阅读与 Obsidian 源文件保持同一套语法，并提供 Markdown 与已归档 PDF 的下载入口。
              </p>
            </div>

            <div className="algorithm-stat-grid" aria-label="算法板子统计">
              <div className="algorithm-stat">
                <span className="algorithm-stat-value">{boards.length}</span>
                <span className="algorithm-stat-label">BOARDS</span>
              </div>
              <div className="algorithm-stat">
                <span className="algorithm-stat-value">{sections.length}</span>
                <span className="algorithm-stat-label">SECTIONS</span>
              </div>
              <div className="algorithm-stat">
                <span className="algorithm-stat-value">{verifiedCount}</span>
                <span className="algorithm-stat-label">READY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8" aria-label="板子 2.0 PDF 下载">
        <Panel label="板子 2.0" sublabel="PDF DOWNLOADS" icon={Download}>
          <p className="mb-4 text-sm text-[var(--yc-dim)]">完整板子 PDF，按专题分为六册，下载后可离线阅读。</p>
          <div className="algorithm-download-grid">
            {algorithmDownloads.map((item) => (
              <a key={item.file} className="algorithm-download-card"
                href={sitePath(`/algorithm-downloads/2.0/${item.file}`)} download={item.file}
                aria-label={`下载 ${item.name}.pdf · ${item.label}`}>
                <div className="min-w-0"><strong>{item.name}</strong><span>{item.label}</span></div>
                <div className="algorithm-download-meta"><span>PDF · {item.size}</span><Download size={16} aria-hidden="true" /></div>
              </a>
            ))}
          </div>
        </Panel>
      </section>

      <section className="py-8 md:py-10">
        <Panel
          label="BOARD ROUTER / 板子路由"
          sublabel="SEARCH & FILTER"
          icon={Search}
          right={<Pill>{resultCount} MATCHED</Pill>}
        >
          <div className="algorithm-toolbar">
            <label className="algorithm-search-wrap">
              <Search className="algorithm-search-icon" aria-hidden="true" />
              <span className="sr-only">搜索算法板子</span>
              <input
                id="algorithm-search-input"
                className="algorithm-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索算法、函数名、别名、章节…  /"
              />
              {query ? (
                <button type="button" className="algorithm-search-clear" onClick={() => setQuery("")} aria-label="清除搜索">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </label>

            <div>
              <div className="yc-hud-text mb-2 text-[8px] text-[var(--yc-dim)]">STATUS / 内容状态</div>
              <div className="algorithm-filter-row">
                <button
                  type="button"
                  className={`algorithm-filter ${activeStatus === "ALL" ? "is-active" : ""}`}
                  onClick={() => setActiveStatus("ALL")}
                >
                  ALL
                </button>
                {visibleStatuses.map((status) => {
                  const meta = getAlgorithmStatusMeta(status);
                  return (
                    <button
                      type="button"
                      key={status}
                      data-status={status}
                      className={`algorithm-filter ${activeStatus === status ? "is-active" : ""}`}
                      onClick={() => setActiveStatus(status)}
                    >
                      <span className="algorithm-status-dot" />
                      {meta.value}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="algorithm-search-hint">支持函数名、算法别名和多关键词搜索（空格分隔）；按 <kbd>/</kbd> 或 <kbd>Ctrl K</kbd> 快速聚焦。</p>
          </div>
        </Panel>
      </section>

      <section className="pb-8">
        <SectionTitle
          isLight={isLight}
          kicker="MODULE INDEX / 模块索引"
          title="按知识域浏览"
          desc="保留完整章节结构，已整理的板子可直接阅读，空章节将在后续补充。"
        />

        <div className="algorithm-index-layout mt-6">
          <aside className="algorithm-section-nav">
            <Panel label="KNOWLEDGE / 知识域" sublabel="FOLDER TREE" icon={FolderTree} right={<Pill>{sections.length}</Pill>}>
              <button
                type="button"
                className={`algorithm-section-button ${activeSection === "ALL" ? "is-active" : ""}`}
                onClick={() => setActiveSection("ALL")}
              >
                <span>全部板子</span>
                <span className="yc-hud-text text-[8px] text-[var(--yc-dim)]">{boards.length}</span>
              </button>
              <DirectoryTree directories={directories} boards={boards} active={activeSection} onSelect={setActiveSection} />
            </Panel>
          </aside>

          <div>
            {queryActive ? <div className="algorithm-search-summary" role="status">找到 {resultCount} 个匹配板子，按相关度排序。{activeSection !== "ALL" || activeStatus !== "ALL" ? " 当前筛选条件仍然生效。" : ""}</div> : null}
            {filteredBoards.length ? (
              <div className="algorithm-board-grid">
                {filteredBoards.map(({ board, match }) => (
                  <article key={board.slug} className="algorithm-board-card yc-cut-corner">
                    <div className="flex items-start justify-between gap-3">
                      <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">
                        {board.section}
                      </div>
                      <AlgorithmStatusBadge status={board.status} compact />
                    </div>

                    <h2 className="algorithm-board-card-title heading-main"><a href={sitePath(board.href)} className="algorithm-card-link">{board.title}</a></h2>
                    {match ? <p className="algorithm-match-reason">命中{({ title: "标题", symbol: "函数 / 类型", alias: "别名", heading: "小节", tag: "标签", section: "知识域" } as const)[match.field]}：<code>{match.text}</code></p> : null}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {board.tags.slice(0, 3).map((tag) => <Pill key={tag}>{tag}</Pill>)}
                    </div>

                    <div className="algorithm-board-actions">
                      <a className="algorithm-board-action algorithm-board-action-primary" href={sitePath(board.href)}>
                        <BookOpen className="h-3.5 w-3.5" />
                        阅读板子
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      <a className="algorithm-board-action" href={sitePath(board.markdownUrl)} download>
                        <Download className="h-3.5 w-3.5" />
                        下载 MD
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="algorithm-empty yc-cut-corner">
                <div className="yc-hud-text text-[10px] text-[var(--yc-dim)]">NO MATCHED MODULE</div>
                <p className="mt-3 text-sm">{activeSection !== "ALL" && !boards.some((board) => board.slug.startsWith(activeSection + "/"))
                  ? `${activeSection}：此目录暂未收录板子，内容整理中。`
                  : "没有匹配的板子。清除搜索或切回全部状态后再试。"}</p>
              </div>
            )}
            {resultCount > resultLimit ? <button type="button" className="algorithm-more-results" onClick={() => setResultLimit((n) => n + 36)}>加载更多 · 还有 {resultCount - resultLimit} 篇</button> : null}
          </div>
        </div>
      </section>
    </TerminalPageShell>
  );
}
