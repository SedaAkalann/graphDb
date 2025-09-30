import cytoscape from "cytoscape";
import React, { useEffect, useRef } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import type { CytoData } from "../../types/types";



interface GraphViewProps {
  data: CytoData;
}

export const GraphView: React.FC<GraphViewProps> = ({ data }) => {
  const { isDarkMode } = useDarkMode();
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    if (!data) return;

    // Mevcut cytoscape instance'ını temizle
    if (cyRef.current) {
      cyRef.current.removeAllListeners();
      cyRef.current.destroy();
      cyRef.current = null;
    }

    // Container'ın hazır olduğundan emin ol
    const container = document.getElementById("cyto-canvas");
    if (!container) return;

    // Cytoscape'i başlat
    const initializeCytoscape = () => {
      try {
        setIsInitializing(true);
        cyRef.current = cytoscape({
          container: container,
          elements: data.elements,
          userPanningEnabled: true,
          userZoomingEnabled: true,
          boxSelectionEnabled: false,
          style: [
            {
              selector: "node",
              style: {
                width: 90,
                height: 90,
                "background-color": "data(backgroundColor)",
                "background-opacity": 0.9,
                "border-width": 4,
                "border-color": isDarkMode ? "#6366f1" : "#4f46e5",
                "border-opacity": 0.9,
                "shape": "ellipse",
                label: "data(label)",
                "font-size": "14px",
                "font-weight": 700,
                "font-family": "Inter, -apple-system, system-ui, sans-serif",
                color: "#ffffff",
                "text-valign": "center",
                "text-halign": "center",
                "text-outline-width": 3,
                "text-outline-color": isDarkMode ? "#1e293b" : "#334155",
                "text-outline-opacity": 0.95,
                "overlay-padding": "16px",
                "z-index": 10,
                "transition-property": "all",
                "transition-duration": 250,
                opacity: 0.95,
              },
            },
            {
              selector: "node:hover",
              style: {
                width: 105,
                height: 105,
                "border-width": 5,
                "border-color": isDarkMode ? "#8b5cf6" : "#7c3aed",
                "background-opacity": 1,
                opacity: 1,
                "z-index": 25,
                "transition-duration": 200,
              },
            },
            {
              selector: "node:selected",
              style: {
                "background-color": isDarkMode ? "#8b5cf6" : "#6366f1",
                "border-color": isDarkMode ? "#c4b5fd" : "#a5b4fc",
                "text-outline-color": isDarkMode ? "#8b5cf6" : "#6366f1",
                width: 110,
                height: 110,
                "border-width": 6,
                "z-index": 30,
                "overlay-color": isDarkMode ? "#8b5cf6" : "#6366f1",
                "overlay-opacity": 0.2,
              },
            },
            {
              selector: "edge",
              style: {
                width: 4,
                "line-color": isDarkMode ? "#6b7280" : "#9ca3af",
                "target-arrow-color": isDarkMode ? "#6b7280" : "#9ca3af",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "control-point-step-size": 80,
                label: "data(label)",
                "font-size": "13px",
                "font-weight": 600,
                "font-family": "Inter, -apple-system, system-ui, sans-serif",
                "text-background-color": isDarkMode ? "rgba(17, 24, 39, 0.95)" : "rgba(248, 250, 252, 0.95)",
                "text-background-opacity": 1,
                "text-background-padding": "6px",
                "text-background-shape": "roundrectangle",
                "text-rotation": "autorotate",
                color: isDarkMode ? "#f3f4f6" : "#374151",
                "text-border-width": 1,
                "text-border-color": isDarkMode ? "rgba(55, 65, 81, 0.6)" : "rgba(203, 213, 225, 0.6)",
                "text-border-opacity": 0.8,
                opacity: 0.85,
                "transition-property": "all",
                "transition-duration": 250,
                "line-style": "solid",
                "line-cap": "round",
              },
            },
            {
              selector: "edge:selected",
              style: {
                "line-color": isDarkMode ? "#8b5cf6" : "#6366f1",
                "target-arrow-color": isDarkMode ? "#8b5cf6" : "#6366f1",
                "text-background-color": isDarkMode ? "rgba(139, 92, 246, 0.2)" : "rgba(99, 102, 241, 0.2)",
                "font-weight": "bold",
                width: 6,
                opacity: 1,
                "z-index": 20,
              },
            },
            {
              selector: "edge:hover",
              style: {
                width: 5,
                opacity: 1,
                "line-color": isDarkMode ? "#a78bfa" : "#4f46e5",
                "target-arrow-color": isDarkMode ? "#a78bfa" : "#4f46e5",
                "text-background-opacity": 1,
                "transition-duration": 150,
              },
            },
          ],
          layout: {
            name: "concentric",
            randomize: true,
            animate: true,
            animationDuration: 1500,
            animationEasing: "ease-out",
            fit: true,
            padding: 60,
            nodeDimensionsIncludeLabels: true,
            idealEdgeLength: 200,
            nodeOverlap: 20,
            refresh: 30,
            componentSpacing: 200,
            nodeRepulsion: 800000,
            edgeElasticity: 300,
            nestingFactor: 12,
            gravity: 25,
            numIter: 1500,
            initialTemp: 400,
            coolingFactor: 0.90,
            minTemp: 1.0
          },
        });

        // Layout tamamlandığında loading'i kapat
        cyRef.current.on('layoutstop', () => {
          setTimeout(() => setIsInitializing(false), 500);
        });

      } catch (error) {
        console.error("Cytoscape initialization error:", error);
        setIsInitializing(false);
      }
    };

    // Kısa bir delay ile cytoscape'i başlat
    const timer = setTimeout(() => {
      initializeCytoscape();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cyRef.current) {
        cyRef.current.removeAllListeners();
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [data, isDarkMode]);



  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/50">

      {/* Modern Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: isDarkMode
            ? `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.3) 2px, transparent 0),
               radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.2) 1px, transparent 0)`
            : `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.15) 2px, transparent 0),
               radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.1) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Enhanced Loading Screen */}
      {isInitializing && (
        <div className="absolute inset-0 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 p-8 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 shadow-2xl">

            {/* Advanced Loading Animation */}
            <div className="relative w-24 h-24">
              {/* Outer ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
              {/* Middle ring */}
              <div className="absolute inset-2 border-4 border-transparent border-r-purple-500 dark:border-r-purple-400 rounded-full animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              {/* Inner ring */}
              <div className="absolute inset-4 border-4 border-transparent border-l-indigo-500 dark:border-l-indigo-400 rounded-full animate-spin"
                style={{ animationDuration: '2s' }}></div>
              {/* Center dot */}
              <div className="absolute inset-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 rounded-full animate-pulse shadow-lg"></div>

              {/* Floating particles */}
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 right-1/4 w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full animate-ping"
                style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/4 -left-2 w-1 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-ping"
                style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Enhanced Text */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Graph Oluşturuluyor
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-3">
                <span>Düğümler ve bağlantılar yerleştiriliyor</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-80 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
        </div>
      )}

      {/* Graph Canvas with Enhanced Styling */}
      <div
        id="cyto-canvas"
        className="w-full h-full rounded-2xl"
        style={{
          background: isDarkMode
            ? `linear-gradient(135deg, 
                rgba(17, 24, 39, 0.95) 0%, 
                rgba(31, 41, 55, 0.9) 25%, 
                rgba(55, 65, 81, 0.85) 50%, 
                rgba(31, 41, 55, 0.9) 75%, 
                rgba(17, 24, 39, 0.95) 100%)`
            : `linear-gradient(135deg, 
                rgba(248, 250, 252, 0.95) 0%, 
                rgba(241, 245, 249, 0.9) 25%, 
                rgba(226, 232, 240, 0.85) 50%, 
                rgba(241, 245, 249, 0.9) 75%, 
                rgba(248, 250, 252, 0.95) 100%)`,
          outline: "none",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full dark:from-blue-400/20"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full dark:from-purple-400/20"></div>
    </div>
  );
};
