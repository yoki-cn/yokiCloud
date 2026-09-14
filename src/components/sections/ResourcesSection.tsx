import { ArrowUpRight, FolderKanban, Tag } from "lucide-react";

import type { ResourceItem } from "../../data/resources";
import {
  AnimatedPanelCard,
  ClearanceBadge,
  ExtRouteTag,
  Panel,
  Pill,
  SectionTitle,
  SegmentedControl,
  SystemState,
} from "../ui";

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
            <SegmentedControl
              label="CATEGORY ROUTER / 分类路由"
              options={depotTypeOptions.map((t) => ({ value: t, label: t }))}
              value={activeDepotType}
              onChange={setActiveDepotType}
            />

            <div className="border-t border-[var(--yc-line)] pt-3">
              <SegmentedControl
                label="TAG ROUTER / 标签路由"
                options={depotTagOptions.map((t) => ({ value: t, label: t.toUpperCase() }))}
                value={activeDepotTag}
                onChange={setActiveDepotTag}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--yc-line)] pt-3">
              <span className="proj-hud-chip">EXT:03</span>
              <span className="proj-hud-chip">TYPE:{activeDepotType}</span>
              <span className="proj-hud-chip">TAG:{activeDepotTag}</span>
              <span className="proj-hud-chip">SYNC:OK</span>
            </div>
          </div>
        </Panel>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.length ? (
            filteredResources.map((r, idx) => (
              <AnimatedPanelCard
                key={r.id}
                index={idx}
                href={r.link}
                ariaLabel={`Open ${r.title}`}
                label={`NODE / ${r.type}`}
                sublabel={`${String(r.id).toUpperCase()} / ${r.clearance}`}
                icon={FolderKanban}
                right={<ClearanceBadge clearance={r.clearance} />}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{String(r.id).toUpperCase()}</span>
                    <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">DEPOT FILE</span>
                  </div>

                  <div className="heading-main text-[15px] font-semibold tracking-wide text-[var(--yc-text)]">{r.title}</div>
                  <div className="text-muted-block text-[11px] leading-relaxed text-[var(--yc-muted)]">{r.summary}</div>

                  <div className="flex flex-wrap gap-1.5">
                    {(r.tags || []).map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>

                  <div className="proj-hud-row mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="proj-hud-chip">ID:{String(r.id).toUpperCase()}</span>
                    <span className="proj-hud-chip">CLASS:{r.type}</span>
                    <span className="proj-hud-chip">CLEAR:{r.clearance}</span>
                  </div>

                  <div className="yc-hud-text inline-flex items-center gap-1.5 text-[9px] text-[var(--yc-muted)]">
                    OPEN NODE
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </AnimatedPanelCard>
            ))
          ) : (
            <SystemState
              className="sm:col-span-2 lg:col-span-3"
              title="没有匹配的资源节点"
              desc="当前类型和标签组合没有结果。资源仓路由会随过滤条件保持同步。"
            />
          )}
        </div>
      </div>
    </section>
  );
}
