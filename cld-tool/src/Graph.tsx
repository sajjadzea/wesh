import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape, { ElementDefinition } from 'cytoscape';

interface GraphProps {
  elements: ElementDefinition[];
  onNodeClick?: (id: string, position: {x: number, y: number}) => void;
}

export default function Graph({ elements, onNodeClick }: GraphProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout({ name: 'cose' }).run();
    cy.userPanningEnabled(true);
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      if (onNodeClick) onNodeClick(node.id(), node.renderedPosition());
    });
  }, [onNodeClick]);

  return (
    <CytoscapeComponent
      elements={elements}
      cy={(cy) => (cyRef.current = cy)}
      style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
    />
  );
}
