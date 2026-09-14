import { sitePath } from "../../utils/sitePath";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LayoutGrid, Linkedin, Mail, Menu, X } from "lucide-react";
import type { ReactNode } from "react";

import { handleExternalLinkClick } from "../../utils/linkActions";
import GithubMark from "../icons/GithubMark";
import { BreathingSeparator, ThemeToggleButton } from "../ui";
import { cx } from "../ui/cx";
import { returnToSource } from "../../utils/navigation";

export type NavItem = {
  id: string;
  label: string;
  href?: string;
};

export type HeaderTopBarProps = {
  brandName: string;
  tagline: string;
  navItems: NavItem[];
  menuOpen: boolean;
  onToggleMenu: () => void;
  onScrollTo?: (id: string) => void;
  navHrefForItem?: (item: NavItem) => string;
  onNavigate?: () => void;
  isLight: boolean;
  onToggleTheme: () => void;
  bookmarksOpen: boolean;
  onToggleBookmarks: () => void;
  bookmarksLabel?: string;
  brandHref?: string;
  backHref?: string;
  backLabel?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  showContactActions?: boolean;
  primaryAction?: ReactNode;
  mobileExtraActions?: ReactNode;
  chapterNavigation?: ReactNode;
};

export default function HeaderTopBar({
  brandName,
  tagline,
  navItems,
  menuOpen,
  onToggleMenu,
  onScrollTo,
  navHrefForItem,
  onNavigate,
  isLight,
  onToggleTheme,
  bookmarksOpen,
  onToggleBookmarks,
  bookmarksLabel = "Toggle sidebar",
  brandHref,
  backHref,
  githubUrl,
  linkedinUrl,
  email,
  showContactActions = true,
  primaryAction,
  mobileExtraActions,
  chapterNavigation,
}: HeaderTopBarProps) {
  const iconButtonClass =
    "items-center justify-center rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)] transition hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] hover:text-[var(--yc-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";
  const navItemClass =
    "top-nav-link yc-hud-text rounded-[var(--yc-radius-sm)] px-3 py-1.5 text-[10px] text-[var(--yc-muted)] transition hover:bg-[var(--yc-surface-inner)] hover:text-[var(--yc-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";
  const mobileNavItemClass =
    "top-nav-link yc-hud-text rounded-[var(--yc-radius-sm)] px-3 py-2 text-left text-[10px] text-[var(--yc-muted)] transition hover:bg-[var(--yc-surface-inner)] hover:text-[var(--yc-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";
  const canShowContactActions = showContactActions && githubUrl && linkedinUrl && email;

  function handleNav(item: NavItem, href?: string) {
    if (href) {
      onNavigate?.();
      return;
    }

    onScrollTo?.(item.id);
  }

  function renderNavItem(item: NavItem, mobile = false) {
    const href = item.href || navHrefForItem?.(item);
    const className = mobile ? mobileNavItemClass : navItemClass;

    if (href) {
      return (
        <a key={item.id} href={sitePath(href)} onClick={() => handleNav(item, href)} className={cx(className, "no-underline")}>
          {item.label}
        </a>
      );
    }

    return (
      <button key={item.id} onClick={() => handleNav(item)} className={className}>
        {item.label}
      </button>
    );
  }

  const brandContent = (
    <>
      <div className="text-sm font-medium tracking-wide text-[var(--yc-text)]">{brandName}</div>
      <div className="header-tagline yc-hud-text text-[10px] text-[var(--yc-dim)]">{tagline}</div>
    </>
  );

  return (
    <header className={cx("top-bar sticky top-0 z-40 border-b border-[var(--yc-line)] bg-[var(--yc-bg-0)] shadow-[0_1px_0_var(--yc-line)]", Boolean(chapterNavigation) && "has-chapter-navigation")}>
      <div className="yc-page-frame max-w-[1680px] mx-auto py-3 flex items-center gap-4">
        <div className="header-identity flex shrink-0 items-center gap-3">
          {backHref && (
            <a href={sitePath(backHref)} data-return aria-label="返回" title="返回" onClick={(event) => { if (event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); returnToSource(backHref); }} className={cx("inline-flex h-8 shrink-0 gap-1.5 px-2 no-underline", iconButtonClass)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs">返回</span>
            </a>
          )}
          <button
            onClick={onToggleBookmarks}
            className={cx(
              "inline-flex h-8 w-8",
              iconButtonClass,
              bookmarksOpen &&
                "border-[color-mix(in_srgb,var(--yc-cyan)_42%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-cyan)]"
            )}
            aria-label={bookmarksLabel}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          {brandHref ? (
            <a href={sitePath(brandHref)} className="header-brand min-w-0 leading-tight no-underline">
              {brandContent}
            </a>
          ) : (
            <div className="header-brand leading-tight">{brandContent}</div>
          )}
        </div>

        <div className={cx("flex items-center gap-3", chapterNavigation ? "chapter-header-main min-w-0 flex-1" : "ml-auto")}>
          <nav className={cx("items-center gap-1", chapterNavigation ? "chapter-fixed-links flex shrink-0" : "hidden md:flex")}>{navItems.map((item) => renderNavItem(item))}</nav>
          {chapterNavigation ? <div className="chapter-header-slot min-w-0 flex-1">{chapterNavigation}</div> : null}

          <div className="top-bar-actions flex shrink-0 items-center gap-3">
            {canShowContactActions ? (
              <>
                <a
                  href={sitePath(githubUrl)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleExternalLinkClick(e, githubUrl)}
                  className={cx("hidden h-8 w-8 sm:inline-flex", iconButtonClass)}
                  aria-label="GitHub"
                >
                  <GithubMark className="h-4 w-4" />
                </a>
                <a
                  href={sitePath(linkedinUrl)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleExternalLinkClick(e, linkedinUrl)}
                  className={cx("hidden h-8 w-8 sm:inline-flex", iconButtonClass)}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={sitePath(`mailto:${email}`)}
                  className={cx("hidden h-8 w-8 sm:inline-flex", iconButtonClass)}
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </>
            ) : null}

            {primaryAction}

            <BreathingSeparator className="hidden sm:block mx-1 opacity-80" />

            <div className="hidden sm:block">
              <ThemeToggleButton isLight={isLight} onToggle={onToggleTheme} className="px-0" />
            </div>

            <div className="md:hidden flex items-center gap-1">
              <div className="sm:hidden">
                <ThemeToggleButton isLight={isLight} onToggle={onToggleTheme} ariaLabel="Theme" className="px-0" />
              </div>
              <button onClick={onToggleMenu} className={cx("inline-flex h-9 w-9", iconButtonClass)} aria-label="Menu">
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[var(--yc-line)] md:hidden"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => renderNavItem(item, true))}
              {mobileExtraActions}
              {canShowContactActions ? (
                <div className="flex items-center gap-2 px-3 pt-2">
                  <a
                    href={sitePath(githubUrl)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => handleExternalLinkClick(e, githubUrl)}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--yc-muted)] hover:text-[var(--yc-text)]"
                  >
                    <GithubMark className="h-3.5 w-3.5" />
                    GITHUB
                  </a>
                  <span className="text-[var(--yc-line-strong)]">/</span>
                  <a
                    href={sitePath(linkedinUrl)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => handleExternalLinkClick(e, linkedinUrl)}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--yc-muted)] hover:text-[var(--yc-text)]"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LINKEDIN
                  </a>
                  <span className="text-[var(--yc-line-strong)]">/</span>
                  <a
                    href={sitePath(`mailto:${email}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--yc-muted)] hover:text-[var(--yc-text)]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    EMAIL
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
