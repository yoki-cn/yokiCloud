export const ADMIN_SESSION_COOKIE = "yoki_admin_session_v1";
export const ADMIN_SESSION_HOURS = 12;
export const ADMIN_PASSWORD_ITERATIONS = 210_000;

export const ADMIN_PERMISSION_GROUPS = [
  {
    id: "content",
    label: "内容维护",
    detail: "控制公开内容的上传、修改与删除。",
    permissions: [
      { key: "content.posts", label: "Blog 文章", detail: "上传、修改、删除 Markdown 文章。" },
      { key: "content.bulletins", label: "侧栏公告", detail: "增删改门户侧边栏公告。" },
      { key: "content.bookmarks", label: "侧栏书签", detail: "增删改门户侧边栏书签。" },
      { key: "content.resources", label: "资源节点", detail: "维护资源节点卡片与外链。" },
      { key: "content.gateways", label: "门户路由", detail: "编辑门户页面主入口。" },
    ],
  },
  {
    id: "security",
    label: "安全与账号",
    detail: "控制管理者账号、密码与登录态。",
    permissions: [
      { key: "security.admins", label: "管理员维护", detail: "增删改管理员账号与权限。" },
      { key: "security.password", label: "密码修改", detail: "修改自己或其他管理员密码。" },
      { key: "security.sessions", label: "登录状态", detail: "使用和清理本地 Cookie 登录态。" },
    ],
  },
  {
    id: "system",
    label: "系统操作",
    detail: "控制本地草稿、导入导出、发布构建与重置。",
    permissions: [
      { key: "system.import", label: "导入数据", detail: "导入管理台 JSON 数据包。" },
      { key: "system.export", label: "导出数据", detail: "导出 JSON、TS 与 Markdown 源文件。" },
      { key: "system.publish", label: "发布构建", detail: "写入静态源码并重新构建站点。" },
      { key: "system.reset", label: "重置草稿", detail: "恢复为源码内置初始数据。" },
    ],
  },
] as const;

export type AdminPermissionGroup = (typeof ADMIN_PERMISSION_GROUPS)[number];
export type AdminPermissionKey = AdminPermissionGroup["permissions"][number]["key"];
export type AdminPermissionMap = Record<AdminPermissionKey, boolean>;

export type AdminUser = {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  permissions: AdminPermissionMap;
  updatedAt: string;
};

export const DEFAULT_ADMIN_PERMISSIONS = Object.fromEntries(
  ADMIN_PERMISSION_GROUPS.flatMap((group) => group.permissions.map((permission) => [permission.key, true]))
) as AdminPermissionMap;

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-yoki",
    username: "yoki",
    displayName: "Yoki",
    passwordHash: "c9d0f34086113646929372872bdb624eb92f854f9aaf6d9b36aad9600fe24a63",
    passwordSalt: "19d6fd890d5f28649399990c81b4a54e",
    passwordIterations: ADMIN_PASSWORD_ITERATIONS,
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
    updatedAt: "2026-06-13",
  },
];
