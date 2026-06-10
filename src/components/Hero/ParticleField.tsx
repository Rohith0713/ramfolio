import { useRef, useEffect, useMemo } from 'react';
import { gsap } from '../../hooks/useGSAP';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

/**
 * Animated SVG particle field that creates a subtle "network topology"
 * effect behind the hero content. Renders floating nodes with connecting lines.
 */
export default function ParticleField() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  const NODE_COUNT = 35;
  const CONNECTION_DISTANCE = 180;

  // Generate initial nodes
  useMemo(() => {
    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        radius: 1.5 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.4,
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Entrance animation
    gsap.from(svg, {
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
      delay: 0.5,
    });

    // Animation loop
    const circleEls = svg.querySelectorAll('circle');
    const lineEls = svg.querySelectorAll('line');

    const tick = () => {
      const nodes = nodesRef.current;

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < -5) node.x = 105;
        if (node.x > 105) node.x = -5;
        if (node.y < -5) node.y = 105;
        if (node.y > 105) node.y = -5;
      });

      // Update circle positions
      circleEls.forEach((circle, i) => {
        if (i >= nodes.length) return;
        circle.setAttribute('cx', `${nodes[i].x}%`);
        circle.setAttribute('cy', `${nodes[i].y}%`);
      });

      // Update connections
      let lineIdx = 0;
      for (let i = 0; i < nodes.length && lineIdx < lineEls.length; i++) {
        for (let j = i + 1; j < nodes.length && lineIdx < lineEls.length; j++) {
          const dx = (nodes[i].x - nodes[j].x);
          const dy = (nodes[i].y - nodes[j].y);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE / 10) {
            const opacity = (1 - dist / (CONNECTION_DISTANCE / 10)) * 0.15;
            const line = lineEls[lineIdx];
            line.setAttribute('x1', `${nodes[i].x}%`);
            line.setAttribute('y1', `${nodes[i].y}%`);
            line.setAttribute('x2', `${nodes[j].x}%`);
            line.setAttribute('y2', `${nodes[j].y}%`);
            line.setAttribute('opacity', `${opacity}`);
            lineIdx++;
          }
        }
      }
      // Hide unused lines
      for (let k = lineIdx; k < lineEls.length; k++) {
        lineEls[k].setAttribute('opacity', '0');
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const nodes = nodesRef.current;
  const maxLines = 80;

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Connection lines */}
      {Array.from({ length: maxLines }).map((_, i) => (
        <line
          key={`line-${i}`}
          stroke="#8b5cf6"
          strokeWidth="0.5"
          opacity="0"
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={node.radius}
          fill="#a78bfa"
          opacity={node.opacity}
        />
      ))}
    </svg>
  );
}
