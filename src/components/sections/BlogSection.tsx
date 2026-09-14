import { sitePath } from "../../utils/sitePath";
import { ArrowUpRight, BookOpen, Tag } from "lucide-react";

import type { Post } from "../../data/blog";
import { handleExternalLinkClick } from "../../utils/linkActions";
import { ExtRouteTag, Panel, Pill, SectionTitle, SegmentedControl, SystemState } from "../ui";

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
          desc="按标签和年份整理的文章记录。"
        />

        <Panel label="TAG ROUTER / 标签路由" sublabel="LOG FILTER" icon={Tag} right={<Pill>{filteredPosts.length} NODES</Pill>}>
          <SegmentedControl
            options={blogTagOptions.map((tag) => ({ value: tag, label: tag.toUpperCase() }))}
            value={activeTag}
            onChange={setActiveTag}
          />

          <div className="year-router mt-3 pt-3 border-t border-white/10">
            <SegmentedControl
              label="YEAR ROUTER / 年份路由"
              options={[{ value: "ALL", label: "ALL" }, ...years.map((year) => ({ value: year, label: year }))]}
              value={activeYear}
              onChange={setActiveYear}
            />
          </div>
        </Panel>

        <Panel label="LOG INDEX / 文章索引" sublabel="OPEN: NEW TAB" icon={BookOpen} right={<Pill>{filteredPosts.length} ITEMS</Pill>}>
          {filteredPosts.length ? (
            <div className="divide-y divide-[var(--yc-line)]">
              {filteredPosts.map((post) => (
                <a
                  key={post.id}
                  href={sitePath(post.link)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${post.title} in a new tab`}
                  onClick={(e) => handleExternalLinkClick(e, post.link)}
                  className="group grid gap-3 px-1 py-4 text-inherit no-underline transition hover:bg-[var(--yc-surface-inner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)] md:grid-cols-[120px_1fr_auto]"
                >
                  <div className="yc-hud-text text-[10px] text-[var(--yc-dim)]">
                    <div>{post.date}</div>
                    <div className="mt-1">{post.id.toUpperCase()}</div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tint="accent">{post.tag}</Pill>
                      <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">ARTICLE NODE</span>
                    </div>
                    <div className="heading-main mt-2 text-[15px] font-semibold tracking-wide text-[var(--yc-text)]">
                      {post.title}
                    </div>
                    <p className="text-muted-block mt-1 text-[11px] leading-relaxed text-[var(--yc-muted)]">
                      {post.summary}
                    </p>
                  </div>

                  <div className="yc-hud-text flex items-center gap-1.5 text-[9px] text-[var(--yc-dim)] group-hover:text-[var(--yc-text)] md:justify-end">
                    NEW TAB
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <SystemState
              title="没有匹配的记录节点"
              desc="当前标签或年份过滤器没有结果。切回 ALL 可查看完整记录。"
            />
          )}
        </Panel>
      </div>
    </section>
  );
}
