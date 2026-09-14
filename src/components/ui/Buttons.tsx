import { sitePath } from "../../utils/sitePath";
﻿import type { ComponentType, MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { handleExternalLinkClick } from "../../utils/linkActions";
import { cx } from "./cx";

const focusClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";

const tokenButtonClasses =
  "border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)] transition hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] hover:text-[var(--yc-text)] active:translate-y-px";

export type LinkButtonProps = {
  href?: string;
  children: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
};

export function LinkButton({ href, children, icon: Icon, className = "" }: LinkButtonProps) {
  if (!href) return null;
  return (
    <a
      href={sitePath(href)}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => handleExternalLinkClick(e, href)}
      className={cx(
        "link-button",
        "flex items-center gap-2",
        "px-3 py-1.5",
        "rounded-[var(--yc-radius-md)]",
        "text-xs",
        tokenButtonClasses,
        focusClasses,
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5 min-w-0">
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span className="tracking-wide truncate">{children}</span>
      </span>
      <ArrowUpRight className="ml-auto w-3.5 h-3.5 opacity-60 shrink-0" />
    </a>
  );
}

export type IconButtonProps = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  icon: ComponentType<{ className?: string }>;
  label: string;
  className?: string;
};

export function IconButton({ onClick, icon: Icon, label, className = "" }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        "inline-flex items-center justify-center",
        "w-7 h-7",
        "rounded-[var(--yc-radius-md)]",
        tokenButtonClasses,
        focusClasses,
        "shrink-0",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export type ExtRouteTagProps = {
  href?: string;
  code: string;
  label: string;
};

export function ExtRouteTag({ href, code, label }: ExtRouteTagProps) {
  if (!href) return null;
  return (
    <a
      href={sitePath(href)}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => handleExternalLinkClick(e, href)}
      className={cx(
        "ext-route",
        "inline-flex items-center gap-2",
        "px-3 py-1.5",
        "rounded-[var(--yc-radius-md)]",
        "text-[10px] tracking-[0.20em]",
        tokenButtonClasses,
        focusClasses
      )}
    >
      <span className="text-[9px] tracking-[0.26em] text-[var(--yc-dim)]">{code}</span>
      <span className="ext-route-label">{label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
    </a>
  );
}
