import type { ButtonHTMLAttributes } from "react";
import { Moon, Sun } from "lucide-react";

import { cx } from "./cx";

export type ThemeToggleButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  isLight: boolean;
  onToggle: () => void;
  ariaLabel?: string;
};

export function ThemeToggleButton({
  isLight,
  onToggle,
  ariaLabel = "Toggle theme",
  className = "",
  ...props
}: ThemeToggleButtonProps) {
  const Icon = isLight ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cx(
        "inline-flex h-8 w-8 items-center justify-center rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)] transition",
        "hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] hover:text-[var(--yc-text)]",
        "active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4 shrink-0" />
    </button>
  );
}
