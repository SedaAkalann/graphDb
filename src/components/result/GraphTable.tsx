import { ChevronDown, ChevronUp, ExternalLink, Network, Zap } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { CytoData } from "../../types/types";
import { TableFilter } from "./TableFilter";
import { TableSearch } from "./TableSearch";

interface GraphTableProps {
  data: CytoData;
}

interface NodeData {
  id: string;
  label: string;
  type: string;
  properties: Record<string, string | number | boolean>;
  backgroundColor: string;
  connections: Array<{
    targetId: string;
    targetLabel: string;
    edgeLabel: string;
    direction: "outgoing" | "incoming";
  }>;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
}

type SortField = "label" | "type" | "connections";
type SortDirection = "asc" | "desc";

// Helper function to parse properties string
const parseProperties = (propertiesString: string): Record<string, string | number | boolean> => {
  try {
    const properties: Record<string, string | number | boolean> = {};
    const lines = propertiesString.split("\\n");

    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        properties[key] = value;
      }
    });

    return properties;
  } catch {
    return {};
  }
};

export const GraphTable: React.FC<GraphTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("label");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Data processing
  const { nodes, edges, nodeTypes } = useMemo(() => {
    const nodeMap = new Map<string, NodeData>();
    const edgeList: EdgeData[] = [];
    const typeSet = new Set<string>();

    // Process elements
    data.elements.forEach((element) => {
      const { data: elementData } = element;

      if (elementData.source && elementData.target) {
        // This is an edge
        const edge: EdgeData = {
          id: elementData.id || `${elementData.source}-${elementData.target}`,
          source: elementData.source,
          target: elementData.target,
          label: elementData.label || "",
        };
        edgeList.push(edge);
      } else {
        // This is a node
        const properties = elementData.properties
          ? parseProperties(elementData.properties)
          : {};

        const node: NodeData = {
          id: elementData.id || "",
          label: elementData.label || "",
          type: elementData.type || "unknown",
          backgroundColor: elementData.backgroundColor || "#6b7280",
          properties,
          connections: [],
        };

        nodeMap.set(node.id, node);
        typeSet.add(node.type);
      }
    });

    // Build connections
    edgeList.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (sourceNode && targetNode) {
        sourceNode.connections.push({
          targetId: edge.target,
          targetLabel: targetNode.label,
          edgeLabel: edge.label,
          direction: "outgoing",
        });

        targetNode.connections.push({
          targetId: edge.source,
          targetLabel: sourceNode.label,
          edgeLabel: edge.label,
          direction: "incoming",
        });
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: edgeList,
      nodeTypes: Array.from(typeSet).sort(),
    };
  }, [data]);

  // Filtering and sorting
  const filteredAndSortedNodes = useMemo(() => {
    const filtered = nodes.filter((node) => {
      const matchesSearch = !searchTerm ||
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(node.properties).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(node.type);

      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "connections":
          aValue = a.connections.length;
          bValue = b.connections.length;
          break;
        default:
          aValue = a.label;
          bValue = b.label;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [nodes, searchTerm, selectedTypes, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedRows(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      insan: "👤",
      plaka: "🚗",
      ev: "🏠",
      konum: "📍",
      sirket: "🏢",
      telefon: "📱",
      email: "📧",
    };
    return icons[type as keyof typeof icons] || "🔵";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      insan: "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
      plaka: "bg-orange-50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
      ev: "bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
      konum: "bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
      sirket: "bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
      telefon: "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
      email: "bg-pink-50 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700",
    };
    return colors[type as keyof typeof colors] || "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 "
    >
      {children}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/30 dark:via-gray-900 dark:to-indigo-900/30 p-2 overflow-hidden flex flex-col ">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-2">
        <div className="flex-1">
          <TableSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Düğümlerde, özelliklerde ara..."
          />
        </div>

        <div className="flex-shrink-0">
          <TableFilter
            nodeTypes={nodeTypes}
            selectedTypes={selectedTypes}
            onTypeToggle={(type) => {
              setSelectedTypes(prev =>
                prev.includes(type)
                  ? prev.filter(t => t !== type)
                  : [...prev, type]
              );
            }}
            onClearAll={() => setSelectedTypes([])}
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-2 flex items-center gap-4">
        <div className="bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-200/60">
          <span className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{filteredAndSortedNodes.length}</span> düğüm
            {nodes.length !== filteredAndSortedNodes.length && (
              <span className="text-slate-500 dark:text-slate-400 ml-1">/ {nodes.length} toplam</span>
            )}
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-200/60">
          <span className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{edges.length}</span> bağlantı
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-gray-600/60 shadow-sm overflow-hidden flex flex-col ">
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-gray-700/80 border-b border-slate-200/60 dark:border-gray-600/60 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <SortButton field="label">Düğüm</SortButton>
                </th>
                <th className="px-6 py-4 text-left">
                  <SortButton field="type">Tür</SortButton>
                </th>
                <th className="px-6 py-4 text-left">Özellikler</th>
                <th className="px-6 py-4 text-left">
                  <SortButton field="connections">Bağlantılar</SortButton>
                </th>
                <th className="px-6 py-4 text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedNodes.map((node, index) => {
                const isExpanded = expandedRows.has(node.id);
                return (
                  <React.Fragment key={node.id}>
                    <tr className={`
                      border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50/50 dark:hover:bg-gray-700/50 
                      ${index % 2 === 0 ? "bg-white/50 dark:bg-gray-800/50" : "bg-slate-50/30 dark:bg-gray-700/30"}
                    `}>
                      {/* Node Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                            style={{ backgroundColor: node.backgroundColor }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{node.label}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className={`
                          inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium
                          ${getTypeColor(node.type)}
                        `}>
                          <span>{getTypeIcon(node.type)}</span>
                          <span className="capitalize">{node.type}</span>
                        </div>
                      </td>

                      {/* Properties */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {Object.entries(node.properties).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="text-slate-500 dark:text-slate-400">{key}:</span>{" "}
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{String(value)}</span>
                            </div>
                          ))}
                          {Object.keys(node.properties).length > 2 && (
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              +{Object.keys(node.properties).length - 2} daha...
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Connections */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Network className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <span className="text-sm font-semibold text-slate-700">
                            {node.connections.length}
                          </span>
                          {node.connections.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(node.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-2"
                            >
                              {isExpanded ? "Gizle" : "Göster"}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row - Connections Detail */}
                    {isExpanded && node.connections.length > 0 && (
                      <tr className="bg-slate-50/50 dark:bg-gray-800/50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-600/60">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                              <Network className="w-4 h-4" />
                              Bağlantılar ({node.connections.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {node.connections.map((conn, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg"
                                >
                                  <div className={`
                                    w-2 h-2 rounded-full
                                    ${conn.direction === "outgoing" ? "bg-green-500 dark:bg-green-400" : "bg-blue-500 dark:bg-blue-400"}
                                  `} />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                                      {conn.targetLabel}
                                    </div>
                                    {conn.edgeLabel && (
                                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {conn.edgeLabel}
                                      </div>
                                    )}
                                  </div>
                                  <div className={`
                                    text-xs px-2 py-1 rounded-md font-medium
                                    ${conn.direction === "outgoing"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                    }
                                  `}>
                                    {conn.direction === "outgoing" ? "Giden" : "Gelen"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredAndSortedNodes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <Network className="w-12 h-12 mx-auto mb-2" />
              </div>
              <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-md">
                Arama kriterlerinize uygun düğüm bulunamadı. Farklı arama terimleri veya filtreler deneyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
