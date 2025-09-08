import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

export const ResultsViewer: React.FC<{ data: any; onBack: () => void }> = ({ data, onBack }) => {
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!data) return;
    if (cyRef.current) cyRef.current.destroy();
    cyRef.current = cytoscape({
      container: document.getElementById("cyto-canvas"),
      elements: data.elements,
      style: [
        {
          selector: "node",
          style: {
            width: 28,
            height: 28,
            "background-color": "#2563eb",
            "border-width": 3,
            "border-color": "#fff",
            "border-opacity": 1,
            "shape": "ellipse",
            label: "data(label)",
            "font-size": "7px",
            // "font-weight": "600",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "text-outline-width": 2,
            "text-outline-color": "#2563eb",
            "overlay-padding": "4px",
            "z-index": 10,
            "transition-property": "background-color, border-color",
            // "transition-duration": "0.2s",
          },
        },
        {
          selector: "node:selected",
          style: {
            "background-color": "#f59e42",
            "border-color": "#f59e42",
            "text-outline-color": "#f59e42",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#b6b6b6",
            "target-arrow-color": "#b6b6b6",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "9px",
            "text-background-color": "#fff",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-rotation": "autorotate",
            color: "#444",
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#2563eb",
            "target-arrow-color": "#2563eb",
            "font-weight": "bold",
          },
        },
      ],
      layout: { name: "cose", padding: 30 },
    });
    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [data]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <button
        className="absolute top-6 right-8 px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition z-10 shadow"
        onClick={onBack}
      >
        Sorguya Geri Dön
      </button>
      <div
        id="cyto-canvas"
        style={{
          width: "100vw",
          height: "100vh",
          // background: "#f8fafc",
          // borderRadius: 18,
          // boxShadow: "0 2px 16px 0 rgba(30,41,59,0.10)",
          // border: "1.5px solid #e0e7ef",
          marginTop: 32,
        }}
      />
    </div>
  );
};