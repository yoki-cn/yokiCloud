import { useState } from "react";
import BackLink from "../components/ui/BackLink";
import {
  Archive,
  BookOpen,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Grid2X2,
  Plus,
  Radio,
  Shield,
  X,
} from "lucide-react";

import { useTheme } from "../hooks/useTheme";
import LocalStyles from "../styles/localStyles";
import {
  AnimatedPanelCard,
  AdminButton,
  AdminField,
  AdminModal,
  AdminPanel,
  AdminStatStrip,
  AdminSwitch,
  AdminTextInput,
  AdminToolbar,
  ArchiveCard,
  ArkButton,
  ArkIconButton,
  BreathingSeparator,
  DownloadRouteCard,
  HudChip,
  HudLabel,
  MetaRail,
  Panel,
  SegmentedControl,
  SignalDot,
  StatusTile,
  SystemState,
  ThemeToggleButton,
  UnboundedSurface,
} from "../components/ui";

const colorTokens = [
  ["BG-0", "--yc-bg-0"],
  ["BG-1", "--yc-bg-1"],
  ["SURFACE", "--yc-surface"],
  ["INNER", "--yc-surface-inner"],
  ["LINE", "--yc-line"],
  ["TEXT", "--yc-text"],
  ["MUTED", "--yc-muted"],
  ["CYAN", "--yc-cyan"],
  ["AMBER", "--yc-amber"],
  ["GREEN", "--yc-green"],
  ["FOCUS", "--yc-focus"],
] as const;

const segmentOptions = [
  { value: "all", label: "ALL", meta: "09" },
  { value: "project", label: "PROJECT", meta: "04" },
  { value: "log", label: "LOG", meta: "03" },
  { value: "resource", label: "DEPOT", meta: "02" },
] as const;

function LibrarySection({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8">
      <div className="mb-5">
        <MetaRail items={[eyebrow, "ACCESS: PUBLIC", "SYNC: OK"]} />
        <h2 className="mt-3 text-2xl font-semibold tracking-wide text-[var(--yc-text)]">{title}</h2>
        {desc ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--yc-muted)]">{desc}</p> : null}
        <div className="mt-3 h-px w-44 bg-gradient-to-r from-[var(--yc-line-strong)] via-[var(--yc-line)] to-transparent" />
      </div>
      {children}
    </section>
  );
}

export default function UIComponentLibrary() {
  const { isLight, toggleTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<(typeof segmentOptions)[number]["value"]>("all");
  const [adminSwitchOn, setAdminSwitchOn] = useState(true);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <div className="app-root min-h-screen bg-[var(--yc-bg-0)] text-[var(--yc-text)]">
      <LocalStyles />
      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-20 grain" />

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-[var(--yc-line)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <MetaRail items={["YOKI CLOUD UI KIT", "STYLE EXTRACT", "V1"]} tone="warm" />
            <h1 className="mt-4 text-3xl font-semibold tracking-wide text-[var(--yc-text)] md:text-4xl">
              组件库 / Component Library
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--yc-muted)]">
              从当前站点提取的舟味终端视觉语言：深色 HUD、浅色纸面档案、切角面板、编号标签、路由动作和高密度信息块。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggleButton isLight={isLight} onToggle={toggleTheme} />
            <BackLink />
          </div>
        </div>

        <LibrarySection
          eyebrow="FOUNDATION"
          title="设计 Token"
          desc="组件统一读取 `--yc-*` 语义变量，深色与浅色模式只替换变量，不重写组件结构。"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {colorTokens.map(([label, token]) => (
              <UnboundedSurface
                key={token}
                className="rounded-[var(--yc-radius-md)] p-3"
              >
                <div
                  className="h-16 rounded-[var(--yc-radius-sm)] border border-[var(--yc-line)]"
                  style={{ background: `var(${token})` }}
                />
                <div className="yc-hud-text mt-3 text-[10px] text-[var(--yc-text)]">{label}</div>
                <div className="mt-1 text-[11px] text-[var(--yc-dim)]">{token}</div>
              </UnboundedSurface>
            ))}
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="SURFACE"
          title="无界 Surface"
          desc="外层容器不使用可见 border，通过背景层、环境阴影和局部高光建立层级；输入、选中、focus 仍保留明确边界。"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <UnboundedSurface tone="neutral" className="p-4">
              <HudChip>UNBOUNDED</HudChip>
              <h3 className="mt-4 text-lg font-semibold tracking-wide text-[var(--yc-text)]">轻量信息块</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--yc-muted)]">
                适合说明、统计、导航索引和非关键内容承载，降低整页边框密度。
              </p>
            </UnboundedSurface>
            <UnboundedSurface tone="accent" interactive className="p-4">
              <HudChip tone="accent">ACCENT</HudChip>
              <h3 className="mt-4 text-lg font-semibold tracking-wide text-[var(--yc-text)]">可交互无界层</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--yc-muted)]">
                Hover 只做轻微上浮与阴影增强，不增加刺眼描边。
              </p>
            </UnboundedSurface>
            <UnboundedSurface tone="warm" className="p-4">
              <HudChip tone="warm">DAY READY</HudChip>
              <h3 className="mt-4 text-lg font-semibold tracking-wide text-[var(--yc-text)]">浅色模式友好</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--yc-muted)]">
                浅色模式用沙金和纸面阴影区分层级，文字仍保持墨色对比。
              </p>
            </UnboundedSurface>
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="ATOMS"
          title="基础原子"
          desc="HUD 标签、状态点、按钮和图标按钮是所有面板的最小构件。"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel label="HUD LABEL / 信息标题" sublabel="ATOM SET" icon={Shield} right={<HudChip tone="accent">READY</HudChip>}>
              <div className="grid gap-4">
                <HudLabel
                  eyebrow="ARTICLE NODE / 文章节点"
                  title="终端档案标题"
                  desc="小字号英文标签负责系统感，正文说明保持清楚可读。"
                  icon={Archive}
                  right={<SignalDot tone="success" pulse />}
                />
                <div className="flex flex-wrap gap-2">
                  <HudChip>NEUTRAL</HudChip>
                  <HudChip tone="accent">SYNC:OK</HudChip>
                  <HudChip tone="warm">BETA</HudChip>
                  <HudChip tone="success">STABLE</HudChip>
                </div>
                <MetaRail items={["NODE", "ACCESS: PUBLIC", "BUILD: STABLE"]} />
              </div>
            </Panel>

            <Panel label="BUTTON / 动作按钮" sublabel="ACTION SET" icon={Radio} right={<HudChip>4 TONES</HudChip>}>
              <div className="flex flex-wrap gap-2">
                <ArkButton tone="primary" icon={Database}>
                  OPEN ROUTE
                </ArkButton>
                <ArkButton tone="secondary" icon={BookOpen}>
                  READ NODE
                </ArkButton>
                <ArkButton tone="warm" icon={CheckCircle2}>
                  MARK READY
                </ArkButton>
                <ArkButton tone="ghost" icon={Copy}>
                  COPY BUFFER
                </ArkButton>
                <ArkButton tone="primary" icon={Database} disabled>
                  DISABLED
                </ArkButton>
                <ArkIconButton icon={ExternalLink} label="Open repository" />
                <ArkIconButton icon={Grid2X2} label="Open matrix" tone="primary" />
              </div>
            </Panel>
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="CONTROLS"
          title="筛选与状态"
          desc="用于项目、资源、博客等列表页的过滤矩阵和数据状态。"
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Panel label="FILTER MATRIX / 过滤矩阵" sublabel="SEGMENTED CONTROL" icon={Grid2X2} right={<HudChip tone="accent">ACTIVE:{activeSegment.toUpperCase()}</HudChip>}>
              <SegmentedControl
                label="CATEGORY ROUTER"
                options={[...segmentOptions]}
                value={activeSegment}
                onChange={setActiveSegment}
              />
            </Panel>
            <div className="grid grid-cols-3 gap-3">
              <StatusTile label="PROJECTS" value="12" meta="FILES" icon={Archive} />
              <StatusTile label="POSTS" value="08" meta="NODES" tone="warm" />
              <StatusTile label="BUILD" value="OK" meta="STABLE" tone="success" />
            </div>
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="ADMIN"
          title="管理台组件"
          desc="用于本地内容管理界面，覆盖字段、工具条、统计条和文件下载入口。"
        >
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <AdminPanel
              label="节点详情 / NODE DETAIL"
              sublabel="管理表单"
              icon={Database}
              right={<HudChip tone="accent">LOCAL</HudChip>}
              variant="unbounded"
            >
              <AdminStatStrip
                items={[
                  { label: "POST", value: 4, tone: "accent" },
                  { label: "LINK", value: 17 },
                ]}
              />
              <AdminToolbar>
                <AdminButton icon={Plus} tone="accent">
                  新建节点
                </AdminButton>
                <AdminButton icon={Download} tone="warm">
                  导出 TS
                </AdminButton>
                <AdminButton icon={Grid2X2} onClick={() => setAdminModalOpen(true)}>
                  打开浮窗
                </AdminButton>
              </AdminToolbar>
              <div className="grid gap-3 md:grid-cols-2">
                <AdminField label="标题">
                  <AdminTextInput defaultValue="Markdown 源文件" />
                </AdminField>
                <AdminField label="路由">
                  <AdminTextInput defaultValue="/posts/slope-optimization/" />
                </AdminField>
              </div>
              <AdminSwitch
                checked={adminSwitchOn}
                onCheckedChange={setAdminSwitchOn}
                label="管理员权限开关"
                desc="用于账号权限、内容维护、导入导出等后台控制项。"
              />
            </AdminPanel>

            <DownloadRouteCard
              href="/posts/slope-optimization.md"
              title="Markdown 源文件"
              desc="文章页和管理台复用同一个下载入口组件。"
              meta="MD 文件"
            />
          </div>
          <AdminModal
            open={adminModalOpen}
            label="管理浮窗 / ADMIN MODAL"
            sublabel="FORM + PREVIEW"
            size="md"
            onClose={() => setAdminModalOpen(false)}
            right={
              <AdminButton icon={X} onClick={() => setAdminModalOpen(false)}>
                关闭
              </AdminButton>
            }
          >
            <AdminField label="浮窗字段">
              <AdminTextInput defaultValue="用于文章正文、公告等高占用编辑任务。" />
            </AdminField>
            <p className="text-xs leading-relaxed text-[var(--yc-muted)]">
              高占用编辑区从主页面移入浮窗，主控制台只保留索引、概要和动作入口。
            </p>
          </AdminModal>
        </LibrarySection>

        <LibrarySection
          eyebrow="STATES"
          title="系统状态"
          desc="列表、远程资源和可过滤区域统一使用 SystemState 表达加载、空结果和错误，保持各模块反馈一致。"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <SystemState
              kind="loading"
              title="正在同步节点"
              desc="骨架条保持最终布局比例，不使用孤立圆形加载器。"
            />
            <SystemState
              title="没有匹配结果"
              desc="筛选条件无命中时显示，保留清楚的恢复路径。"
              action={{ label: "重置筛选" }}
            />
            <SystemState
              kind="error"
              title="路由暂不可用"
              desc="错误状态使用暖色提示，但不会打断整个页面阅读。"
              action={{ label: "RETRY SYNC", tone: "warm" }}
            />
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="MOTION"
          title="动效组件"
          desc="主题切换、顶栏呼吸条、项目/博客卡片 hover 扫描动效都已独立成组件。"
        >
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <Panel label="TOP BAR ACTIONS / 顶栏动作" sublabel="THEME + BREATHING STRIP" icon={Radio} right={<HudChip tone="warm">SHELL PART</HudChip>}>
              <div className="flex flex-wrap items-center gap-3">
                <ThemeToggleButton isLight={isLight} onToggle={toggleTheme} />
                <BreathingSeparator className="h-9" />
                <div className="min-w-40 flex-1">
                  <BreathingSeparator orientation="horizontal" />
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[var(--yc-muted)]">
                HeaderTopBar 内部已经使用这两个组件，顶栏 hover 时呼吸条会继承现有明暗模式动效。
              </p>
            </Panel>

            <div className="grid gap-4 md:grid-cols-2">
              <AnimatedPanelCard
                label="FILE / 2026"
                sublabel="PROJECT CARD MOTION"
                icon={Shield}
                right={<HudChip tone="success">STABLE</HudChip>}
              >
                <div className="flex flex-col gap-3">
                  <HudChip tone="accent">PROJECT</HudChip>
                  <div>
                    <div className="heading-main text-[15px] font-semibold text-white/92 tracking-wide">
                      Animated Project Card
                    </div>
                    <div className="text-muted-block mt-1 text-[11px] leading-relaxed text-white/55">
                      Hover 时触发扫描线、短刻线和轻微抬升，项目区已改用该组件。
                    </div>
                  </div>
                  <div className="proj-hud-row flex flex-wrap gap-1.5">
                    <span className="proj-hud-chip">BUILD:STABLE</span>
                    <span className="proj-hud-chip">STACK:05</span>
                  </div>
                </div>
              </AnimatedPanelCard>

              <AnimatedPanelCard
                label="LOG / 2026-05-12"
                sublabel="BLOG CARD MOTION"
                icon={BookOpen}
                right={<HudChip tone="accent">NOTES</HudChip>}
              >
                <div className="flex flex-col gap-2.5">
                  <div className="heading-main text-[15px] font-semibold text-white/92 tracking-wide">
                    Animated Blog Node
                  </div>
                  <div className="text-muted-block text-[11px] leading-relaxed text-white/55">
                    博客区已改为整卡路由，内部不再重复写 motion 配置。
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[9px] tracking-[0.22em] text-white/35">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300/60" />
                    READ NODE
                  </div>
                </div>
              </AnimatedPanelCard>
            </div>
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="SHELL"
          title="默认页面框架"
          desc="`TerminalPageShell` 统一承载背景网格、顶栏、书签侧栏、主内容 rail、底栏和浮层插槽。"
        >
          <Panel label="TERMINAL PAGE SHELL / 页面壳" sublabel="LAYOUT EXPORT" icon={Grid2X2} right={<HudChip tone="accent">components/layout</HudChip>}>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["BACKGROUND", "网格、噪点、径向氛围层"],
                ["TOP BAR", "品牌、导航、外链、主题切换"],
                ["SIDEBAR", "书签、公告、最近更新"],
                ["FOOTER", "底栏和内容 rail 对齐"],
              ].map(([label, desc]) => (
                <UnboundedSurface key={label} className="rounded-[var(--yc-radius-md)] p-3">
                  <HudChip tone="neutral">{label}</HudChip>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--yc-muted)]">{desc}</p>
                </UnboundedSurface>
              ))}
            </div>
          </Panel>
        </LibrarySection>

        <LibrarySection
          eyebrow="PATTERNS"
          title="组合组件"
          desc="ArchiveCard 固定了档案卡的标题、标签、meta 与动作区，适合作品、资源、文章入口复用。"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <ArchiveCard
              eyebrow="FILE / 2026"
              title="Project Dossier"
              desc="用于作品卡片，承载类型、状态、技术栈和打开档案动作。"
              icon={Shield}
              chips={[
                { label: "WEB", tone: "accent" },
                { label: "BUILD:STABLE", tone: "success" },
              ]}
              meta="ID:PRJ-001"
            />
            <ArchiveCard
              eyebrow="NODE / DEPOT"
              title="Resource Node"
              desc="用于资源入口，强调分类、权限、外链跳转和简短摘要。"
              icon={Database}
              chips={[
                { label: "CLEAR:PUBLIC" },
                { label: "EXT:03", tone: "warm" },
              ]}
              meta="CLASS:TOOL"
            />
            <ArchiveCard
              eyebrow="ARTICLE / LOG"
              title="Interface Notes"
              desc="用于文章列表，保持可扫描的标题、标签和阅读入口。"
              icon={BookOpen}
              chips={[
                { label: "READ:6MIN" },
                { label: "UPDATED", tone: "accent" },
              ]}
              meta="MD 源文件"
              actionLabel="READ NODE"
            />
          </div>
        </LibrarySection>

        <LibrarySection
          eyebrow="GUIDELINES"
          title="开发使用规则"
          desc="新增页面时优先拼装这些组件，只有当信息结构无法表达时再新增组件。"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "页面骨架使用 Panel + HudLabel + MetaRail，说明/统计/导航可优先使用 UnboundedSurface。",
              "列表卡片优先用 ArchiveCard，标签不写长句，动作区固定在右下。",
              "过滤器优先用 SegmentedControl，选项过多时再拆成两个 router。",
              "新增颜色先映射到 `--yc-*` token，不在业务组件里散落一次性色值。",
            ].map((item, idx) => (
              <UnboundedSurface key={item} className="rounded-[var(--yc-radius-md)] p-4">
                <HudChip tone={idx === 0 ? "accent" : "neutral"}>RULE:{String(idx + 1).padStart(2, "0")}</HudChip>
                <p className="mt-3 text-sm leading-relaxed text-[var(--yc-muted)]">{item}</p>
              </UnboundedSurface>
            ))}
          </div>
        </LibrarySection>
      </main>
    </div>
  );
}
