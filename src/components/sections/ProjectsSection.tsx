import { motion } from "framer-motion";
import { Shield, Tag } from "lucide-react";

import type { Project, ProjectType } from "../../data/projects";
import { fadeUp } from "../../motion/presets";
import { ExtRouteTag } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { Pill, StatusBadge, TypeBadge } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";
import { cx } from "../ui/cx";

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
          right={<ExtRouteTag href={archiveUrl} code="EXT-01" label="OPEN ARCHIVE" />}
          desc="以更官方、更压缩的层级展示项目概览。Click a card to open dossier."
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
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((t) => {
              const active = activeType === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onSelectType(t.key)}
                  className={cx(
                    "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                    active
                      ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                      : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p, idx) => (
            <motion.button
              key={p.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, delay: Math.min(idx * 0.03, 0.15) }}
              onClick={() => onSelectProject(p)}
              className="text-left"
            >
              <Panel
                className="h-full hover:border-white/20 transition project-card"
                label={`FILE / ${p.year}`}
                sublabel={p.role}
                icon={Shield}
                right={<StatusBadge status={p.status} />}
              >
                <div className="flex flex-col gap-3 relative">
                  <div className="flex items-center justify-between gap-2">
                    <TypeBadge typeKey={p.type} />
                    <span className="text-[9px] tracking-[0.2em] text-white/30">{p.id.toUpperCase()}</span>
                  </div>

                  <div>
                    <div className="heading-main text-[15px] font-semibold text-white/92 tracking-wide">{p.title}</div>
                    <div className="text-muted-block mt-1 text-[11px] text-white/55 leading-relaxed">{p.tagline}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] tracking-wide text-white/55"
                      >
                        {s}
                      </span>
                    ))}
                    {p.stack.length > 5 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] tracking-wide text-white/45">
                        +{p.stack.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.22em] text-white/35">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300/60" />
                    OPEN DOSSIER
                  </div>

                  <div className="proj-hud-row mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="proj-hud-chip">BUILD:{p.status}</span>
                    <span className="proj-hud-chip">YEAR:{p.year}</span>
                    <span className="proj-hud-chip">STACK:{p.stack.length}</span>
                  </div>
                </div>
              </Panel>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
