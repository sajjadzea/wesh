import React, { useState, useEffect } from 'react';
import cytoscape from 'cytoscape';

interface SidebarProps {
  nodeId: string | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  cy: cytoscape.Core | null;
}

export default function Sidebar({ nodeId, position, onClose, cy }: SidebarProps) {
  if (!nodeId || !position) return null;
  const node = cy?.getElementById(nodeId);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [resources, setResources] = useState('');

  useEffect(() => {
    if (!node) return;
    setLabel(node.data('label') || '');
    setDescription(node.data('description') || '');
    setImpact(node.data('impact') || '');
    setResources((node.data('resources') || []).join('\n'));
  }, [nodeId, node]);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <strong>{nodeId}</strong>
        <button onClick={onClose}>x</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label>
          برچسب
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          توضیحات
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          سطح تأثیر
          <input value={impact} onChange={(e) => setImpact(e.target.value)} />
        </label>
        <label>
          منابع (هر خط یک لینک)
          <textarea value={resources} onChange={(e) => setResources(e.target.value)} />
        </label>
        <button
          onClick={() => {
            if (!node) return;
            node.data({
              label,
              description,
              impact,
              resources: resources.split('\n').filter(Boolean),
            });
            onClose();
          }}
        >ذخیره</button>
      </div>
    </div>
  );
}
