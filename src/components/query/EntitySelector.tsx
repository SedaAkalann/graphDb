import { Button } from "@/components/ui/button";
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
  Home,
  MapPin,
  Trash2,
  MoveDown,
  User
} from "lucide-react";
import React from "react";

const entityList = [
  { id: "insan", label: "İnsan", color: "#2563eb", icon: <User className="w-5 h-5" color="#2563eb" /> },
  { id: "plaka", label: "Plaka", color: "#f59e42", icon: <Car className="w-5 h-5" color="#f59e42" /> },
  { id: "ev", label: "Ev", color: "#22c55e", icon: <Home className="w-5 h-5" color="#22c55e" /> },
  { id: "konum", label: "Konum", color: "#a21caf", icon: <MapPin className="w-5 h-5" color="#a21caf" /> },
]; 
// bu kısım backend'den çekilecek 

export const EntitySelector: React.FC<{
  onClear?: () => void;
  onLoadSample?: () => void;
}> = ({ onClear, onLoadSample }) => (
  <aside
    className="
       min-w-[200px] max-w-xs bg-white border-r border-gray-200
      flex flex-col z-10
      md:static fixed left-0 top-0 md:h-full h-[60vh] md:w-56 w-4/5
      transition-all
    "
    style={{ zIndex: 20 }}
  >
    <Card className="h-full flex flex-col shadow-none border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Varlıklar</CardTitle>
        <p className="text-xs text-muted-foreground">Şemaya sürükleyip bırakın</p>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col pt-4 pb-0 px-0">
        {/* ÜST LİSTE: aynı yatay padding için px-3 */}
        <ScrollArea className="flex-1">
          <div className="px-3 flex flex-col gap-2">
            {entityList.map((entity) => (
              <Button
                key={entity.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow-label", entity.label);
                  event.dataTransfer.setData("application/reactflow-type", entity.id);
                  event.dataTransfer.setData("application/reactflow-color", entity.color);
                }}
                variant="outline"
                className="
                  w-full h-10 rounded-lg
                  px-3 justify-start items-center gap-3
                  bg-gray-50 hover:bg-blue-50 border-gray-200
                  shadow-sm cursor-grab active:scale-95 transition
                "
                style={{ userSelect: "none" }}
              >
                {entity.icon}
                <span className="font-medium text-gray-800">{entity.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        {/* ALT AKSİYONLAR: üsttekiyle aynı padding, aynı yükseklik, aynı hizalama */}
        <div className="px-3 flex flex-col gap-2 mb-3">
          <Button
            variant="outline"
            onClick={onLoadSample}
            className="
              w-full h-10 rounded-lg
              px-3  gap-3
              bg-gray-50 hover:bg-blue-50 border-gray-200
              shadow-sm transition flex justify-center items-center"
          >
            <MoveDown color="blue" className="w-5 h-5" />
            <span className="font-medium text-gray-800">Örnek Yükle</span>
          </Button>

          <Button
            variant="outline"

            onClick={onClear}
            className="
              w-full h-10 rounded-lg
              px-3  gap-3
              bg-gray-50 hover:bg-blue-50 border-gray-200
              shadow-sm transition flex justify-center items-center
            "
          >
            <Trash2 color="red" className="w-5 h-5" />
            <span className="font-medium text-gray-800">Sorguyu Temizle</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </aside>
);
