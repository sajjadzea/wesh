import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import causalData from "../../data/causal-power-imbalance.json";

const CausalGraph = () => {
  const cyRef = useRef(null);

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: [...causalData.nodes, ...causalData.edges],
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#007bff",
            width: 50,
            height: 50,
          },
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "line-color": "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
            "target-arrow-color": "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: { name: "cose" },
    });

    cy.on("tap", "node", (evt) => {
      const data = evt.target.data();
      alert(`${data.label}\n${data.description}\n${data.resources?.join(", ") || ""}`);
    });

    return () => cy.destroy();
  }, []);

  return <div ref={cyRef} style={{ width: "100%", height: "600px" }} />;
};

export default CausalGraph;
