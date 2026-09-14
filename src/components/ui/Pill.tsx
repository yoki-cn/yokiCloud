import type { ReactNode } from "react";

import { PROJECT_TYPES } from "../../data/projects";

import { cx } from "./cx";

export type PillTint = "neutral" | "accent" | "warm";

export type PillProps = {
  children: ReactNode;
  tint?: PillTint;
  className?: string;
};

export function Pill({ children, tint = "neutral", className = "" }: PillProps) {
  const map: Record<string, string> = {
    neutral: "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)]",
    accent:
      "border-[color-mix(in_srgb,var(--yc-cyan)_42%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-cyan)]",
    warm:
      "border-[color-mix(in_srgb,var(--yc-amber)_48%,transparent)] bg-[var(--yc-amber-soft)] text-[var(--yc-amber)]",
  };
  return (
    <span
      className={cx(
        "pill",
        "yc-hud-text",
        "inline-flex items-center gap-1",
        "px-2 py-0.5",
        "rounded-[var(--yc-radius-sm)] border",
        "text-[9px]",
        map[tint] || map.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypeBadge({ typeKey }: { typeKey: string }) {
  const t = PROJECT_TYPES.find((x) => x.key === typeKey);
  return <Pill tint="accent">{t?.label || typeKey}</Pill>;
}

export function StatusBadge({ status }: { status: string }) {
  const warm = ["BETA", "MAINTAINED"].includes(status);
  return <Pill tint={warm ? "warm" : "neutral"}>{status}</Pill>;
}

export function ClearanceBadge({ clearance }: { clearance: string }) {
  const tint = clearance === "RESTRICTED" ? "accent" : clearance === "LIMITED" ? "warm" : "neutral";
  return <Pill tint={tint}>{`CLEARANCE:${clearance}`}</Pill>;
}
