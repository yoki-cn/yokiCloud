import { sitePath } from "../../utils/sitePath";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import type { AlgorithmBoardSummary } from "../../pages/_AlgorithmArchive";

export default function DirectoryTree({ directories, boards, active, onSelect }: {
  directories: string[]; boards: AlgorithmBoardSummary[]; active: string; onSelect: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("yoki.algorithms.tree.v1") || "[]");
      if (Array.isArray(saved)) setExpanded(saved.filter((x) => typeof x === "string"));
    } catch { /* default: collapsed */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem("yoki.algorithms.tree.v1", JSON.stringify(expanded)); } catch {} } }, [expanded, ready]);
  const dirs = directories.filter((path) => path.split("/")[0] !== "图片");
  function render(parent = "") {
    return <ul className={parent ? "algorithm-tree-children" : "algorithm-tree"}>
      {dirs.filter((path) => path.split("/").slice(0, -1).join("/") === parent).map((path) => {
        const children = dirs.some((d) => d.startsWith(path + "/")) || boards.some((b) => b.slug.startsWith(path + "/"));
        const open = expanded.includes(path);
        const count = boards.filter((b) => b.slug.startsWith(path + "/")).length;
        return <li key={path}>
          <div className="algorithm-tree-row">
            {children ? <button type="button" className="algorithm-tree-toggle" aria-label={`${open ? "收起" : "展开"}${path}`} aria-expanded={open}
              onClick={() => setExpanded((old) => open ? old.filter((x) => x !== path) : [...old, path])}>
              <ChevronRight size={14} style={{ transform: open ? "rotate(90deg)" : undefined }} />
            </button> : <Folder size={14} className="shrink-0 mx-1 text-[var(--yc-dim)]" />}
            <button type="button" className={`algorithm-section-button ${active === path ? "is-active" : ""}`} aria-pressed={active === path} onClick={() => onSelect(path)}>
              <span>{path.split("/").at(-1)}</span><span className="shrink-0 text-xs">{count || "空"}</span>
            </button>
          </div>
          {children && open && render(path)}
        </li>;
      })}
      {parent && boards.filter((board) => board.slug.split("/").slice(0, -1).join("/") === parent).map((board) =>
        <li key={board.slug}><a href={sitePath(board.href)} className="algorithm-tree-file"><FileText size={13} className="shrink-0" /><span>{board.title}</span></a></li>)}
    </ul>;
  }
  return <nav aria-label="算法章节目录">{render()}</nav>;
}
