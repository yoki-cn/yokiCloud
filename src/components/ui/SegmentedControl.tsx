import type { ReactNode } from "react";

import { cx } from "./cx";

export type SegmentOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  meta?: ReactNode;
};

export type SegmentedControlProps<T extends string = string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div className={cx("min-w-0", className)}>
      {label ? <div className="yc-hud-text mb-2 text-[10px] text-[var(--yc-dim)]">{label}</div> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cx(
                "yc-hud-text inline-flex min-h-8 items-center gap-2 rounded-[var(--yc-radius-sm)] border px-3 py-1.5 text-[9px] transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-cyan)]",
                active
                  ? "border-[color-mix(in_srgb,var(--yc-cyan)_46%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-cyan)]"
                  : "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)] hover:border-[var(--yc-line-strong)] hover:text-[var(--yc-text)]"
              )}
            >
              <span>{option.label}</span>
              {option.meta ? <span className="opacity-55">{option.meta}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
