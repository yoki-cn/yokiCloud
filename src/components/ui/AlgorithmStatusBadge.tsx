import { getAlgorithmStatusMeta, type AlgorithmStatus } from "../../data/algorithmStatus";
import { cx } from "./cx";

export type AlgorithmStatusBadgeProps = {
  status: AlgorithmStatus | string;
  compact?: boolean;
  className?: string;
};

export default function AlgorithmStatusBadge({
  status,
  compact = false,
  className,
}: AlgorithmStatusBadgeProps) {
  const meta = getAlgorithmStatusMeta(status);

  return (
    <span
      className={cx("algorithm-status", compact && "algorithm-status-compact", className)}
      data-status={meta.value}
      title={meta.description}
    >
      <span className="algorithm-status-dot" aria-hidden="true" />
      <span>{meta.value}</span>
    </span>
  );
}
