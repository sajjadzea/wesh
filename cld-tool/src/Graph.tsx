import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { ElementDefinition } from 'cytoscape';

interface GraphProps {
  elements: ElementDefinition[];
  onNodeClick?: (id: string, position: {x: number, y: number}) => void;
  onCyReady?: (cy: cytoscape.Core) => void;
}

export default function Graph({ elements, onNodeClick, onCyReady }: GraphProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.layout({ name: 'cose' }).run();
    cy.userPanningEnabled(true);
    cy.autoungrabify(false);

    cy.style()
      .selector('node')
      .style({
        label: 'data(label)'
      })
      .selector('edge')
      .style({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'line-color': (ele) => (ele.data('sign') === 'negative' ? '#dc2626' : '#16a34a'),
        'target-arrow-color': (ele) => (ele.data('sign') === 'negative' ? '#dc2626' : '#16a34a'),
      });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      if (onNodeClick) onNodeClick(node.id(), node.renderedPosition());
    });

    if (onCyReady) onCyReady(cy);
  }, [onNodeClick, onCyReady]);

  return (
    <CytoscapeComponent
      elements={elements}
      cy={(cy) => {
        cyRef.current = cy;
        if (onCyReady) onCyReady(cy);
      }}
      style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
    />
  );
}
