import React from "react";
import type { Edge, Node } from "reactflow";
import { Layout } from "./components/layout/Layout";
import { QueryBuilder } from "./components/query/QueryBuilder";
import type { CytoData, RFEdgeData, RFNodeData } from "./types/types";
import { ResultsViewer } from "./components/result/ResultsViewer";



export const App: React.FC = () => {
  const [isQueryMode, setIsQueryMode] = React.useState(true);
  const [cytoData, setCytoData] = React.useState<CytoData | null>(null);

  // Şema verilerini App seviyesine taşıdık
  const [nodes, setNodes] = React.useState<Node<RFNodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge<RFEdgeData>[]>([]);
  const [selectedNode, setSelectedNode] = React.useState<Node<RFNodeData> | null>(null);
  const [resultLimit, setResultLimit] = React.useState(10);
  const [queryDepth, setQueryDepth] = React.useState(3);

  return (
    <Layout>
      {isQueryMode ? (
        <QueryBuilder
          // Şema verilerini props olarak geçiyoruz
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          resultLimit={resultLimit}
          setResultLimit={setResultLimit}
          queryDepth={queryDepth}
          setQueryDepth={setQueryDepth}
          onQuery={(data: CytoData) => {
            setCytoData(data); // QueryBuilder'dan gelen veri
            setIsQueryMode(false);
          }}
        />
      ) : (
        <ResultsViewer
          data={cytoData}
          onBack={() => setIsQueryMode(true)}
        />
      )}
    </Layout>
  );
};