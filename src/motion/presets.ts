import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export const fastFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
