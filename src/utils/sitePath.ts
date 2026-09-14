import { withBasePath } from "../../scripts/site-path.mjs";

// Keep stored content portable; apply the deployment prefix at rendering boundaries.
export function sitePath<T extends string | undefined>(value: T): T {
  return withBasePath(value, import.meta.env.BASE_URL) as T;
}
