import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowRight, GitBranch } from "lucide-react";
import React from "react";
import type { Edge, Node } from "reactflow";
import { edgeProperties } from "../../constants/edgeProperties";
import type { RFEdgeData, RFNodeData } from "../../types/types";

interface EdgePropertySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEdge: Edge<RFEdgeData> | null;
  onEdgePropertyChange: (key: string, value: string | number | boolean) => void;
  nodes: Node<RFNodeData>[];
  edges: Edge<RFEdgeData>[];
}

export const EdgePropertySheet: React.FC<EdgePropertySheetProps> = ({
  isOpen,
  onOpenChange,
  selectedEdge,
  onEdgePropertyChange,
  nodes,
}) => {
  // Edge türü state'i
  const [selectedEdgeType, setSelectedEdgeType] = React.useState<string>('');

  // Edge seçildiğinde türü sıfırla veya mevcut türü al
  React.useEffect(() => {
    if (selectedEdge) {
      // Önce data.properties.type'dan al, yoksa label'dan çıkarsmaya çalış
      const currentType = selectedEdge?.data?.properties?.type as string || 
                         selectedEdge?.data?.label?.toLowerCase().replace(/\s+/g, '_') || '';
      
      if (currentType && edgeProperties[currentType]) {
        setSelectedEdgeType(currentType);
      } else {
        setSelectedEdgeType('');
      }
    } else {
      setSelectedEdgeType('');
    }
  }, [selectedEdge]);

  // Seçili edge türüne göre özellikleri al
  const properties = selectedEdgeType ? (edgeProperties[selectedEdgeType] || []) : [];

  // Source ve target node'ları bulma
  const sourceNode = nodes.find(node => node.id === selectedEdge?.source);
  const targetNode = nodes.find(node => node.id === selectedEdge?.target);

  // İlişki türü seçim listesi - edgeProperties.ts'teki key'lerle eşleşir
  const relationshipTypes = [
    { value: 'arkadas', label: 'Arkadaş' },
    { value: 'evli', label: 'Evli' },
    { value: 'akraba', label: 'Akraba' },
    { value: 'calisan', label: 'Çalışan' },
    { value: 'sahip', label: 'Sahip' },
    { value: 'arac_sahibi', label: 'Araç Sahibi' },
    { value: 'oturan', label: 'Oturan' },
    { value: 'bulundu', label: 'Bulundu' },
    { value: 'arama_yapti', label: 'Arama Yaptı' },
    { value: 'mesaj_gonderdi', label: 'Mesaj Gönderdi' },
    { value: 'email_gonderdi', label: 'Email Gönderdi' },
    { value: 'para_transferi', label: 'Para Transferi' },
    { value: 'default', label: 'Genel Bağlantı' }
  ];

  // İlişki türü değiştirildiğinde
  const handleTypeChange = (value: string) => {
    setSelectedEdgeType(value);
    // Edge türünü ve label'ını güncelle
    const selectedType = relationshipTypes.find(type => type.value === value);
    if (selectedType && onEdgePropertyChange) {
      onEdgePropertyChange('type', value); // Türü kaydet
      onEdgePropertyChange('label', selectedType.label); // Label'ı güncelle
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] bg-gradient-to-b from-slate-50/95 via-white to-blue-50/30 dark:from-gray-900/95 dark:via-gray-800 dark:to-blue-900/20 border-l border-slate-200/60 dark:border-gray-700/60 backdrop-blur-sm"
      >
        <SheetHeader className="pb-4 border-b border-slate-200/50 dark:border-gray-700/50 px-6 pt-6">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <GitBranch className="w-5 h-5" />
            </div>
            {selectedEdge ? `${selectedEdgeType || 'İlişki'} Özellikleri` : "İlişki Paneli"}
          </SheetTitle>
          <SheetDescription>
            Seçili ilişkinin özelliklerini düzenleyin.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-6 py-4 pb-8">

            {/* Bağlantı Bilgileri */}
            {selectedEdge && sourceNode && targetNode && (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                  Bağlantı Bilgileri
                </h3>

                <div className="grid grid-cols-3 gap-3 items-center text-sm">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2 shadow-sm border-2 border-white dark:border-gray-700"
                      style={{ backgroundColor: sourceNode.data?.color || '#3b82f6' }}
                    />
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {sourceNode.data?.label || 'Source'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {sourceNode.data?.type || ''}
                    </div>
                  </div>

                  <div className="text-center">
                    <ArrowRight className="w-6 h-6 text-blue-400 mx-auto" />
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2 shadow-sm border-2 border-white dark:border-gray-700"
                      style={{ backgroundColor: targetNode.data?.color || '#3b82f6' }}
                    />
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {targetNode.data?.label || 'Target'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {targetNode.data?.type || ''}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* İlişki Türü Seçimi */}
            {selectedEdge && (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-purple-500" />
                  İlişki Türü
                </h3>

                <div className="space-y-3">
                  <Label htmlFor="edge-type" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    İlişki Türünü Seçin
                  </Label>
                  <Select
                    value={selectedEdgeType}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger className="w-full h-12 bg-white/80 dark:bg-gray-800/80 border-slate-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all">
                      <SelectValue placeholder="İlişki türü seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* İlişki Özellikleri */}
            {selectedEdge && selectedEdgeType && (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-slate-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm border-2 border-white dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                  {relationshipTypes.find(type => type.value === selectedEdgeType)?.label || selectedEdgeType} Özellikleri
                </h3>

                <div className="grid gap-4">
                  {properties.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                      <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Bu ilişki için özellik tanımlanmamış</p>
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
                            value={selectedEdge.data?.properties?.[property.key]?.toString() || ""}
                            onValueChange={(value) => onEdgePropertyChange(property.key, value)}
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
                            type={property.type === "number" ? "number" : property.type === "date" ? "date" : "text"}
                            placeholder={property.type === "date" ? "" : `${property.label} girin...`}
                            value={selectedEdge.data?.properties?.[property.key]?.toString() || ""}
                            onChange={(e) => {
                              const value = property.type === "number" 
                                ? (e.target.value ? Number(e.target.value) : 0)
                                : e.target.value;
                              onEdgePropertyChange(property.key, value);
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
