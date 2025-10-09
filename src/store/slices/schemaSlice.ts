import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Edge, Node } from 'reactflow';
import type { RFEdgeData, RFNodeData } from '../../types/types';

interface SchemaState {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
}

const initialState: SchemaState = {
  nodes: [],
  edges: [],
};

const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node<RFNodeData>[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge<RFEdgeData>[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<Node<RFNodeData>>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(node => node.id !== action.payload);
      // Silinen node ile ilgili edge'leri de sil
      state.edges = state.edges.filter(
        edge => edge.source !== action.payload && edge.target !== action.payload
      );
    },
    addEdge: (state, action: PayloadAction<Edge<RFEdgeData>>) => {
      state.edges.push(action.payload);
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<RFNodeData> }>) => {
      const { id, data } = action.payload;
      const nodeIndex = state.nodes.findIndex(node => node.id === id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].data = { ...state.nodes[nodeIndex].data, ...data };
      }
    },
    clearSchema: (state) => {
      state.nodes = [];
      state.edges = [];
    },
  },
});

export const { 
  setNodes, 
  setEdges, 
  addNode, 
  removeNode, 
  addEdge, 
  removeEdge, 
  updateNode, 
  clearSchema 
} = schemaSlice.actions;

export default schemaSlice.reducer;
