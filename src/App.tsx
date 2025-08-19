import { Layout } from "./components/layout/Layout";
import { QueryBuilder } from "./components/query/QueryBuilder";
import { ResultsViewer } from "./components/result/ResultsViewer";
import React from "react";

export const App: React.FC = () => {
  const [isQueryMode, setIsQueryMode] = React.useState(true);
  const [cytoData, setCytoData] = React.useState<any>(null);

  return (
    <Layout>
      {isQueryMode ? (
        <QueryBuilder
          onQuery={(data) => {
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