/** Lightweight build-time index: no Markdown body is sent to the browser. */
export type AlgorithmSearchMetadata = { headings: string[]; symbols: string[]; aliases: string[] };

const ALIASES: Array<[RegExp, string[]]> = [
  [/\bSCC\b|强连通分量/i, ["Tarjan", "Kosaraju", "强连通分量", "缩点"]],
  [/\bDSU\b|并查集/i, ["Union Find", "Disjoint Set Union", "并查集"]],
  [/\bBIT\b|树状数组/i, ["Fenwick Tree", "树状数组"]],
  [/SegTree|线段树/i, ["Segment Tree", "线段树"]],
  [/Li Chao|李超树/i, ["Li Chao Tree", "李超线段树"]],
  [/\bLCT\b|Link.Cut/i, ["Link Cut Tree", "动态树"]],
  [/\bHLD\b|树链剖分/i, ["Heavy Light Decomposition", "树剖"]],
  [/\bKMP\b/i, ["前缀函数", "字符串匹配"]],
  [/后缀自动机|\bSAM\b/i, ["Suffix Automaton", "后缀自动机"]],
  [/后缀数组|\bSuffix Array\b/i, ["Suffix Array", "SA"]],
  [/AC 自动机|Aho.Corasick/i, ["ACAM", "Aho Corasick"]],
  [/二分图匹配/i, ["Bipartite Matching", "匈牙利"]],
  [/费用流/i, ["MCMF", "Min Cost Flow", "最小费用最大流"]],
  [/最大流|\bDinic\b/i, ["Max Flow", "网络流"]],
  [/最短路/i, ["Shortest Path", "Dijkstra"]],
  [/\b2.SAT\b/i, ["Two Sat", "二元可满足性"]],
  [/凸包/i, ["Convex Hull", "Andrew"]],
  [/旋转卡壳/i, ["Rotating Calipers", "最远点对"]],
  [/半平面交/i, ["Half Plane Intersection", "HPI"]],
  [/\bNTT\b/i, ["Number Theoretic Transform", "数论变换"]],
  [/\bFFT\b/i, ["Fast Fourier Transform", "快速傅里叶变换"]],
  [/莫队/i, ["Mo Algorithm", "Mo's Algorithm"]],
  [/\bPAM\b|回文树/i, ["Palindrome Automaton", "回文自动机"]],
];

const SKIP_HEADINGS = new Set(["注意事项", "常见用法", "接口", "接口说明", "成员变量", "复杂度", "板子", "代码", "示例"]);
const SKIP_SYMBOLS = new Set([
  "if", "else", "for", "while", "switch", "catch", "return", "sizeof",
  "min", "max", "swap", "sort", "reverse", "begin", "end", "push_back",
  "emplace_back", "pop_back", "resize", "reserve", "clear", "assert",
  "move", "forward", "cout", "cin",
]);

function unique(values: Iterable<string>, limit: number) {
  const seen = new Set<string>();
  for (const value of values) {
    const word = value.trim();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    if (seen.size >= limit) break;
  }
  return [...seen];
}

export function extractAlgorithmSearchMetadata(raw: string, title: string): AlgorithmSearchMetadata {
  const headings = unique(
    [...raw.matchAll(/^#{2,6}\s+(.+?)\s*$/gm)]
      .map((match) => match[1].replace(/[*\x60]/g, "").replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1").trim())
      .filter((heading) => heading.length <= 100 && !SKIP_HEADINGS.has(heading)),
    90,
  );

  const names: string[] = [];
  for (const block of raw.matchAll(/\x60{3}(?:cpp|c\+\+|cc|cxx)\s*\r?\n([\s\S]*?)\x60{3}/gi)) {
    for (const originalLine of block[1].split(/\r?\n/)) {
      const line = originalLine.split("//", 1)[0].trim();
      if (!line || line.startsWith("#")) continue;
      for (const match of line.matchAll(/\b(?:struct|class|enum(?:\s+class)?|using)\s+([A-Za-z_]\w*)/g)) {
        if (!SKIP_SYMBOLS.has(match[1])) names.push(match[1]);
      }
      const declaration = line.match(/^(?:(?:static|inline|constexpr|consteval|friend|virtual|explicit)\s+)*(?:[\w:<>,*&~]+\s+)+([A-Za-z_]\w*)\s*\(/);
      if (declaration && !SKIP_SYMBOLS.has(declaration[1])) names.push(declaration[1]);
    }
  }

  const aliases = unique(ALIASES.flatMap(([pattern, values]) => pattern.test(title) ? values : []), 20);
  return { headings, symbols: unique(names, 160), aliases };
}
