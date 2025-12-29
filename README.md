# Arknights Inspired Portfolio (React + TypeScript)

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

## 部署（静态站点）

构建后产物在 `dist/`，直接部署到任意静态服务器即可。Nginx 示例：

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/arknights-portfolio/dist;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 配置入口

- 统一配置：`src/config/siteConfig.ts`
  - `brandName` / `displayName`
  - `email` / `links`
  - `externalRoutes` (EXT-01/02/03)

## 结构说明

- 入口页面：`src/pages/ArknightsInspiredPortfolio.tsx`
- Section 注册表：`src/components/sections/index.ts`
- UI 组件：`src/components/ui/*`
- 动效与 Hooks：`src/motion/*`, `src/hooks/*`
- 数据层：`src/data/*`
- 本地样式（原 LocalStyles）：`src/styles/localStyles.tsx`

## 保持一致的关键点

- 原 LocalStyles 的选择器与 CSS 规则保持不变。
- section id（portal/projects/resources/blog/friends/about）完全保留。
- prefers-reduced-motion 与 modal 行为（遮罩关闭、body 锁滚动）保持一致。
