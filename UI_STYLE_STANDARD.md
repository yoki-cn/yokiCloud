# Yoki Cloud UI 风格标准

版本：2026-05-12  
适用范围：Yoki Cloud 主站、文章页、资源页、后续新增模块。  
目标：建立一套稳定、可复用、可审查的“舟味”个人门户视觉语言，而不是临时模仿某个活动截图。

---

## 1. 风格定位

Yoki Cloud 的视觉方向是“明日方舟式平面设计美感 + PRTS 终端界面 + 个人知识档案库”。

本网站不是游戏 UI 的一比一复刻，也不使用官方素材作为装饰主体。它抽取的是《明日方舟》设计中的方法论：

- 高信息密度但不混乱。
- 平面几何优先，少用拟物。
- 黑、白、灰为骨架，蓝青与暖橙/金色作为状态强调。
- 强烈的标签系统、编号系统、档案系统。
- 让界面像“系统的一部分”，而不是普通网页套皮。

### 1.1 黑暗模式关键词

- PRTS / 罗德岛终端
- 工业科幻
- 深色网格
- 切角面板
- 半透明 HUD
- 扫描线、路由标签、状态芯片
- 信息板、档案卡、侧边抽屉

### 1.2 浅色模式关键词

浅色模式参考《明日方舟》SideStory「众生行记」相关活动界面的视觉感受：更偏手册、档案、宗教/民俗记录、纸面标注与浅色平面海报，而不是简单把深色模式反相。

浅色模式应具备：

- 温暖米白纸面，而非纯白。
- 沙金、旧纸、浅棕、灰墨作为主体。
- 少量青蓝作为系统色，避免过度“赛博蓝”。
- 带有博物志、行记、地图标记、抄本边注的气质。
- 保持平面构成，不做厚重拟物羊皮纸。

---

## 2. 调研依据与设计提炼

以下来源用于提炼风格原则。所有实现都应转化为原创设计语言，不直接复制他人页面或官方素材。

### 2.1 明日方舟 UI 与网页复刻/再设计参考

- [明日方舟官方网站优化设计](https://www.dreamanual.com/arknights-redesign/)  
  可提炼：从游戏 UI 提取关键元素；黑白灰主体、蓝橙辅助、矩形几何、少量圆形和规则渐变底纹。

- [《明日方舟》UI/UX 设计复盘](https://www.dreamanual.com/arknights-ui-ux/)  
  可提炼：PRTS 观瞄投影、卡片层级、视差、装饰字体、焦距与底图处理、减少页面层级的转场。

- [ak-ui 设计规范](https://ak-ui.yunyoujun.cn/components/)  
  可提炼：中文标题可用衬线气质，正文保持无衬线可读；组件应带有明确的“明日方舟式”字体层级。

- [《明日方舟》UX 分析：游戏 UI 如何塑造轻盈友好的体验？](https://www.zcool.com.cn/article/ZMTE0MTIyMA%3D%3D.html)  
  可提炼：系统层级宜浅，复杂信息用互斥面板、侧边面板和局部替换降低打断。

- [明日方舟 | 出苍白海视觉风格解析](https://www.zcool.com.cn/work/ZNzEwNTk0MDQ%3D.html)  
  可提炼：活动视觉可以有独立主题色和图形母题，但必须回到统一的舟味秩序中。

- [Behance：莱茵生命主题 UI 设计练习](https://www.behance.net/gallery/135431879/-UI-Arknights-Game-UI)  
  可提炼：阵营主题可以通过颜色、图标、编号、实验室标签表达，而不一定需要复杂插画。

- [Behance：重新设计《明日方舟》主菜单](https://www.behance.net/gallery/68521113/_?locale=en_US)  
  可提炼：主菜单/首页可混合科幻 HUD 与现代 Fluent 式空间层级，但核心仍是清晰路由。

- [PRTS：SideStory「众生行记」](https://prts.wiki/w/%E4%BC%97%E7%94%9F%E8%A1%8C%E8%AE%B0) 与 [Bilibili：众生行记活动界面记录](https://www.bilibili.com/video/BV1PQJzzSEVK/)  
  可提炼：浅色模式应偏“活动记录册/行记/宗教图录/民俗档案”的平面感。

### 2.2 文章页与知识库页面参考

- [Nextra Docs Theme](https://nextra.site/docs/docs-theme/start)  
  可提炼：技术文章页需要顶部导航、侧边/右侧目录、搜索或索引入口、正文和辅助信息分层。

- [VitePress Markdown Extensions](https://vitepress.dev/es/guide/markdown)  
  可提炼：技术内容需要高质量代码块、目录、代码组/片段引用等能力；Yoki Cloud 初期先支持 Markdown、代码块、LaTeX 和标题锚点。

- [Astro Syntax Highlighting Docs](https://docs.astro.build/hi/guides/syntax-highlighting/)  
  可提炼：Astro 可用 Shiki 做 Markdown 代码高亮；主题应随明暗模式变化。

---

## 3. 设计原则

### 3.1 功能先于装饰

所有装饰必须解释一种信息关系：

- 线条：分区、路由、对齐、数据流。
- 扫描线：系统运行状态，不应用在大段正文上。
- 编号：档案 ID、节点编号、路由编号。
- 切角：交互卡片或重点面板，不能滥用到每一个小元素。
- 噪点/网格：环境氛围，只能在背景层。

### 3.2 高密度但可扫描

页面可以密集，但必须做到：

- 每个模块有明确标题、英文辅助标签和状态 chip。
- 操作按钮位置稳定：右上角、卡片尾部、固定侧栏。
- 正文行宽控制在 `68ch - 76ch`。
- 卡片内信息先标签化，再放长文本。

### 3.3 平面构成优先

少用：

- 大圆角玻璃拟态。
- 过度发光。
- 复杂 3D 透视。
- 大面积纯紫色。
- 普通 SaaS 风卡片。

优先使用：

- 直线、矩形、切角、多栏网格。
- 半透明薄面板。
- 标签、编号、状态条。
- 结构区域使用 1px 边线；浮动 Surface 使用 shadow hairline 与局部高亮。
- 大标题 + 微型字距标签。

### 3.4 明暗模式不是反色

深色模式强调终端、夜间、电子屏幕。  
浅色模式强调纸面、行记、活动图录。

两者共享信息结构，但颜色、阴影、材质应分别设计。

---

## 4. 色彩标准

### 4.1 深色模式色板

| 用途 | Token | 建议值 | 说明 |
| --- | --- | --- | --- |
| 背景 0 | `--ark-bg-0` | `#070a0e` | 页面底色 |
| 背景 1 | `--ark-bg-1` | `#0c1118` | 面板底部渐变 |
| 面板 | `--ark-panel` | `rgba(255,255,255,0.055)` | HUD 半透明层 |
| 面板边线 | `--ark-line` | `rgba(255,255,255,0.12)` | 1px 主边线 |
| 主文字 | `--ark-text` | `rgba(255,255,255,0.92)` | 标题/正文 |
| 次文字 | `--ark-muted` | `rgba(255,255,255,0.55)` | 描述 |
| 弱文字 | `--ark-dim` | `rgba(255,255,255,0.34)` | meta |
| 系统青 | `--ark-cyan` | `#58c7ff` | active/route |
| 警示橙 | `--ark-amber` | `#ffaa58` | warning/accent |
| 成功绿 | `--ark-green` | `#8ee6b0` | success |

### 4.2 浅色模式色板

| 用途 | Token | 建议值 | 说明 |
| --- | --- | --- | --- |
| 背景 0 | `--ark-day-bg-0` | `#f5f3ee` | 暖纸面 |
| 背景 1 | `--ark-day-bg-1` | `#eee4d3` | 分区底色 |
| 面板 | `--ark-day-panel` | `rgba(255,255,255,0.96)` | 纸面卡片 |
| 内嵌层 | `--ark-day-inner` | `#f3ece0` | 档案夹 |
| 边线 | `--ark-day-line` | `rgba(180,160,130,0.62)` | 旧金/纸边 |
| 主文字 | `--ark-day-text` | `#111827` | 正文 |
| 次文字 | `--ark-day-muted` | `#4b5563` | 描述 |
| 弱文字 | `--ark-day-dim` | `#6b7280` | meta |
| 沙金 | `--ark-day-gold` | `#f5d596` | active/accent |
| 行记蓝 | `--ark-day-teal` | `#5ba7ba` | 系统辅助 |
| 墨棕 | `--ark-day-ink` | `#594b3b` | 低饱和强调 |

### 4.3 色彩使用比例

- 深色模式：黑灰 78%，白字 12%，青色 6%，橙/金 4%。
- 浅色模式：米白/纸色 72%，墨色 16%，沙金 8%，青蓝 4%。
- 单个屏幕内高亮色不超过 2 种。
- 红色只用于真正错误，不用于普通强调。

---

## 5. 字体与排版

### 5.1 字体策略

当前项目可继续使用系统字体，但后续若引入 Web Font，建议：

- 中文标题：`Noto Serif SC` 或具有宋体骨架的 serif。
- 中文正文：`Noto Sans SC` / `Source Han Sans SC`。
- 英文 HUD：`Barlow Condensed` / `Rajdhani` / `IBM Plex Sans Condensed`。
- 代码：`JetBrains Mono` / `IBM Plex Mono`。

原则：

- 中文长文必须优先保证可读性。
- HUD 标签可以窄体、大字距、全大写。
- 不允许所有文字都使用科技字体。

### 5.2 字号层级

| 场景 | 字号 | 字距 | 用法 |
| --- | --- | --- | --- |
| 页面大标题 | 32-48px | `0.02em` | 首页 Hero / 文章标题 |
| Section 标题 | 20-28px | `0.04em` | 模块主标题 |
| 卡片标题 | 14-18px | `0.04em` | Panel 内标题 |
| 正文 | 15-17px | `normal` | 文章与描述 |
| HUD 标签 | 9-11px | `0.18-0.28em` | ROUTE / NODE / META |
| 代码 | 13-14px | `normal` | 技术文章代码块 |

### 5.3 行宽与行高

- 技术文章正文最大宽度：`72ch`。
- 中文正文行高：`1.85`。
- 英文/代码说明行高：`1.65`。
- 段落间距：`1em - 1.35em`。
- 标题前距应大于后距，形成章节切割感。

---

## 6. 布局系统

### 6.1 页面栅格

- 主容器最大宽度：`72rem` 或 `80rem`。
- 桌面端文章页建议三栏：
  - 左：返回/文章元信息/状态。
  - 中：正文。
  - 右：目录/阅读状态。
- 移动端合并为单栏，目录降级为顶部摘要或隐藏。

### 6.2 面板结构

标准 Panel 应包含：

1. 顶部 label：英文/中文混排。
2. sublabel：状态或模块说明。
3. 右侧 chip：数量、状态、节点编号。
4. 内容区：正文、卡片、列表或代码。
5. 装饰：只允许轻量扫描线、角标、1px divider。

Panel、Modal、侧栏等 Surface 的外轮廓属于视觉层级，不使用独立可见 border。统一通过阴影 token 表达：

1. `edge ring`：zero-blur hairline，说明 Surface 边界。
2. `contact shadow`：处理贴近背景的接触暗部。
3. `ambient shadow`：区分普通面板、浮动侧栏和 Modal 的高度。

输入框、表格、divider、focus、selected、error 等结构或状态边界继续使用 `border` / `outline`。

### 6.2.1 无界 Surface

用于说明、统计、轻量索引和辅助导航时，优先使用 `UnboundedSurface`：

- 外轮廓不使用可见 border。
- 依靠背景层、环境阴影和局部高光表达层级。
- Hover 只做轻微上浮与阴影增强，不额外叠加强描边。
- 不用于表单输入、错误、选中项、代码块、表格等需要明确边界的结构。

### 6.3 切角规范

切角用于：

- 主卡片。
- 可点击入口。
- 代码块外框。
- 文章重点提示。

不用于：

- 普通段落。
- 所有按钮。
- 大面积背景。

切角尺寸：

- 小组件：8-10px。
- 卡片：12-16px。
- 大面板：18-24px。

---

## 7. 动效规范

### 7.1 动效目标

动效用于说明状态变化，不用于炫技。

允许：

- 页面入场轻微上移与淡入。
- 卡片 hover 的扫描线。
- 侧边栏滑入。
- 状态 tile 的轻微倾斜。
- 顶栏 separator 呼吸。

禁止：

- 大面积循环闪烁。
- 阻碍阅读的正文动效。
- 长时间 loading 动画。
- hover 后元素位移超过 4px。

### 7.2 时间与缓动

- 快速反馈：120-180ms。
- 面板展开：180-240ms。
- 页面入场：320-520ms。
- 扫描线：400-700ms 单次。
- 循环氛围：3-6s，低透明度。

必须支持 `prefers-reduced-motion: reduce`。

---

## 8. 组件规范

### 8.1 Button

按钮必须表达动作等级：

- Primary：青色/金色弱填充 + 边线。
- Secondary：透明白/纸色 + 边线。
- Icon：固定方形，图标居中。
- Link：带 `ArrowUpRight` 或路由标签。

按钮文案建议：

- `OPEN ROUTE`
- `READ NODE`
- `VIEW ARCHIVE`
- `COPY BUFFER`
- `DOWNLOAD FILE`
- `RETURN TERMINAL`

### 8.2 Chip / Pill

用于表达短状态：

- `ACTIVE`
- `SYNC:OK`
- `NODE: DP`
- `CLEAR: PUBLIC`
- `BUILD: STABLE`

Chip 不承载长句。

### 8.3 Sidebar

侧边栏是“支线操作”容器：

- 书签、公告、最近更新、目录都适合放入侧栏。
- 不应把核心正文塞进侧栏。
- 移动端必须可关闭，不遮挡主流程。

### 8.4 Modal

Modal 只用于：

- 项目详情。
- 图片预览。
- 短交互确认。

不用于长文阅读。

---

## 9. 文章页规范

文章页必须像“终端档案阅读器”，而不是普通博客模板。

### 9.1 页面结构

文章页由以下区域构成：

1. 顶部返回条：品牌、返回入口、主题继承状态。
2. 文章头部：分类、标题、摘要、更新时间、阅读标记。
3. 左侧档案卡：文件编号、主题、来源路径、渲染能力。
4. 正文：Markdown 内容。
5. 右侧目录：标题锚点、章节状态。
6. 底部：返回主站、编辑/来源提示、版权或维护说明。

### 9.2 正文样式

正文 `.ark-prose` 应满足：

- `h1` 只出现在文章头部；正文从 `h2` 开始。
- `h2` 前有明显分割线和编号感。
- `h3` 使用较小 HUD 标签风格。
- 段落保持舒适行距，不使用过高字距。
- 列表项目用细线或小方块强调。
- 引用块像“档案批注”，左侧有状态条。
- 表格像数据矩阵，表头浅底/深底。

### 9.3 代码块

代码块必须被设计成“代码档案面板”：

- 外层有边线和切角。
- 顶部可显示语言/文件名（没有语言时不强求）。
- 背景与正文面板区分。
- 横向滚动必须可用。
- 在浅色模式下不能刺眼，使用纸面代码底色。

### 9.4 LaTeX 数学公式

公式显示为“推导面板”：

- 块级公式居中，但外层给轻微背景与边框。
- 行内公式不应破坏中文行高。
- 浅色模式公式边线使用沙金/纸棕。
- 深色模式公式边线使用青色/白色弱光。

### 9.5 Markdown 支持范围

必须支持：

- 标题、段落、强调、列表。
- 代码块与行内代码。
- 表格。
- 引用块。
- 链接。
- 行内公式 `$...$`。
- 块级公式 `$$...$$`。
- Obsidian 双链 `[[note]]` 与别名 `[[note|label]]`。
- Obsidian Callout（含 `+` / `-` 折叠状态）。
- Obsidian 高亮 `==text==`、标签 `#tag`、任务列表与图片嵌入。

后续可扩展：

- 代码块标题。
- 目录高亮。
- 复制代码按钮。
- Mermaid 图。

---

## 10. 文案规范

### 10.1 语言风格

中文为主，英文作为系统标签。

示例：

- `ARTICLE NODE / 文章节点`
- `RENDER PIPELINE / 渲染管线`
- `SOURCE FILE / 来源文件`
- `MATH READY / 公式可用`

### 10.2 不要过度中二

舟味不是堆叠术语。页面可以有 `NODE`、`ROUTE`、`ARCHIVE`，但正文说明必须清楚。

错误：

- “此处乃博士终端灵魂之锚点。”

正确：

- “可从文章顶栏或侧栏下载当前文章的 Markdown 文件。”

---

## 11. 可访问性与工程约束

- 文本对比度必须优先于氛围。
- 所有图标按钮必须有 `aria-label`。
- 可点击卡片必须能通过键盘访问。
- 外链必须处理 `target="_blank"` 与 fallback。
- 文章页不能依赖客户端 JavaScript 才能阅读。
- Markdown 构建应在服务端/构建期完成。
- Markdown 原生 HTML 默认按文本转义，不允许文章内容注入脚本或事件属性。
- 任何装饰都不能阻止复制正文、代码和公式。
- Modal 必须锁定背景滚动，支持 `Escape` 关闭，并在关闭后恢复原焦点。
- 大面积布局容器禁止长期设置 `will-change`；主题切换时不得依赖全屏 `mix-blend-mode` 或大面积 `backdrop-filter`。
- 动画优先使用 `transform` 与 `opacity`，并为 `prefers-reduced-motion` 提供静态状态。

---

## 12. 当前项目落地映射

| 设计概念 | 当前文件/类 |
| --- | --- |
| 全局 Tailwind 入口 | `src/styles/globals.css` |
| 主站局部舟味样式 | `src/styles/localStyles.tsx` |
| 面板 | `src/components/ui/Panel.tsx` |
| 无界容器 | `src/components/ui/UnboundedSurface.tsx` |
| 管理台控件与 Modal | `src/components/ui/AdminControls.tsx` |
| 切角 | `src/components/ui/CutCorner.tsx` |
| 按钮与外链 | `src/components/ui/Buttons.tsx` |
| 书签侧栏 | `src/components/sidebars/BookmarksSidebar.tsx` |
| 文章页布局 | `src/layouts/ArticleLayout.astro` |
| 文章页样式 | `src/styles/article.css` |
| Markdown/LaTeX 配置 | `astro.config.mjs` |
| Obsidian 语法转换 | `scripts/remark-obsidian.mjs` |
| 算法板子索引 | `src/pages/algorithms/index.astro` |
| 算法板子状态 | `src/data/algorithmStatus.ts` |
| 算法板子与打印样式 | `src/styles/algorithm.css` |

---

## 13. 设计检查清单

新增页面或组件上线前必须检查：

- 是否同时适配深色和浅色模式？
- 是否有明确的模块 label / sublabel？
- 是否至少保留 1 个稳定返回路径？
- 是否存在无意义的 `#` 链接？
- 是否移动端可读？
- 是否支持键盘聚焦？
- 是否过度发光、过度圆角、过度玻璃？
- 是否仍像 Yoki Cloud，而不是通用 Tailwind 模板？
