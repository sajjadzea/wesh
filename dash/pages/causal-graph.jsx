import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
// import causalData from "../../data/causal-power-imbalance.json";

const CausalGraph = () => {
  const cyRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cy;
    fetch("/data/causal-power-imbalance.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.nodes || !data.edges) {
          throw new Error("Invalid data format");
        }
        cy = cytoscape({
          container: cyRef.current,
          elements: [...data.nodes, ...data.edges],
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
          const nodeData = evt.target.data();
          alert(`${nodeData.label}\n${nodeData.description}\n${nodeData.resources?.join(", ") || ""}`);
        });
      })
      .catch((err) => {
        console.error("Error loading graph data", err);
        setError("خطا در بارگذاری داده‌های نمودار");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[600px]">
      {loading && <div className="absolute inset-0 flex items-center justify-center">در حال بارگذاری...</div>}
      {error && <div className="absolute inset-0 flex items-center justify-center text-red-600">{error}</div>}
      <div ref={cyRef} className="w-full h-full" />
    </div>
  );
};

export default CausalGraph;
