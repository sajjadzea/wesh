var CausalGraphModule = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dash/pages/causal-graph.js
  var causal_graph_exports = {};
  __export(causal_graph_exports, {
    default: () => causal_graph_default
  });
  var import_react = __toESM(__require("react"));
  var import_cytoscape = __toESM(__require("cytoscape"));
  var CausalGraph = () => {
    const cyRef = (0, import_react.useRef)(null);
    const [loading, setLoading] = (0, import_react.useState)(true);
    const [error, setError] = (0, import_react.useState)(null);
    (0, import_react.useEffect)(() => {
      let cy;
      fetch("/data/causal-power-imbalance.json").then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      }).then((data) => {
        console.log("Graph data:", data);
        console.log("Nodes:", data.nodes);
        console.log("Edges:", data.edges);
        if (!data.nodes || !data.edges) {
          throw new Error("Invalid data format");
        }
        cy = (0, import_cytoscape.default)({
          container: cyRef.current,
          elements: [...data.nodes, ...data.edges],
          style: [
            {
              selector: "node",
              style: {
                label: "data(label)",
                "background-color": "#007bff",
                width: 50,
                height: 50
              }
            },
            {
              selector: "edge",
              style: {
                width: 4,
                "line-color": "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
                "target-arrow-color": "mapData(type, 'positive', 'green', 'negative', 'red', 'neutral', 'gray')",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier"
              }
            }
          ],
          layout: { name: "cose" }
        });
        cy.on("tap", "node", (evt) => {
          const nodeData = evt.target.data();
          alert(`${nodeData.label}
${nodeData.description}
${nodeData.resources?.join(", ") || ""}`);
        });
      }).catch((err) => {
        console.error("Error loading graph data", err);
        setError("\u062E\u0637\u0627 \u062F\u0631 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0646\u0645\u0648\u062F\u0627\u0631");
      }).finally(() => {
        setLoading(false);
      });
      return () => {
        if (cy) {
          cy.destroy();
        }
      };
    }, []);
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "relative w-full h-[600px]" }, loading && /* @__PURE__ */ import_react.default.createElement("div", { className: "absolute inset-0 flex items-center justify-center" }, "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC..."), error && /* @__PURE__ */ import_react.default.createElement("div", { className: "absolute inset-0 flex items-center justify-center text-red-600" }, error), /* @__PURE__ */ import_react.default.createElement("div", { ref: cyRef, className: "w-full h-full" }));
  };
  var causal_graph_default = CausalGraph;
  return __toCommonJS(causal_graph_exports);
})();
