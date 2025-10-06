import { Search } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import type { Connection, Edge, Node, ReactFlowInstance } from "reactflow";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDarkMode } from "../../contexts/DarkModeContext";
import type { RFEdgeData, RFNodeData } from "../../types/types";
import { EdgePropertySheet } from "./EdgePropertySheet";
import { NodePropertySheet } from "./NodePropertySheet";

// Node ve edge types'ları component dışında tanımla
const nodeTypes = {};
const edgeTypes = {};

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
  onEdgeSelect,
  onQuery,
}: {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<RFNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<RFEdgeData>[]>>;
  onNodeSelect?: (node: Node<RFNodeData> | null) => void;
  onEdgeSelect?: (edge: Edge<RFEdgeData> | null) => void;
  onQuery: () => void;
}) => {
  const { isDarkMode } = useDarkMode();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  
  // Edge Property Sheet için state'ler
  const [isEdgePropertySheetOpen, setIsEdgePropertySheetOpen] = useState(false);
  const [selectedEdgeForSheet, setSelectedEdgeForSheet] = useState<Edge<RFEdgeData> | null>(null);

  // Node Property Sheet için state'ler
  const [isNodePropertySheetOpen, setIsNodePropertySheetOpen] = useState(false);
  const [selectedNodeForSheet, setSelectedNodeForSheet] = useState<Node<RFNodeData> | null>(null);

  // Node özellik değişiklik handler'ı
  const handleNodePropertyChange = useCallback((key: string, value: string | number | boolean) => {
    if (!selectedNodeForSheet) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNodeForSheet.id) {
          const updatedNode: Node<RFNodeData> = {
            ...node,
            data: node.data ? {
              ...node.data,
              properties: {
                ...node.data.properties,
                [key]: value,
              },
            } : {
              id: node.id,
              label: 'Node',
              type: 'default',
              color: '#3b82f6',
              properties: { [key]: value },
            },
          };
          return updatedNode;
        }
        return node;
      })
    );

    // Selected node'u da güncelle
    setSelectedNodeForSheet((prev) => {
      if (!prev) return null;
      const updatedPrev: Node<RFNodeData> = {
        ...prev,
        data: prev.data ? {
          ...prev.data,
          properties: {
            ...prev.data.properties,
            [key]: value,
          },
        } : {
          id: prev.id,
          label: 'Node',
          type: 'default',
          color: '#3b82f6',
          properties: { [key]: value },
        },
      };
      return updatedPrev;
    });
  }, [selectedNodeForSheet, setNodes]);

  // Edge özellik değişiklik handler'ı
  const handleEdgePropertyChange = useCallback((key: string, value: string | number | boolean) => {
    if (!selectedEdgeForSheet) return;

    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edge.id === selectedEdgeForSheet.id) {
          const updatedEdge: Edge<RFEdgeData> = {
            ...edge,
            data: edge.data ? {
              ...edge.data,
              properties: {
                ...edge.data.properties,
                [key]: value,
              },
            } : {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              label: 'Yeni Bağlantı',
              properties: { [key]: value },
            },
          };

          // Label'ı da güncelle - eğer 'label' key'i geldiyse
          if (key === 'label') {
            updatedEdge.label = String(value);
            if (updatedEdge.data) {
              updatedEdge.data.label = String(value);
            }
          }

          return updatedEdge;
        }
        return edge;
      })
    );

    // Selected edge'i de güncelle
    setSelectedEdgeForSheet((prev) => {
      if (!prev) return null;
      const updatedPrev: Edge<RFEdgeData> = {
        ...prev,
        data: prev.data ? {
          ...prev.data,
          properties: {
            ...prev.data.properties,
            [key]: value,
          },
        } : {
          id: prev.id,
          source: prev.source,
          target: prev.target,
          label: 'Yeni Bağlantı',
          properties: { [key]: value },
        },
        label: key === 'label' ? String(value) : prev.label,
      };
      return updatedPrev;
    });
  }, [selectedEdgeForSheet, setEdges]);



  // Node ekleme (drag-drop)
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const label = event.dataTransfer.getData("application/reactflow-label");
      const color = event.dataTransfer.getData("application/reactflow-color");
      const type = event.dataTransfer.getData("application/reactflow-type");
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
      onNodeSelect?.(newNode);
      
      // Yeni node bırakıldığında direkt sheet'i aç
      setTimeout(() => {
        setSelectedNodeForSheet(newNode);
        setIsNodePropertySheetOpen(true);
        // Edge sheet'ini kapat
        setIsEdgePropertySheetOpen(false);
        setSelectedEdgeForSheet(null);
      }, 100);
    },
    [reactFlowInstance, setNodes, onNodeSelect]
  );

  // Sürükleme sırasında görselliği düzgün tut
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Edge eklenince direkt yaratıp sheet aç
  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      const newEdge: Edge<RFEdgeData> = {
        id: `edge_${Date.now()}`,
        source: params.source,
        target: params.target,
        label: 'Yeni Bağlantı',
        animated: true,
        style: {
          strokeWidth: 2.5,
          stroke: "#3b82f6",
        },
        labelStyle: {
          fontSize: 12,
          fontWeight: 600,
          fill: "#1e293b",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "4px 8px",
          borderRadius: "8px",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        },
        labelBgPadding: [8, 4] as [number, number],
        labelBgBorderRadius: 8,
        labelBgStyle: {
          fill: "rgba(255, 255, 255, 0.95)",
          stroke: "#3b82f6",
          strokeWidth: 1,
          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
        },
        data: {
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          label: 'Yeni Bağlantı',
          properties: {
            type: '', // Boş başlar, kullanıcı seçer
          },
        },
      };

      setEdges((eds) => [...eds, newEdge]);

      // Edge'i seç ve sheet'i aç - setTimeout ile state update'i bekle
      setTimeout(() => {
        if (onEdgeSelect) {
          onEdgeSelect(newEdge);
        }
        // Direkt bizim edge sheet'imizi de aç
        setSelectedEdgeForSheet(newEdge);
        setIsEdgePropertySheetOpen(true);
      }, 100);
    }
  }, [setEdges, onEdgeSelect]);



  // Node seçimi - Node'a basınca hemen sheet'i aç
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<RFNodeData>) => {
      // Önce parent'a bildir
      onNodeSelect?.(node);
      // Sonra direkt sheet'i aç
      setSelectedNodeForSheet(node);
      setIsNodePropertySheetOpen(true);
      // Edge sheet'ini kapat
      setIsEdgePropertySheetOpen(false);
      setSelectedEdgeForSheet(null);
    },
    [onNodeSelect]
  );

  // Edge seçimi - Edge'e basınca hemen sheet'i aç
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge<RFEdgeData>) => {
      // Önce parent'a bildir
      if (onEdgeSelect) {
        onEdgeSelect(edge);
      }
      // Sonra direkt sheet'i aç
      setSelectedEdgeForSheet(edge);
      setIsEdgePropertySheetOpen(true);
    },
    [onEdgeSelect]
  );

  // Canvas boşluğuna tıklayınca seçimi kaldır
  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
    if (onEdgeSelect) {
      onEdgeSelect(null);
    }
    // Her iki sheet'i de kapat
    setIsEdgePropertySheetOpen(false);
    setSelectedEdgeForSheet(null);
    setIsNodePropertySheetOpen(false);
    setSelectedNodeForSheet(null);
  }, [onNodeSelect, onEdgeSelect]);

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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={{
          animated: true,
          style: {
            strokeWidth: 2.5,
            stroke: "#3b82f6"
          },
          labelStyle: {
            fontSize: 10,
            fontWeight: 500,
            fill: "#1e293b"
          },
          labelBgPadding: [8, 4] as [number, number],
          labelBgBorderRadius: 8,
          labelBgStyle: {
            fill: "rgba(255, 255, 255, 0.95)",
            stroke: "#3b82f6",
            strokeWidth: 1,
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
          }
        }}
        fitView
      >
        <MiniMap
          nodeColor={isDarkMode ? "#8b5cf6" : "pink"}
          maskColor={isDarkMode ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)"}
          style={{
            backgroundColor: isDarkMode ? "#1f2937" : "#f8fafc",
            // width:"80px",
            // height:"80px",
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

      {/* Node Property Sheet */}
      <NodePropertySheet
        isOpen={isNodePropertySheetOpen}
        onOpenChange={setIsNodePropertySheetOpen}
        selectedNode={selectedNodeForSheet}
        onNodePropertyChange={handleNodePropertyChange}
      />

      {/* Edge Property Sheet */}
      <EdgePropertySheet
        isOpen={isEdgePropertySheetOpen}
        onOpenChange={setIsEdgePropertySheetOpen}
        selectedEdge={selectedEdgeForSheet}
        onEdgePropertyChange={handleEdgePropertyChange}
        nodes={nodes}
        edges={edges}
      />
    </main>
  );
};
