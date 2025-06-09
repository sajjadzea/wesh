import { useRef, useState } from 'react';
import Graph, { type GraphHandle } from './Graph';
import Sidebar from './Sidebar';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [sidebarNode, setSidebarNode] = useState<any | null>(null);
  const [sidebarPos, setSidebarPos] = useState<{ x: number; y: number } | null>(null);
  const graphRef = useRef<GraphHandle>(null);

  const exportJson = () => {
    const json = graphRef.current?.exportJson() ?? '{}';
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      graphRef.current?.importJson(reader.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={exportJson} className="px-2 py-1 bg-teal-500 text-white text-sm rounded">Export</button>
        <label className="px-2 py-1 bg-teal-500 text-white text-sm rounded cursor-pointer">
          Import
          <input type="file" accept="application/json" onChange={importJson} className="hidden" />
        </label>
      </div>
      <Graph
        ref={graphRef}
        search={search}
        onNodeClick={(data, pos) => {
          setSidebarNode(data);
          setSidebarPos(pos);
        }}
      />
      <Sidebar
        node={sidebarNode}
        position={sidebarPos}
        onClose={() => setSidebarNode(null)}
        onSave={data => graphRef.current?.updateNode(data)}
      />
    </div>
  );
}

export default App;
