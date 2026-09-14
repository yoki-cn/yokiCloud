import { sitePath } from "../../utils/sitePath";
﻿import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  FolderKanban,
  Hammer,
  LayoutGrid,
  Linkedin,
  Mail,
  Maximize2,
  Newspaper,
  Shield,
} from "lucide-react";

import type { CollectedImage, CollectedLine } from "../../data/collected";
import type { Gateway } from "../../data/gateways";
import type { PointerTiltHandlers } from "../../hooks/useRafPointerTilt";
import { fadeUp } from "../../motion/presets";
import { handleExternalLinkClick } from "../../utils/linkActions";
import BilibiliIcon from "../icons/BilibiliIcon";
import GithubMark from "../icons/GithubMark";
import { ArkButton, StatusTile } from "../ui";
import { IconButton, LinkButton } from "../ui/Buttons";
import CutCorner from "../ui/CutCorner";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import { cx } from "../ui/cx";

export type HeroGuideProps = {
  gateways: Gateway[];
  collectedLines: CollectedLine[];
  collectedImages: CollectedImage[];
  copiedLineId: string | null;
  onCopyLine: (text: string, id: string) => void;
  onOpenImage: (image: CollectedImage) => void;
  scrollToId: (id: string) => void;
  projectCount: number;
  postCount: number;
  boardCount: number;
  readyBoardCount: number;
  quickLinks: {
    github: string;
    bilibili: string;
    linkedin: string;
    email: string;
  };
  statusHandlers: PointerTiltHandlers;
};

export default function HeroGuide({
  gateways,
  collectedLines,
  collectedImages,
  copiedLineId,
  onCopyLine,
  onOpenImage,
  scrollToId,
  projectCount,
  postCount,
  boardCount,
  readyBoardCount,
  quickLinks,
  statusHandlers,
}: HeroGuideProps) {
  const { onMove, onEnter, onLeave, onDown, onUp } = statusHandlers;

  return (
    <section className="pt-10 md:pt-14 pb-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.42 }}
        className="mb-4"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/3">
          <div className="scanline" />
          <div className="px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] tracking-[0.28em] text-white/45">DEPARTMENT GUIDE / 部门导引</div>
                <div className="mt-2 heading-main text-lg font-semibold text-white/92 tracking-wide">主要部门</div>
              </div>
              <Pill>EXT ROUTES</Pill>
            </div>

            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {gateways.map((g, idx) => (
                <a
                  key={g.code}
                  href={sitePath(g.href)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleExternalLinkClick(e, g.href)}
                  className={cx(
                    "gateway-card",
                    "portal-card",
                    "group",
                    "relative overflow-hidden",
                    "rounded-lg",
                    "border border-white/10",
                    "bg-white/5 hover:bg-white/10",
                    "px-4 py-3",
                    "transition"
                  )}
                >
                  <div className="portal-hover-scan" aria-hidden="true" />
                  <div className="portal-tickflash" aria-hidden="true" />
                  <div
                    className={cx(
                      "portal-sigil",
                      ["portal-sigil-01", "portal-sigil-02", "portal-sigil-03"][idx] || "portal-sigil-01"
                    )}
                    aria-hidden="true"
                  />

                  <div className="route-corner" aria-hidden="true">
                    <div className="route-corner-text">
                      <span className="route-corner-k">ROUTE</span>
                      <span className="route-corner-code">{g.code}</span>
                    </div>
                    <ArrowUpRight className="route-corner-ico w-3 h-3" />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[9px] tracking-[0.28em] text-white/45">
                      {g.en} <span className="opacity-40">/</span> {g.code}
                    </div>
                  </div>
                  <div className="mt-2 heading-main text-[14px] font-semibold text-white/90">{g.cn}</div>
                  <div className="mt-1 text-[11px] text-white/55 leading-relaxed text-muted-block">{g.desc}</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[9px] tracking-[0.24em] text-white/45 group-hover:text-white/80">
                    OPEN ROUTE
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.46 }}
        className="grid md:grid-cols-2 gap-4 items-stretch mb-4"
      >
        <Panel
          className="h-full"
          label="CAPTURED LINES / 采集文案"
          sublabel="QUOTE BUFFER"
          icon={Newspaper}
          right={<Pill>{collectedLines.length} LINES</Pill>}
        >
          <div className="flex flex-col gap-3 h-full">
            {collectedLines.map((q) => (
              <div
                key={q.id}
                className={cx(
                  "inner-elevated rounded-lg border border-white/10 bg-white/5 p-3",
                  "flex flex-col",
                  collectedLines.length === 1 && "flex-1"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[9px] tracking-[0.24em] text-white/45">{q.title}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="proj-hud-chip">{q.id.toUpperCase()}</span>
                    <IconButton
                      icon={copiedLineId === q.id ? CheckCircle2 : Copy}
                      label="Copy"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onCopyLine(q.text, q.id);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-2 text-sm leading-relaxed text-white/75 text-muted-block">“{q.text}”</div>
                <div className="flex-1" />
                <div className="mt-3 flex items-center gap-2 text-[9px] tracking-[0.22em] text-white/35">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300/60" />
                  {q.meta}
                </div>
              </div>
            ))}
            <div className="yc-hud-text mt-auto text-[10px] text-[var(--yc-dim)]">BUFFER READY / 可继续收录</div>
          </div>
        </Panel>

        <Panel
          className="h-full"
          label="CAPTURED IMAGES / 采集图片"
          sublabel="IMAGE BUFFER"
          icon={LayoutGrid}
          right={<Pill>{collectedImages.length} FILES</Pill>}
        >
          <div className="flex flex-col gap-3 h-full">
            {collectedImages.map((img) => {
              const fmt = (
                img.src
                  .split("?")[0]
                  .match(/\.([a-z0-9]+)(?:@|$)/i)?.[1] || "IMG"
              ).toUpperCase();
              const downloadName = `${img.id}.${fmt.toLowerCase()}`;
              return (
                <CutCorner
                  key={img.id}
                  className="archive-panel inner-elevated rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="archive-kicker">图像档案面板</div>
                      <div className="mt-1 text-[9px] tracking-[0.24em] text-white/45">{img.title}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="proj-hud-chip">{img.id.toUpperCase()}</span>
                        <span className="proj-hud-chip">FMT:{fmt}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <IconButton
                          icon={Maximize2}
                          label="View"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenImage(img);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="archive-stage mt-2 rounded-lg border border-white/10 bg-black/20">
                    <div className="archive-stage-grid" aria-hidden="true" />
                    <div className="scanline" />
                    <img
                      src={sitePath(img.src)}
                      alt={img.alt}
                      className="archive-img"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                    <div className="archive-stage-hud" aria-hidden="true">
                      <span className="archive-stage-hud-k">IMAGE BUFFER</span>
                      <span className="archive-stage-hud-dot" />
                      <span className="archive-stage-hud-k">SYNC:OK</span>
                    </div>
                    <div className="archive-stage-stamp" aria-hidden="true">
                      ARCHIVE
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[9px] tracking-[0.22em] text-white/35">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300/60" />
                      {img.meta}
                    </div>
                    <div className="archive-footer flex items-center gap-1.5 text-[9px] tracking-[0.22em] text-white/35">
                      <a
                        href={sitePath(img.src)}
                        download={downloadName}
                        aria-label="Download"
                        className={cx(
                          "inline-flex items-center justify-center",
                          "w-6 h-6",
                          "rounded-md",
                          "bg-white/5",
                          "border border-white/10",
                          "hover:bg-white/10",
                          "transition",
                          "shrink-0"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-3.5 h-3.5 text-white/70" />
                      </a>
                      <span className="archive-footer-chip">FILE:{img.id.toUpperCase()}</span>
                    </div>
                  </div>
                </CutCorner>
              );
            })}
            <div className="yc-hud-text mt-auto text-[10px] text-[var(--yc-dim)]">IMAGE BUFFER READY / 图像档案可扩展</div>
          </div>
        </Panel>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.45 }}
        className="grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] items-start gap-4"
      >
        <Panel label="SYSTEM BOOT / 系统接入" sublabel="PUBLIC TERMINAL MODE" icon={Shield}>
          <div className="relative overflow-hidden rounded-lg">
            <div className="scanline" />
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[10px] tracking-[0.28em] text-white/45">ACCESS GRANTED / 已授权访问</div>
                <h1 className="heading-main mt-2 text-2xl md:text-3xl font-semibold tracking-wide text-white/95">
                  Project Terminal / 作品终端
                </h1>
                <p className="mt-3 text-sm text-white/55 leading-relaxed text-muted-block">
                  收录 Web、App、小程序、设计系统和写作记录的个人作品终端。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Pill tint="accent">
                  <CheckCircle2 className="w-3 h-3" />
                  ACTIVE / 在线
                </Pill>
                <Pill>
                  <Cpu className="w-3 h-3" />
                  INTERFACE V1
                </Pill>
                <Pill>
                  <Hammer className="w-3 h-3" />
                  ORIGINAL MODULES
                </Pill>
              </div>

              <div className="flex flex-wrap gap-2">
                <ArkButton
                  onClick={() => scrollToId("portal")}
                  tone="primary"
                  icon={ArrowUpRight}
                  trailingIcon={false}
                >
                  ENTER PORTAL / 进入入口矩阵
                </ArkButton>
                <ArkButton
                  onClick={() => scrollToId("projects")}
                  tone="secondary"
                  icon={FolderKanban}
                  trailingIcon={false}
                >
                  VIEW ARCHIVE / 查看档案
                </ArkButton>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4">
          <Panel label="QUICK ROUTES / 快速路由" icon={ExternalLink} right={<Pill>NODE: JP/TYO</Pill>}>
            <div className="grid grid-cols-2 gap-2">
              <LinkButton href={quickLinks.github} icon={GithubMark} className="w-full">
                REPOS / 仓库
              </LinkButton>
              <LinkButton href={quickLinks.bilibili} icon={BilibiliIcon} className="w-full">
                BILIBILI / 关注
              </LinkButton>
              <LinkButton href={quickLinks.linkedin} icon={Linkedin} className="w-full">
                NETWORK / 网络
              </LinkButton>
              <LinkButton href={`mailto:${quickLinks.email}`} icon={Mail} className="w-full">
                SIGNAL / 联络
              </LinkButton>
            </div>
            <div className="yc-hud-text mt-3 text-[10px] text-[var(--yc-dim)]">PUBLIC CHANNELS / 已配置外链</div>
          </Panel>

          <Panel className="hero-status" label="STATUS / 运行状态" icon={Cpu}>
            <div className="hero-status-grid">
              <StatusTile label="BOARDS / 板子" value={boardCount} />
              <StatusTile label="USABLE / 可用" value={readyBoardCount} tone="success" />
              <StatusTile
                label="PROJECTS"
                value={projectCount}
                onMouseMove={onMove}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onMouseDown={onDown}
                onMouseUp={onUp}
              />
              <StatusTile
                label="POSTS"
                value={postCount}
                tone="warm"
                onMouseMove={onMove}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onMouseDown={onDown}
                onMouseUp={onUp}
              />
              <StatusTile
                label="BUILD"
                value="STABLE"
                tone="success"
                onMouseMove={onMove}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onMouseDown={onDown}
                onMouseUp={onUp}
              />
            </div>
          </Panel>
        </div>
      </motion.div>
    </section>
  );
}
