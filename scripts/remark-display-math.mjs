// Obsidian treats $$...$$ as display math even when both delimiters share a line.
export default function remarkDisplayMath() {
  return (tree, file) => {
    const source = String(file.value || "");
    function isDisplay(node) {
      if (node.type !== "inlineMath") return false;
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      return typeof start === "number" && typeof end === "number" && /^\$\$[^$]/.test(source.slice(start, end));
    }
    function walk(parent) {
      if (!Array.isArray(parent.children)) return;
      parent.children = parent.children.flatMap(node => {
        if (node.type !== "paragraph" || !node.children.some(isDisplay)) {
          walk(node);
          return [node];
        }
        const result = [];
        let children = [];
        function flush() {
          while (children[0]?.type === "break") children.shift();
          while (children.at(-1)?.type === "break") children.pop();
          if (children.some(child => child.type !== "text" || child.value.trim())) result.push({ ...node, children });
          children = [];
        }
        for (const child of node.children) {
          if (!isDisplay(child)) { children.push(child); continue; }
          flush();
          result.push({ type: "math", value: child.value, position: child.position,
            data: { hName: "pre", hChildren: [{ type: "element", tagName: "code", properties: { className: ["language-math", "math-display"] }, children: [{ type: "text", value: child.value }] }] } });
        }
        flush();
        return result;
      });
    }
    walk(tree);
  };
}
