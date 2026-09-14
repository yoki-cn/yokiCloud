/** Show calendar dates without shifting date-only metadata through local time zones. */
export function formatDateOnly(value: unknown): string {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string") return "";
  const text = value.trim();
  return text.match(/^\d{4}-\d{2}-\d{2}(?=$|[T\s])/)?.[0] ?? text;
}
