import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Folder, FileText } from "lucide-react";
import { sitePath } from "../../utils/sitePath";

export type ChapterBoard = { slug: string; title: string; href: string };
type Branch = { path: string; anchor: HTMLElement };

export function positionChapterMenu(anchor: DOMRect, width: number, height: number, viewportWidth: number, viewportHeight: number, nested: boolean) {
  const gap = 8;
  let left = nested ? anchor.right : anchor.left;
  if (nested && left + width > viewportWidth - gap) left = anchor.left - width;
  left = Math.max(gap, Math.min(left, viewportWidth - width - gap));
  const top = Math.max(gap, Math.min(nested ? anchor.top : anchor.bottom, viewportHeight - height - gap));
  return { left, top };
}

function ChapterPanel({ branch, depth, directories, boards, open, close, enter, leave }: {
  branch: Branch; depth: number; directories: string[]; boards: ChapterBoard[];
  open: (path: string, anchor: HTMLElement, depth: number) => void;
  close: (depth: number) => void; enter: () => void; leave: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  useLayoutEffect(() => {
    const place = () => {
      if (!panel.current || !branch.anchor.isConnected) return;
      const rect = panel.current.getBoundingClientRect();
      const next = positionChapterMenu(branch.anchor.getBoundingClientRect(), rect.width, rect.height, innerWidth, innerHeight, depth > 0);
      setPosition(old => old.left === next.left && old.top === next.top ? old : next);
    };
    place();
    const observer = new ResizeObserver(place);
    if (panel.current) observer.observe(panel.current);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("chapter-layout", place);
    return () => { observer.disconnect(); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); window.removeEventListener("chapter-layout", place); };
  }, [branch, depth]);
  useLayoutEffect(() => { window.dispatchEvent(new Event("chapter-layout")); }, [position.left, position.top]);
  const childDirs = directories.filter(path => path.split("/").slice(0, -1).join("/") === branch.path);
  const childBoards = boards.filter(board => board.slug.split("/").slice(0, -1).join("/") === branch.path);
  return <div ref={panel} className="chapter-popover" style={{ ...position, zIndex: 100 + depth }} data-chapter-popup
    onMouseEnter={enter} onMouseLeave={leave} aria-label={branch.path}>
    <div className="chapter-popover-heading"><span>{branch.path.split("/").at(-1)}</span><button type="button" onClick={() => { close(depth); branch.anchor.focus(); }} aria-label="收起此级目录">×</button></div>
    <div className="chapter-popover-list" onScroll={() => close(depth + 1)}>
      {childDirs.map(path => <button type="button" key={path} className="chapter-menu-item" aria-haspopup="true"
        onMouseEnter={event => open(path, event.currentTarget, depth + 1)} onClick={event => open(path, event.currentTarget, depth + 1)}
        onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); open(path, event.currentTarget, depth + 1); requestAnimationFrame(() => document.querySelectorAll<HTMLElement>("[data-chapter-popup]")[depth + 1]?.querySelector<HTMLElement>(".chapter-menu-item")?.focus()); } }}>
        <Folder size={14} /><span>{path.split("/").at(-1)}</span><ChevronRight size={14} /></button>)}
      {childBoards.map(board => <a key={board.slug} className="chapter-menu-item" href={sitePath(board.href)} onMouseEnter={() => close(depth + 1)}><FileText size={14} /><span>{board.title}</span></a>)}
      {!childDirs.length && !childBoards.length ? <p className="chapter-empty">PRTS：本目录待归档</p> : null}
    </div>
  </div>;
}

export default function ChapterNavigation({ directories, boards }: { directories: string[]; boards: ChapterBoard[] }) {
  const dirs = useMemo(() => directories.filter(path => path.split("/")[0] !== "图片").sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true })), [directories]);
  const nav = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [portal, setPortal] = useState<Element | null>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const enter = () => clearTimeout(timer.current);
  const leave = () => { enter(); timer.current = setTimeout(() => setBranches([]), 240); };
  const close = (depth: number) => setBranches(old => old.slice(0, depth));
  const open = (path: string, anchor: HTMLElement, depth: number) => {
    enter();
    setBranches(old => old[depth]?.path === path ? old : [...old.slice(0, depth), { path, anchor }]);
  };
  useEffect(() => {
    setPortal(document.querySelector(".article-root"));
    const update = () => { const el = rail.current; if (el) setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 }); };
    update();
    const observer = new ResizeObserver(update);
    if (rail.current) observer.observe(rail.current);
    rail.current?.addEventListener("scroll", update);
    const outside = (event: PointerEvent) => { const target = event.target as Element; if (!nav.current?.contains(target) && !target.closest("[data-chapter-popup]")) setBranches([]); };
    document.addEventListener("pointerdown", outside);
    return () => { clearTimeout(timer.current); observer.disconnect(); rail.current?.removeEventListener("scroll", update); document.removeEventListener("pointerdown", outside); };
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if ((event.key === "Escape" || event.key === "ArrowLeft") && branches.length) { event.preventDefault(); branches.at(-1)?.anchor.focus(); close(branches.length - 1); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [branches]);
  function scroll(direction: number) { setBranches([]); rail.current?.scrollBy({ left: direction * Math.max(180, rail.current.clientWidth * .65), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
  return <nav ref={nav} className="chapter-navigation" aria-label="算法大章节" onMouseEnter={enter} onMouseLeave={leave}>
    <button type="button" className="chapter-scroll" disabled={!edges.left} onClick={() => scroll(-1)} aria-label="向左滚动章节"><ChevronLeft size={18} /></button>
    <div ref={rail} className="chapter-rail" onScroll={() => setBranches([])}>
      {dirs.filter(path => !path.includes("/")).map(path => <button key={path} type="button" className="chapter-root" aria-haspopup="true" aria-expanded={branches[0]?.path === path}
        onMouseEnter={event => open(path, event.currentTarget, 0)} onClick={event => open(path, event.currentTarget, 0)}
        onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); open(path, event.currentTarget, 0); requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-chapter-popup] .chapter-menu-item")?.focus()); } }}>{path}</button>)}
    </div>
    <button type="button" className="chapter-scroll" disabled={!edges.right} onClick={() => scroll(1)} aria-label="向右滚动章节"><ChevronRight size={18} /></button>
    {portal && branches.map((branch, depth) => createPortal(<ChapterPanel key={branch.path} branch={branch} depth={depth} directories={dirs} boards={boards} open={open} close={close} enter={enter} leave={leave} />, portal))}
  </nav>;
}
