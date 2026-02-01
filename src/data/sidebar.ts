export type SidebarFeedItem = {
  id: string;
  title: string;
  detail?: string;
  href?: string;
  tone?: "info" | "warn" | "maint";
};

// Owner-editable side panel notes (build-time).
// - Public build is read-only for visitors.
// - Update this list, then rebuild/deploy.
export const SIDEBAR_BULLETINS: SidebarFeedItem[] = [
  {
    id: "maint-readonly",
    title: "READONLY / 只读",
    detail: "书签与侧栏内容为构建时配置（访客不可修改）",
    tone: "maint",
  },
];

