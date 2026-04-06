"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { subscribeNavigationIntent } from "@/lib/appLoadingBus";

type Ctx = {
  /** Wrap async work so the bar stays until finished (orders, forms, …). */
  runWithLoading: <T>(fn: () => Promise<T>) => Promise<T>;
  startLoading: () => void;
  stopLoading: () => void;
};

const AppLoadingContext = createContext<Ctx | null>(null);

export function useAppLoading(): Ctx {
  const ctx = useContext(AppLoadingContext);
  if (!ctx) throw new Error("useAppLoading must be used within AppLoadingProvider");
  return ctx;
}

function AppLoadingProviderInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [routeLoading, setRouteLoading] = useState(false);
  const [pulseLoading, setPulseLoading] = useState(false);
  const [manualCount, setManualCount] = useState(0);
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLoading = useCallback(() => {
    setManualCount((c) => c + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setManualCount((c) => Math.max(0, c - 1));
  }, []);

  const runWithLoading = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const clearPulse = useCallback(() => {
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
      pulseTimerRef.current = null;
    }
    setPulseLoading(false);
  }, []);

  // Client navigation finished (pathname segment changed)
  useEffect(() => {
    clearPulse();
    setRouteLoading(false);
  }, [pathname, clearPulse]);

  // Programmatic navigation (router.push / replace)
  useEffect(() => {
    return subscribeNavigationIntent(() => {
      clearPulse();
      setRouteLoading(true);
    });
  }, [clearPulse]);

  // Pointer: internal links + generic controls get feedback
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-no-loading]")) return;

      const el = target.closest(
        [
          "a[href]",
          "button",
          "[role='button']",
          "[role='tab']",
          "[role='menuitem']",
          "input[type='submit']",
          "input[type='image']",
          "summary",
          "[data-loading-click]",
        ].join(", "),
      );
      if (!el) return;

      if (el instanceof HTMLButtonElement && el.disabled) return;
      if (el instanceof HTMLInputElement && el.disabled) return;

      const a = el instanceof HTMLAnchorElement ? el : el.closest("a[href]");
      if (a instanceof HTMLAnchorElement && a.href) {
        if (a.download || a.target === "_blank") return;
        const hrefAttr = a.getAttribute("href");
        if (hrefAttr?.startsWith("#")) return;
        try {
          const u = new URL(a.href, window.location.origin);
          if (u.origin !== window.location.origin) return;
          const same =
            u.pathname === window.location.pathname &&
            u.search === window.location.search;
          if (same) return;
          clearPulse();
          setRouteLoading(true);
          return;
        } catch {
          return;
        }
      }

      // Buttons / non-nav controls: short pulse so clicks feel acknowledged
      clearPulse();
      setPulseLoading(true);
      pulseTimerRef.current = setTimeout(() => {
        pulseTimerRef.current = null;
        setPulseLoading(false);
      }, 420);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [clearPulse]);

  /** Top bar + centered overlay: all tracked activity site-wide (nav, clicks, runWithLoading). */
  const showBar = routeLoading || pulseLoading || manualCount > 0;
  const showCenterOverlay = showBar;

  const ctxValue = useMemo(
    () => ({ runWithLoading, startLoading, stopLoading }),
    [runWithLoading, startLoading, stopLoading],
  );

  return (
    <AppLoadingContext.Provider value={ctxValue}>
      <div
        className="p4u-global-loading-bar"
        aria-hidden={!showBar}
        data-active={showBar ? "true" : "false"}
      />
      <div
        className="p4u-global-loading-overlay"
        data-active={showCenterOverlay ? "true" : "false"}
        aria-hidden={!showCenterOverlay}
        role="status"
        aria-live="polite"
        aria-busy={showCenterOverlay}
      >
        {showCenterOverlay ? (
          <div className="p4u-global-loading-spinner" aria-label="Loading" />
        ) : null}
      </div>
      {children}
    </AppLoadingContext.Provider>
  );
}

export function AppLoadingProvider({ children }: { children: ReactNode }) {
  return <AppLoadingProviderInner>{children}</AppLoadingProviderInner>;
}
