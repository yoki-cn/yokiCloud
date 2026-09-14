import { sitePath } from "../../utils/sitePath";
import { cx } from "../ui/cx";

export type GithubMarkProps = {
  className?: string;
};

export default function GithubMark({ className }: GithubMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("inline-block shrink-0 bg-current", className)}
      style={{
        maskImage: `url('${sitePath("/logo/github.svg")}')`,
        WebkitMaskImage: `url('${sitePath("/logo/github.svg")}')`,
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
