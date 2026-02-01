# yokiCloud · 个人网站导航页（React + TypeScript）

这是一个带有 PRTS/明日方舟终端风格的个人网站入口页：把常用链接、内容分区与外部站点入口集中到一个页面里，作为日常使用的“起始页 / 导航页”（不是电子简历）。

- 在线访问（GitHub Pages）：https://yoki-cn.github.io/yokiCloud/
- 技术栈：React + TypeScript + Vite + Tailwind CSS + Framer Motion

## 页面包含什么

- Portal：主入口/快捷分流
- Bookmarks Sidebar：侧边书签栏（只读展示）
- Projects / Resources / Blog / Friends / About：按 Section 组织的内容区

## 开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 配置与内容维护

- 统一配置：`src/config/siteConfig.ts`
  - `brandName` / `displayName`
  - `email` / `links`
  - `externalRoutes` (EXT-01/02/03)
- 书签侧栏：`src/data/bookmarks.ts`
  - 修改后重新构建/部署即可生效
  - 可选自定义 icon：把文件放到上级目录的 `logo/`（与本仓库同级），`dev/build` 会自动同步到 `public/logo`

## 结构说明

- 入口页面：`src/pages/ArknightsInspiredPortfolio.tsx`
- Section 注册表：`src/components/sections/index.ts`
- UI 组件：`src/components/ui/*`
- 动效与 Hooks：`src/motion/*`, `src/hooks/*`
- 数据层：`src/data/*`
- 本地样式（原 LocalStyles）：`src/styles/localStyles.tsx`

## UI 风格说明

- `UI_STYLE_GUIDE.md`
