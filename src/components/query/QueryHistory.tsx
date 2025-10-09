import { ArrowRight, Clock, Database, History } from 'lucide-react';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setWorkspaceEdges, setWorkspaceNodes } from '../../store/slices/workspaceSlice';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

// Entity renk şeması (EntitySelector'dan aynı renkler)
const entityColors = {
  insan: "#2563eb",
  plaka: "#f59e42",
  ev: "#22c55e",
  konum: "#a21caf",
  sirket: "#dc2626",
  telefon: "#059669",
  email: "#7c3aed",
  banka: "#b91c1c",
  hesap: "#0891b2",
  adres: "#ea580c",
  ulke: "#16a34a",
  sehir: "#9333ea"
};

// SchemeCanvas'taki ile aynı node stili
const defaultNodeStyle: React.CSSProperties = {
  borderRadius: "50%",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1e293b",
  fontWeight: "bold",
  fontSize: 13,
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
};

// Mock geçmiş sorgular verisi (API'den gelecek)
const mockQueryHistory = [
  {
    id: '1',
    name: 'İnsan ve Ev İlişkisi',
    description: 'Bir kişinin yaşadığı ev ve iletişim bilgileri',
    date: '2025-01-07',
    nodes: [
      {
        id: 'person1',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          id: 'person1',
          label: 'İnsan',
          type: 'insan',
          color: entityColors.insan,
          properties: { isim: 'Mehmet', soyisim: 'Yılmaz', yas: 35, tc: '12345678901' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.insan}`,
          background: entityColors.insan,
        }
      },
      {
        id: 'house1',
        type: 'custom',
        position: { x: 300, y: 100 },
        data: {
          id: 'house1',
          label: 'Ev',
          type: 'ev',
          color: entityColors.ev,
          properties: { adres: 'İstanbul Kadıköy', kat: 3, oda: 4, tip: 'Daire' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.ev}`,
          background: entityColors.ev,
        }
      },
      {
        id: 'phone1',
        type: 'custom',
        position: { x: 500, y: 100 },
        data: {
          id: 'phone1',
          label: 'Telefon',
          type: 'telefon',
          color: entityColors.telefon,
          properties: { telefon: '0532-123-4567' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.telefon}`,
          background: entityColors.telefon,
        }
      }
    ],
    edges: [
      {
        id: 'edge1',
        source: 'person1',
        target: 'house1',
        type: 'smoothstep',
        label: 'yasar',
        data: {
          id: 'edge1',
          source: 'person1',
          target: 'house1',
          label: 'yasar',
          properties: { baslangic_tarihi: '2020-01-01', durum: 'Aktif' } as Record<string, string | number | boolean>
        }
      },
      {
        id: 'edge2',
        source: 'person1',
        target: 'phone1',
        type: 'smoothstep',
        label: 'sahip',
        data: {
          id: 'edge2',
          source: 'person1',
          target: 'phone1',
          label: 'sahip',
          properties: { kayit_tarihi: '2018-05-15' } as Record<string, string | number | boolean>
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Şirket ve Çalışan İlişkisi',
    description: 'Kişinin çalıştığı şirket ve banka hesabı bilgileri',
    date: '2025-01-06',
    nodes: [
      {
        id: 'person2',
        type: 'custom',
        position: { x: 100, y: 120 },
        data: {
          id: 'person2',
          label: 'İnsan',
          type: 'insan',
          color: entityColors.insan,
          properties: { isim: 'Ayşe', soyisim: 'Demir', meslek: 'Yazılım Geliştirici' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.insan}`,
          background: entityColors.insan,
        }
      },
      {
        id: 'company1',
        type: 'custom',
        position: { x: 300, y: 60 },
        data: {
          id: 'company1',
          label: 'Şirket',
          type: 'sirket',
          color: entityColors.sirket,
          properties: { sirket_adi: 'TechCorp A.Ş.', sektor: 'Teknoloji', calisan_sayisi: 250 } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.sirket}`,
          background: entityColors.sirket,
        }
      },
      {
        id: 'bank1',
        type: 'custom',
        position: { x: 300, y: 180 },
        data: {
          id: 'bank1',
          label: 'Banka',
          type: 'banka',
          color: entityColors.banka,
          properties: { banka_adi: 'Ziraat Bankası', sube_kodu: '1234' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.banka}`,
          background: entityColors.banka,
        }
      }
    ],
    edges: [
      {
        id: 'edge3',
        source: 'person2',
        target: 'company1',
        type: 'smoothstep',
        label: 'calisan',
        data: {
          id: 'edge3',
          source: 'person2',
          target: 'company1',
          label: 'calisan',
          properties: { ise_baslama_tarihi: '2022-03-01', pozisyon: 'Senior Developer', maas: 15000 } as Record<string, string | number | boolean>
        }
      },
      {
        id: 'edge4',
        source: 'person2',
        target: 'bank1',
        type: 'smoothstep',
        label: 'musteri',
        data: {
          id: 'edge4',
          source: 'person2',
          target: 'bank1',
          label: 'musteri',
          properties: { hesap_acilis_tarihi: '2020-01-15', hesap_tipi: 'Vadesiz Mevduat' } as Record<string, string | number | boolean>
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Aile İlişkileri Ağı',
    description: 'İki kişi arasındaki evlilik bağı ve adres bilgileri',
    date: '2025-01-05',
    nodes: [
      {
        id: 'husband1',
        type: 'custom',
        position: { x: 100, y: 150 },
        data: {
          id: 'husband1',
          label: 'İnsan',
          type: 'insan',
          color: entityColors.insan,
          properties: { isim: 'Can', soyisim: 'Özkan', yas: 28, cinsiyet: 'Erkek' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.insan}`,
          background: entityColors.insan,
        }
      },
      {
        id: 'wife1',
        type: 'custom',
        position: { x: 350, y: 150 },
        data: {
          id: 'wife1',
          label: 'İnsan',
          type: 'insan',
          color: entityColors.insan,
          properties: { isim: 'Elif', soyisim: 'Özkan', yas: 26, cinsiyet: 'Kadın' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.insan}`,
          background: entityColors.insan,
        }
      },
      {
        id: 'city1',
        type: 'custom',
        position: { x: 225, y: 50 },
        data: {
          id: 'city1',
          label: 'Şehir',
          type: 'sehir',
          color: entityColors.sehir,
          properties: { sehir_adi: 'Ankara', bolge: 'İç Anadolu', nufus: 5600000 } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.sehir}`,
          background: entityColors.sehir,
        }
      },
      {
        id: 'address1',
        type: 'custom',
        position: { x: 225, y: 250 },
        data: {
          id: 'address1',
          label: 'Adres',
          type: 'adres',
          color: entityColors.adres,
          properties: { tam_adres: 'Çankaya Mah. Atatürk Cad. No:15 Ankara', posta_kodu: '06100' } as Record<string, string | number | boolean>
        },
        style: {
          ...defaultNodeStyle,
          border: `2px solid ${entityColors.adres}`,
          background: entityColors.adres,
        }
      }
    ],
    edges: [
      {
        id: 'edge5',
        source: 'husband1',
        target: 'wife1',
        type: 'smoothstep',
        label: 'evli',
        data: {
          id: 'edge5',
          source: 'husband1',
          target: 'wife1',
          label: 'evli',
          properties: { evlilik_tarihi: '2021-06-15', evlilik_yeri: 'Ankara', cocuk_sayisi: 1 } as Record<string, string | number | boolean>
        }
      },
      {
        id: 'edge6',
        source: 'husband1',
        target: 'city1',
        type: 'smoothstep',
        label: 'yasar',
        data: {
          id: 'edge6',
          source: 'husband1',
          target: 'city1',
          label: 'yasar',
          properties: { baslangic_tarihi: '2021-07-01' } as Record<string, string | number | boolean>
        }
      },
      {
        id: 'edge7',
        source: 'wife1',
        target: 'city1',
        type: 'smoothstep',
        label: 'yasar',
        data: {
          id: 'edge7',
          source: 'wife1',
          target: 'city1',
          label: 'yasar',
          properties: { baslangic_tarihi: '2021-07-01' } as Record<string, string | number | boolean>
        }
      },
      {
        id: 'edge8',
        source: 'address1',
        target: 'city1',
        type: 'smoothstep',
        label: 'adresinde',
        data: {
          id: 'edge8',
          source: 'address1',
          target: 'city1',
          label: 'adresinde',
          properties: { kayit_tarihi: '2021-07-01' } as Record<string, string | number | boolean>
        }
      }
    ]
  }
];

export const QueryHistory: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const dispatch = useAppDispatch();
  const activeWorkspaceId = useAppSelector((state) => state.workspace.activeWorkspaceId);

  const loadQueryToCanvas = (query: typeof mockQueryHistory[0]) => {
    if (activeWorkspaceId) {
      dispatch(setWorkspaceNodes({ workspaceId: activeWorkspaceId, nodes: query.nodes }));
      dispatch(setWorkspaceEdges({ workspaceId: activeWorkspaceId, edges: query.edges }));
      setIsHistoryOpen(false);
    }
  };

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <History className="w-4 h-4" />
          <span>Geçmiş Sorgularım</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[500px] sm:w-[540px] bg-gradient-to-b from-slate-50/95 via-white to-blue-50/30 dark:from-gray-900/95 dark:via-gray-800 dark:to-blue-900/20 border-l border-slate-200/60 dark:border-gray-700/60 backdrop-blur-sm"
      >
        <SheetHeader className="pb-4 border-b border-slate-200/50 dark:border-gray-700/50 px-6 pt-6">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <History className="w-5 h-5" />
            </div>
            <span>Geçmiş Sorgularım</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 py-4 pb-8">
            {mockQueryHistory.map((query) => (
              <div
                key={query.id}
                className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => loadQueryToCanvas(query)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                      {query.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {query.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300">
                        <Clock className="w-3 h-3 mr-1" />
                        {query.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {query.nodes.length} Node
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {query.edges.length} Edge
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-1 ml-4 flex-shrink-0" />
                </div>
              </div>
            ))}

            {mockQueryHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Henüz kayıtlı sorgu bulunamadı.</p>
                <p className="text-sm">Sorgularınız otomatik olarak kaydedilecek.</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
