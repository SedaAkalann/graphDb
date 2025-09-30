import { Search } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import type { Connection, Edge, Node, ReactFlowInstance } from "reactflow";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDarkMode } from "../../contexts/DarkModeContext";
import type { RFEdgeData, RFNodeData } from "../../types/types";
import { EdgeModal } from "./EdgeModal";

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

// Ortak node stilini tek yerde tutalım
const defaultNodeStyle: React.CSSProperties = {
  borderRadius: "50%",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1e293b",
  fontWeight: "bold",
  fontSize: 13,
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
};

export const SchemeCanvas = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodeSelect,
  onQuery,
}: {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<RFNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<RFEdgeData>[]>>;
  onNodeSelect: (node: Node<RFNodeData> | null) => void;
  onQuery: () => void;
}) => {
  const { isDarkMode } = useDarkMode();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [pendingEdge, setPendingEdge] = useState<Connection | null>(null);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);

  // Node ekleme (drag-drop)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const label = event.dataTransfer.getData("application/reactflow-label");
      const color = event.dataTransfer.getData("application/reactflow-color");
      const type = event.dataTransfer.getData("application/reactflow-type");
      console.log(label, type, color);
      if (!label || !reactFlowInstance || !reactFlowBounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();
      const newNode: Node<RFNodeData> = {
        id,
        type: "default",
        position,
        data: { id, label, type, color, properties: {} },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${color || "#2563eb"}`,
          background: color || "#e0e7ff",
        },
      };

      setNodes((nds) => [...nds, newNode]);
      onNodeSelect(newNode);
    },
    [reactFlowInstance, setNodes, onNodeSelect]
  );

  // Sürükleme sırasında görselliği düzgün tut
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Edge eklenince modal aç
  const onConnect = useCallback((params: Connection) => {
    setPendingEdge(params);
    setEdgeModalOpen(true);
  }, []);

  // Modal kaydetme
  const handleEdgeModalSave = (relationType: string) => {
    if (pendingEdge?.source && pendingEdge?.target) {
      setEdges((eds) =>
        addEdge(
          {
            ...pendingEdge,
            id: `edge_${eds.length + 1}`,
            label: relationType,
            animated: true,
            style: { strokeWidth: 2, stroke: "#2563eb" },
            data: {
              id: `${pendingEdge.source}-${pendingEdge.target}`,
              source: pendingEdge.source,
              target: pendingEdge.target,
              label: relationType,
            },
          },
          eds
        )
      );
    }
    closeEdgeModal();
  };

  // Modal kapatma helper
  const closeEdgeModal = () => {
    setEdgeModalOpen(false);
    setPendingEdge(null);
  };

  // Node seçimi
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<RFNodeData>) => onNodeSelect(node),
    [onNodeSelect]
  );

  // Canvas boşluğuna tıklayınca seçimi kaldır
  const onPaneClick = useCallback(() => onNodeSelect(null), [onNodeSelect]);

  return (
    <main
      ref={reactFlowWrapper}
      className="flex-1 h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/30 dark:via-gray-900 dark:to-indigo-900/30 relative "
      style={{
        minWidth: 0,
        borderRight: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
        boxShadow: isDarkMode ? "0 0 24px 0 rgba(0,0,0,0.2)" : "0 0 24px 0 rgba(30,41,59,0.04)",
      }}
    >
      {/* Sorgula Butonu - Sağ Üst */}
      <button
        onClick={onQuery}
        className="
          absolute top-4 right-4 z-30
          h-12 px-6 rounded-2xl
          bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500
          hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-600
          text-white font-bold text-sm
          shadow-xl hover:shadow-2xl hover:-translate-y-1
          transition-all duration-300 ease-out
          flex items-center gap-3
          active:scale-[0.96] overflow-hidden group
          border border-emerald-400/50
        "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <Search className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12 drop-shadow-sm" />
        <span className="relative z-10 drop-shadow-sm">Sorgula</span>
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <MiniMap
          nodeColor={isDarkMode ? "#8b5cf6" : "pink"}
          maskColor={isDarkMode ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)"}
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#f8fafc",
          }}
        />
        <Background
          gap={24}
          color={isDarkMode ? "#374151" : "#e0e7ff"}
        />
        <Controls
          className={isDarkMode ? "dark" : ""}
        />
      </ReactFlow>

      <EdgeModal open={edgeModalOpen} onClose={closeEdgeModal} onSave={handleEdgeModalSave} />
    </main>
  );
};
