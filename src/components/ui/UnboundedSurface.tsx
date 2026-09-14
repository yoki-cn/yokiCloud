import type { ElementType, ReactNode } from "react";

import { cx } from "./cx";

export type UnboundedSurfaceTone = "neutral" | "accent" | "warm" | "success" | "danger";

export type UnboundedSurfaceProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  tone?: UnboundedSurfaceTone;
  interactive?: boolean;
};

const toneClasses: Record<UnboundedSurfaceTone, string> = {
  neutral: "yc-unbounded-neutral",
  accent: "yc-unbounded-accent",
  warm: "yc-unbounded-warm",
  success: "yc-unbounded-success",
  danger: "yc-unbounded-danger",
};

export function UnboundedSurface({
  as: Component = "div",
  children,
  className,
  tone = "neutral",
  interactive = false,
}: UnboundedSurfaceProps) {
  return (
    <Component
      className={cx(
        "yc-unbounded-surface relative min-w-0 overflow-hidden rounded-[var(--yc-radius-lg)] border-0",
        toneClasses[tone],
        interactive && "yc-unbounded-interactive transition",
        className
      )}
    >
      {children}
    </Component>
  );
}
