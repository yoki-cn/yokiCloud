import type { ComponentType, ReactNode } from "react";

import { cx } from "./cx";

export type HudTone = "neutral" | "accent" | "warm" | "success";

const toneClasses: Record<HudTone, string> = {
  neutral: "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)]",
  accent: "border-[color-mix(in_srgb,var(--yc-cyan)_42%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-cyan)]",
  warm: "border-[color-mix(in_srgb,var(--yc-amber)_50%,transparent)] bg-[var(--yc-amber-soft)] text-[var(--yc-amber)]",
  success: "border-[color-mix(in_srgb,var(--yc-green)_42%,transparent)] bg-[color-mix(in_srgb,var(--yc-green)_14%,transparent)] text-[var(--yc-green)]",
};

export type HudLabelProps = {
  eyebrow?: string;
  title: string;
  desc?: string;
  icon?: ComponentType<{ className?: string }>;
  right?: ReactNode;
  className?: string;
};

export function HudLabel({ eyebrow, title, desc, icon: Icon, right, className = "" }: HudLabelProps) {
  return (
    <div className={cx("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon ? (
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)]">
              <Icon className="h-3.5 w-3.5 text-[var(--yc-muted)]" />
            </span>
          ) : null}
          {eyebrow ? <div className="yc-hud-text text-[10px] text-[var(--yc-dim)]">{eyebrow}</div> : null}
        </div>
        <div className="mt-2 text-base font-semibold tracking-wide text-[var(--yc-text)]">{title}</div>
        {desc ? <p className="mt-1 text-xs leading-relaxed text-[var(--yc-muted)]">{desc}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export type HudChipProps = {
  children: ReactNode;
  tone?: HudTone;
  className?: string;
};

export function HudChip({ children, tone = "neutral", className = "" }: HudChipProps) {
  return (
    <span
      className={cx(
        "yc-hud-text inline-flex items-center gap-1.5 rounded-[var(--yc-radius-sm)] border px-2 py-0.5 text-[9px] leading-4",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export type SignalDotProps = {
  tone?: HudTone;
  pulse?: boolean;
  className?: string;
};

export function SignalDot({ tone = "accent", pulse = false, className = "" }: SignalDotProps) {
  const colorClass: Record<HudTone, string> = {
    neutral: "bg-[var(--yc-dim)]",
    accent: "bg-[var(--yc-cyan)]",
    warm: "bg-[var(--yc-amber)]",
    success: "bg-[var(--yc-green)]",
  };
  return (
    <span
      className={cx(
        "inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_12px_currentColor]",
        colorClass[tone],
        pulse && "soft-pulse",
        className
      )}
    />
  );
}

export type MetaRailProps = {
  items: string[];
  tone?: HudTone;
  className?: string;
};

export function MetaRail({ items, tone = "accent", className = "" }: MetaRailProps) {
  return (
    <div className={cx("yc-hud-text flex flex-wrap items-center gap-2 text-[10px] text-[var(--yc-dim)]", className)}>
      <SignalDot tone={tone} />
      {items.map((item, idx) => (
        <span key={`${item}-${idx}`} className="inline-flex items-center gap-2">
          {idx > 0 ? <span className="opacity-35">/</span> : null}
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}
