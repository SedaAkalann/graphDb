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
import { EdgeModal } from "./EdgeModal";
import type { RFEdgeData, RFNodeData } from "./types";

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
}: {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<RFNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<RFEdgeData>[]>>;
  onNodeSelect: (node: Node<RFNodeData> | null) => void;
}) => {
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

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
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
    (_: any, node: Node<RFNodeData>) => onNodeSelect(node),
    [onNodeSelect]
  );

  // Canvas boşluğuna tıklayınca seçimi kaldır
  const onPaneClick = useCallback(() => onNodeSelect(null), [onNodeSelect]);

  return (
    <main
      ref={reactFlowWrapper}
      className="flex-1 h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative"
      style={{
        minWidth: 0,
        borderRight: "1px solid #e5e7eb",
        boxShadow: "0 0 24px 0 rgba(30,41,59,0.04)",
      }}
    >
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
        <MiniMap nodeColor="#2563eb" />
        <Background gap={24} color="#e0e7ff" />
        <Controls />
      </ReactFlow>

      <EdgeModal open={edgeModalOpen} onClose={closeEdgeModal} onSave={handleEdgeModalSave} />
    </main>
  );
};
