import { sitePath } from "../../utils/sitePath";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { ArrowUpRight, Binary, BookOpen, FolderKanban, Mail, Radio } from "lucide-react";

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

type RouteRow = {
  id: string;
  code: string;
  title: string;
  desc: string;
  meta: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
};

export default function PortalSection({ isLight, scrollToId, projectCount, postCount }: PortalSectionProps) {
  const routes: RouteRow[] = [
    {
      id: "projects",
      code: "PORTAL-01",
      title: "作品档案",
      desc: "项目、设计系统和实验记录按类型归档。",
      meta: `${projectCount} FILES`,
      icon: FolderKanban,
    },
    {
      id: "algorithms",
      code: "PORTAL-02",
      title: "算法板子",
      desc: "按知识点与章节组织的模块化算法模板。",
      meta: "OPEN LIBRARY",
      icon: Binary,
    },
    {
      id: "blog",
      code: "PORTAL-03",
      title: "记录节点",
      desc: "前端、设计和产品实践的短篇记录。",
      meta: `${postCount} ENTRIES`,
      icon: BookOpen,
    },
    {
      id: "about",
      code: "PORTAL-04",
      title: "终端身份",
      desc: "个人信息、能力矩阵和联系入口。",
      meta: "OPEN CHANNEL",
      icon: Mail,
    },
  ];

  return (
    <section id="portal" className="portal-section relative py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="CONTROL LAYER / 控制层"
          title="入口矩阵"
          desc="选择一个入口查看作品、算法板子、记录和联系方式。"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35 }}
        >
          <Panel
            label="ROUTE INDEX / 路由索引"
            sublabel="PUBLIC ACCESS"
            icon={Radio}
            right={<Pill tint="accent">SYNC:OK</Pill>}
          >
            <div className="divide-y divide-[var(--yc-line)]">
              {routes.map((route) => {
                const Icon = route.icon;
                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] text-[var(--yc-muted)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="yc-hud-text text-[10px] text-[var(--yc-dim)]">{route.code}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="heading-main text-base font-semibold tracking-wide text-[var(--yc-text)]">
                        {route.title}
                      </div>
                      <p className="text-muted-block mt-1 text-xs leading-relaxed text-[var(--yc-muted)]">{route.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 md:justify-end">
                      <Pill>{route.meta}</Pill>
                      <span className="yc-hud-text inline-flex items-center gap-1.5 text-[9px] text-[var(--yc-dim)] group-hover:text-[var(--yc-text)]">
                        OPEN
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </>
                );

                const routeClass =
                  "group grid w-full gap-3 px-1 py-4 text-left text-inherit no-underline transition hover:bg-[var(--yc-surface-inner)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)] md:grid-cols-[130px_1fr_auto]";

                return route.href ? (
                  <a key={route.id} href={sitePath(route.href)} className={routeClass}>
                    {content}
                  </a>
                ) : (
                  <button key={route.id} type="button" onClick={() => scrollToId(route.id)} className={routeClass}>
                    {content}
                  </button>
                );
              })}
            </div>
          </Panel>
        </motion.div>
      </div>
    </section>
  );
}
