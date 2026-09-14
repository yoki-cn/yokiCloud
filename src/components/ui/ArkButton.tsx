import { sitePath } from "../../utils/sitePath";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { handleExternalLinkClick } from "../../utils/linkActions";
import { cx } from "./cx";

export type ArkButtonTone = "primary" | "secondary" | "ghost" | "warm";
export type ArkButtonSize = "sm" | "md";

const toneClasses: Record<ArkButtonTone, string> = {
  primary:
    "border-[color-mix(in_srgb,var(--yc-cyan)_46%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-cyan)] hover:bg-[color-mix(in_srgb,var(--yc-cyan)_24%,transparent)]",
  secondary:
    "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)] hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] hover:text-[var(--yc-text)]",
  ghost: "border-transparent bg-transparent text-[var(--yc-muted)] hover:bg-[var(--yc-surface-inner)] hover:text-[var(--yc-text)]",
  warm:
    "border-[color-mix(in_srgb,var(--yc-amber)_48%,transparent)] bg-[var(--yc-amber-soft)] text-[var(--yc-amber)] hover:bg-[color-mix(in_srgb,var(--yc-amber)_24%,transparent)]",
};

const sizeClasses: Record<ArkButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-[10px]",
  md: "min-h-10 px-4 py-2 text-[11px]",
};

const focusClasses = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";

export type ArkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: ArkButtonTone;
  size?: ArkButtonSize;
  icon?: ComponentType<{ className?: string }>;
  trailingIcon?: ComponentType<{ className?: string }> | false;
};

export function ArkButton({
  children,
  tone = "secondary",
  size = "md",
  icon: Icon,
  trailingIcon: TrailingIcon,
  className = "",
  ...props
}: ArkButtonProps) {
  const EndIcon = TrailingIcon === false ? null : TrailingIcon || ArrowUpRight;
  return (
    <button
      type="button"
      className={cx(
        "yc-hud-text inline-flex items-center justify-center gap-2 rounded-[var(--yc-radius-md)] border transition active:translate-y-px",
        focusClasses,
        "disabled:cursor-not-allowed disabled:opacity-45",
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
      <span className="truncate">{children}</span>
      {EndIcon ? <EndIcon className="h-3.5 w-3.5 shrink-0 opacity-70" /> : null}
    </button>
  );
}

export type ArkIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone?: ArkButtonTone;
};

export function ArkIconButton({ icon: Icon, label, tone = "secondary", className = "", ...props }: ArkIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex h-8 w-8 items-center justify-center rounded-[var(--yc-radius-md)] border transition active:translate-y-px",
        focusClasses,
        "disabled:cursor-not-allowed disabled:opacity-45",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export type ArkLinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  tone?: ArkButtonTone;
  size?: ArkButtonSize;
  icon?: ComponentType<{ className?: string }>;
};

export function ArkLinkButton({
  href,
  children,
  tone = "secondary",
  size = "md",
  icon: Icon,
  className = "",
  target = "_blank",
  rel = "noreferrer",
  ...props
}: ArkLinkButtonProps) {
  return (
    <a
      href={sitePath(href)}
      target={target}
      rel={rel}
      onClick={(e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) handleExternalLinkClick(e, href);
      }}
      className={cx(
        "yc-hud-text inline-flex items-center justify-center gap-2 rounded-[var(--yc-radius-md)] border transition active:translate-y-px",
        focusClasses,
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
      <span className="truncate">{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
    </a>
  );
}
