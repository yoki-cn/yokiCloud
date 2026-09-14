import { useState, type ReactNode } from "react";

import LocalStyles from "../../styles/localStyles";
import BookmarksSidebar from "../sidebars/BookmarksSidebar";
import Footer from "../sections/Footer";
import HeaderTopBar, { type NavItem } from "../sections/HeaderTopBar";
import { cx } from "../ui/cx";

export type TerminalPageShellProps = {
  brandName: string;
  tagline: string;
  navItems: NavItem[];
  isLight: boolean;
  onToggleTheme: () => void;
  bookmarksOpen: boolean;
  onBookmarksOpenChange: (open: boolean) => void;
  onScrollTo: (id: string) => void;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  children: ReactNode;
  overlay?: ReactNode;
  footerBrandName?: string;
  className?: string;
  mainClassName?: string;
  backHref?: string;
};

export default function TerminalPageShell({
  brandName,
  tagline,
  navItems,
  isLight,
  onToggleTheme,
  bookmarksOpen,
  onBookmarksOpenChange,
  onScrollTo,
  githubUrl,
  linkedinUrl,
  email,
  children,
  overlay,
  footerBrandName,
  className = "",
  mainClassName = "",
  backHref,
}: TerminalPageShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleScrollTo(id: string) {
    onScrollTo(id);
    setMenuOpen(false);
  }

  return (
    <div
      className={cx(
        "app-root min-h-screen bg-[var(--yc-bg-0)] text-[var(--yc-text)]",
        bookmarksOpen && "sidebar-open",
        className
      )}
    >
      <LocalStyles />

      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="yc-atmosphere fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-20 grain" />

      <HeaderTopBar
        brandName={brandName}
        tagline={tagline}
        backHref={backHref}
        navItems={navItems}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((s) => !s)}
        onScrollTo={handleScrollTo}
        isLight={isLight}
        onToggleTheme={onToggleTheme}
        bookmarksOpen={bookmarksOpen}
        onToggleBookmarks={() => onBookmarksOpenChange(!bookmarksOpen)}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
        email={email}
      />

      <BookmarksSidebar open={bookmarksOpen} onOpenChange={onBookmarksOpenChange} />

      <div className="content-rail">
        <main className={cx("yc-page-frame relative mx-auto max-w-[1680px]", mainClassName)}>{children}</main>
      </div>

      <Footer brandName={footerBrandName || brandName} />
      {overlay}
    </div>
  );
}
