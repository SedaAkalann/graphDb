import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import graphSlice from './slices/graphSlice';
import schemaSlice from './slices/schemaSlice';
import workspaceSlice from './slices/workspaceSlice';

export const store = configureStore({
  reducer: {
    graph: graphSlice,
    schema: schemaSlice,
    workspace: workspaceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Cytoscape objelerini serializasyon kontrolünden muaf tut
        ignoredActions: ['graph/setGraphData'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
