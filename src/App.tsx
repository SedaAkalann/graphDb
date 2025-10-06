import React from "react";
import type { Edge, Node } from "reactflow";
import { Layout } from "./components/layout/Layout";
import { QueryBuilder } from "./components/query/QueryBuilder";
import type { CytoData, RFEdgeData, RFNodeData } from "./types/types";

import { DarkModeProvider } from "./contexts/DarkModeContext";

export const App: React.FC = () => {
  const [cytoData, setCytoData] = React.useState<CytoData | null>(null); // graph verisi 
  const [isLoading, setIsLoading] = React.useState(false); // graph için loading state

  // Şema verilerini App seviyesine taşıdık
  const [nodes, setNodes] = React.useState<Node<RFNodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge<RFEdgeData>[]>([]);

  const handleQuery = async (data: CytoData) => {
    setIsLoading(true);
    setCytoData(data);
    // Loading simulation
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  return (
    <DarkModeProvider>
      <Layout>
        <QueryBuilder
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onQuery={handleQuery}
          isLoading={isLoading}
          resultsData={cytoData}
        />
      </Layout>
    </DarkModeProvider>
  );
};