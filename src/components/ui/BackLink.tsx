import { sitePath } from "../../utils/sitePath";
import { ArrowLeft } from "lucide-react";
import { returnToSource } from "../../utils/navigation";
export default function BackLink({ fallback = "/" }: { fallback?: string }) {
  return <a href={sitePath(fallback)} data-return onClick={(event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault(); returnToSource(fallback);
  }} className="inline-flex items-center gap-2 rounded-lg border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] px-3 py-2 text-xs text-[var(--yc-muted)] no-underline hover:text-[var(--yc-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--yc-focus)]">
    <ArrowLeft size={14} aria-hidden="true" />返回
  </a>;
}
