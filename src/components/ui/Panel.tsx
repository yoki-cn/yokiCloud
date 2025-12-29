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
};

export default function Panel({
  className = "",
  label,
  sublabel,
  icon: Icon,
  children,
  right,
}: PanelProps) {
  return (
    <CutCorner
      className={cx(
        "panel",
        "flex flex-col",
        "bg-white/4 border border-white/10",
        "rounded-xl",
        "backdrop-blur-[6px]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_10px_26px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {(label || right || sublabel) && (
        <div className="flex items-start justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            {Icon && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 border border-white/10">
                <Icon className="w-3.5 h-3.5 text-white/70" />
              </span>
            )}
            <div className="leading-none">
              {label && (
                <div className="text-[10px] tracking-[0.24em] text-white/50">{label}</div>
              )}
              {sublabel && (
                <div className="mt-1 text-[9px] tracking-[0.18em] text-white/30">{sublabel}</div>
              )}
            </div>
          </div>
          {right}
        </div>
      )}
      <div className="p-4 pt-3 flex-1 min-h-0">{children}</div>
    </CutCorner>
  );
}
