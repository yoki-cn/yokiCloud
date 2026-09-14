/** Prefix only site-root URLs; keep external, relative and fragment URLs intact. */
export function withBasePath(value, base = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return value;
  const prefix = `/${base.replace(/^\/+|\/+$/g, "")}`;
  if (prefix === "/") return value;
  if (value === prefix || value.startsWith(`${prefix}/`) || value.startsWith(`${prefix}?`) || value.startsWith(`${prefix}#`)) return value;
  return `${prefix}${value}`;
}
