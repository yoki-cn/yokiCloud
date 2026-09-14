import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import { cx } from "./cx";
import { type HudTone } from "./Hud";

export type StatusTileProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  tone?: HudTone;
};

const statusDotToneClasses: Record<HudTone, string> = {
  neutral: "status-dot-neutral",
  accent: "status-dot-accent",
  warm: "status-dot-warm",
  success: "status-dot-success",
};

export function StatusTile({ label, value, meta, icon: Icon, tone = "accent", className = "", ...props }: StatusTileProps) {
  return (
    <div
      className={cx(
        "status-tile rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] p-3",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]",
        className
      )}
      {...props}
    >
      <span className="status-press" aria-hidden="true" />
      <div className="status-content flex min-h-16 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{label}</div>
          {Icon ? (
            <Icon className="h-3.5 w-3.5 text-[var(--yc-muted)]" />
          ) : (
            <span className={cx("status-dot", statusDotToneClasses[tone])} aria-hidden="true" />
          )}
        </div>
        <div>
          <div className="text-lg font-semibold tracking-wide text-[var(--yc-text)]">{value}</div>
          {meta ? <div className="yc-hud-text mt-1 text-[9px] text-[var(--yc-dim)]">{meta}</div> : null}
        </div>
      </div>
    </div>
  );
}
