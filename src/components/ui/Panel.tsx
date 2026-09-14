import type { ComponentType, ReactNode } from "react";

import CutCorner from "./CutCorner";
import { cx } from "./cx";

export type PanelProps = {
  className?: string;
  label?: string;
  sublabel?: string;
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
  right?: ReactNode;
  elevation?: "panel" | "floating" | "modal";
  variant?: "framed" | "unbounded";
};

export default function Panel({
  className = "",
  label,
  sublabel,
  icon: Icon,
  children,
  right,
  elevation = "panel",
  variant = "framed",
}: PanelProps) {
  const elevationClass = {
    panel: "yc-elevation-panel",
    floating: "yc-elevation-floating",
    modal: "yc-elevation-modal",
  }[elevation];

  const content = (
    <>
      {(label || right || sublabel) && (
        <div className="flex items-start justify-between gap-3 border-b border-[var(--yc-line)] px-4 pb-3 pt-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {Icon && (
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)]">
                <Icon className="h-3.5 w-3.5 text-[var(--yc-muted)]" />
              </span>
            )}
            <div className="min-w-0 leading-none">
              {label && (
                <div className="yc-hud-text truncate text-[10px] text-[var(--yc-muted)]">{label}</div>
              )}
              {sublabel && (
                <div className="yc-hud-text mt-1 truncate text-[9px] text-[var(--yc-dim)]">{sublabel}</div>
              )}
            </div>
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </>
  );

  if (variant === "unbounded") {
    return (
      <div
        className={cx(
          "panel yc-unbounded-surface flex flex-col rounded-[var(--yc-radius-lg)] border-0",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <CutCorner
      className={cx(
        "panel",
        "flex flex-col",
        "rounded-[var(--yc-radius-lg)]",
        "border-0",
        "bg-[var(--yc-surface)]",
        elevationClass,
        className
      )}
    >
      {content}
    </CutCorner>
  );
}
