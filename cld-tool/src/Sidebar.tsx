import React from 'react';

interface SidebarProps {
  nodeId: string | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export default function Sidebar({ nodeId, position, onClose }: SidebarProps) {
  if (!nodeId || !position) return null;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x + 20,
    top: position.y,
    background: '#fff',
    border: '1px solid #ccc',
    padding: '8px',
    zIndex: 1000,
  };
  return (
    <div style={style}>
      <div className="flex justify-between mb-2">
        <strong>{nodeId}</strong>
        <button onClick={onClose}>x</button>
      </div>
      <ul className="list-disc ml-4">
        <li><a href="#" target="_blank" rel="noopener noreferrer">لینک نمونه</a></li>
      </ul>
    </div>
  );
}
