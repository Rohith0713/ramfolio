import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins globally once
gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

/**
 * Custom hook that creates a GSAP context scoped to a container ref.
 * Automatically cleans up all GSAP animations and ScrollTriggers on unmount.
 */
export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
  scope?: React.RefObject<HTMLElement | null>
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx!);
    }, scope?.current || undefined);

    ctxRef.current = ctx;

    return () => {
      ctx.revert(); // Clean up all GSAP animations created in this context
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}

/**
 * Utility: Creates a ScrollTrigger-based animation on a target.
 */
export function useScrollReveal(
  triggerRef: React.RefObject<HTMLElement | null>,
  animationVars: gsap.TweenVars,
  scrollTriggerVars?: ScrollTrigger.Vars
) {
  useEffect(() => {
    if (!triggerRef.current) return;

    const tween = gsap.from(triggerRef.current, {
      ...animationVars,
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
        ...scrollTriggerVars,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Re-export gsap and ScrollTrigger for convenience
 */
export { gsap, ScrollTrigger };

/**
 * Hook to handle responsive resize with debounce
 */
export function useResizeObserver(
  ref: React.RefObject<HTMLElement | null>,
  callback: (entry: ResizeObserverEntry) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const stableCallback = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      callbackRef.current(entry);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(stableCallback);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, stableCallback]);
}
