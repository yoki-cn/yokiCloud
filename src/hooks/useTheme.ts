import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "ark.portal.theme.v1";
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function applyTheme(theme: ThemeMode) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
  });

  const themeRef = useRef(theme);

  useIsomorphicLayoutEffect(() => {
    themeRef.current = theme;
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    themeRef.current = nextTheme;
    applyTheme(nextTheme);
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(themeRef.current === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, isLight: theme === "light", toggleTheme };
}
