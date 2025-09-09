import cytoscape from "cytoscape";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef } from "react";
import type { CytoData } from "../../types/types";
import "./ResultsViewer.css";

export const ResultsViewer: React.FC<{ data: CytoData | null; onBack: () => void }> = ({ data, onBack }) => {
  const cyRef = useRef<cytoscape.Core | null>(null);

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

    // Kısa bir delay ile cytoscape'i başlat
    const timer = setTimeout(() => {
      try {
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
                width: 40,
                height: 40,
                "background-color": "data(backgroundColor)",
                "border-width": 3,
                "border-color": "#fff",
                "border-opacity": 1,
                "shape": "ellipse",
                label: "data(label)",
                "font-size": "10px",
                "font-weight": 600,
                color: "#fff",
                "text-valign": "center",
                "text-halign": "center",
                "text-outline-width": 2,
                "text-outline-color": "data(backgroundColor)",
                "overlay-padding": "6px",
                "z-index": 10,
                "transition-property": "background-color, border-color, width, height",
                "transition-duration": 150,
              },
            },
            {
              selector: "node:hover",
              style: {
                width: 45,
                height: 45,
                "border-width": 4,
              },
            },
            {
              selector: "node:selected",
              style: {
                "background-color": "#f59e42",
                "border-color": "#f59e42",
                "text-outline-color": "#f59e42",
                width: 50,
                height: 50,
              },
            },
            {
              selector: "edge",
              style: {
                width: 3,
                "line-color": "#64748b",
                "target-arrow-color": "#64748b",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                label: "data(label)",
                "font-size": "11px",
                "font-weight": 500,
                "text-background-color": "#fff",
                "text-background-opacity": 0.9,
                "text-background-padding": "3px",
                "text-rotation": "autorotate",
                color: "#475569",
              },
            },
            {
              selector: "edge:selected",
              style: {
                "line-color": "#2563eb",
                "target-arrow-color": "#2563eb",
                "font-weight": "bold",
                width: 4,
              },
            },
          ],
          layout: {
            name: "cose",
            padding: 50,
            animate: true,
            animationDuration: 800,
            animationEasing: "ease-out",
            nodeRepulsion: 4000,
            idealEdgeLength: 80,
            edgeElasticity: 100,
            nestingFactor: 1.1,
            gravity: 40,
            numIter: 800,
            initialTemp: 800,
            coolingFactor: 0.95,
            minTemp: 1.0,
            randomize: false,
            componentSpacing: 100,
            nodeOverlap: 20,
            refresh: 20,
            fit: true,
            boundingBox: undefined,
            nodeDimensionsIncludeLabels: false
          },
        });

        // Tooltip event'lerini ekle
        setupTooltipEvents();

      } catch (error) {
        console.error("Cytoscape initialization error:", error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cyRef.current) {
        cyRef.current.removeAllListeners();
        cyRef.current.destroy();
        cyRef.current = null;
      }
      // Tooltip'leri temizle
      const existingTooltip = document.getElementById("cyto-tooltip");
      if (existingTooltip) {
        existingTooltip.remove();
      }
    };
  }, [data]);

  const setupTooltipEvents = () => {
    if (!cyRef.current) return;

    let tooltipTimer: NodeJS.Timeout | null = null;

    cyRef.current.on("mouseover", "node", (event) => {
      // Önceki tooltip timer'ını temizle
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
      }

      tooltipTimer = setTimeout(() => {
        const node = event.target;
        const nodeData = node.data();

        // Mevcut tooltip'i kaldır
        const existingTooltip = document.getElementById("cyto-tooltip");
        if (existingTooltip) {
          existingTooltip.remove();
        }

        // Yeni tooltip oluştur
        const tooltip = document.createElement("div");
        tooltip.id = "cyto-tooltip";
        tooltip.className = "cyto-tooltip";

        // Modern card-like tooltip styling
        tooltip.style.cssText = `
          position: fixed;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          z-index: 9999;
          pointer-events: none;
          max-width: 280px;
          line-height: 1.5;
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // Tooltip içeriği - daha güzel formatting
        const properties = nodeData.properties || 'Özellik bilgisi yok';
        const formattedProperties = properties
          .split('\\n')
          .map((line: string) => {
            const [key, value] = line.split(':');
            if (key && value) {
              return `<div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span style="color: #64748b; font-weight: 500;">${key.trim()}:</span>
                <span style="color: #1e293b; font-weight: 600; margin-left: 12px;">${value.trim()}</span>
              </div>`;
            }
            return `<div style="margin: 4px 0; color: #64748b;">${line}</div>`;
          })
          .join('');

        tooltip.innerHTML = `
          <div style="
            display: flex; 
            align-items: center; 
            gap: 8px; 
            margin-bottom: 12px; 
            padding-bottom: 8px; 
            border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          ">
            <div style="
              width: 12px; 
              height: 12px; 
              border-radius: 50%; 
              background: ${nodeData.backgroundColor || '#64748b'};
              flex-shrink: 0;
            "></div>
            <div style="
              font-weight: 700; 
              color: #1e293b; 
              font-size: 14px;
            ">${nodeData.label}</div>
          </div>
          <div style="
            font-size: 12px;
            color: #64748b;
          ">
            ${formattedProperties}
          </div>
        `;

        document.body.appendChild(tooltip);

        // Animasyonu başlat
        requestAnimationFrame(() => {
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateY(0) scale(1)';
        });

        // Mouse pozisyonunu takip et
        const updateTooltipPosition = (e: MouseEvent) => {
          if (tooltip && document.body.contains(tooltip)) {
            const x = e.clientX + 15;
            const y = e.clientY - 15;

            // Ekran sınırlarını kontrol et
            const tooltipRect = tooltip.getBoundingClientRect();
            const maxX = window.innerWidth - tooltipRect.width - 20;
            const maxY = window.innerHeight - tooltipRect.height - 20;

            tooltip.style.left = `${Math.min(x, maxX)}px`;
            tooltip.style.top = `${Math.max(10, Math.min(y, maxY))}px`;
          }
        };

        document.addEventListener("mousemove", updateTooltipPosition);

        // Cleanup fonksiyonu
        const cleanup = () => {
          document.removeEventListener("mousemove", updateTooltipPosition);
          const tooltipElement = document.getElementById("cyto-tooltip");
          if (tooltipElement) {
            tooltipElement.style.opacity = '0';
            tooltipElement.style.transform = 'translateY(8px) scale(0.95)';
            setTimeout(() => {
              if (document.body.contains(tooltipElement)) {
                tooltipElement.remove();
              }
            }, 200);
          }
        };

        (node as cytoscape.NodeSingular & { _tooltipCleanup?: () => void })._tooltipCleanup = cleanup;
      }, 300); // 300ms delay tooltip göstermek için
    });

    cyRef.current.on("mouseout", "node", (event) => {
      // Timer'ı temizle
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
        tooltipTimer = null;
      }

      const node = event.target;
      const extendedNode = node as cytoscape.NodeSingular & { _tooltipCleanup?: () => void };
      if (extendedNode._tooltipCleanup) {
        extendedNode._tooltipCleanup();
        delete extendedNode._tooltipCleanup;
      }
    });

    // Pan ve zoom olaylarında tooltip'i gizle
    cyRef.current.on("pan zoom", () => {
      const existingTooltip = document.getElementById("cyto-tooltip");
      if (existingTooltip) {
        existingTooltip.remove();
      }
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <button
        onClick={onBack}
        className="
          absolute top-6 right-6 z-10
          h-12 px-6 rounded-2xl
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
          text-white font-bold text-sm
          shadow-lg hover:shadow-2xl hover:-translate-y-1
          transition-all duration-300 ease-out
          flex items-center gap-3
          active:scale-[0.96] border border-indigo-400/50
          overflow-hidden group
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-0.5 drop-shadow-sm" />
        <span className="relative z-10 drop-shadow-sm">Sorguya Geri Dön</span>
      </button>
      <div
        id="cyto-canvas"
        style={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, rgba(248,250,252,0.8), rgba(241,245,249,0.6))",
          marginTop: 0,
          outline: "none",
        }}
      />
    </div>
  );
};