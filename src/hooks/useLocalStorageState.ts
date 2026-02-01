import { useEffect, useState } from "react";

export type UseLocalStorageStateOptions<T> = {
  parse?: (raw: string) => T;
  serialize?: (value: T) => string;
  enabled?: boolean;
};

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageStateOptions<T> = {}
) {
  const parse = options.parse ?? ((raw: string) => JSON.parse(raw) as T);
  const serialize = options.serialize ?? ((value: T) => JSON.stringify(value));
  const enabled = options.enabled ?? true;

  const [value, setValue] = useState<T>(() => {
    const init = typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    if (!enabled || typeof window === "undefined") return init;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return init;
      return parse(raw);
    } catch {
      return init;
    }
  });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // ignore write errors (private mode, quota, etc.)
    }
  }, [enabled, key, serialize, value]);

  return [value, setValue] as const;
}
