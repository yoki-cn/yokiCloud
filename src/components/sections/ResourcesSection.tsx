import { motion } from "framer-motion";
import { ArrowUpRight, FolderKanban, Tag } from "lucide-react";

import type { ResourceItem } from "../../data/resources";
import { fadeUp } from "../../motion/presets";
import { ExtRouteTag } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { ClearanceBadge, Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";
import { cx } from "../ui/cx";

export type ResourcesSectionProps = {
  isLight: boolean;
  filteredResources: ResourceItem[];
  depotTypeOptions: string[];
  depotTagOptions: string[];
  activeDepotType: string;
  activeDepotTag: string;
  setActiveDepotType: (type: string) => void;
  setActiveDepotTag: (tag: string) => void;
  depotRouteHref: string;
  depotRouteLabel: string;
};

export default function ResourcesSection({
  isLight,
  filteredResources,
  depotTypeOptions,
  depotTagOptions,
  activeDepotType,
  activeDepotTag,
  setActiveDepotType,
  setActiveDepotTag,
  depotRouteHref,
  depotRouteLabel,
}: ResourcesSectionProps) {
  return (
    <section id="resources" className="py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="RESOURCE DEPOT / 资源仓"
          title="资源节点"
          right={<ExtRouteTag href={depotRouteHref} code="EXT-03" label={depotRouteLabel} />}
          desc="把重要资源做成可路由的节点清单。This is a curated subset; full depot lives in EXT-03."
        />

        <Panel
          label="DEPOT ROUTER / 资源分类路由"
          sublabel="FILTER MATRIX"
          icon={Tag}
          right={<Pill>{filteredResources.length} NODES</Pill>}
        >
          <div className="grid gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-6 bg-white/20" />
                <span className="text-[10px] tracking-[0.28em] text-white/45">CATEGORY ROUTER</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {depotTypeOptions.map((t) => {
                  const active = activeDepotType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setActiveDepotType(t)}
                      className={cx(
                        "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                        active
                          ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                          : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-6 bg-white/20" />
                <span className="text-[10px] tracking-[0.28em] text-white/45">TAG ROUTER</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {depotTagOptions.map((t) => {
                  const active = activeDepotTag === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setActiveDepotTag(t)}
                      className={cx(
                        "px-3 py-1.5 rounded-md border text-[9px] tracking-[0.26em] transition",
                        active
                          ? "bg-cyan-400/15 border-cyan-300/35 text-cyan-100"
                          : "bg-white/5 border-white/10 text-white/55 hover:text-white/80 hover:bg-white/10"
                      )}
                    >
                      {t.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-1.5">
              <span className="proj-hud-chip">EXT:03</span>
              <span className="proj-hud-chip">TYPE:{activeDepotType}</span>
              <span className="proj-hud-chip">TAG:{activeDepotTag}</span>
              <span className="proj-hud-chip">SYNC:OK</span>
            </div>
          </div>
        </Panel>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((r, idx) => (
            <motion.div
              key={r.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.32, delay: Math.min(idx * 0.03, 0.15) }}
            >
              <Panel
                className="h-full hover:border-white/20 transition"
                label={`NODE / ${r.type}`}
                sublabel={`${String(r.id).toUpperCase()} / ${r.clearance}`}
                icon={FolderKanban}
                right={<ClearanceBadge clearance={r.clearance} />}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] tracking-[0.2em] text-white/30">{String(r.id).toUpperCase()}</span>
                    <span className="text-[9px] tracking-[0.2em] text-white/40">DEPOT FILE</span>
                  </div>

                  <div className="heading-main text-[15px] font-semibold text-white/92 tracking-wide">{r.title}</div>
                  <div className="text-muted-block text-[11px] text-white/55 leading-relaxed">{r.summary}</div>

                  <div className="flex flex-wrap gap-1.5">
                    {(r.tags || []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] tracking-wide text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="proj-hud-row mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="proj-hud-chip">ID:{String(r.id).toUpperCase()}</span>
                    <span className="proj-hud-chip">CLASS:{r.type}</span>
                    <span className="proj-hud-chip">CLEAR:{r.clearance}</span>
                  </div>

                  <div>
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.24em] text-white/55 hover:text-white/85"
                    >
                      OPEN NODE
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
