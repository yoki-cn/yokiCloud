import { useEffect, useState } from "react";

function defaultParse<T>(raw: string) {
  return JSON.parse(raw) as T;
}

function defaultSerialize<T>(value: T) {
  return JSON.stringify(value);
}

export type UseSessionStorageStateOptions<T> = {
  parse?: (raw: string) => T;
  serialize?: (value: T) => string;
};

export function useSessionStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseSessionStorageStateOptions<T> = {}
) {
  const parse = options.parse ?? defaultParse<T>;
  const serialize = options.serialize ?? defaultSerialize<T>;
  const [value, setValue] = useState<T>(() => {
    const init = typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    if (typeof window === "undefined") return init;
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw == null ? init : parse(raw);
    } catch {
      return init;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (value === "") {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, serialize(value));
      }
    } catch {
      // Ignore unavailable or quota-limited session storage.
    }
  }, [key, serialize, value]);

  return [value, setValue] as const;
}
