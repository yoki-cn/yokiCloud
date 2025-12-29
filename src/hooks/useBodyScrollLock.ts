import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
