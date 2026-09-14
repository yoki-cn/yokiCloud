import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDisplayMath from "./scripts/remark-display-math.mjs";
import rehypeSecureHtml from "./scripts/rehype-secure-html.mjs";
import remarkObsidian from "./scripts/remark-obsidian.mjs";
import remarkBoardLinks from "./scripts/remark-board-links.mjs";
import rehypeSitePath from "./scripts/rehype-site-path.mjs";
import localPathRedirectPlugin from "./scripts/local-path-redirect.mjs";

const site = process.env.SITE || "https://yoki-cn.github.io";
const base = process.env.SITE_BASE || "/yokiCloud/";

export default defineConfig({
  site,
  base,
  output: "static",
  vite: { plugins: [localPathRedirectPlugin(base)] },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
    processor: unified({
      remarkPlugins: [remarkGfm, remarkBreaks, remarkMath, remarkDisplayMath, remarkObsidian, remarkBoardLinks],
      rehypePlugins: [rehypeSlug, rehypeKatex, rehypeSecureHtml, [rehypeSitePath, { base }]],
    }),
  },
  // Static pages do not need streaming; avoid UTF-8 chunk padding in React 18 SSR.
  integrations: [react({ experimentalDisableStreaming: true })],
});
