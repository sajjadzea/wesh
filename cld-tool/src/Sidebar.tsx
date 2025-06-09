import React from 'react';

interface SidebarProps {
  node: any | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function Sidebar({ node, position, onClose, onSave }: SidebarProps) {
  if (!node || !position) return null;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x + 20,
    top: position.y,
    background: '#fff',
    border: '1px solid #ccc',
    padding: '8px',
    zIndex: 1000,
    width: 200,
  };
  return (
    <div style={style}>
      <div className="flex justify-between mb-2">
        <strong>{node.label}</strong>
        <button onClick={onClose}>x</button>
      </div>
      <div className="mb-2 text-sm">{node.description}</div>
      <div className="mb-2 text-sm">Impact: {node.impact}</div>
      {node.resources && (
        <a href={node.resources} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">resources</a>
      )}
      <div className="mt-2 text-right">
        <button onClick={() => onSave(node)} className="px-2 py-1 bg-teal-500 text-white text-xs rounded">Save</button>
      </div>
    </div>
  );
}
