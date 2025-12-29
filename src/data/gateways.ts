import { siteConfig } from "../config/siteConfig";

export type Gateway = {
  code: string;
  cn: string;
  en: string;
  desc: string;
  href: string;
};

export const ARCHIVE_SITE_URL = siteConfig.externalRoutes.archive;
export const LOG_SITE_URL = siteConfig.externalRoutes.log;
export const DEPOT_SITE_URL = siteConfig.externalRoutes.depot;

// IMPORTANT: This array powers the "部门导引 / 主要部门" section.
export const PRIMARY_GATEWAYS: Gateway[] = [
  {
    code: "EXT-01",
    cn: "完整作品集",
    en: "ARCHIVE",
    desc: "Full portfolio archive. 全量项目 / Case / 系统说明。",
    href: ARCHIVE_SITE_URL,
  },
  {
    code: "EXT-02",
    cn: "完整博客",
    en: "LOG",
    desc: "Long-form articles. 完整文章站点入口。",
    href: LOG_SITE_URL,
  },
  {
    code: "EXT-03",
    cn: "资源站",
    en: "DEPOT",
    desc: "Resources depot. 索引 / 收藏 / 下载入口。",
    href: DEPOT_SITE_URL,
  },
];
