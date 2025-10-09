import { Search, Undo2, Trash2 } from "lucide-react";
import React, { useCallback, useRef, useState, useMemo } from "react";
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
import { useAppDispatch, useAppSelector } from "../../store";
import { 
  addNodeToWorkspace, 
  addEdgeToWorkspace, 
  setWorkspaceNodes, 
  setWorkspaceEdges,
  updateNodeInWorkspace 
} from "../../store/slices/workspaceSlice";

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

interface SchemeCanvasProps {
  onNodeSelect?: (node: Node<RFNodeData> | null) => void;
  onEdgeSelect?: (edge: Edge<RFEdgeData> | null) => void;
  onQuery: () => void;
}

export const SchemeCanvas: React.FC<SchemeCanvasProps> = ({
  onNodeSelect,
  onEdgeSelect,
  onQuery,
}) => {
  const dispatch = useAppDispatch();
  const { workspaces, activeWorkspaceId } = useAppSelector((state) => state.workspace);
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  
  const nodes = useMemo(() => activeWorkspace?.nodes || [], [activeWorkspace?.nodes]);
  const edges = useMemo(() => activeWorkspace?.edges || [], [activeWorkspace?.edges]);
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

  // Undo/Redo History Management
  const [history, setHistory] = useState<{ nodes: Node<RFNodeData>[], edges: Edge<RFEdgeData>[] }[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  // Selected items for deletion
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);



  // History management
  const saveToHistory = useCallback(() => {
    if (!activeWorkspaceId) return;
    
    const currentState = { nodes: [...nodes], edges: [...edges] };
    
    // İlk state ise direkt ekle
    if (history.length === 0) {
      setHistory([currentState]);
      setCurrentHistoryIndex(0);
      return;
    }
    
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(currentState);
    
    // Keep history to max 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
      setCurrentHistoryIndex(newHistory.length - 1);
    } else {
      setCurrentHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [nodes, edges, history, currentHistoryIndex, activeWorkspaceId]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (!activeWorkspaceId || currentHistoryIndex <= 0) return;
    
    const previousState = history[currentHistoryIndex - 1];
    if (previousState) {
      dispatch(setWorkspaceNodes({ workspaceId: activeWorkspaceId, nodes: previousState.nodes }));
      dispatch(setWorkspaceEdges({ workspaceId: activeWorkspaceId, edges: previousState.edges }));
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }, [history, currentHistoryIndex, activeWorkspaceId, dispatch]);



  // Delete selected items
  const handleDelete = useCallback(() => {
    if (!activeWorkspaceId) return;
    
    saveToHistory(); // Save current state before deleting
    
    // Delete selected nodes and their connected edges
    const remainingNodes = nodes.filter(node => !selectedNodes.includes(node.id));
    const remainingEdges = edges.filter(edge => 
      !selectedEdges.includes(edge.id) && 
      !selectedNodes.includes(edge.source) && 
      !selectedNodes.includes(edge.target)
    );
    
    dispatch(setWorkspaceNodes({ workspaceId: activeWorkspaceId, nodes: remainingNodes }));
    dispatch(setWorkspaceEdges({ workspaceId: activeWorkspaceId, edges: remainingEdges }));
    
    // Clear selections
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, [activeWorkspaceId, nodes, edges, selectedNodes, selectedEdges, dispatch, saveToHistory]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          handleUndo();
        }
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        handleDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleDelete]);

  // Initialize history with current state
  React.useEffect(() => {
    if (activeWorkspaceId && history.length === 0) {
      const initialState = { nodes: [...nodes], edges: [...edges] };
      setHistory([initialState]);
      setCurrentHistoryIndex(0);
    }
  }, [activeWorkspaceId, nodes, edges, history.length]);

  // Node özellik değişiklik handler'ı
  const handleNodePropertyChange = useCallback((key: string, value: string | number | boolean) => {
    if (!selectedNodeForSheet) return;

    const currentNodeData = selectedNodeForSheet.data || {
      id: selectedNodeForSheet.id,
      label: 'Node',
      type: 'default',
      color: '#3b82f6',
      properties: {},
    };

    const newData = {
      ...currentNodeData,
      properties: {
        ...currentNodeData.properties,
        [key]: value,
      },
    };

    if (activeWorkspaceId) {
      dispatch(updateNodeInWorkspace({ workspaceId: activeWorkspaceId, nodeId: selectedNodeForSheet.id, data: newData }));
    }

    // Selected node'u da güncelle
    setSelectedNodeForSheet((prev) => {
      if (!prev) return null;
      const updatedPrev: Node<RFNodeData> = {
        ...prev,
        data: newData,
      };
      return updatedPrev;
    });
  }, [selectedNodeForSheet, dispatch, activeWorkspaceId]);

  // Edge özellik değişiklik handler'ı
  const handleEdgePropertyChange = useCallback((key: string, value: string | number | boolean) => {
    if (!selectedEdgeForSheet) return;

    if (activeWorkspaceId) {
      const updatedEdges = edges.map((edge) => {
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
      });

      dispatch(setWorkspaceEdges({ workspaceId: activeWorkspaceId, edges: updatedEdges }));
    }

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
  }, [selectedEdgeForSheet, edges, dispatch, activeWorkspaceId]);



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

      if (activeWorkspaceId) {
        saveToHistory(); // Save state before adding node
        dispatch(addNodeToWorkspace({ workspaceId: activeWorkspaceId, node: newNode }));
      }
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
    [reactFlowInstance, dispatch, onNodeSelect, activeWorkspaceId, saveToHistory]
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

      if (activeWorkspaceId) {
        saveToHistory(); // Save state before adding edge
        dispatch(addEdgeToWorkspace({ workspaceId: activeWorkspaceId, edge: newEdge }));
      }

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
  }, [dispatch, onEdgeSelect, activeWorkspaceId, saveToHistory]);



  // Node seçimi - Node'a basınca hemen sheet'i aç
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<RFNodeData>) => {
      // Ctrl/Cmd key ile multi-select
      if (event.ctrlKey || event.metaKey) {
        setSelectedNodes(prev => 
          prev.includes(node.id) 
            ? prev.filter(id => id !== node.id)
            : [...prev, node.id]
        );
      } else {
        // Normal click - select only this node for editing
        onNodeSelect?.(node);
        setSelectedNodeForSheet(node);
        setIsNodePropertySheetOpen(true);
        setIsEdgePropertySheetOpen(false);
        setSelectedEdgeForSheet(null);
        
        // Single selection için
        setSelectedNodes([node.id]);
        setSelectedEdges([]);
      }
    },
    [onNodeSelect]
  );

  // Edge seçimi - Edge'e basınca hemen sheet'i aç
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge<RFEdgeData>) => {
      // Ctrl/Cmd key ile multi-select
      if (event.ctrlKey || event.metaKey) {
        setSelectedEdges(prev => 
          prev.includes(edge.id) 
            ? prev.filter(id => id !== edge.id)
            : [...prev, edge.id]
        );
      } else {
        // Normal click - select only this edge for editing
        onEdgeSelect?.(edge);
        setSelectedEdgeForSheet(edge);
        setIsEdgePropertySheetOpen(true);
        
        // Single selection için
        setSelectedEdges([edge.id]);
        setSelectedNodes([]);
      }
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
      {/* Action Buttons - Sol Üst */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        {/* Undo Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleUndo();
          }}
          disabled={currentHistoryIndex <= 0}
          title="Geri Al (Ctrl+Z)"
          className="
            h-10 w-10 rounded-xl
            bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
            border border-gray-200/50 dark:border-gray-600/50
            text-gray-600 dark:text-gray-300
            hover:text-blue-600 dark:hover:text-blue-400
            hover:bg-blue-50/50 dark:hover:bg-blue-900/20
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            flex items-center justify-center
            shadow-lg hover:shadow-xl
          "
        >
          <Undo2 className="w-4 h-4" />
        </button>



        {/* Delete Button with Instructions */}
        <div className="relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete();
            }}
            disabled={selectedNodes.length === 0 && selectedEdges.length === 0}
            className="
              h-10 w-10 rounded-xl
              bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
              border border-gray-200/50 dark:border-gray-600/50
              text-gray-600 dark:text-gray-300
              hover:text-red-600 dark:hover:text-red-400
              hover:bg-red-50/50 dark:hover:bg-red-900/20
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center
              shadow-lg hover:shadow-xl
            "
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {/* Tooltip with Instructions */}
          <div className="
            absolute left-12 top-0 z-50
            bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg px-3 py-2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none whitespace-nowrap
            shadow-xl border border-gray-700
          ">
            {selectedNodes.length === 0 && selectedEdges.length === 0 ? (
              <>
                <div className="font-semibold text-yellow-400">Nasıl Silinir?</div>
                <div>1. Ctrl+Click ile düğüm/bağlantı seç</div>
                <div>2. Bu butona tıkla veya Delete tuşu</div>
              </>
            ) : (
              <>
                <div className="font-semibold text-red-400">Seçili Öğeleri Sil</div>
                <div>{selectedNodes.length + selectedEdges.length} öğe silinecek</div>
                <div className="text-gray-400">Delete tuşu da kullanılabilir</div>
              </>
            )}
            {/* Arrow */}
            <div className="absolute left-[-6px] top-3 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gray-200/50 dark:bg-gray-600/50 mx-1"></div>
      </div>

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
        nodes={nodes.map(node => ({
          ...node,
          selected: selectedNodes.includes(node.id),
          style: {
            ...node.style,
            ...(selectedNodes.includes(node.id) && {
              border: '3px solid #ef4444',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
            })
          }
        }))}
        edges={edges.map(edge => ({
          ...edge,
          selected: selectedEdges.includes(edge.id),
          style: {
            ...edge.style,
            ...(selectedEdges.includes(edge.id) && {
              stroke: '#ef4444',
              strokeWidth: 4
            })
          }
        }))}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={(changes) => {
          if (activeWorkspaceId) {
            const newNodes = applyNodeChanges(changes, nodes);
            dispatch(setWorkspaceNodes({ workspaceId: activeWorkspaceId, nodes: newNodes }));
          }
        }}
        onEdgesChange={(changes) => {
          if (activeWorkspaceId) {
            const newEdges = applyEdgeChanges(changes, edges);
            dispatch(setWorkspaceEdges({ workspaceId: activeWorkspaceId, edges: newEdges }));
          }
        }}
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
