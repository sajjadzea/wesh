import { useState, useRef } from 'react'
import Graph from './Graph'
import Sidebar from './Sidebar'
import './App.css'
import cytoscape, { ElementDefinition } from 'cytoscape'

function App() {
  const [elements, setElements] = useState<ElementDefinition[]>([
    { data: { id: 'a', label: 'A', description: '', impact: '', resources: [] }, position: { x: 50, y: 50 } },
    { data: { id: 'b', label: 'B', description: '', impact: '', resources: [] }, position: { x: 200, y: 80 } },
    { data: { id: 'ab', source: 'a', target: 'b', sign: 'positive' } }
  ]);

  const cyRef = useRef<cytoscape.Core | null>(null);

  const [sidebarNode, setSidebarNode] = useState<string | null>(null);
  const [sidebarPos, setSidebarPos] = useState<{ x: number; y: number } | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            const cy = cyRef.current;
            if (cy) {
              cy.nodes().forEach((n) => {
                const match = n.data('label').toLowerCase().includes(val.toLowerCase());
                n.style('background-color', match ? '#fde047' : '#ccc');
              });
            }
          }}
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={() => {
            const cy = cyRef.current;
            if (!cy) return;
            const blob = new Blob([JSON.stringify(cy.json())], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cld.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ marginRight: '10px' }}
        >دانلود JSON</button>
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(reader.result as string);
                const cy = cyRef.current;
                if (cy) cy.json(data);
              } catch {}
            };
            reader.readAsText(file);
          }}
        />
      </div>
      <Graph
        elements={elements}
        onNodeClick={(id, pos) => {
          setSidebarNode(id);
          setSidebarPos(pos);
        }}
        onCyReady={(cy) => {
          cyRef.current = cy;
        }}
      />
      <Sidebar
        nodeId={sidebarNode}
        position={sidebarPos}
        onClose={() => setSidebarNode(null)}
        cy={cyRef.current}
      />
    </div>
  );
}

export default App
