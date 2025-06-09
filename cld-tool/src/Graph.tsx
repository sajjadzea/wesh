import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import cytoscape from 'cytoscape';
import type { Core } from 'cytoscape';
import data from './data/sample.json';

export interface GraphHandle {
  exportJson(): string;
  importJson(json: string): void;
  updateNode(nodeData: any): void;
}

interface GraphProps {
  search: string;
  onNodeClick?: (data: any, position: { x: number; y: number }) => void;
}

const Graph = forwardRef<GraphHandle, GraphProps>(function Graph({ search, onNodeClick }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  useImperativeHandle(ref, () => ({
    exportJson() {
      return JSON.stringify(cyRef.current?.json() ?? {});
    },
    importJson(json: string) {
      const parsed = JSON.parse(json);
      cyRef.current?.json(parsed);
    },
    updateNode(nodeData: any) {
      const node = cyRef.current?.$id(nodeData.id);
      if (node) node.data({ ...node.data(), ...nodeData });
    }
  }), []);

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current!,
      elements: (data as any).elements,
      layout: { name: 'cose' },
      style: [
        { selector: 'node', style: { label: 'data(label)' } },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'line-color': 'data(color)'
          }
        },
        { selector: '.highlight', style: { 'background-color': 'yellow' } }
      ],
      userPanningEnabled: true,
      wheelSensitivity: 0.2
    });
    cyRef.current = cy;
    cy.on('tap', 'node', evt => {
      if (onNodeClick) onNodeClick(evt.target.data(), evt.position);
    });
    return () => {
      cy.destroy();
    };
  }, [onNodeClick]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass('highlight');
    if (search) {
      cy.nodes()
        .filter(n => n.data('label').toLowerCase().includes(search.toLowerCase()))
        .addClass('highlight');
    }
  }, [search]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px', border: '1px solid #ccc' }} />;
});

export default Graph;
