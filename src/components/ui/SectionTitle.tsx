import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp } from "../../motion/presets";
import { cx } from "./cx";

export type SectionTitleProps = {
  kicker: string;
  title: string;
  desc?: string;
  isLight: boolean;
  right?: ReactNode;
};

export default function SectionTitle({ kicker, title, desc, isLight, right }: SectionTitleProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      className="mb-6"
    >
      {right ? (
        <div className="flex items-end justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-[var(--yc-line-strong)]" />
            <span className="yc-hud-text text-xs text-[var(--yc-muted)]">{kicker}</span>
          </div>
          <div className="shrink-0">{right}</div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-8 bg-[var(--yc-line-strong)]" />
          <span className="yc-hud-text text-xs text-[var(--yc-muted)]">{kicker}</span>
        </div>
      )}

      <h2 className="section-title-main text-2xl md:text-3xl font-semibold tracking-wide text-[var(--yc-text)]">
        {title}
      </h2>

      <div
        className={cx(
          "section-meta yc-hud-text mt-2 flex flex-wrap items-center gap-2 text-[10px]",
          isLight ? "section-meta-day" : "section-meta-night"
        )}
      >
        <span className="section-meta-dot inline-block w-1.5 h-1.5 rounded-full" />
        <span>NODE</span>
        <span className="section-meta-slash">/</span>
        <span>ACCESS: PUBLIC</span>
        <span className="section-meta-slash">/</span>
        <span>SYNC: OK</span>
      </div>

      <motion.div
        className="section-title-divider mt-3 h-px w-40"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-140px" }}
        transition={{ duration: 0.32, delay: 0.18, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      {desc ? <p className="section-desc mt-4 max-w-3xl leading-relaxed text-[var(--yc-muted)]">{desc}</p> : null}
    </motion.div>
  );
}
