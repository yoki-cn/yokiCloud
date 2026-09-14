export const ALGORITHM_STATUS_ORDER = ["optimizing", "usable", "verified", "draft", "deprecated"] as const;

export type AlgorithmStatus = (typeof ALGORITHM_STATUS_ORDER)[number];

export type AlgorithmStatusMeta = {
  value: AlgorithmStatus;
  description: string;
};

export const ALGORITHM_STATUS_META: Record<AlgorithmStatus, AlgorithmStatusMeta> = {
  optimizing: {
    value: "optimizing",
    description: "主体可参考，仍在补充边界与实现细节。",
  },
  usable: {
    value: "usable",
    description: "已整理为可直接复用的模板。",
  },
  verified: {
    value: "verified",
    description: "已通过题目或测试验证。",
  },
  draft: {
    value: "draft",
    description: "结构或内容尚未完成。",
  },
  deprecated: {
    value: "deprecated",
    description: "保留用于追溯，不建议在新题中使用。",
  },
};

export function normalizeAlgorithmStatus(value: unknown): AlgorithmStatus {
  return typeof value === "string" && ALGORITHM_STATUS_ORDER.includes(value as AlgorithmStatus)
    ? (value as AlgorithmStatus)
    : "draft";
}

export function getAlgorithmStatusMeta(value: unknown): AlgorithmStatusMeta {
  return ALGORITHM_STATUS_META[normalizeAlgorithmStatus(value)];
}
