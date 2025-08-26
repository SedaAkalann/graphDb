import React from "react";
import { Filter, Play } from "lucide-react";
import { NodePropertyForm } from "./NodePropertyForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PropertyPanel: React.FC<{
  selectedNode: any;
  onNodePropertyChange: (key: string, value: any) => void;
  resultLimit: number;
  setResultLimit: (v: number) => void;
  queryDepth: number;
  setQueryDepth: (v: number) => void;
  onQuery: () => void;
  onFilter?: () => void;
}> = ({
  selectedNode,
  onNodePropertyChange,
  resultLimit,
  setResultLimit,
  queryDepth,
  setQueryDepth,
  onQuery,
  onFilter,
}) => (
  <aside
    className="
      w-80 min-w-[260px] max-w-sm h-full bg-white border-l border-gray-200
      flex flex-col z-10
      md:static fixed right-0 top-0 md:h-full h-[60vh] md:w-80 w-4/5
      transition-all overflow-y-auto
    "
    style={{ zIndex: 20 }}
  >
    <Card className="h-full flex flex-col shadow-none border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Sorgu Özellikleri</CardTitle>
        <p className="text-xs text-muted-foreground">
          Limitleri ayarlayın, özellikleri düzenleyin
        </p>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col pt-4 pb-0 px-0">
        <ScrollArea className="flex-1">
          <div className="px-3 flex flex-col gap-4">
            {/* SONUÇ LİMİTİ */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-600">
                Sonuç Limiti
              </label>
              <Input
                type="number"
                min={1}
                value={resultLimit}
                onChange={(e) => setResultLimit(Number(e.target.value))}
                className="h-9"
              />
            </div>

            {/* SORGU DERİNLİĞİ */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-600">
                Sorgu Derinliği
              </label>
              <Input
                type="number"
                min={1}
                value={queryDepth}
                onChange={(e) => setQueryDepth(Number(e.target.value))}
                className="h-9"
              />
            </div>

            {/* NODE ÖZELLİKLERİ */}
            {selectedNode && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {selectedNode.data.label} Özellikleri
                </h3>
                <NodePropertyForm
                  nodeType={selectedNode.data.type}
                  values={selectedNode.data.properties || {}}
                  onChange={onNodePropertyChange}
                />

                {/* FİLTRE BUTONU */}
                {onFilter && (
                  <Button
                    variant="outline"
                    onClick={onFilter}
                    className="
                      mt-4 w-full h-10 rounded-lg
                      px-3 justify-start items-center gap-3
                      bg-gray-50 hover:bg-blue-50 border-gray-200
                      shadow-sm transition
                    "
                  >
                    <Filter className="w-5 h-5" />
                    <span className="font-medium text-gray-800">Filtrele</span>
                  </Button>
                )}

                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-3 text-xs text-gray-400">veya</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        {/* SORGULA BUTONU */}
        <div className="px-3 flex flex-col gap-2 mb-3">
          <Button
            onClick={onQuery}
            className="
               w-full h-10 rounded-lg
              px-3 justify-start items-center gap-3
              bg-gray-50 hover:bg-blue-50 border-gray-200
              shadow-sm transition flex justify-center items-center
            "
          >
            <Play color="blue"  className="w-5 h-5" />
            <span className="font-medium text-gray-800">Sorgula</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </aside>
);
