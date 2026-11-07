/** Pure client-side ranking over compact, build-time metadata. */
export type AlgorithmSearchField = "title" | "symbol" | "alias" | "heading" | "tag" | "section";
export type AlgorithmSearchMatch = { score: number; field: AlgorithmSearchField; text: string };
export type AlgorithmSearchable = {
  title: string;
  slug: string;
  section: string;
  tags: string[];
  headings: string[];
  symbols: string[];
  aliases: string[];
};

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[\s_\-./()（）]+/g, "");
}

function scoreField(field: AlgorithmSearchField, value: string, token: string): number {
  const text = normalize(value);
  if (!text || !text.includes(token)) return 0;
  const weights: Record<AlgorithmSearchField, [number, number, number]> = {
    title: [150, 120, 100],
    symbol: [140, 110, 85],
    alias: [125, 100, 78],
    heading: [100, 80, 62],
    tag: [75, 55, 42],
    section: [35, 28, 20],
  };
  const [exact, prefix, partial] = weights[field];
  return text === token ? exact : text.startsWith(token) ? prefix : partial;
}

export function matchAlgorithmBoard(board: AlgorithmSearchable, query: string): AlgorithmSearchMatch | null {
  const tokens = query.trim().split(/\s+/).map(normalize).filter(Boolean).slice(0, 8);
  if (!tokens.length) return null;
  const fields: Array<[AlgorithmSearchField, string[]]> = [
    ["title", [board.title, board.slug.split("/").at(-1) || ""]],
    ["symbol", board.symbols],
    ["alias", board.aliases],
    ["heading", board.headings],
    ["tag", board.tags],
    ["section", [board.section, board.slug]],
  ];
  let score = 0;
  let primary: AlgorithmSearchMatch | null = null;
  for (const token of tokens) {
    let best: AlgorithmSearchMatch | null = null;
    for (const [field, values] of fields) {
      for (const value of values) {
        const current = scoreField(field, value, token);
        if (current && (!best || current > best.score)) best = { score: current, field, text: value };
      }
    }
    if (!best) return null;
    score += best.score;
    if (!primary || best.score > primary.score) primary = best;
  }
  return primary ? { ...primary, score } : null;
}
