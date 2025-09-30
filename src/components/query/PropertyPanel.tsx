import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Database, Info, Save, Settings, Target } from "lucide-react";
import React from "react";
import type { Edge, Node } from "reactflow";
import type { RFEdgeData, RFNodeData } from "../../types/types";
import { NodePropertyForm } from "./NodePropertyForm";

export const PropertyPanel: React.FC<{
  selectedNode: Node<RFNodeData> | null;
  onNodePropertyChange: (key: string, value: string | number | boolean) => void;
  resultLimit: number;
  setResultLimit: (v: number) => void;
  queryDepth: number;
  setQueryDepth: (v: number) => void;
  onSave?: () => void;
  nodes?: Node<RFNodeData>[];
  edges?: Edge<RFEdgeData>[];
}> = ({
  selectedNode,
  onNodePropertyChange,
  resultLimit,
  setResultLimit,
  queryDepth,
  setQueryDepth,
  onSave,
  nodes = [],
  edges = [],
}) => (
    <aside className="min-w-[340px] max-w-[400px] bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-md border-l border-slate-200/60 dark:border-gray-700/60 flex flex-col shadow-2xl h-full overflow-hidden ">
      <Card className="h-full flex flex-col shadow-none border-none bg-transparent">
        {/* Header */}
        <CardHeader className="pb-6 px-6 pt-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-900/40 dark:to-indigo-900/40 border-b border-slate-200/50 dark:border-gray-700/50 flex-shrink-0 ">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Graph Özellikleri
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sorgu parametrelerini ve node özelliklerini yönetin</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
          <ScrollArea
            className="flex-1 h-full"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#6366f1 #f1f5f9'
            }}
          >
            <div className="px-6 py-6 space-y-6">

              {/* Sorgu Parametreleri */}
              <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/30 dark:from-gray-800/80 dark:to-blue-900/30 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Sorgu Parametreleri</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/50">
                        <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Sonuç Limiti
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={resultLimit}
                      onChange={(e) => setResultLimit(Number(e.target.value))}
                      className="h-11 bg-white/80 dark:bg-gray-800/80 border-slate-300/50 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-900 dark:text-slate-100"
                      placeholder="Maksimum sonuç sayısı"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">Döndürülecek maksimum kayıt sayısı</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Sorgu Derinliği
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={queryDepth}
                      onChange={(e) => setQueryDepth(Number(e.target.value))}
                      className="h-11 bg-white/80 dark:bg-gray-800/80 border-slate-300/50 dark:border-gray-600/50 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-900 dark:text-slate-100"
                      placeholder="Traversal derinliği"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">Graph'ta kaç seviye derinlik taranacak</p>
                  </div>
                </div>
              </div>

              {/* Node Özellikleri */}
              {selectedNode ? (
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
                      style={{ backgroundColor: selectedNode.data.color || '#64748b' }}
                    />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{selectedNode.data.label} Detayları</h3>
                  </div>
                  <NodePropertyForm
                    nodeType={selectedNode.data.type}
                    values={selectedNode.data.properties || {}}
                    onChange={onNodePropertyChange}
                  />

                  {onSave && (
                    <button
                      onClick={onSave}
                      className="
                        mt-6 w-full h-12 rounded-2xl
                        bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600
                        hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700
                        text-white font-bold text-sm
                        shadow-lg hover:shadow-2xl hover:-translate-y-1
                        transition-all duration-300 ease-out
                        flex items-center justify-center gap-3
                        active:scale-[0.96] overflow-hidden group
                        border border-emerald-400/50
                      "
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <Save className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12" />
                      <span className="relative z-10">Node'u Kaydet</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-50/80 to-gray-50/60 dark:from-gray-800/80 dark:to-gray-900/60 rounded-2xl p-8 border border-slate-200/50 dark:border-gray-700/50 text-center shadow-sm">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-slate-400 dark:text-gray-500 w-fit mx-auto mb-5">
                    <Info className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Node Seçilmedi</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-gray-800/50 px-4 py-3 rounded-xl">
                    Özelliklerini düzenlemek için şemadan bir node seçin.
                    Sol panelden yeni node'lar ekleyebilir veya mevcut node'ları düzenleyebilirsiniz.
                  </p>
                </div>
              )}

              {/* Graph İstatistikleri */}
              <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-900/40 dark:to-purple-900/40 rounded-2xl p-6 border border-violet-200/50 dark:border-violet-800/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Graph İstatistikleri</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-800/50 hover:shadow-sm transition-all duration-200">
                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{nodes.length}</div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Node'lar</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-800/50 hover:shadow-sm transition-all duration-200">
                    <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{edges.length}</div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Bağlantılar</div>
                  </div>
                </div>
              </div>

            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
