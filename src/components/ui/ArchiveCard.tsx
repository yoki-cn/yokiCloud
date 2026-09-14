import { sitePath } from "../../utils/sitePath";
import type { ComponentType, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { cx } from "./cx";
import { HudChip, HudLabel, type HudTone } from "./Hud";

export type ArchiveCardProps = {
  eyebrow: string;
  title: string;
  desc?: string;
  icon?: ComponentType<{ className?: string }>;
  chips?: Array<{ label: ReactNode; tone?: HudTone }>;
  meta?: ReactNode;
  actionLabel?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  children?: ReactNode;
};

export function ArchiveCard({
  eyebrow,
  title,
  desc,
  icon,
  chips = [],
  meta,
  actionLabel = "OPEN NODE",
  onClick,
  href,
  className = "",
  children,
}: ArchiveCardProps) {
  const content = (
    <div
      className={cx(
        "yc-scan-surface yc-elevation-panel yc-interactive-surface group h-full rounded-[var(--yc-radius-lg)] border-0 bg-[var(--yc-surface)] p-4 text-left transition",
        "hover:bg-[var(--yc-surface-strong)]",
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col gap-3">
        <HudLabel eyebrow={eyebrow} title={title} desc={desc} icon={icon} />
        {chips.length ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip, idx) => (
              <HudChip key={idx} tone={chip.tone}>
                {chip.label}
              </HudChip>
            ))}
          </div>
        ) : null}
        {children}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="yc-hud-text min-w-0 truncate text-[9px] text-[var(--yc-dim)]">{meta}</div>
          <div className="yc-hud-text inline-flex shrink-0 items-center gap-1.5 text-[9px] text-[var(--yc-muted)] group-hover:text-[var(--yc-text)]">
            {actionLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={sitePath(href)}
        className="block h-full rounded-[var(--yc-radius-lg)] text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block h-full w-full rounded-[var(--yc-radius-lg)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
      >
        {content}
      </button>
    );
  }

  return content;
}
