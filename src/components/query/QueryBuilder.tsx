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
  const [isLoading, setIsLoading] = React.useState(false);

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

  // Sorgula butonuna basınca App'e veri gönder - loading simulation ile
  const handleQuery = async () => {
    setIsLoading(true);

    // API çağrısını simüle et
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

    // Entity renkleri (EntitySelector'daki renklerle uyumlu)
    const entityColors = {
      insan: "#2563eb",
      plaka: "#f59e42",
      ev: "#22c55e",
      konum: "#a21caf",
      sirket: "#ef4444",
      telefon: "#06b6d4",
      email: "#8b5cf6"
    };

    // Çok daha zengin ve gerçekçi fake data
    const cytoData = {
      elements: [
        {
          data: {
            id: "n1",
            label: "Ahmet Yılmaz",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 12345678901\nYaş: 35\nMeslek: Yazılım Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: İstanbul\nMedeni Hal: Evli\nEğitim: Yüksek Lisans\nDeneyim: 12 yıl`
          }
        },
        {
          data: {
            id: "n2",
            label: "34ABC123",
            backgroundColor: entityColors.plaka,
            type: "plaka",
            properties: `Renk: Beyaz\nMarka: BMW\nModel: 320i\nYıl: 2020\nMotor: 2.0L\nYakıt: Benzin\nVites: Otomatik\nKM: 45.000`
          }
        },
        {
          data: {
            id: "n3",
            label: "Villa Residence",
            backgroundColor: entityColors.ev,
            type: "ev",
            properties: `Adres: Atatürk Cad. No:15 Beşiktaş/İST\nKat: 3\nOda: 4+1\nM²: 180\nTip: Villa\nYaş: 5\nIsıtma: Kombi\nBalkon: Var`
          }
        },
        {
          data: {
            id: "n4",
            label: "Beşiktaş Merkez",
            backgroundColor: entityColors.konum,
            type: "konum",
            properties: `İl: İstanbul\nİlçe: Beşiktaş\nMahalle: Çırağan\nPosta: 34349\nBölge: Avrupa\nKoordinat: 41.0082,29.0124`
          }
        },
        {
          data: {
            id: "n5",
            label: "Ayşe Demir",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 98765432109\nYaş: 28\nMeslek: Kardiyolog\nCinsiyet: Kadın\nDoğum Yeri: Ankara\nMedeni Hal: Bekar\nEğitim: Tıp Fakültesi\nUnvan: Dr.`
          }
        },
        {
          data: {
            id: "n6",
            label: "06XYZ789",
            backgroundColor: entityColors.plaka,
            type: "plaka",
            properties: `Renk: Siyah\nMarka: Mercedes-Benz\nModel: C200 AMG\nYıl: 2019\nMotor: 1.5L Turbo\nYakıt: Benzin\nVites: Otomatik\nKM: 67.500`
          }
        },
        {
          data: {
            id: "n7",
            label: "Modern Apartmanı",
            backgroundColor: entityColors.ev,
            type: "ev",
            properties: `Adres: Cumhuriyet Mah. 8.Sok No:12/7\nKat: 7\nOda: 2+1\nM²: 120\nTip: Daire\nYaş: 10\nIsıtma: Merkezi\nAsansör: Var`
          }
        },
        {
          data: {
            id: "n8",
            label: "TechCorp Ltd.",
            backgroundColor: entityColors.sirket,
            type: "sirket",
            properties: `Vergi No: 1234567890\nFaaliyet: Yazılım Geliştirme\nKuruluş: 2015\nPersonel: 45\nSektör: Teknoloji\nTip: Limited Şirketi`
          }
        },
        {
          data: {
            id: "n9",
            label: "+90 532 123 45 67",
            backgroundColor: entityColors.telefon,
            type: "telefon",
            properties: `Operatör: Türk Telekom\nTip: GSM\nHat Sahibi: Ahmet Yılmaz\nAktivasyón: 2018\nPaket: Sınırsız\nDurum: Aktif`
          }
        },
        {
          data: {
            id: "n10",
            label: "ahmet.yilmaz@email.com",
            backgroundColor: entityColors.email,
            type: "email",
            properties: `Domain: email.com\nTip: Kişisel\nOluşturma: 2017\nSon Giriş: 2 saat önce\nGüvenlik: 2FA Aktif\nDepolama: 15GB`
          }
        },
        {
          data: {
            id: "n11",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n12",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n13",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n14",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n15",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n16",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n17",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n18",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n19",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n20",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n21",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n22",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n23",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n24",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n25",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n26",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n17",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n28",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n29",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n30",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n31",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n32",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n33",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n34",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n35",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n36",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n37",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        {
          data: {
            id: "n38",
            label: "Mehmet Özkan",
            backgroundColor: entityColors.insan,
            type: "insan",
            properties: `TC: 11223344556\nYaş: 42\nMeslek: İnşaat Mühendisi\nCinsiyet: Erkek\nDoğum Yeri: Bursa\nMedeni Hal: Evli\nÇocuk: 2\nDeneyim: 18 yıl`
          }
        },
        // Çok daha karmaşık bağlantı ağı
        { data: { source: "n1", target: "n2", label: "Sahip" } },
        { data: { source: "n2", target: "n3", label: "Kayıtlı Adres" } },
        { data: { source: "n3", target: "n4", label: "Konum" } },
        { data: { source: "n5", target: "n6", label: "Kullanıcı" } },
        { data: { source: "n6", target: "n7", label: "Kayıtlı Adres" } },
        { data: { source: "n7", target: "n4", label: "Konum" } },
        { data: { source: "n1", target: "n5", label: "Meslektaş" } },
        { data: { source: "n1", target: "n8", label: "Çalışan" } },
        { data: { source: "n1", target: "n9", label: "Telefon Hattı" } },
        { data: { source: "n1", target: "n10", label: "Email Hesabı" } },
        { data: { source: "n5", target: "n8", label: "Konsültan" } },
        { data: { source: "n11", target: "n3", label: "Müteahhit" } },
        { data: { source: "n11", target: "n7", label: "Yapımcı" } },
        { data: { source: "n1", target: "n11", label: "Komşu" } },
        { data: { source: "n1", target: "n8", label: "Ofis Konumu" } },
        { data: { source: "n2", target: "n3", label: "Ofis Konumu" } },
        { data: { source: "n3", target: "n4", label: "Ofis Konumu" } },
        { data: { source: "n8", target: "n4", label: "Ofis Konumu" } },
        { data: { source: "n5", target: "n7", label: "Ofis Konumu" } },
        { data: { source: "n7", target: "n2", label: "Ofis Konumu" } },
        { data: { source: "n2", target: "n8", label: "Ofis Konumu" } },
        { data: { source: "n8", target: "n2", label: "Ofis Konumu" } },
        { data: { source: "n17", target: "n15", label: "Ofis Konumu" } },
        { data: { source: "n8", target: "n1", label: "Ofis Konumu" } },
        { data: { source: "n4", target: "n6", label: "Ofis Konumu" } },
        { data: { source: "n3", target: "n4", label: "Ofis Konumu" } },
        { data: { source: "n1", target: "n3", label: "Ofis Konumu" } },
        { data: { source: "n8", target: "n4", label: "Ofis Konumu" } },
        { data: { source: "n8", target: "n24", label: "Ofis Konumu" } },
        { data: { source: "n28", target: "n4", label: "Ofis Konumu" } },
        { data: { source: "n21", target: "n14", label: "Ofis Konumu" } },
        { data: { source: "n26", target: "n23", label: "Ofis Konumu" } },
        { data: { source: "n29", target: "n13", label: "Ofis Konumu" } },
        { data: { source: "n22", target: "n33", label: "Ofis Konumu" } },
        { data: { source: "n32", target: "n12", label: "Ofis Konumu" } },
        { data: { source: "n31", target: "n23", label: "Ofis Konumu" } },
        { data: { source: "n28", target: "n8", label: "Ofis Konumu" } },
        { data: { source: "n12", target: "n17", label: "Ofis Konumu" } },
        { data: { source: "n15", target: "n7", label: "Ofis Konumu" } },
        { data: { source: "n14", target: "n17", label: "Ofis Konumu" } },
        { data: { source: "n29", target: "n8", label: "Ofis Konumu" } },
        { data: { source: "n21", target: "n33", label: "Ofis Konumu" } },
      ],
    };

    setIsLoading(false);
    onQuery(cytoData);
    // bu kısım gerçek uygulamada backend'den sonuç verisi çekme işlemi olacak
  };

  return (
    <div className="flex w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 overflow-hidden relative min-h-0 ">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center ">
          <div className="flex flex-col items-center gap-6">
            {/* Modern Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 w-8 h-8 border-2 border-purple-200 dark:border-purple-800 border-b-purple-500 dark:border-b-purple-400 rounded-full animate-spin animate-reverse"></div>
            </div>

            {/* Loading Text with Animation */}
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Graph Verisi Yükleniyor...
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                Analiz ediliyor
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1 h-1 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1 h-1 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                <span>Bağlantı Kuruldu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                <span>Veri Çekiliyor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                <span>İşleniyor</span>
              </div>
            </div>
          </div>
        </div>
      )}

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