import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Tag } from "lucide-react";

import type { Post } from "../../data/blog";
import { fadeUp } from "../../motion/presets";
import { ExtRouteTag } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";
import { cx } from "../ui/cx";

export type BlogSectionProps = {
  isLight: boolean;
  filteredPosts: Post[];
  blogTagOptions: string[];
  activeTag: string;
  setActiveTag: (tag: string) => void;
  years: string[];
  activeYear: string;
  setActiveYear: (year: string) => void;
  logUrl: string;
};

export default function BlogSection({
  isLight,
  filteredPosts,
  blogTagOptions,
  activeTag,
  setActiveTag,
  years,
  activeYear,
  setActiveYear,
  logUrl,
}: BlogSectionProps) {
  return (
    <section id="blog" className="py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="SECONDARY LOG / 次要记录"
          title="记录节点"
          right={<ExtRouteTag href={logUrl} code="EXT-02" label="OPEN LOG" />}
          desc="更压缩的文章卡片层级，突出标题 / 标签 / 日期。"
        />

        <Panel
          label="TAG ROUTER / 标签路由"
          sublabel="LOG FILTER"
          icon={Tag}
          right={<Pill>{filteredPosts.length} NODES</Pill>}
        >
          <div className="flex flex-wrap gap-2">
            {blogTagOptions.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                className={cx(
                  "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                  activeTag === t
                    ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                    : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                )}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="year-router mt-3 pt-3 border-t border-white/10">
            <div className="mb-2 flex items-center gap-2">
              <span className="year-router-line h-px w-6 bg-white/20" />
              <span className="year-router-label text-[10px] tracking-[0.28em] text-white/45">YEAR ROUTER / 年份路由</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveYear("ALL")}
                className={cx(
                  "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                  activeYear === "ALL"
                    ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                    : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                )}
              >
                ALL
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={cx(
                    "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                    activeYear === y
                      ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                      : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, delay: Math.min(idx * 0.03, 0.12) }}
            >
              <Panel
                className="hover:border-white/20 transition"
                label={`LOG / ${post.date}`}
                sublabel={post.id.toUpperCase()}
                icon={BookOpen}
                right={<Pill tint="accent">{post.tag}</Pill>}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="heading-main text-[15px] font-semibold text-white/92 tracking-wide">{post.title}</div>
                  <div className="text-muted-block text-[11px] text-white/55 leading-relaxed">{post.summary}</div>
                  <div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.24em] text-white/55 hover:text-white/85"
                    >
                      READ NODE
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
