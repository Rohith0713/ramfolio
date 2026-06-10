import { useRef, useEffect } from 'react';
import { GRAPH_PADDING, timeToX, X_LABELS } from '../../utils/animations';

interface TimelineScrubberProps {
  progress: number;
  onProgressChange: (progress: number) => void;
  width: number;
  height?: number;
}

export default function TimelineScrubber({
  progress,
  onProgressChange,
  width,
  height = 60,
}: TimelineScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Handle scrubber click/drag
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updateProgress(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      updateProgress(e);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const updateProgress = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, (x - GRAPH_PADDING.left) / (width - GRAPH_PADDING.left - GRAPH_PADDING.right)));
    onProgressChange(newProgress);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const playheadX = timeToX(0.05 + progress * 0.9, width);
  const currentTime = Math.floor(progress * 120); // Total duration in seconds
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#252525',
        borderBottom: '1px solid #333',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Time markers grid */}
      <svg
        width={width}
        height={height - 24}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Major time markers */}
        {X_LABELS.map((label, i) => {
          const x = timeToX((i + 1) / (X_LABELS.length + 1), width);
          return (
            <g key={`marker-${label}`}>
              {/* Tick mark */}
              <line
                x1={x}
                y1={height - 28}
                x2={x}
                y2={height - 20}
                stroke="#555"
                strokeWidth="1"
              />
              {/* Time label */}
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill="#888"
                fontSize="9"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight="500"
                letterSpacing="0.02em"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Subtle background grid */}
        <line
          x1={GRAPH_PADDING.left}
          y1={0}
          x2={GRAPH_PADDING.left}
          y2={height - 24}
          stroke="#333"
          strokeWidth="1"
        />
        <line
          x1={width - GRAPH_PADDING.right}
          y1={0}
          x2={width - GRAPH_PADDING.right}
          y2={height - 24}
          stroke="#333"
          strokeWidth="1"
        />
        <line
          x1={GRAPH_PADDING.left}
          y1={height - 24}
          x2={width - GRAPH_PADDING.right}
          y2={height - 24}
          stroke="#333"
          strokeWidth="1"
        />
      </svg>

      {/* Progress bar background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: height - 24,
          backgroundColor: 'rgba(255, 0, 255, 0.02)',
          pointerEvents: 'none',
        }}
      />

      {/* Progress fill */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: GRAPH_PADDING.left,
          width: `${(width - GRAPH_PADDING.left - GRAPH_PADDING.right) * progress}px`,
          height: height - 24,
          backgroundColor: 'rgba(255, 0, 255, 0.08)',
          transition: isDraggingRef.current ? 'none' : 'background-color 0.2s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Playhead line */}
      <div
        style={{
          position: 'absolute',
          left: `${playheadX}px`,
          top: 0,
          width: '2px',
          height: height - 24,
          backgroundColor: '#ff00ff',
          boxShadow: '0 0 8px rgba(255, 0, 255, 0.8)',
          pointerEvents: 'none',
          transition: isDraggingRef.current ? 'none' : 'left 0.1s ease',
        }}
      />

      {/* Playhead handle */}
      <div
        style={{
          position: 'absolute',
          left: `${playheadX - 6}px`,
          top: height - 22,
          width: '12px',
          height: '16px',
          backgroundColor: '#ff00ff',
          borderRadius: '2px',
          cursor: 'grab',
          boxShadow: '0 2px 8px rgba(255, 0, 255, 0.6), 0 0 12px rgba(255, 0, 255, 0.4)',
          pointerEvents: 'auto',
          transition: isDraggingRef.current ? 'none' : 'all 0.1s ease',
          zIndex: 10,
        }}
      />

      {/* Current time display */}
      <div
        style={{
          position: 'absolute',
          left: `${playheadX + 12}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 0, 255, 0.9)',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '9px',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 5,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
        }}
      >
        {timeString}
      </div>

      {/* Tooltip hint on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          color: '#666',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      >
        Drag to scrub • Click anywhere to seek
      </div>
    </div>
  );
}
