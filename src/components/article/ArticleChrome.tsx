import { sitePath } from "../../utils/sitePath";
import { notify } from "../../utils/notifications";
import { boardPdfUrl, fetchBoardPdf, PDF_NOT_FOUND } from "../../utils/boardPdf";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { useTheme } from "../../hooks/useTheme";
import HeaderTopBar from "../sections/HeaderTopBar";
import { AlgorithmStatusBadge, DownloadRouteCard } from "../ui";
import BackLink from "../ui/BackLink";
import ChapterNavigation, { type ChapterBoard } from "../algorithm/ChapterNavigation";

export type ArticleNavItem = {
  id: string;
  label: string;
};

export type ArticleChromeProps = {
  brandName: string;
  tagline: string;
  navItems: ArticleNavItem[];
  title: string;
  category: string;
  categoryLabel?: string;
  updated: string;
  tags: string[];
  markdownDownloadUrl?: string;
  markdownFilename?: string;
  indexHref?: string;
  indexLabel?: string;
  status?: string;
  enablePdf?: boolean;
  chapterDirectories?: string[];
  chapterBoards?: ChapterBoard[];
};

export default function ArticleChrome({
  brandName,
  tagline,
  navItems,
  title,
  category,
  categoryLabel = "分类",
  updated,
  tags,
  markdownDownloadUrl,
  markdownFilename,
  indexHref = "/#blog",
  indexLabel = "Blog 索引",
  status,
  enablePdf = false,
  chapterDirectories = [],
  chapterBoards = [],
}: ArticleChromeProps) {
  const [sidebarOpen, setSidebarOpen] = useLocalStorageState<boolean>(
    "ark.portal.article.sidebarOpen.v1",
    () => {
      if (typeof window === "undefined") return true;
      return window.matchMedia?.("(min-width: 768px)")?.matches ?? true;
    }
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.dataset.articleSidebar = sidebarOpen ? "open" : "closed";
    return () => {
      delete document.documentElement.dataset.articleSidebar;
    };
  }, [sidebarOpen]);

  const [pdfBusy, setPdfBusy] = useState(false);
  const setPdfNotice = (message: string) => { if (message) notify(message, "error"); };

  async function downloadPdf() {
    if (pdfBusy) return;
    setMenuOpen(false);
    setPdfBusy(true);
    notify("PRTS 正在检索 PDF 档案，请稍候。");
    try {
      if (!markdownDownloadUrl) { setPdfNotice(PDF_NOT_FOUND); return; }
      const blob = await fetchBoardPdf(sitePath(boardPdfUrl(markdownDownloadUrl)));
      if (!blob) { setPdfNotice(PDF_NOT_FOUND); return; }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = (markdownFilename || `${title}.md`).replace(/\.md$/, ".pdf");
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      notify("PRTS PDF 档案已交付浏览器，请确认下载记录。", "success");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setPdfNotice("PRTS 通讯受阻：暂时无法调取 PDF 档案，请稍后重试。");
    } finally {
      setPdfBusy(false);
    }
  }


  return (
    <>
      <HeaderTopBar
        brandName={brandName}
        tagline={tagline}
        backHref={indexHref}
        backLabel={enablePdf ? "返回板子列表" : "返回博客列表"}
        navItems={navItems}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((s) => !s)}
        navHrefForItem={(item) => {
          if (item.id === "home") return "/";
          if (item.id === "index" || item.id === "blog") return indexHref;
          return "/";
        }}
        onNavigate={() => setMenuOpen(false)}
        isLight={isLight}
        onToggleTheme={toggleTheme}
        bookmarksOpen={sidebarOpen}
        onToggleBookmarks={() => setSidebarOpen((s) => !s)}
        bookmarksLabel="Toggle article sidebar"
        brandHref="/"
        showContactActions={false}
        chapterNavigation={enablePdf ? <ChapterNavigation directories={chapterDirectories} boards={chapterBoards} /> : undefined}
      />

      <AnimatePresence>
        {sidebarOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="article-sidebar fixed z-30 top-16 bottom-4 left-4 max-w-[calc(100vw-1.5rem)]"
              style={{ width: "clamp(240px, 24vw, 340px)" }}
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="article-panel article-sidebar-panel h-full article-panel-pad flex min-h-0 flex-col">
                <div className="scanline" />
                <div className="flex shrink-0 items-start justify-between gap-3">
                  <div>
                    <div className="article-toc-title">
                      {enablePdf ? "板子侧栏 / ALGORITHM SIDE PANEL" : "文章侧栏 / ARTICLE SIDE PANEL"}
                    </div>
                    <div className="mt-2 heading-main text-sm font-semibold text-[var(--yc-text)]">{title}</div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] transition hover:bg-[var(--yc-surface-strong)]"
                    aria-label="Hide article sidebar"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-[var(--yc-muted)]" />
                  </button>
                </div>

                <div className="article-sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                  <ul className="article-status-list">
                    <li>
                      <span className="article-status-k">{categoryLabel}</span>
                      <span className="article-status-v">{category}</span>
                    </li>
                    <li>
                      <span className="article-status-k">更新时间</span>
                      <span className="article-status-v">{updated}</span>
                    </li>
                  </ul>

                  {tags.length ? (
                    <div className="article-tags">
                      {tags.map((tag) => (
                        <span key={tag} className="article-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {status ? (
                    <div className="mt-4">
                      <div className="article-status-k mb-2">内容状态</div>
                      <AlgorithmStatusBadge status={status} />
                    </div>
                  ) : null}

                  {markdownDownloadUrl ? (
                    <div className="mt-4">
                      <DownloadRouteCard
                        href={markdownDownloadUrl}
                        download={markdownFilename || true}
                        compact
                        title="Markdown 源文件"
                        desc="下载当前内容的原始 Markdown。"
                        meta={markdownFilename ? `文件: ${markdownFilename}` : "MD 文件"}
                      />
                    </div>
                  ) : null}

                  {enablePdf ? (
                    <button
                      type="button"
                      onClick={downloadPdf} disabled={pdfBusy} aria-busy={pdfBusy}
                      className="algorithm-board-action algorithm-board-action-primary mt-2 w-full justify-center algorithm-pdf-button"
                      title="检索并下载已归档的 PDF 文件"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      {pdfBusy ? "检索中…" : "下载 PDF"}
                    </button>
                  ) : null}

                  <div className="mt-4 grid gap-2 pb-1">
                    <BackLink fallback={indexHref} />
                    <a className="article-route text-[10px] tracking-[0.20em]" href={sitePath(indexHref)}>
                      {indexLabel}
                    </a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
