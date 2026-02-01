# UI 风格说明（Arknights / Endfield Inspired）

本项目的 UI 目标是「PRTS/终端风格的个人门户站」：信息密度高、层级清晰、带轻量 HUD 质感与扫描线/网格背景；同时提供深色与浅色两套视觉（Night/Day）。

> 关键词：**PRTS-like Terminal** / **Cut Corner 面板** / **HUD Chips** / **Grid + Scanline** / **Cyan & Amber Accent** / **Day: Warm Paper**

---

## 1) 灵感与定位

- 参考：明日方舟 / 明日方舟：终末地的终端界面语言（信息面板、HUD、模块化卡片、克制的发光点缀）。
- 目的：作为**浏览器默认打开页**的个人入口，优先保证「快速进入/低摩擦」与「在白天/夜间都可长时间阅读」。

---

## 2) 主题系统（深/浅模式）

### Dark / Night（默认）

- 背景：深蓝黑底（`#070a0e`）+ 多层 `radial-gradient` 微光氛围。
- 纹理：**网格（bg-grid）** + **颗粒（grain）** + **扫描线（scanline）**，营造终端感但不抢内容。
- 强调色：
  - **Cyan**（偏科技/指示灯）：用于 focus、hover、侧栏/入口节点的强调。
  - **Amber/Orange**（偏告警/能量）：用于次级强调与高亮对比。
- 面板：半透明黑底 + 轻边框 + 投影，强调「浮层/面板堆叠」的深度层级。

### Light / Day

- 背景：暖纸色（类似纸面/沙色），减少对眼睛刺激，适合白天长时间打开。
- 强调色：从 Night 的冷青，切换为偏金/暖色（类似终末地的沙金/金属表面感）。
- 规则：**结构不变、语义不变**（面板/网格/扫描线仍存在），只调整「对比度、底色、阴影、点缀色」。

实现位置：
- 主题开关：`LOG/src/hooks/useTheme.ts`
- 主题样式：`LOG/src/styles/localStyles.tsx`（使用 `[data-theme="light"]` 覆盖）

---

## 3) 布局与层级（Layout & Hierarchy）

- 顶栏（Top Bar）：
  - 固定在顶部（sticky），承载「品牌/状态」与「最常用动作」。
  - 左侧：侧栏开关 + Brand/Tagline 对齐成一个整体。
  - 右侧：外链（GitHub/in/Mail）+ 环境开关（呼吸光条、深浅模式）。
- 主内容（Content Rail）：
  - 使用 `max-w-6xl` 作为阅读宽度上限；在大屏维持信息密度但不扩散。
  - 侧栏打开时，主内容在桌面端通过 `padding-left` 右移，避免重叠。
- 侧栏（Side Panel）：
  - 用作「常用入口（书签）」+「状态信息（公告/维护）」+「最近更新」的集中区。
  - 侧栏内容支持折叠，减少信息噪声。

实现位置：
- 侧栏布局变量：`LOG/src/styles/localStyles.tsx`（`--sidebar-w/--sidebar-gap`）
- 主内容偏移：`LOG/src/styles/localStyles.tsx`（`.content-rail`）

---

## 4) 字体与文案风格（Typography & Copy）

- 采用「小字号 + 大字距 + 大写英文」做终端标签（例如 `text-[9px]`、`tracking-[0.22em]`）。
- 标题区（heading）强调可读性：更大的字号、更高的对比、更少的装饰。
- 中英文混排策略：
  - 英文多用于系统标签（PORTAL-01 / UPDATED / NOTICE）
  - 中文用于解释与描述（减少理解成本）

---

## 5) 动效与交互（Motion & Interaction）

- 扫描线（scanline）：用于面板内部的轻量动感，不影响阅读。
- Hover：轻微上浮（`translateY(-1px)`）+ 轻投影，体现可点击层级。
- Focus：统一使用明显但克制的 `outline`（Night 偏青，Day 偏金）。
- Reduced motion：尊重系统设置（`prefers-reduced-motion` 会关闭扫描线等动画）。

---

## 6) 可复用模块（组件/样式）

### UI 组件（React）

- 面板容器：`LOG/src/components/ui/Panel.tsx`
  - 内置 cut-corner、header（label/sublabel/right）
- CutCorner：`LOG/src/components/ui/CutCorner.tsx`
  - 可用于「内层卡片」「块级容器」来保持风格统一
- Pills / Chips：`LOG/src/components/ui/Pill.tsx` + `.proj-hud-chip`（在 `localStyles.tsx`）
- Buttons：`LOG/src/components/ui/Buttons.tsx`
  - `IconButton` / `LinkButton` / `ExtRouteTag`
- 分割线：`LOG/src/components/ui/DividerLine.tsx`
- 章节标题：`LOG/src/components/ui/SectionTitle.tsx`

### 侧栏模块（Side Panel）

- 侧栏组件：`LOG/src/components/sidebars/BookmarksSidebar.tsx`
  - 公告/维护提示（Bulletin）
  - 新收录/最近更新（Recent）
  - 书签网格（Bookmarks Grid）
- 侧栏数据：
  - 书签：`LOG/src/data/bookmarks.ts`
  - 公告：`LOG/src/data/sidebar.ts`

### 可复用 CSS/效果（LocalStyles）

- 背景：`.bg-grid` / `.grain`
- 动效：`.scanline` / `.soft-pulse`
- 侧栏布局：`.content-rail` + `--sidebar-*`
- 书签 UI：`.bm-grid` / `.bm-tile` / `.bm-icon-wrap` / `.bm-scroll`

---

## 7) 数据与只读策略（Owner Editable, Visitor Read-only）

- 书签、公告等内容采用**构建时配置**（静态站点友好）。
- 访客只能展开/收起模块、点击链接，不提供新增/删除入口。
- 自定义图标：
  - 把图标放到 `d:\Web\logo`
  - 在 `LOG/src/data/bookmarks.ts` 对应项填 `icon`
  - dev/build 会自动同步到 `LOG/public/logo`（并进入 `dist/logo`）

---

## 8) 后续修改建议（保持一致性）

1. **优先扩展“数据层”而不是改 UI 结构**  
   - 例如新增公告/最近更新条目：先改 `src/data/sidebar.ts`、`src/data/bookmarks.ts`。
2. **新增模块时复用 Panel/CutCorner**  
   - 结构：Header（icon+label+sublabel+chip）+ Content（列表/网格）+ 扫描线（可选）。
3. **浅色模式的 hover/outline 要单独校准**  
   - 避免直接复用深色的半透明黑背景；尽量用暖灰/纸面阴影。
4. **统一交互状态**  
   - hover：轻上浮/轻阴影  
   - focus：明显 outline  
   - active：不使用强烈位移（避免“跳”）
5. **控制动效强度**  
   - 保持 scanline 是“氛围”，不要让动画成为主体；重要内容区域减少动态干扰。

---

## 9) 快速定位（改哪里）

- 全局风格（深浅模式、背景、细节）：`LOG/src/styles/localStyles.tsx`
- 顶栏布局/按钮顺序：`LOG/src/components/sections/HeaderTopBar.tsx`
- 侧栏模块与折叠逻辑：`LOG/src/components/sidebars/BookmarksSidebar.tsx`
- 书签配置：`LOG/src/data/bookmarks.ts`
- 公告配置：`LOG/src/data/sidebar.ts`

