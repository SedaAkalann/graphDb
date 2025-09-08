import React, { useState } from "react";
import { EntitySelector } from "./EntitySelector";
import { PropertyPanel } from "./PropertyPanel";
import { SchemeCanvas } from "./SchemeCanvas";

export const QueryBuilder: React.FC<{ onQuery: (data: any) => void }> = ({ onQuery }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [resultLimit, setResultLimit] = useState(10);
  const [queryDepth, setQueryDepth] = useState(3);

  // Sorgula butonuna basınca App'e veri gönder
  const handleQuery = () => {
    // Burada gerçek backend sorgusu yerine örnek veri gönderiyoruz
    const cytoData = {
      elements: [
        { data: { id: "n1", label: "Ahmet" } },
        { data: { id: "n2", label: "Plaka" } },
        { data: { id: "n3", label: "Ev" } },
        { data: { id: "n4", label: "Konum" } },
        { data: { id: "n5", label: "Ayşe" } },
        { data: { source: "n1", target: "n2", label: "Sahip" } },
        { data: { source: "n2", target: "n3", label: "Bağlı" } },
        { data: { source: "n3", target: "n4", label: "Bulunduğu" } },
        { data: { source: "n5", target: "n2", label: "Sahip" } },
        { data: { source: "n5", target: "n4", label: "Gitti" } },
      ],
    };
    onQuery(cytoData);
    // bu kısım gerçek uygulamada backend'den sonuç verisi çekme işlemi olacak
  };

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-blue-100 via-white to-indigo-100 overflow-hidden">
      <EntitySelector
        onClear={() => {
          setNodes([]);
          setEdges([]);
          setSelectedNode(null);
        }}
        onLoadSample={() => {
          // örnek yükle fonksiyonu
        }}
      />
      <SchemeCanvas
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onNodeSelect={setSelectedNode}
      />
      <PropertyPanel
        selectedNode={selectedNode}
        onNodePropertyChange={() => {}}
        resultLimit={resultLimit}
        setResultLimit={setResultLimit}
        queryDepth={queryDepth}
        setQueryDepth={setQueryDepth}
        onQuery={handleQuery} // <-- Burada!
      />
    </div>
  );
};