import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, isLight: theme === "light", toggleTheme };
}
