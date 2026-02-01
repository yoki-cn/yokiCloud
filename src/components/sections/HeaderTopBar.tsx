import { AnimatePresence, motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
};

export type HeaderTopBarProps = {
  brandName: string;
  tagline: string;
  navItems: NavItem[];
  menuOpen: boolean;
  onToggleMenu: () => void;
  onScrollTo: (id: string) => void;
  isLight: boolean;
  onToggleTheme: () => void;
  bookmarksOpen: boolean;
  onToggleBookmarks: () => void;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
};

export default function HeaderTopBar({
  brandName,
  tagline,
  navItems,
  menuOpen,
  onToggleMenu,
  onScrollTo,
  isLight,
  onToggleTheme,
  bookmarksOpen,
  onToggleBookmarks,
  githubUrl,
  linkedinUrl,
  email,
}: HeaderTopBarProps) {
  return (
    <header className="top-bar sticky top-0 z-40 backdrop-blur-md bg-black/45 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleBookmarks}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition ${
              bookmarksOpen ? "bg-cyan-400/15 hover:bg-cyan-400/22" : "bg-white/5 hover:bg-white/10"
            }`}
            aria-label="Toggle sidebar"
          >
            <LayoutGrid className={`w-4 h-4 ${bookmarksOpen ? "text-cyan-200" : "text-white/70"}`} />
          </button>
          <div className="leading-tight">
            <div className="text-sm tracking-wide text-white/90 font-medium">{brandName}</div>
            <div className="header-tagline text-[10px] tracking-[0.22em] text-white/45">{tagline}</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onScrollTo(item.id)}
                className="top-nav-link px-3 py-1.5 rounded-md text-[10px] tracking-[0.22em] text-white/65 hover:text-white hover:bg-white/5 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="top-bar-actions flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-white/70" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-white/70" />
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-white/70" />
            </a>

            <div className="top-bar-separator hidden sm:block h-7 w-px mx-1 rounded-full bg-gradient-to-b from-transparent via-cyan-200/80 to-transparent opacity-80" />

            <button
              onClick={onToggleTheme}
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 soft-pulse transition"
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-white/80" /> : <Sun className="w-4 h-4 text-white/80" />}
            </button>

            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                className="sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition"
                aria-label="Theme"
              >
                {isLight ? <Moon className="w-4 h-4 text-white/70" /> : <Sun className="w-4 h-4 text-white/70" />}
              </button>
              <button
                onClick={onToggleMenu}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-4 h-4 text-white/70" /> : <Menu className="w-4 h-4 text-white/70" />}
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
            className="md:hidden border-t border-white/5"
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onScrollTo(item.id)}
                  className="top-nav-link text-left px-3 py-2 rounded-md text-[10px] tracking-[0.22em] text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-3 pt-2">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white/85"
                >
                  <Github className="w-3.5 h-3.5" />
                  GITHUB
                </a>
                <span className="text-white/15">/</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white/85"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LINKEDIN
                </a>
                <span className="text-white/15">/</span>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white/85"
                >
                  <Mail className="w-3.5 h-3.5" />
                  EMAIL
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
