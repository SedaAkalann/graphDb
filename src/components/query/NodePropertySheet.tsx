import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import React from "react";
import type { Node } from "reactflow";
import { entityProperties } from "../../constants/entityProperties";
import type { RFNodeData } from "../../types/types";

interface NodePropertySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node<RFNodeData> | null;
  onNodePropertyChange: (key: string, value: string | number | boolean) => void;
}

export const NodePropertySheet: React.FC<NodePropertySheetProps> = ({
  isOpen,
  onOpenChange,
  selectedNode,
  onNodePropertyChange,
}) => {
  // Node türüne göre özellikleri al
  const properties = selectedNode ? entityProperties[selectedNode.data.type] || [] : [];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] bg-gradient-to-b from-slate-50/95 via-white to-blue-50/30 dark:from-gray-900/95 dark:via-gray-800 dark:to-blue-900/20 border-l border-slate-200/60 dark:border-gray-700/60 backdrop-blur-sm"
      >
        <SheetHeader className="pb-4 border-b border-slate-200/50 dark:border-gray-700/50 px-6 pt-6">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <Settings className="w-5 h-5" />
            </div>
            {selectedNode ? `${selectedNode.data.label} Özellikleri` : "Node Paneli"}
          </SheetTitle>
          <SheetDescription>
            Seçili node'un özelliklerini düzenleyin.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-6 py-4 pb-8">

            {/* Node Bilgileri */}
            {selectedNode && (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm border-2 border-white dark:border-gray-700"
                    style={{ backgroundColor: selectedNode.data.color }}
                  />
                  {selectedNode.data.label} Bilgileri
                </h3>

                <div className="grid gap-4">
                  <div className="p-4 bg-gradient-to-r from-slate-50/50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-slate-200/50 dark:border-gray-600/50">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Node Türü
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 capitalize">
                      {selectedNode.data.type}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Node Özellikleri */}
            {selectedNode && (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm border-2 border-white dark:border-gray-700"
                    style={{ backgroundColor: selectedNode.data.color }}
                  />
                  {selectedNode.data.label} Özellikleri
                </h3>

                <div className="grid gap-4">
                  {properties.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                      <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Bu node türü için özellik tanımlanmamış</p>
                    </div>
                  ) : (
                    properties.map((property) => (
                      <div key={property.key} className="space-y-3 p-4 bg-gradient-to-r from-slate-50/50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-slate-200/50 dark:border-gray-600/50">
                        <Label
                          htmlFor={property.key}
                          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {property.label}
                        </Label>

                        {property.type === "select" ? (
                          <Select
                            value={selectedNode.data.properties?.[property.key]?.toString() || ""}
                            onValueChange={(value) => onNodePropertyChange(property.key, value)}
                          >
                            <SelectTrigger className="w-full h-10 bg-white/80 dark:bg-gray-800/80 border-slate-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all">
                              <SelectValue placeholder={`${property.label} seçin`} />
                            </SelectTrigger>
                            <SelectContent>
                              {property.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={property.key}
                            type={property.type === "number" ? "number" : "text"}
                            placeholder={`${property.label} girin...`}
                            value={selectedNode.data.properties?.[property.key]?.toString() || ""}
                            onChange={(e) => {
                              const value = property.type === "number" 
                                ? (e.target.value ? Number(e.target.value) : 0)
                                : e.target.value;
                              onNodePropertyChange(property.key, value);
                            }}
                            className="w-full h-10 bg-white/80 dark:bg-gray-800/80 border-slate-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
