import type { ReactNode } from "react";

import { cx } from "./cx";

export type CutCornerProps = {
  className?: string;
  children: ReactNode;
};

export default function CutCorner({ className = "", children }: CutCornerProps) {
  return (
    <div
      className={cx(
        "relative",
        "before:content-[''] before:absolute before:top-0 before:right-0",
        "before:w-3 before:h-3 before:border-t before:border-r",
        "before:border-white/20",
        "after:content-[''] after:absolute after:bottom-0 after:left-0",
        "after:w-3 after:h-3 after:border-b after:border-l",
        "after:border-white/15",
        className
      )}
    >
      {children}
    </div>
  );
}
