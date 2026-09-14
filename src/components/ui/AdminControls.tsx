import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import Panel from "./Panel";
import { UnboundedSurface } from "./UnboundedSurface";
import { cx } from "./cx";

export type AdminTone = "neutral" | "accent" | "warm" | "danger" | "success";

const toneClasses: Record<AdminTone, string> = {
  neutral:
    "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-text)] hover:bg-[var(--yc-surface-strong)]",
  accent:
    "border-[color-mix(in_srgb,var(--yc-cyan)_42%,transparent)] bg-[var(--yc-cyan-soft)] text-[var(--yc-text)] hover:border-[var(--yc-cyan)]",
  warm:
    "border-[color-mix(in_srgb,var(--yc-amber)_42%,transparent)] bg-[var(--yc-amber-soft)] text-[var(--yc-text)] hover:border-[var(--yc-amber)]",
  danger:
    "border-red-300/35 bg-red-500/10 text-[var(--yc-text)] hover:border-red-300/70 hover:bg-red-500/15",
  success:
    "border-[color-mix(in_srgb,var(--yc-green)_42%,transparent)] bg-[color-mix(in_srgb,var(--yc-green)_12%,transparent)] text-[var(--yc-text)] hover:border-[var(--yc-green)]",
};

export type AdminPanelProps = {
  label: string;
  sublabel?: string;
  icon?: ComponentType<{ className?: string }>;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: "framed" | "unbounded";
};

export function AdminPanel({
  label,
  sublabel,
  icon,
  right,
  children,
  className,
  bodyClassName,
  variant = "framed",
}: AdminPanelProps) {
  return (
    <Panel label={label} sublabel={sublabel} icon={icon} right={right} className={className} variant={variant}>
      <div className={cx("grid min-w-0 gap-4", bodyClassName)}>{children}</div>
    </Panel>
  );
}

export type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: AdminTone;
  icon?: ComponentType<{ className?: string }>;
  size?: "sm" | "md";
};

export function AdminButton({
  tone = "neutral",
  icon: Icon,
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "yc-hud-text inline-flex items-center justify-center gap-2 rounded-[var(--yc-radius-sm)] border text-center font-medium no-underline transition active:translate-y-px disabled:pointer-events-none disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]",
        size === "sm" ? "px-2.5 py-1.5 text-[9px]" : "px-3 py-2 text-[10px]",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export type AdminFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function AdminField({ label, hint, error, children, className }: AdminFieldProps) {
  return (
    <label className={cx("grid gap-2", className)}>
      <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{label}</span>
      {children}
      {hint ? <span className="text-[11px] leading-relaxed text-[var(--yc-dim)]">{hint}</span> : null}
      {error ? <span className="text-[11px] leading-relaxed text-red-700 dark:text-red-200">{error}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-text)] shadow-none transition placeholder:text-[var(--yc-dim)] focus:border-[var(--yc-line-strong)] focus:bg-[var(--yc-surface)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]";

export function AdminTextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(controlClass, "h-9 px-3 text-sm", className)} {...props} />;
}

export function AdminSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(controlClass, "h-9 px-3 text-sm", className)} {...props}>
      {children}
    </select>
  );
}

export function AdminTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(controlClass, "min-h-28 resize-y px-3 py-2 text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

export type AdminListButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  titleText: string;
  meta?: string;
  detail?: string;
  badge?: string;
  variant?: "framed" | "unbounded";
};

export function AdminListButton({
  active = false,
  titleText,
  meta,
  detail,
  badge,
  variant = "framed",
  className,
  ...props
}: AdminListButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        "group w-full min-w-0 rounded-[var(--yc-radius-md)] border p-3 text-left transition active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]",
        variant === "unbounded"
          ? active
            ? "border-transparent bg-[var(--yc-surface-strong)] shadow-[var(--yc-shadow-unbounded)]"
            : "border-transparent bg-transparent hover:bg-[var(--yc-surface-inner)] hover:shadow-[var(--yc-shadow-unbounded)]"
          : active
            ? "border-[var(--yc-line-strong)] bg-[var(--yc-surface-strong)]"
            : "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface)]",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {meta ? <div className="yc-hud-text break-words text-[9px] text-[var(--yc-dim)] [overflow-wrap:anywhere]">{meta}</div> : null}
          <div className="mt-1 break-words text-sm font-semibold tracking-wide text-[var(--yc-text)] [overflow-wrap:anywhere]">{titleText}</div>
        </div>
        {badge ? <span className="proj-hud-chip shrink-0">{badge}</span> : null}
      </div>
      {detail ? <p className="mt-2 break-words text-xs leading-relaxed text-[var(--yc-muted)] [overflow-wrap:anywhere]">{detail}</p> : null}
    </button>
  );
}

export function AdminToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

export type AdminSwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label: string;
  desc?: string;
};

export function AdminSwitch({
  checked,
  onCheckedChange,
  label,
  desc,
  className,
  disabled,
  onClick,
  ...props
}: AdminSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cx(
        "group flex w-full items-start gap-3 rounded-[var(--yc-radius-md)] border p-3 text-left transition active:translate-y-px",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]",
        checked
          ? "border-[color-mix(in_srgb,var(--yc-green)_44%,transparent)] bg-[color-mix(in_srgb,var(--yc-green)_10%,transparent)]"
          : "border-[var(--yc-line)] bg-[var(--yc-surface-inner)] hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface)]",
        disabled && "pointer-events-none opacity-45",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange?.(!checked);
      }}
      {...props}
    >
      <span
        className={cx(
          "mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition",
          checked
            ? "border-[color-mix(in_srgb,var(--yc-green)_58%,transparent)] bg-[color-mix(in_srgb,var(--yc-green)_18%,transparent)]"
            : "border-[var(--yc-line)] bg-[var(--yc-surface)]"
        )}
        aria-hidden="true"
      >
        <span
          className={cx(
            "h-3.5 w-3.5 rounded-full transition-transform",
            checked ? "translate-x-4 bg-[var(--yc-green)]" : "translate-x-0 bg-[var(--yc-dim)]"
          )}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold tracking-wide text-[var(--yc-text)]">{label}</span>
        {desc ? <span className="mt-1 block text-xs leading-relaxed text-[var(--yc-muted)]">{desc}</span> : null}
      </span>
    </button>
  );
}

export type AdminModalProps = {
  open: boolean;
  label: string;
  sublabel?: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
  className?: string;
  bodyClassName?: string;
};

export function AdminModal({
  open,
  label,
  sublabel,
  right,
  children,
  footer,
  onClose,
  size = "lg",
  className,
  bodyClassName,
}: AdminModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  const sizeClass = {
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto" onClick={onClose}>
        <div className="flex min-h-full items-start justify-center px-4 py-6 md:py-10">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={cx("w-full outline-none", sizeClass)}
            onClick={(event) => event.stopPropagation()}
          >
            <Panel
              label={label}
              sublabel={sublabel}
              right={right}
              elevation="modal"
              className={cx("w-full", className)}
            >
              <div className={cx("grid min-w-0 gap-4", bodyClassName)}>
                {children}
                {footer ? <div className="border-t border-[var(--yc-line)] pt-4">{footer}</div> : null}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminStatStrip({
  items,
  className,
}: {
  items: Array<{ label: string; value: string | number; tone?: AdminTone }>;
  className?: string;
}) {
  return (
    <div className={cx("grid gap-2 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <UnboundedSurface
          key={item.label}
          tone={item.tone ?? "neutral"}
          className="rounded-[var(--yc-radius-md)] p-3"
        >
          <div className="yc-hud-text text-[9px] opacity-75">{item.label}</div>
          <div className="mt-1 text-xl font-semibold tracking-wide">{item.value}</div>
        </UnboundedSurface>
      ))}
    </div>
  );
}
