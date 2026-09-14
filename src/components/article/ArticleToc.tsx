import { sitePath } from "../../utils/sitePath";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export type ArticleTocItem = {
  id: string;
  label: string;
  level?: number;
  children?: ArticleTocItem[];
};

type TocNode = Required<Pick<ArticleTocItem, "id" | "label">> & {
  level: number;
  children: TocNode[];
};

function normalizeToc(items: ArticleTocItem[]): TocNode[] {
  if (items.some((item) => item.children?.length)) {
    return items.map((item) => ({
      id: item.id,
      label: item.label,
      level: item.level ?? 1,
      children: normalizeToc(item.children ?? []),
    }));
  }

  const roots: TocNode[] = [];
  const stack: TocNode[] = [];

  for (const item of items) {
    const level = Math.max(1, item.level ?? 1);
    const node: TocNode = {
      id: item.id,
      label: item.label,
      level,
      children: [],
    };

    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(node);
    else roots.push(node);
    stack.push(node);
  }

  return roots;
}

export default function ArticleToc({ toc }: { toc: ArticleTocItem[] }) {
  const tree = useMemo(() => normalizeToc(toc), [toc]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleNode(node: TocNode) {
    if (!node.children.length) return;
    setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
  }

  function renderNode(node: TocNode, depth: number) {
    const hasChildren = node.children.length > 0;
    const open = Boolean(expanded[node.id]);
    const visualDepth = Math.min(depth + 1, 4);
    const nodeContent = (
      <>
        {hasChildren ? (
          <ChevronDown className={`article-toc-chevron ${open ? "is-open" : ""}`} aria-hidden="true" />
        ) : (
          <span className="article-toc-bullet" aria-hidden="true" />
        )}
        <span className="article-toc-text">{node.label}</span>
      </>
    );

    return (
      <li key={node.id}>
        {hasChildren ? (
          <button
            type="button"
            className={`article-toc-link article-toc-button article-toc-depth-${visualDepth}`}
            style={{ paddingLeft: `${10 + depth * 14}px` }}
            onClick={() => toggleNode(node)}
            aria-expanded={open}
          >
            {nodeContent}
          </button>
        ) : (
          <a
            href={sitePath(`#${node.id}`)}
            className={`article-toc-link article-toc-depth-${visualDepth}`}
            style={{ paddingLeft: `${10 + depth * 14}px` }}
          >
            {nodeContent}
          </a>
        )}

        {hasChildren && open ? <ol>{node.children.map((child) => renderNode(child, depth + 1))}</ol> : null}
      </li>
    );
  }

  if (!tree.length) {
    return <div className="mt-3 text-xs leading-relaxed text-white/45">No section router configured.</div>;
  }

  return <ol className="article-toc-tree">{tree.map((node) => renderNode(node, 0))}</ol>;
}
