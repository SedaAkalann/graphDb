import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Edge, Node } from 'reactflow';
import type { RFEdgeData, RFNodeData } from '../../types/types';

export interface Workspace {
  id: string;
  name: string;
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
  createdAt: number;
  lastModified: number;
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
}

const initialWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Ana Çalışma Alanı',
  nodes: [],
  edges: [],
  createdAt: Date.now(),
  lastModified: Date.now(),
};

const initialState: WorkspaceState = {
  workspaces: [initialWorkspace],
  activeWorkspaceId: 'workspace-1',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Yeni workspace oluştur
    createWorkspace: (state, action: PayloadAction<{ name: string }>) => {
      const newWorkspace: Workspace = {
        id: `workspace-${Date.now()}`,
        name: action.payload.name,
        nodes: [],
        edges: [],
        createdAt: Date.now(),
        lastModified: Date.now(),
      };
      state.workspaces.push(newWorkspace);
      state.activeWorkspaceId = newWorkspace.id;
    },

    // Aktif workspace'i değiştir
    setActiveWorkspace: (state, action: PayloadAction<string>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload);
      if (workspace) {
        state.activeWorkspaceId = action.payload;
      }
    },

    // Workspace'i sil
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      if (state.workspaces.length <= 1) return; // En az bir workspace olmalı
      
      state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
      
      // Eğer aktif workspace silindiyse, ilk workspace'i aktif yap
      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = state.workspaces[0]?.id || null;
      }
    },

    // Workspace'i yeniden adlandır
    renameWorkspace: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.id);
      if (workspace) {
        workspace.name = action.payload.name;
        workspace.lastModified = Date.now();
      }
    },

    // Workspace'e node ekle
    addNodeToWorkspace: (state, action: PayloadAction<{ workspaceId: string; node: Node<RFNodeData> }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.nodes.push(action.payload.node);
        workspace.lastModified = Date.now();
      }
    },

    // Workspace'den node sil
    removeNodeFromWorkspace: (state, action: PayloadAction<{ workspaceId: string; nodeId: string }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.nodes = workspace.nodes.filter(node => node.id !== action.payload.nodeId);
        // Node ile ilgili edge'leri de sil
        workspace.edges = workspace.edges.filter(
          edge => edge.source !== action.payload.nodeId && edge.target !== action.payload.nodeId
        );
        workspace.lastModified = Date.now();
      }
    },

    // Workspace'e edge ekle
    addEdgeToWorkspace: (state, action: PayloadAction<{ workspaceId: string; edge: Edge<RFEdgeData> }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.edges.push(action.payload.edge);
        workspace.lastModified = Date.now();
      }
    },

    // Workspace'den edge sil
    removeEdgeFromWorkspace: (state, action: PayloadAction<{ workspaceId: string; edgeId: string }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.edges = workspace.edges.filter(edge => edge.id !== action.payload.edgeId);
        workspace.lastModified = Date.now();
      }
    },

    // Workspace node'larını güncelle (toplu)
    setWorkspaceNodes: (state, action: PayloadAction<{ workspaceId: string; nodes: Node<RFNodeData>[] }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.nodes = action.payload.nodes;
        workspace.lastModified = Date.now();
      }
    },

    // Workspace edge'lerini güncelle (toplu)
    setWorkspaceEdges: (state, action: PayloadAction<{ workspaceId: string; edges: Edge<RFEdgeData>[] }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        workspace.edges = action.payload.edges;
        workspace.lastModified = Date.now();
      }
    },

    // Workspace node'unu güncelle
    updateNodeInWorkspace: (state, action: PayloadAction<{ workspaceId: string; nodeId: string; data: Partial<RFNodeData> }>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload.workspaceId);
      if (workspace) {
        const nodeIndex = workspace.nodes.findIndex(node => node.id === action.payload.nodeId);
        if (nodeIndex !== -1) {
          workspace.nodes[nodeIndex].data = { ...workspace.nodes[nodeIndex].data, ...action.payload.data };
          workspace.lastModified = Date.now();
        }
      }
    },

    // Workspace'i temizle
    clearWorkspace: (state, action: PayloadAction<string>) => {
      const workspace = state.workspaces.find(w => w.id === action.payload);
      if (workspace) {
        workspace.nodes = [];
        workspace.edges = [];
        workspace.lastModified = Date.now();
      }
    },
  },
});

export const {
  createWorkspace,
  setActiveWorkspace,
  deleteWorkspace,
  renameWorkspace,
  addNodeToWorkspace,
  removeNodeFromWorkspace,
  addEdgeToWorkspace,
  removeEdgeFromWorkspace,
  setWorkspaceNodes,
  setWorkspaceEdges,
  updateNodeInWorkspace,
  clearWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
