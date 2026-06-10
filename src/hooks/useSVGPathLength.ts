import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook that measures an SVG path's total length and provides
 * a function to get a point at any percentage along the path.
 */
export function useSVGPathLength(
  pathRef: React.RefObject<SVGPathElement | null>
) {
  const [totalLength, setTotalLength] = useState(0);
  const rafRef = useRef<number>(0);

  const measure = useCallback(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setTotalLength(len);
    }
  }, [pathRef]);

  useEffect(() => {
    measure();

    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  /**
   * Get the {x, y} point at a given fraction (0–1) along the path.
   */
  const getPointAtFraction = useCallback(
    (fraction: number): DOMPoint | null => {
      if (!pathRef.current || totalLength === 0) return null;
      const clampedFraction = Math.max(0, Math.min(1, fraction));
      return pathRef.current.getPointAtLength(clampedFraction * totalLength);
    },
    [pathRef, totalLength]
  );

  return { totalLength, getPointAtFraction, measure };
}
