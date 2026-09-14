import { sitePath } from "../../utils/sitePath";
import { useState } from "react";
import { ArrowRight, Binary, BookOpen } from "lucide-react";
import type { AlgorithmBoardSummary } from "../../pages/_AlgorithmArchive";
import { ALGORITHM_STATUS_ORDER } from "../../data/algorithmStatus";
import { AlgorithmStatusBadge, Panel, Pill, SectionTitle, SegmentedControl, SystemState } from "../ui";

export default function AlgorithmsSection({ isLight, boards, directories }: {
  isLight: boolean;
  boards: AlgorithmBoardSummary[];
  directories: string[];
}) {
  const [section, setSection] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const sections = directories.filter((path) => !path.includes("/") && path !== "图片");
  const statuses = ALGORITHM_STATUS_ORDER.filter((value) => boards.some((board) => board.status === value));
  const filtered = boards.filter((board) =>
    (section === "ALL" || board.slug.startsWith(section + "/")) && (status === "ALL" || board.status === status));
  const params = new URLSearchParams();
  if (section !== "ALL") params.set("section", section);
  if (status !== "ALL") params.set("status", status);
  const href = `/algorithms/${params.size ? `?${params}` : ""}`;
  return (
    <section id="algorithms" className="py-10 md:py-14 scroll-mt-20">
      <div className="flex flex-col gap-6">
        <SectionTitle isLight={isLight} kicker="ALGORITHM LIBRARY / 算法档案" title="算法板子"
          desc="按知识域与状态浏览算法模板，进入板库查看完整章节和下载。"
          right={<a href={sitePath(href)} className="algorithm-board-action algorithm-board-action-primary">进入板库 <ArrowRight className="h-4 w-4" /></a>} />
        <Panel label="BOARD ROUTER / 板子筛选" sublabel="KNOWLEDGE & STATUS" icon={Binary} right={<Pill>{filtered.length} BOARDS</Pill>}>
          <SegmentedControl label="知识域" options={[{ value: "ALL", label: "ALL" }, ...sections.map((value) => ({ value, label: value }))]} value={section} onChange={setSection} />
          <div className="mt-3 border-t border-[var(--yc-line)] pt-3">
            <SegmentedControl label="状态" options={[{ value: "ALL", label: "ALL" }, ...statuses.map((value) => ({ value, label: value }))]} value={status} onChange={setStatus} />
          </div>
        </Panel>
        <Panel label="BOARD INDEX / 板子索引" sublabel="PREVIEW" icon={BookOpen} right={<Pill>{Math.min(6, filtered.length)} / {filtered.length}</Pill>}>
          {filtered.length ? <div className="divide-y divide-[var(--yc-line)]">
            {filtered.slice(0, 6).map((board) => <a key={board.slug} href={sitePath(board.href)}
              className="group grid gap-3 px-1 py-4 text-inherit no-underline transition hover:bg-[var(--yc-surface-inner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--yc-focus)] md:grid-cols-[180px_1fr_auto]">
              <div className="text-xs text-[var(--yc-dim)]">{board.section}<div className="mt-1">{board.updated}</div></div>
              <div className="min-w-0"><div className="heading-main text-base font-semibold">{board.title}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">{board.tags.slice(0, 3).map((tag) => <Pill key={tag}>{tag}</Pill>)}</div></div>
              <div className="flex items-center gap-3"><AlgorithmStatusBadge status={board.status} /><ArrowRight className="h-4 w-4" /></div>
            </a>)}
          </div> : <SystemState title="暂无匹配的板子" desc="此知识域暂未收录符合条件的板子，可以切换知识域或状态。" />}
          <div className="mt-4 flex justify-end border-t border-[var(--yc-line)] pt-4">
            <a href={sitePath(href)} className="algorithm-board-action algorithm-board-action-primary">查看全部匹配板子（{filtered.length}）<ArrowRight className="h-4 w-4" /></a>
          </div>
        </Panel>
      </div>
    </section>
  );
}
