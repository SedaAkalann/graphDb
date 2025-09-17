import cytoscape from "cytoscape";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useRef } from "react";
import type { CytoData } from "../../types/types";
import "./ResultsViewer.css";

export const ResultsViewer: React.FC<{ data: CytoData | null; onBack: () => void }> = ({ data, onBack }) => {
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

    // Kısa bir delay ile cytoscape'i başlat
    const timer = setTimeout(() => {
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
                width: 50,
                height: 50,
                "background-color": "data(backgroundColor)",
                "border-width": 3,
                "border-color": "#ffffff",
                "border-opacity": 1,
                "shape": "ellipse",
                label: "data(label)",
                "font-size": "11px",
                "font-weight": 700,
                color: "#ffffff",
                "text-valign": "center",
                "text-halign": "center",
                "text-outline-width": 2,
                "text-outline-color": "data(backgroundColor)",
                "text-outline-opacity": 0.8,
                "overlay-padding": "8px",
                "z-index": 10,
                "transition-property": "background-color, border-color, width, height, opacity",
                "transition-duration": 250,
                opacity: 0.95,
              },
            },
            {
              selector: "node:hover",
              style: {
                width: 60,
                height: 60,
                "border-width": 4,
                "border-color": "#f8fafc",
                opacity: 1,
                "z-index": 20,
              },
            },
            {
              selector: "node:selected",
              style: {
                "background-color": "#6366f1",
                "border-color": "#a5b4fc",
                "text-outline-color": "#6366f1",
                width: 65,
                height: 65,
                "border-width": 5,
                "z-index": 30,
              },
            },
            {
              selector: "edge",
              style: {
                width: 4,
                "line-color": "#64748b",
                "target-arrow-color": "#64748b",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "control-point-step-size": 80,
                label: "data(label)",
                "font-size": "10px",
                "font-weight": 600,
                "text-background-color": "rgba(255, 255, 255, 0.95)",
                "text-background-opacity": 1,
                "text-background-padding": "4px",
                "text-background-shape": "roundrectangle",
                "text-rotation": "autorotate",
                color: "#475569",
                "text-border-width": 1,
                "text-border-color": "rgba(226, 232, 240, 0.8)",
                "text-border-opacity": 1,
                opacity: 0.8,
                "transition-property": "line-color, target-arrow-color, width, opacity",
                "transition-duration": 200,
              },
            },
            {
              selector: "edge:selected",
              style: {
                "line-color": "#6366f1",
                "target-arrow-color": "#6366f1",
                "font-weight": "bold",
                width: 6,
                opacity: 1,
                "z-index": 15,
              },
            },
            {
              selector: "edge:hover",
              style: {
                width: 5,
                opacity: 1,
                "line-color": "#4f46e5",
                "target-arrow-color": "#4f46e5",
              },
            },
          ],
          layout: {
            name: "breadthfirst", //grid,breadthfirst,circle,
            padding: 60,
            animate: true,
            animationDuration: 1200,
            animationEasing: "ease-out",
            nodeRepulsion: 5000,
            idealEdgeLength: 100,
            edgeElasticity: 120,
            nestingFactor: 1.2,
            gravity: 50,
            numIter: 1000,
            initialTemp: 1000,
            coolingFactor: 0.95,
            minTemp: 1.0,
            randomize: false,
            componentSpacing: 120,
            nodeOverlap: 25,
            refresh: 30,
            fit: true,
            boundingBox: undefined,
            nodeDimensionsIncludeLabels: false
          },
        });

        // Tooltip event'lerini ekle
        setupTooltipEvents();

        // Layout tamamlandığında loading'i kapat
        cyRef.current.on('layoutstop', () => {
          setTimeout(() => setIsInitializing(false), 500);
        });

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

        // Ultra modern glassmorphism tooltip styling
        tooltip.style.cssText = `
          position: fixed;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 
            0 32px 64px -12px rgba(0, 0, 0, 0.08),
            0 20px 40px -8px rgba(0, 0, 0, 0.05),
            0 8px 16px -4px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 0 0 1px rgba(99, 102, 241, 0.1);
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
          z-index: 9999;
          pointer-events: none;
          max-width: 320px;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(12px) scale(0.92);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        `;

        // Tooltip içeriği - ultra modern ve zengin formatting
        const properties = nodeData.properties || 'Özellik bilgisi yok';
        const nodeType = nodeData.type || 'Bilinmeyen';

        // İkon mapping
        const getNodeIcon = (type: string) => {
          const icons = {
            insan: '👤',
            plaka: '🚗',
            ev: '🏠',
            konum: '📍',
            sirket: '🏢',
            telefon: '📱',
            email: '📧',
            default: '🔵'
          };
          return icons[type as keyof typeof icons] || icons.default;
        };

        // Tip badge rengi
        const getTypeBadgeColor = (type: string) => {
          const colors = {
            insan: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            plaka: 'linear-gradient(135deg, #f59e0b, #d97706)',
            ev: 'linear-gradient(135deg, #10b981, #059669)',
            konum: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            sirket: 'linear-gradient(135deg, #ef4444, #dc2626)',
            default: 'linear-gradient(135deg, #6b7280, #4b5563)'
          };
          return colors[type as keyof typeof colors] || colors.default;
        };

        const formattedProperties = properties
          .split('\\n')
          .map((line: string) => {
            const [key, value] = line.split(':');
            if (key && value) {
              return `<div style="
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                margin: 8px 0; 
                padding: 8px 12px; 
                background: rgba(248, 250, 252, 0.8);
                border-radius: 8px;
                border: 1px solid rgba(226, 232, 240, 0.5);
              ">
                <span style="
                  color: #475569; 
                  font-weight: 600; 
                  font-size: 12px;
                  letter-spacing: 0.025em;
                ">${key.trim()}</span>
                <span style="
                  color: #1e293b; 
                  font-weight: 700; 
                  margin-left: 16px;
                  background: linear-gradient(135deg, #334155, #1e293b);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                ">${value.trim()}</span>
              </div>`;
            }
            return `<div style="
              margin: 6px 0; 
              color: #64748b;
              font-style: italic;
            ">${line}</div>`;
          })
          .join('');

        tooltip.innerHTML = `
          <!-- Gradient overlay for extra depth -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: ${getTypeBadgeColor(nodeType)};
            border-radius: 16px 16px 0 0;
          "></div>
          
          <!-- Header -->
          <div style="
            display: flex; 
            align-items: center; 
            gap: 12px; 
            margin-bottom: 16px; 
            padding-bottom: 12px; 
            border-bottom: 1px solid rgba(226, 232, 240, 0.4);
          ">
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px; 
              height: 32px; 
              border-radius: 12px; 
              background: ${nodeData.backgroundColor || '#64748b'};
              font-size: 16px;
              box-shadow: 
                0 4px 8px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
              flex-shrink: 0;
            ">${getNodeIcon(nodeType)}</div>
            
            <div style="flex: 1;">
              <div style="
                font-weight: 800; 
                color: #1e293b; 
                font-size: 15px;
                margin-bottom: 4px;
                background: linear-gradient(135deg, #1e293b, #475569);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${nodeData.label}</div>
              
              <div style="
                display: inline-block;
                padding: 4px 8px;
                background: ${getTypeBadgeColor(nodeType)};
                color: white;
                font-size: 10px;
                font-weight: 700;
                border-radius: 6px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              ">${nodeType}</div>
            </div>
          </div>
          
          <!-- Properties -->
          <div style="
            font-size: 12px;
            position: relative;
          ">
            <div style="
              color: #64748b;
              font-weight: 600;
              margin-bottom: 10px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            ">Özellikler</div>
            ${formattedProperties}
          </div>
          
          <!-- Footer gradient -->
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, ${nodeData.backgroundColor || '#64748b'}, transparent);
            opacity: 0.3;
          "></div>
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
      {/* Graph Initialization Loading Overlay */}
      {isInitializing && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-50/90 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {/* Graph Visualization Loading Animation */}
            <div className="relative w-20 h-20">
              {/* Outer ring */}
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
              {/* Middle ring */}
              <div className="absolute inset-2 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              {/* Inner ring */}
              <div className="absolute inset-4 border-4 border-pink-200 border-b-pink-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              {/* Center dot */}
              <div className="absolute inset-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>

            {/* Graph Status Text */}
            <div className="text-center">
              <div className="text-xl font-bold text-slate-800 mb-3">
                Graph Oluşturuluyor
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-2">
                Düğümler ve bağlantılar yerleştiriliyor
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="
          absolute top-6 left-6 z-10
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