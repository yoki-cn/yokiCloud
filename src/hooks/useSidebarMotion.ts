import { useReducedMotion } from "framer-motion";

// Keep duration/easing aligned with the sidebar layout transitions in globals.css.
export function useSidebarMotion() {
  const reduceMotion = useReducedMotion();
  return {
    initial: { x: "-110%" },
    animate: { x: "0%" },
    exit: { x: "-110%" },
    transition: {
      duration: reduceMotion ? 0 : 0.32,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };
}
