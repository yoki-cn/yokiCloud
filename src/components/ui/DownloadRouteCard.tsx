import { sitePath } from "../../utils/sitePath";
import { Download, FileText } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import CutCorner from "./CutCorner";
import { cx } from "./cx";

export type DownloadRouteCardProps = {
  href: string;
  label?: string;
  title?: string;
  desc?: string;
  meta?: string;
  actionLabel?: string;
  download?: string | boolean;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
  compact?: boolean;
  children?: ReactNode;
};

export function DownloadRouteCard({
  href,
  label = "源文件 / Markdown",
  title = "Markdown 源文件",
  desc = "下载当前文章的原始 Markdown 文件。",
  meta = "FORMAT: MD",
  actionLabel = "下载文件",
  download = true,
  icon: Icon = FileText,
  className,
  compact = false,
  children,
}: DownloadRouteCardProps) {
  return (
    <CutCorner
      className={cx(
        "yc-elevation-compact relative overflow-hidden rounded-[var(--yc-radius-lg)] border-0 bg-[var(--yc-surface-inner)]",
        "download-route-card",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div className="scanline" aria-hidden="true" />
      <div className="relative z-[1] flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface)]">
          <Icon className="h-4 w-4 text-[var(--yc-muted)]" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{label}</div>
          <div className="heading-main mt-1 text-[13px] font-semibold tracking-wide text-[var(--yc-text)]">
            {title}
          </div>
          {desc ? <p className="mt-2 text-xs leading-relaxed text-[var(--yc-muted)]">{desc}</p> : null}
          {children}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="proj-hud-chip download-route-meta">{meta}</span>
            <a
              href={sitePath(href)}
              download={download}
              className="download-route-action yc-hud-text inline-flex items-center gap-1.5 rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface)] px-2.5 py-1.5 text-[9px] text-[var(--yc-text)] no-underline transition hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
            >
              {actionLabel}
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </CutCorner>
  );
}
