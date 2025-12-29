import type { ReactNode } from "react";

import { PROJECT_TYPES } from "../../data/projects";

import { cx } from "./cx";

export type PillTint = "neutral" | "accent" | "warm";

export type PillProps = {
  children: ReactNode;
  tint?: PillTint;
};

export function Pill({ children, tint = "neutral" }: PillProps) {
  const map: Record<string, string> = {
    neutral: "bg-white/5 border-white/10 text-white/70",
    accent: "bg-cyan-400/10 border-cyan-300/30 text-cyan-200",
    warm: "bg-orange-400/10 border-orange-300/30 text-orange-200",
  };
  return (
    <span
      className={cx(
        "pill",
        "inline-flex items-center gap-1",
        "px-2 py-0.5",
        "rounded-md border",
        "text-[9px] tracking-[0.18em]",
        map[tint] || map.neutral
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
