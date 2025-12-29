import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Mail,
  Newspaper,
  Radio,
} from "lucide-react";

import { fadeUp } from "../../motion/presets";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";

export type PortalSectionProps = {
  isLight: boolean;
  scrollToId: (id: string) => void;
  projectCount: number;
  postCount: number;
};

export default function PortalSection({ isLight, scrollToId, projectCount, postCount }: PortalSectionProps) {
  return (
    <section id="portal" className="portal-section relative py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="CONTROL LAYER / 控制层"
          title="入口矩阵"
          desc="将主要内容组织为终端入口。Pick a node to enter the archive."
        />

        <div className="grid lg:grid-cols-3 gap-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35 }}
          >
            <button onClick={() => scrollToId("projects")} className="w-full text-left">
              <Panel
                className="portal-card hover:border-white/20 transition"
                label="PORTAL-01"
                sublabel="PRIMARY ARCHIVE"
                icon={FolderKanban}
                right={<Pill tint="accent">MAIN</Pill>}
              >
                <div className="relative overflow-hidden portal-surface rounded-lg">
                  <div className="scanline" />
                  <div className="portal-hover-scan" aria-hidden="true" />
                  <div className="portal-tickflash" aria-hidden="true" />
                  <div className="portal-sigil portal-sigil-01" aria-hidden="true" />

                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] tracking-[0.28em] text-white/40">作品档案 / PROJECT ARCHIVE</div>
                    <div className="heading-main text-lg font-semibold text-white/92 tracking-wide">Projects Database</div>
                    <div className="text-xs text-white/55 leading-relaxed text-muted-block">
                      Web / App / Mini Program / Design System / Research. 结构化展示、可筛选、可展开档案。
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill>{projectCount} FILES</Pill>
                      <Pill>
                        <CheckCircle2 className="w-3 h-3" />
                        VERIFIED
                      </Pill>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-white/40">
                      ENTER NODE
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Panel>
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <button onClick={() => scrollToId("blog")} className="w-full text-left">
              <Panel
                className="portal-card hover:border-white/20 transition"
                label="PORTAL-02"
                sublabel="SECONDARY NODES"
                icon={Newspaper}
                right={<Pill>LOG</Pill>}
              >
                <div className="relative overflow-hidden portal-surface rounded-lg">
                  <div className="scanline" />
                  <div className="portal-hover-scan" aria-hidden="true" />
                  <div className="portal-tickflash" aria-hidden="true" />
                  <div className="portal-sigil portal-sigil-02" aria-hidden="true" />

                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] tracking-[0.28em] text-white/40">记录节点 / BLOG NODES</div>
                    <div className="heading-main text-lg font-semibold text-white/92 tracking-wide">Interface Notes</div>
                    <div className="text-xs text-white/55 leading-relaxed text-muted-block">
                      UI 观察、前端工程、产品实践。短篇为主，强调可复用的 设计/工程结论。
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill>{postCount} ENTRIES</Pill>
                      <Pill tint="accent">
                        <BookOpen className="w-3 h-3" />
                        UPDATED
                      </Pill>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-white/40">
                      ROUTE TO LOG
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Panel>
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <button onClick={() => scrollToId("about")} className="w-full text-left">
              <Panel
                className="portal-card hover:border-white/20 transition"
                label="PORTAL-03"
                sublabel="IDENTITY & SIGNAL"
                icon={Radio}
                right={<Pill tint="warm">LAST</Pill>}
              >
                <div className="relative overflow-hidden portal-surface rounded-lg">
                  <div className="scanline" />
                  <div className="portal-hover-scan" aria-hidden="true" />
                  <div className="portal-tickflash" aria-hidden="true" />
                  <div className="portal-sigil portal-sigil-03" aria-hidden="true" />

                  <div className="flex flex-col gap-3">
                    <div className="text-[10px] tracking-[0.28em] text-white/40">终端身份 / OPERATOR PROFILE</div>
                    <div className="heading-main text-lg font-semibold text-white/92 tracking-wide">About + Contact</div>
                    <div className="text-xs text-white/55 leading-relaxed text-muted-block">
                      简短身份信息 + 技能矩阵 + 联系方式。放在最后，作为 “档案补完”。
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill>PROFILE NODE</Pill>
                      <Pill>
                        <Mail className="w-3 h-3" />
                        OPEN CHANNEL
                      </Pill>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-white/40">
                      OPEN PROFILE
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Panel>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
