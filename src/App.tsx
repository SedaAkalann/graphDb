import React from "react";
import { Layout } from "./components/layout/Layout";
import { QueryBuilder } from "./components/query/QueryBuilder";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { useAppDispatch } from "./store";
import { setGraphData, setLoading } from "./store/slices/graphSlice";
import type { CytoData } from "./types/types";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleQuery = async (data: CytoData) => {
    dispatch(setLoading(true));
    dispatch(setGraphData(data));
    // Loading simulation
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(setLoading(false));
  };

  return (
    <DarkModeProvider>
      <Layout>
        <QueryBuilder
          onQuery={handleQuery}
        />
      </Layout>
    </DarkModeProvider>
  );
};