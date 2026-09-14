import { cx } from "./cx";

export type BreathingSeparatorProps = {
  orientation?: "vertical" | "horizontal";
  className?: string;
};

export function BreathingSeparator({ orientation = "vertical", className = "" }: BreathingSeparatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "top-bar-separator breathing-separator rounded-full",
        orientation === "vertical" ? "breathing-separator-vertical" : "breathing-separator-horizontal",
        orientation === "vertical"
          ? "h-7 w-px [background-image:var(--yc-separator-vertical)]"
          : "h-px w-full [background-image:var(--yc-separator-horizontal)]",
        className
      )}
    />
  );
}
