import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Download,
  HelpCircle,
  Home,
  Layers3,
  MapPin,
  Sparkles,
  Trash2,
  User
} from "lucide-react";
import React from "react";

const entityList = [
  { id: "insan", label: "İnsan", color: "#2563eb", icon: <User className="w-5 h-5" color="#2563eb" /> },
  { id: "plaka", label: "Plaka", color: "#f59e42", icon: <Car className="w-5 h-5" color="#f59e42" /> },
  { id: "ev", label: "Ev", color: "#22c55e", icon: <Home className="w-5 h-5" color="#22c55e" /> },
  { id: "konum", label: "Konum", color: "#a21caf", icon: <MapPin className="w-5 h-5" color="#a21caf" /> },
  { id: "sirket", label: "Şirket", color: "#dc2626", icon: <Home className="w-5 h-5" color="#dc2626" /> },
  { id: "telefon", label: "Telefon", color: "#059669", icon: <User className="w-5 h-5" color="#059669" /> },
  { id: "email", label: "Email", color: "#7c3aed", icon: <User className="w-5 h-5" color="#7c3aed" /> },
  { id: "banka", label: "Banka", color: "#b91c1c", icon: <Home className="w-5 h-5" color="#b91c1c" /> },
  { id: "hesap", label: "Hesap", color: "#0891b2", icon: <Car className="w-5 h-5" color="#0891b2" /> },
  { id: "adres", label: "Adres", color: "#ea580c", icon: <MapPin className="w-5 h-5" color="#ea580c" /> },
  { id: "ulke", label: "Ülke", color: "#16a34a", icon: <MapPin className="w-5 h-5" color="#16a34a" /> },
  { id: "sehir", label: "Şehir", color: "#9333ea", icon: <MapPin className="w-5 h-5" color="#9333ea" /> },
];

export const EntitySelector: React.FC<{
  onClear?: () => void;
  onLoadSample?: () => void;
}> = ({ onClear, onLoadSample }) => (
  <aside className="min-w-[300px] max-w-[340px] bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-md border-r border-slate-200/60 flex flex-col shadow-2xl h-full overflow-hidden">
    <Card className="h-full flex flex-col shadow-none border-none bg-transparent">

      {/* Header */}
      <CardHeader className="pb-6 px-6 pt-6 bg-gradient-to-r from-purple-50/80 to-pink-50/60 border-b border-slate-200/50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            <Layers3 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Entity Paleti</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Graph şemasını oluşturmak için sürükle-bırak yapın</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        <ScrollArea
          className="flex-1 h-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#8b5cf6 #f1f5f9'
          }}
        >
          <div className="px-6 py-6 space-y-6">

            {/* Entity List */}
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-700">Mevcut Entity'ler</h3>
              </div>

              <div className="space-y-3">
                {entityList.map((entity) => (
                  <div
                    key={entity.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("application/reactflow-label", entity.label);
                      event.dataTransfer.setData("application/reactflow-type", entity.id);
                      event.dataTransfer.setData("application/reactflow-color", entity.color);
                    }}
                    className="
                      w-full h-14 rounded-2xl
                      px-5 flex items-center gap-4
                      bg-white/80 backdrop-blur-sm hover:bg-white/90 
                      border border-slate-200/60 hover:border-slate-300
                      shadow-sm hover:shadow-lg cursor-grab active:scale-[0.98] 
                      transition-all duration-300 ease-out
                      group hover:-translate-y-0.5
                    "
                    style={{ userSelect: "none" }}
                  >
                    <div
                      className="p-2.5 rounded-xl shadow-sm flex items-center justify-center"
                      style={{
                        backgroundColor: `${entity.color}15`,
                        border: `1px solid ${entity.color}20`
                      }}
                    >
                      {entity.icon}
                    </div>
                    <span className="font-semibold text-slate-800 group-hover:text-slate-900">{entity.label}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        Sürükle & Bırak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="pb-4">
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-slate-700">Nasıl Kullanılır?</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Entity'leri orta panele sürükleyerek graph şemanızı oluşturun.
                  Node'lar arasına bağlantı çizmek için node'dan node'a çizgi çekin.
                </p>
              </div>
            </div>

            <Separator className="mb-3" />

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={onLoadSample}
                className="
                  w-full h-12 rounded-2xl
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                  hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                  text-white font-semibold text-sm
                  shadow-lg hover:shadow-xl hover:-translate-y-0.5
                  transition-all duration-300 ease-out
                  flex items-center justify-center gap-3
                  active:scale-[0.98] relative overflow-hidden
                  before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] 
                  hover:before:translate-x-[100%] before:transition-transform before:duration-700
                "
              >
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Örnek Schema Yükle</span>
              </button>

              <button
                onClick={onClear}
                className="
                  w-full h-12 rounded-2xl
                  bg-white/50 backdrop-blur-sm hover:bg-white/70
                  border border-red-200 hover:border-red-300
                  text-red-600 hover:text-red-700 font-semibold text-sm
                  shadow-sm hover:shadow-lg hover:-translate-y-0.5
                  transition-all duration-300 ease-out
                  flex items-center justify-center gap-3
                  active:scale-[0.98] relative overflow-hidden
                  before:absolute before:inset-0 before:bg-red-50/50 before:translate-x-[-100%] 
                  hover:before:translate-x-[100%] before:transition-transform before:duration-700
                "
              >
                <Trash2 className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Temizle</span>
              </button>
            </div>

          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </aside>
);
