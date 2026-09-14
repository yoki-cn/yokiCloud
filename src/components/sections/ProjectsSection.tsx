import { Shield, Tag } from "lucide-react";

import type { Project, ProjectType } from "../../data/projects";
import {
  AnimatedPanelCard,
  ExtRouteTag,
  Panel,
  Pill,
  SectionTitle,
  SegmentedControl,
  StatusBadge,
  SystemState,
  TypeBadge,
} from "../ui";

export type ProjectsSectionProps = {
  isLight: boolean;
  projectTypes: ProjectType[];
  filteredProjects: Project[];
  activeType: string;
  onSelectType: (type: string) => void;
  onSelectProject: (project: Project) => void;
  archiveUrl: string;
};

export default function ProjectsSection({
  isLight,
  projectTypes,
  filteredProjects,
  activeType,
  onSelectType,
  onSelectProject,
  archiveUrl,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="PRIMARY ARCHIVE / 主档案"
          title="作品档案"
          right={
            <div className="flex flex-wrap justify-end gap-2">
              <ExtRouteTag href="/ui-kit/" code="KIT" label="UI LIBRARY" />
              <ExtRouteTag href={archiveUrl} code="EXT-01" label="OPEN ARCHIVE" />
            </div>
          }
          desc="近期项目、组件库和设计系统记录。"
        />

        <Panel
          label="FILTER MATRIX / 过滤矩阵"
          sublabel="TYPE ROUTING"
          icon={Tag}
          right={
            <div className="flex items-center gap-2">
              <Pill>{filteredProjects.length} RESULTS</Pill>
            </div>
          }
        >
          <SegmentedControl
            options={projectTypes.map((type) => ({ value: type.key, label: type.label }))}
            value={activeType}
            onChange={onSelectType}
          />
        </Panel>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.length ? (
            filteredProjects.map((p, idx) => (
              <AnimatedPanelCard
                key={p.id}
                index={idx}
                onClick={() => onSelectProject(p)}
                ariaLabel={`Open ${p.title} dossier`}
                label={`FILE / ${p.year}`}
                sublabel={p.role}
                icon={Shield}
                right={<StatusBadge status={p.status} />}
              >
                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <TypeBadge typeKey={p.type} />
                    <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{p.id.toUpperCase()}</span>
                  </div>

                  <div>
                    <div className="heading-main text-[15px] font-semibold tracking-wide text-[var(--yc-text)]">{p.title}</div>
                    <div className="text-muted-block mt-1 text-[11px] leading-relaxed text-[var(--yc-muted)]">{p.tagline}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                    {p.stack.length > 3 && <Pill>+{p.stack.length - 3}</Pill>}
                  </div>

                  <div className="yc-hud-text mt-1 flex items-center gap-2 text-[9px] text-[var(--yc-dim)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--yc-cyan)]" />
                    OPEN DOSSIER
                  </div>

                  <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">YEAR:{p.year} / STACK:{p.stack.length}</div>
                </div>
              </AnimatedPanelCard>
            ))
          ) : (
            <SystemState
              className="sm:col-span-2 lg:col-span-3"
              title="没有匹配的项目档案"
              desc="调整类型过滤器后，项目档案会在这里重新同步。"
            />
          )}
        </div>
      </div>
    </section>
  );
}
