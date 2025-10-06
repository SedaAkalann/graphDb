import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Building,
  Car,
  CreditCard,
  Home,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User
} from "lucide-react";
import React from "react";

const entityList = [
  { id: "insan", label: "İnsan", color: "#2563eb", icon: User },
  { id: "plaka", label: "Plaka", color: "#f59e42", icon: Car },
  { id: "ev", label: "Ev", color: "#22c55e", icon: Home },
  { id: "konum", label: "Konum", color: "#a21caf", icon: MapPin },
  { id: "sirket", label: "Şirket", color: "#dc2626", icon: Building },
  { id: "telefon", label: "Telefon", color: "#059669", icon: Phone },
  { id: "email", label: "Email", color: "#7c3aed", icon: Mail },
  { id: "banka", label: "Banka", color: "#b91c1c", icon: Building },
  { id: "hesap", label: "Hesap", color: "#0891b2", icon: CreditCard },
  { id: "adres", label: "Adres", color: "#ea580c", icon: MapPin },
  { id: "ulke", label: "Ülke", color: "#16a34a", icon: MapPin },
  { id: "sehir", label: "Şehir", color: "#9333ea", icon: MapPin },
];

export const EntitySelector: React.FC<{
  onClear?: () => void;
  onLoadSample?: () => void;
}> = ({ onClear, onLoadSample }) => (
  <TooltipProvider>
    <aside className="w-full bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-md border-r border-slate-200/60 dark:border-gray-700/60 flex flex-col shadow-2xl h-full overflow-hidden">
      <div className="h-full flex flex-col">

        {/* Entity Icons - Scrollable Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              {entityList.map((entity) => {
                const IconComponent = entity.icon;
                return (
                  <Tooltip key={entity.id}>
                    <TooltipTrigger asChild>
                      <div
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("application/reactflow-label", entity.label);
                          event.dataTransfer.setData("application/reactflow-type", entity.id);
                          event.dataTransfer.setData("application/reactflow-color", entity.color);
                        }}
                        className="
                          w-12 h-12 rounded-xl flex items-center justify-center
                          cursor-grab active:scale-95 hover:scale-105
                          transition-all duration-200 ease-out
                          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                          hover:bg-white dark:hover:bg-gray-700
                          border border-slate-200/60 dark:border-gray-600/60
                          hover:border-slate-300 dark:hover:border-gray-500
                          shadow-sm hover:shadow-lg
                        "
                        style={{ userSelect: "none" }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: entity.color }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{entity.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Clear Button - Fixed at Bottom */}
        <div className="p-3 border-t border-slate-200/60 dark:border-gray-700/60 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onClear}
                size="sm"
                variant="destructive"
                className="w-full h-10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Şemayı Temizle</p>
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
    </aside>
  </TooltipProvider>
);
