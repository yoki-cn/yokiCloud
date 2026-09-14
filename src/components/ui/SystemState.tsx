import type { ComponentType, ReactNode } from "react";
import { AlertTriangle, Archive, Radio } from "lucide-react";

import { ArkButton, ArkLinkButton, type ArkButtonTone } from "./ArkButton";
import { HudChip, type HudTone } from "./Hud";
import { cx } from "./cx";

export type SystemStateKind = "empty" | "loading" | "error";

export type SystemStateProps = {
  kind?: SystemStateKind;
  title: string;
  desc?: string;
  icon?: ComponentType<{ className?: string }>;
  action?: {
    label: ReactNode;
    onClick?: () => void;
    href?: string;
    tone?: ArkButtonTone;
  };
  className?: string;
};

const kindMeta: Record<SystemStateKind, { label: string; tone: HudTone; icon: ComponentType<{ className?: string }> }> = {
  empty: { label: "EMPTY", tone: "neutral", icon: Archive },
  loading: { label: "SYNCING", tone: "accent", icon: Radio },
  error: { label: "ERROR", tone: "warm", icon: AlertTriangle },
};

export function SystemState({ kind = "empty", title, desc, icon, action, className = "" }: SystemStateProps) {
  const meta = kindMeta[kind];
  const Icon = icon || meta.icon;
  const isLoading = kind === "loading";

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={isLoading ? "polite" : undefined}
      className={cx(
        "yc-scan-surface yc-elevation-panel rounded-[var(--yc-radius-lg)] border-0 bg-[var(--yc-surface)] p-5",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)]">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <HudChip tone={meta.tone}>{meta.label}</HudChip>
              <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">SYSTEM STATE</span>
            </div>
            <div className="mt-2 text-base font-semibold tracking-wide text-[var(--yc-text)]">{title}</div>
            {desc ? <p className="mt-1 max-w-[58ch] text-xs leading-relaxed text-[var(--yc-muted)]">{desc}</p> : null}
            {isLoading ? (
              <div className="mt-4 grid max-w-sm gap-2" aria-hidden="true">
                <span className="h-2 w-full animate-pulse rounded-[var(--yc-radius-sm)] bg-[var(--yc-surface-strong)]" />
                <span className="h-2 w-3/4 animate-pulse rounded-[var(--yc-radius-sm)] bg-[var(--yc-surface-strong)]" />
                <span className="h-2 w-1/2 animate-pulse rounded-[var(--yc-radius-sm)] bg-[var(--yc-surface-strong)]" />
              </div>
            ) : null}
          </div>
        </div>

        {action?.href ? (
          <ArkLinkButton
            href={action.href}
            tone={action.tone || (kind === "error" ? "warm" : "secondary")}
            onClick={action.onClick}
            className="self-start"
          >
            {action.label}
          </ArkLinkButton>
        ) : action ? (
          <ArkButton
            tone={action.tone || (kind === "error" ? "warm" : "secondary")}
            onClick={action.onClick}
            className="self-start"
          >
            {action.label}
          </ArkButton>
        ) : null}
      </div>
    </div>
  );
}
