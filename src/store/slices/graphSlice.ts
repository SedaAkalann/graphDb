import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { CytoData } from '../../types/types';

interface GraphState {
  cytoData: CytoData | null;
  isLoading: boolean;
}

const initialState: GraphState = {
  cytoData: null,
  isLoading: false,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<CytoData | null>) => {
      state.cytoData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearGraphData: (state) => {
      state.cytoData = null;
      state.isLoading = false;
    },
  },
});

export const { setGraphData, setLoading, clearGraphData } = graphSlice.actions;
export default graphSlice.reducer;
