import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent } from "react";

type PendingPress = {
  el: HTMLDivElement;
  x: number;
  y: number;
};

export type PointerTiltHandlers = {
  onMove: (e: MouseEvent<HTMLDivElement>) => void;
  onEnter: (e: MouseEvent<HTMLDivElement>) => void;
  onLeave: (e: MouseEvent<HTMLDivElement>) => void;
  onDown: (e: MouseEvent<HTMLDivElement>) => void;
  onUp: (e: MouseEvent<HTMLDivElement>) => void;
};

export function useRafPointerTilt(): PointerTiltHandlers {
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<PendingPress | null>(null);

  const applyStatusPress = useCallback((el: HTMLDivElement, clientX: number, clientY: number) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const px = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const py = Math.max(0, Math.min(1, (clientY - r.top) / r.height));

    const dx = px - 0.5;
    const dy = py - 0.5;

    const tilt = 12;
    const rx = (-dy * tilt).toFixed(2);
    const ry = (dx * tilt).toFixed(2);

    const push = 18;
    const sx = (-dx * push).toFixed(2);
    const sy = (-dy * push).toFixed(2);

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--sx", `${sx}`);
    el.style.setProperty("--sy", `${sy}`);
    el.style.setProperty("--press", "1.2");
  }, []);

  const scheduleStatus = useCallback(
    (el: HTMLDivElement, x: number, y: number) => {
      pendingRef.current = { el, x, y };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const pending = pendingRef.current;
        if (!pending) return;
        applyStatusPress(pending.el, pending.x, pending.y);
      });
    },
    [applyStatusPress]
  );

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      scheduleStatus(e.currentTarget, e.clientX, e.clientY);
    },
    [scheduleStatus]
  );

  const onEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      scheduleStatus(e.currentTarget, e.clientX, e.clientY);
    },
    [scheduleStatus]
  );

  const onLeave = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--press", "0");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--sx", "0");
    el.style.setProperty("--sy", "0");
  }, []);

  const onDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--down", "1");
  }, []);

  const onUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--down", "0");
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { onMove, onEnter, onLeave, onDown, onUp };
}
