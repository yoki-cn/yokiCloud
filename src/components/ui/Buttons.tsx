import type { ComponentType, MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { cx } from "./cx";

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
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx(
        "link-button",
        "flex items-center gap-2",
        "px-3 py-1.5",
        "rounded-lg",
        "border border-white/10",
        "bg-white/5 hover:bg-white/10",
        "text-xs text-white/75",
        "transition",
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
        "rounded-lg",
        "bg-white/5",
        "border border-white/10",
        "hover:bg-white/10",
        "transition",
        "shrink-0",
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 text-white/70" />
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
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx(
        "ext-route",
        "inline-flex items-center gap-2",
        "px-3 py-1.5",
        "rounded-full",
        "border border-white/12",
        "bg-white/5 hover:bg-white/10",
        "text-[10px] tracking-[0.20em]",
        "text-white/70 hover:text-white/90",
        "transition"
      )}
    >
      <span className="text-[9px] tracking-[0.26em] text-white/45">{code}</span>
      <span className="ext-route-label">{label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
    </a>
  );
}
