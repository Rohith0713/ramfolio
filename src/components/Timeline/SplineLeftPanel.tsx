import { useState } from 'react';

interface TreeNode {
  name: string;
  checked: boolean;
  expanded?: boolean;
  color?: string;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'Transform1',
    checked: true,
    expanded: true,
    children: [
      {
        name: 'Center(Path1)',
        checked: true,
        expanded: true,
        children: [
          { name: 'Displacement', checked: true, color: '#ff00ff' },
        ],
      },
    ],
  },
  {
    name: 'Merge1',
    checked: false,
    expanded: false,
    children: [],
  },
  {
    name: 'Size',
    checked: true,
    expanded: false,
    color: '#00c8ff',
    children: [],
  },
  {
    name: 'BSpline1',
    checked: false,
    expanded: true,
    children: [
      { name: 'Polyline', checked: false, color: '#c8c800' },
    ],
  },
  {
    name: 'PlanarTransform1',
    checked: false,
    expanded: false,
    children: [],
  },
  {
    name: 'PlanarTracker1',
    checked: false,
    expanded: false,
    children: [],
  },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false);
  const [checked, setChecked] = useState(node.checked);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        style={{
          paddingLeft: `${8 + depth * 16}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '24px',
          cursor: 'default',
          userSelect: 'none',
          fontSize: '12px',
          color: checked ? '#d0d0d0' : '#707070',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          lineHeight: '24px',
        }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand arrow */}
        {hasChildren ? (
          <span
            style={{
              width: '14px',
              fontSize: '9px',
              color: '#888',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              cursor: 'pointer',
            }}
          >
            ▶
          </span>
        ) : (
          <span style={{ width: '14px' }} />
        )}

        {/* Checkbox */}
        <span
          onClick={(e) => {
            e.stopPropagation();
            setChecked(!checked);
          }}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            border: checked ? '2px solid #4a8fd4' : '1.5px solid #555',
            backgroundColor: checked ? '#4a8fd4' : 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {checked && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
          }}
        >
          {node.name}
        </span>

        {/* Color dot */}
        {node.color && (
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: node.color,
              marginRight: '8px',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, i) => (
            <TreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SplineLeftPanel() {
  return (
    <div
      style={{
        width: '200px',
        minWidth: '200px',
        backgroundColor: '#2a2a2a',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Tree items */}
      <div style={{ padding: '4px 0', flex: 1, overflowY: 'auto' }}>
        {TREE_DATA.map((node, i) => (
          <TreeItem key={`${node.name}-${i}`} node={node} />
        ))}
      </div>
    </div>
  );
}
