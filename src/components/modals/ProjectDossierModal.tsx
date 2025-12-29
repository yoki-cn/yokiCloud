import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ExternalLink, Github, Shield, X } from "lucide-react";

import type { Project } from "../../data/projects";
import { fastFade } from "../../motion/presets";
import { LinkButton } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { Pill, StatusBadge, TypeBadge } from "../ui/Pill";

export type ProjectDossierModalProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectDossierModal({ project, onClose }: ProjectDossierModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={fastFade}
        >
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <div className="absolute inset-0 overflow-y-auto" onClick={onClose}>
            <div className="min-h-full flex items-start justify-center px-4 py-10">
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.992 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Panel
                  className="border-white/20"
                  label={`DOSSIER / 档案 / ${project.year}`}
                  sublabel={`${project.id.toUpperCase()} / ${project.role}`}
                  icon={Shield}
                  right={
                    <div className="flex items-center gap-2">
                      <TypeBadge typeKey={project.type} />
                      <StatusBadge status={project.status} />
                      <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
                        aria-label="Close"
                      >
                        <X className="w-3.5 h-3.5 text-white/70" />
                      </button>
                    </div>
                  }
                >
                  <div className="relative overflow-hidden">
                    <div className="scanline" />
                    <div className="flex flex-col gap-6">
                      <div>
                        <div className="text-[10px] tracking-[0.28em] text-white/40">ROLE / 参与</div>
                        <div className="heading-main mt-2 text-2xl font-semibold text-white/95 tracking-wide">
                          {project.title}
                        </div>
                        <div className="text-muted-block mt-2 text-sm text-white/60 leading-relaxed">{project.tagline}</div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-4">
                          <div className="text-[10px] tracking-[0.22em] text-white/45">STACK / 技术</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {project.stack.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] tracking-wide text-white/65"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-4">
                          <div className="text-[10px] tracking-[0.22em] text-white/45">HIGHLIGHTS / 要点</div>
                          <ul className="mt-2 space-y-1.5">
                            {project.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-300/70" />
                                <span className="text-xs text-white/65 leading-relaxed">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="inner-elevated rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] tracking-[0.22em] text-white/45">LINKS / 外部路由</span>
                          <Pill>EXTERNAL</Pill>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <LinkButton href={project.links.demo} icon={ExternalLink}>
                            LIVE / DEMO
                          </LinkButton>
                          <LinkButton href={project.links.repo} icon={Github}>
                            REPOSITORY
                          </LinkButton>
                          <LinkButton href={project.links.case} icon={BookOpen}>
                            CASE STUDY
                          </LinkButton>
                        </div>
                        {!project.links.demo && !project.links.repo && !project.links.case && (
                          <div className="mt-3 text-xs text-white/40">Add links when available.</div>
                        )}
                      </div>

                      <div className="text-[9px] tracking-[0.22em] text-white/35">
                        Dossier view is designed for quick scanning. Expand into dedicated routes if you want a full-case site.
                      </div>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
