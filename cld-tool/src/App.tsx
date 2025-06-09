import { useState } from 'react'
import Graph from './Graph'
import Sidebar from './Sidebar'
import './App.css'
import { ElementDefinition } from 'cytoscape'

function App() {
  const elements: ElementDefinition[] = [
    { data: { id: 'a', label: 'A' }, position: { x: 50, y: 50 } },
    { data: { id: 'b', label: 'B' }, position: { x: 200, y: 80 } },
    { data: { id: 'ab', source: 'a', target: 'b' } }
  ];

  const [sidebarNode, setSidebarNode] = useState<string | null>(null);
  const [sidebarPos, setSidebarPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <Graph
        elements={elements}
        onNodeClick={(id, pos) => {
          setSidebarNode(id);
          setSidebarPos(pos);
        }}
      />
      <Sidebar nodeId={sidebarNode} position={sidebarPos} onClose={() => setSidebarNode(null)} />
    </div>
  );
}

export default App
