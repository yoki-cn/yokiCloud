# Yoki Cloud

明日方舟终端风格的个人门户、Blog 与本地内容管理台。当前项目使用 Astro 作为静态站点框架，React Island 承载交互组件，内容数据保存在 `src/data/*` 与 `src/pages/posts/*.md`。

## 当前功能
 
默认部署前缀为 `/yokiCloud/`，对应 `https://yoki-cn.github.io/yokiCloud/`。本地预览也使用相同前缀。`SITE` 可覆盖站点域名，`SITE_BASE` 可覆盖前缀；需要部署到域名根目录时设置 `SITE_BASE=/`。配置变更后需要重新构建。

本地开发服务会将旧的 `/`、`/algorithms/`、`/posts/`、`/admin/`、`/ui-kit/` 地址临时跳转到对应的新路径，并保留查询参数。此兼容逻辑不写入 GitHub Pages 静态产物。若修改配置后本地服务表现异常，先执行 `npx astro dev stop`，再运行 `npm run dev -- --host 127.0.0.1`。

页面链接、下载和资源地址统一通过 `src/utils/sitePath.ts` 处理；Markdown 在渲染后通过 `scripts/rehype-site-path.mjs` 处理。源 Markdown 和管理台数据仍保存不带部署前缀的路径，外链与页内锚点不会被改写。构建后运行 `npm run verify:paths` 检查路径及板子链接。

- 门户首页：快捷入口、项目、资源节点、Blog、友链、About 与侧边栏书签。
- Blog：Markdown 文章、KaTeX 数学公式、Shiki 代码高亮、代码块/数学块复制按钮、Markdown 下载入口。
- 算法板子：独立的 `/algorithms/` 子站，按知识域、章节、状态与关键词检索；详情页支持 Markdown 下载与已归档 PDF 下载。
- Obsidian 兼容：全站 Markdown 支持双链、笔记/图片嵌入、Callout、折叠 Callout、高亮、标签、任务列表、表格和软换行。
- 管理台：上传、修改、删除 Blog 文章，维护公告、书签、资源节点、门户路由与管理员。
- 权限：管理员权限按内容维护、安全与账号、系统操作分组，当前所有权限可用开关控制。
- 发布：管理台可调用本机发布服务，把草稿写回静态源码并重新构建。

## 环境要求

- Node.js `>=22.12.0`
- Windows PowerShell 或 PowerShell 7

安装依赖：

```bash
npm install
```

## 一键启动

Windows 下推荐直接运行：

```text
双击 start-local.bat
```

或在 PowerShell 中运行：

```powershell
.\start-local.ps1
```

默认会启动两个本地服务：

- 站点开发服务器：`http://127.0.0.1:4321/yokiCloud/`
- 管理台发布服务：`http://127.0.0.1:4317`

启动后会自动打开浏览器。管理台地址：

```text
http://127.0.0.1:4321/yokiCloud/admin/
```

常用启动参数：

```powershell
.\start-local.ps1 -NoBrowser
.\start-local.ps1 -NoPublishServer
.\start-local.ps1 -NoAlgorithmSync
.\start-local.ps1 -Port 3000
.\start-local.ps1 -ListenHost 0.0.0.0
.\start-local.ps1 -PublishPort 4317
.\start-local.ps1 -PublishToken "your-local-token"
.\start-local.ps1 -AlgorithmSource "G:\Algorithms\Algorithms"
```

`-NoPublishServer` 只适合普通预览；跳过后，管理台里的“发布构建”按钮不可用。
默认启动发布服务时会生成一次性发布令牌，并在终端输出；管理台执行“发布构建”前需要把该令牌填入“发布令牌”字段。

## 手动启动

只启动站点：

```bash
npm run dev -- --host 127.0.0.1 --port 4321
```

单独启动管理台发布服务：

```bash
npm run admin:publish-server
```

发布服务环境变量：

- `YOKI_ADMIN_PUBLISH_HOST`：默认 `127.0.0.1`
- `YOKI_ADMIN_PUBLISH_PORT`：默认 `4317`
- `YOKI_ADMIN_PUBLISH_ORIGINS`：允许调用发布接口的站点来源
- `YOKI_ADMIN_PUBLISH_MAX_BYTES`：管理台提交数据包最大体积，默认 8 MiB
- `YOKI_ADMIN_PUBLISH_TOKEN`：发布接口令牌，至少 16 字节；未设置时服务会在启动时自动生成并打印

## 管理台

- 地址：`/admin/`
- 初始账号：`yoki`
- 初始密码：`suzuran`
- 登录态：Cookie 默认保留 12 小时
- 发布构建：需要本地发布服务令牌，通过 `X-Yoki-Publish-Token` 发送

密码不会保存明文。新账号和新密码使用带独立盐值及迭代次数的 `PBKDF2-SHA-256` 摘要，旧版 SHA-256 本地账号仍可登录并在修改密码后自动升级。Cookie 使用 `SameSite=Strict`，HTTPS 下会自动加 `Secure`，并包含由当前密码摘要派生的会话 proof。需要注意：这是静态站点的前端保护，用于防止普通访客误入，不等同于服务器侧鉴权。

发布令牌只写入 `sessionStorage`，退出管理台或结束标签会话后清除。发布服务只监听本机地址，校验来源和令牌，限制 JSON 请求体大小，并拒绝危险 URL。写入后若构建失败，会恢复发布前的源码文件。

管理台内容会先保存在当前浏览器的本地草稿中。需要公开生效时，有两种方式：

- 点击管理台右上角“发布构建”：要求已启动 `admin:publish-server` 或使用 `start-local.ps1`。
- 导出数据包或源码片段后手动替换文件，再运行构建。

命令行发布 JSON 数据包：

```bash
npm run admin:publish -- --input yoki-admin-dataset.json
```

Dry run：

```bash
npm run admin:publish -- --input yoki-admin-dataset.json --skip-build --dry-run
```

## 构建与预览

```bash
npm run check
npm run verify:security
npm audit --omit=dev
npm run build
npm run preview
```

构建产物输出到 `dist/`。

## 主要目录

- `src/pages/index.astro`：门户首页入口。
- `src/pages/admin.astro`：管理台页面入口。
- `src/pages/_AdminConsole.tsx`：管理台主组件。
- `src/pages/posts/*.md`：Blog Markdown 源文件。
- `src/layouts/ArticleLayout.astro`：Blog 文章布局。
- `src/components/article/*`：文章页顶栏、侧边栏、目录等组件。
- `src/components/sidebars/*`：门户侧边栏。
- `src/components/ui/*`：可复用 UI 基础组件。
- `src/data/*`：Blog、公告、书签、资源节点、友链、管理员等静态数据。
- `src/styles/article.css`：文章页样式。
- `src/styles/globals.css`：全局 Tailwind 入口。
- `scripts/publish-admin-content.mjs`：把管理台数据写入静态源码并构建。
- `scripts/admin-publish-server.mjs`：供管理台按钮调用的本地发布服务。
- `UI_STYLE_STANDARD.md`：当前网站 UI 风格标准。

## 内容维护文件

- Blog 索引：`src/data/blog.ts`
- Blog 正文：`src/pages/posts/*.md`
- 门户公告：`src/data/sidebar.ts`
- 侧边栏书签：`src/data/bookmarks.ts`
- 项目：`src/data/projects.ts`
- 资源节点：`src/data/resources.ts`
- 友链：`src/data/friends.ts`
- 门户路由：`src/data/gateways.ts`
- 管理员与权限：`src/data/adminAuth.ts`

## Blog 文章

- 示例文章：`http://127.0.0.1:4321/yokiCloud/posts/slope-optimization/`
- Markdown 下载：文章顶栏与左侧栏提供下载入口。
- 数学公式：使用 `remark-math` + `rehype-katex`。
- 代码高亮：使用 Astro Markdown + Shiki。
- 安全处理：Markdown 中的原生 HTML 会按文本转义，避免文章内容注入脚本；常规 Markdown、KaTeX 与 Shiki 不受影响。
- 主题：文章页继承主站深色/浅色模式。

## 算法板子

- 索引地址：`http://127.0.0.1:4321/yokiCloud/algorithms/`
- Obsidian 源目录：`G:\Algorithms\Algorithms`
- 仓库镜像：`src/content/algorithms/`；此目录由同步脚本生成，不应作为日常编辑入口。
- 附件镜像：`public/algorithm-assets/`；Obsidian 图片嵌入 `![[image.png]]` 会读取 `/algorithm-assets/image.png`。
- 同步范围：`docs/algorithm-publication-manifest.json` 中列出的 106 份板子及源目录图片。完整 37 个目录由同一清单保留，空目录以 `.gitkeep` 占位并在网页显示“空”。新板子需要先加入清单才能同步。
- 文件夹可继续嵌套，索引会自动发现所有同步后的板子，无需手动维护列表。
- 每份源文件手动填写 `kind`、`title`、`status`、`order`、`tags`；`updated` 由同步程序按文件修改时间生成。
- `section` 由文件所在的顶层章节目录生成，并自动去掉数字前缀，不写入 YAML。
- `status` 可使用 `optimizing`、`usable`、`verified`、`draft`、`deprecated`；网站直接显示这些英文值，并为不同状态使用对应主题色。
- 网页目录直接读取 Markdown 的二至四级标题，无需在 YAML 中填写 `toc`。
- “下载 PDF”会检索作者上传的同名 PDF；文件放置规则见 `docs/algorithm-pdf-downloads.md`，未归档时显示 PRTS 提示。

### 本地同步

普通同步一次：

```bash
npm run algorithms:sync
```

仅预览会发生哪些变化：

```bash
npm run algorithms:sync:dry
```

持续监听 Obsidian 目录：

```bash
npm run algorithms:watch
```

使用 `start-local.bat` 或 `start-local.ps1` 时会自动先同步一次并启动监听。保存 Obsidian 文件后，仓库镜像会更新，正在运行的 Astro 页面也会自动刷新。源目录可通过 `YOKI_ALGORITHM_SOURCE` 或 `-AlgorithmSource` 临时覆盖；永久配置位于 `algorithm-sync.config.json`。

### 同步到 GitHub 和线上网站

当仓库已配置 `origin`，且网站部署服务监听当前 GitHub 分支后，执行：

```bash
npm run algorithms:publish
```

该命令会依次同步 Obsidian、检查站点、完成生产构建，只提交 `src/content/algorithms/`、`public/algorithm-assets/`、`public/algorithm-pdfs/` 与 `docs/algorithm-publication-manifest.json`，然后推送当前分支。工作区中的项目代码、草稿或其他未完成修改不会被加入这次板子提交。GitHub 收到推送后即可触发现有网站部署流程。

也可以覆盖提交说明或源目录：

```bash
npm run algorithms:publish -- --message "更新动态规划板子"
npm run algorithms:publish -- --source "G:\Algorithms\Algorithms"
```

新增板子时，在 Obsidian 源文件顶部填写以下 frontmatter：

```yaml
---
kind: algorithm
title: "板子标题"
status: "optimizing"
order: 20
tags: [DP, Template]
---
```

同步后的仓库镜像只保留上述手填字段，并自动加入 `updated: "YYYY-MM-DD"`。知识域由顶层文件夹路径生成，状态文字直接使用 `status`，两者都不需要额外 YAML 字段。清单中的源文件缺失或字段不完整时，同步在写入前停止；清单外尚未整理的板子不参与校验。网页右侧目录由 Markdown 标题自动生成，不写入 YAML。
