import { sitePath } from "../../utils/sitePath";
import { motion } from "framer-motion";
import type { ComponentType, MouseEvent, ReactNode } from "react";

import { fadeUp } from "../../motion/presets";
import { handleExternalLinkClick } from "../../utils/linkActions";
import Panel from "./Panel";
import { cx } from "./cx";

export type AnimatedPanelCardProps = {
  label?: string;
  sublabel?: string;
  icon?: ComponentType<{ className?: string }>;
  right?: ReactNode;
  children: ReactNode;
  index?: number;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: () => void;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
};

function MotionShell({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.03, 0.15) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedPanelCard({
  label,
  sublabel,
  icon,
  right,
  children,
  index = 0,
  href,
  target,
  onClick,
  className = "",
  contentClassName = "",
  ariaLabel,
}: AnimatedPanelCardProps) {
  const panel = (
    <Panel
      className={cx(
        "portal-card project-card h-full transition hover:bg-[var(--yc-surface-strong)]",
        className
      )}
      label={label}
      sublabel={sublabel}
      icon={icon}
      right={right}
    >
      <div className={cx("relative overflow-hidden rounded-lg", contentClassName)}>
        <div className="portal-hover-scan" aria-hidden="true" />
        <div className="portal-tickflash" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </div>
    </Panel>
  );

  if (href) {
    const resolvedTarget = target ?? (href.startsWith("/") || href.startsWith("#") ? "_self" : "_blank");
    return (
      <MotionShell index={index} className="h-full">
        <a
          href={sitePath(href)}
          target={resolvedTarget}
          rel={resolvedTarget === "_blank" ? "noreferrer" : undefined}
          aria-label={ariaLabel}
          onClick={(e: MouseEvent<HTMLAnchorElement>) => handleExternalLinkClick(e, href)}
          className="block h-full rounded-[var(--yc-radius-lg)] text-left text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
        >
          {panel}
        </a>
      </MotionShell>
    );
  }

  if (onClick) {
    return (
      <MotionShell index={index} className="h-full">
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className="block h-full w-full rounded-[var(--yc-radius-lg)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
        >
          {panel}
        </button>
      </MotionShell>
    );
  }

  return (
    <MotionShell index={index} className="h-full">
      {panel}
    </MotionShell>
  );
}
