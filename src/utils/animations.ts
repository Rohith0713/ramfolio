/* ═══════════════════════════════════════════════════════
   GSAP ANIMATION PRESETS & SVG PATH GENERATORS
   Spline-Editor Style (DaVinci Resolve inspired)
   ═══════════════════════════════════════════════════════ */

export const ANIMATIONS = {
  fadeInUp: {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  },
  fadeInDown: {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  },
  fadeInLeft: {
    x: -60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  },
  fadeInRight: {
    x: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  },
  scaleIn: {
    scale: 0.85,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
  },
  stagger: {
    each: 0.12,
    ease: 'power2.out',
  },
  staggerFast: {
    each: 0.08,
    ease: 'power2.out',
  },
} as const;

/* ─── Spline Editor Constants ───────────────────────── */

export const Y_MIN = 1.4;
export const Y_MAX = 3.2;
export const Y_LABELS = [1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2];
export const X_LABELS = [
  '0:05', '0:10', '0:15', '0:20', '0:25',
  '1:00', '1:05', '1:10', '1:15', '1:20', '1:25', '2:00',
];

/* ─── Graph Curve Definitions ───────────────────────── */

export interface CurveConfig {
  id: string;
  color: string;
  width: number;
  opacity: number;
  label: string;
  /** Whether this is the primary "tracked" curve */
  primary?: boolean;
}

/** Spline editor curves matching DaVinci Resolve style */
export const GRAPH_CURVES: CurveConfig[] = [
  { id: 'flow1', color: '#00c8ff', width: 1.5, opacity: 0.12, label: 'Flow Alpha' },
  { id: 'flow2', color: '#c8c800', width: 1.5, opacity: 0.12, label: 'Flow Beta' },
];

/** Raw curve data: [normalizedX (0-1), value (Y_MIN..Y_MAX)] */
export type CurvePoint = { t: number; v: number };

export const CURVE_DATA: Record<string, CurvePoint[]> = {
  flow1: [
    { t: 0.00, v: 1.80 }, { t: 0.25, v: 1.95 }, { t: 0.50, v: 1.65 },
    { t: 0.75, v: 1.45 }, { t: 1.00, v: 1.40 },
  ],
  flow2: [
    { t: 0.00, v: 1.45 }, { t: 0.20, v: 1.55 }, { t: 0.40, v: 1.42 },
    { t: 0.60, v: 1.50 }, { t: 0.80, v: 1.40 }, { t: 1.00, v: 1.40 },
  ],
};

/* ─── Coordinate Transforms ─────────────────────────── */

export interface GraphPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const GRAPH_PADDING: GraphPadding = { top: 30, right: 20, bottom: 10, left: 45 };

export function valueToY(value: number, height: number, pad = GRAPH_PADDING) {
  const usable = height - pad.top - pad.bottom;
  const norm = (value - Y_MIN) / (Y_MAX - Y_MIN);
  return pad.top + usable * (1 - norm);
}

export function timeToX(t: number, width: number, pad = GRAPH_PADDING) {
  const usable = width - pad.left - pad.right;
  return pad.left + t * usable;
}

/* ─── SVG Path Generation ────────────────────────────── */

function smoothSplinePath(
  points: { x: number; y: number }[],
  tension = 0.4
): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;

    const cpx1 = prev.x + dx * tension;
    const cpy1 = prev.y;
    const cpx2 = prev.x + dx * (1 - tension);
    const cpy2 = curr.y;

    d += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Generate SVG path + pixel control points for a given curve ID.
 */
export function generateCurvePath(
  curveId: string,
  width: number,
  height: number
): { d: string; controlPoints: { x: number; y: number }[] } {
  const data = CURVE_DATA[curveId];
  if (!data) return { d: '', controlPoints: [] };

  const controlPoints = data.map((p) => ({
    x: timeToX(p.t, width),
    y: valueToY(p.v, height),
  }));

  return { d: smoothSplinePath(controlPoints), controlPoints };
}

/**
 * Generate faint background grid-aligned curves for ambience.
 */
export function generateBackgroundCurves(
  width: number,
  height: number,
  count = 6
): string[] {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const yBase = (height / (count + 1)) * (i + 1);
    const amp = height * 0.02 * (1 + Math.sin(i * 1.2));
    const points: { x: number; y: number }[] = [];
    const segments = 8;
    for (let j = 0; j <= segments; j++) {
      const x = (width / segments) * j;
      const y = yBase + Math.sin((j / segments) * Math.PI * 2 + i * 0.8) * amp;
      points.push({ x, y });
    }
    paths.push(smoothSplinePath(points, 0.4));
  }
  return paths;
}

/**
 * Legacy helper — generates the primary timeline path.
 */
export function generateTimelinePath(
  width: number,
  height: number
): string {
  return generateCurvePath('displacement', width, height).d;
}
