import React from "react";
import type { Edge, Node } from "reactflow";
import type { CytoData, RFEdgeData, RFNodeData } from "../../types/types";
import { EntitySelector } from "./EntitySelector";
import { PropertyPanel } from "./PropertyPanel";
import { SchemeCanvas } from "./SchemeCanvas";

interface QueryBuilderProps {
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<RFNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<RFEdgeData>[]>>;
  selectedNode: Node<RFNodeData> | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node<RFNodeData> | null>>;
  resultLimit: number;
  setResultLimit: React.Dispatch<React.SetStateAction<number>>;
  queryDepth: number;
  setQueryDepth: React.Dispatch<React.SetStateAction<number>>;
  onQuery: (data: CytoData) => void;
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  selectedNode,
  setSelectedNode,
  resultLimit,
  setResultLimit,
  queryDepth,
  setQueryDepth,
  onQuery
}) => {

  // Filtre fonksiyonu
  const handleFilter = () => {
    if (!selectedNode) return;
    // Burada filtreleme işlemi yapılabilir
    console.log("Filtreleme yapılıyor:", selectedNode);
  };

  // Node özelliklerini güncelleme fonksiyonu
  const handleNodePropertyChange = (key: string, value: string | number | boolean) => {
    if (!selectedNode) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id
          ? {
            ...node,
            data: {
              ...node.data,
              properties: {
                ...node.data.properties,
                [key]: value,
              },
            },
          }
          : node
      )
    );

    // Seçili node'u da güncelle
    setSelectedNode((prev) =>
      prev
        ? {
          ...prev,
          data: {
            ...prev.data,
            properties: {
              ...prev.data.properties,
              [key]: value,
            },
          },
        }
        : null
    );
  };

  // Sorgula butonuna basınca App'e veri gönder
  const handleQuery = () => {
    // Entity renkleri (EntitySelector'daki renklerle uyumlu)
    const entityColors = {
      insan: "#2563eb",
      plaka: "#f59e42",
      ev: "#22c55e",
      konum: "#a21caf"
    };

    // Detaylı fake data özellikleri
    const cytoData = {
      elements: [
        {
          data: {
            id: "n1",
            label: "Ahmet Yılmaz",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 12345678901\nYaş: 35\nMeslek: Mühendis\nCinsiyet: Erkek`
          }
        },
        {
          data: {
            id: "n2",
            label: "34ABC123",
            backgroundColor: entityColors.plaka,
            type: "plaka",
            properties: `Renk: Beyaz\nMarka: BMW\nModel: 320i\nYıl: 2020`
          }
        },
        {
          data: {
            id: "n3",
            label: "Villa Residence",
            backgroundColor: entityColors.ev,
            type: "ev",
            properties: `Adres: Atatürk Cad. No:15\nKat: 3\nOda: 4+1\nM²: 180\nTip: Villa`
          }
        },
        {
          data: {
            id: "n4",
            label: "Beşiktaş",
            backgroundColor: entityColors.konum,
            type: "konum",
            properties: `İl: İstanbul\nİlçe: Beşiktaş\nMahalle: Çırağan\nPosta: 34349`
          }
        },
        {
          data: {
            id: "n5",
            label: "Ayşe Demir",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 98765432109\nYaş: 28\nMeslek: Doktor\nCinsiyet: Kadın`
          }
        },
        {
          data: {
            id: "n6",
            label: "06XYZ789",
            backgroundColor: entityColors.plaka,
            type: "plaka",
            properties: `Renk: Siyah\nMarka: Mercedes\nModel: C200\nYıl: 2019`
          }
        },
        {
          data: {
            id: "n7",
            label: "Modern Apt",
            backgroundColor: entityColors.ev,
            type: "ev",
            properties: `Adres: Cumhuriyet Mah. Sok:8\nKat: 7\nOda: 2+1\nM²: 120\nTip: Daire`
          }
        },
        // Bağlantılar
        { data: { source: "n1", target: "n2", label: "Sahip" } },
        { data: { source: "n2", target: "n3", label: "Kayıtlı" } },
        { data: { source: "n3", target: "n4", label: "Bulunduğu" } },
        { data: { source: "n5", target: "n2", label: "Kullanıcı" } },
        { data: { source: "n5", target: "n6", label: "Sahip" } },
        { data: { source: "n6", target: "n7", label: "Kayıtlı" } },
        { data: { source: "n7", target: "n4", label: "Bulunduğu" } },
        { data: { source: "n1", target: "n5", label: "Tanıyor" } },
      ],
    };
    onQuery(cytoData);
    // bu kısım gerçek uygulamada backend'den sonuç verisi çekme işlemi olacak
  };

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative min-h-0">
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
        onQuery={handleQuery}
      />
      <PropertyPanel
        selectedNode={selectedNode}
        onNodePropertyChange={handleNodePropertyChange}
        resultLimit={resultLimit}
        setResultLimit={setResultLimit}
        queryDepth={queryDepth}
        setQueryDepth={setQueryDepth}
        onSave={handleFilter}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
};