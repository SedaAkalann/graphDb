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
      className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {children}
      {sortField === field && (
        sortDirection === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
      )}
    </button>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50/95 via-white to-blue-50/30 dark:from-gray-900/95 dark:via-gray-800 dark:to-blue-900/20 p-4 overflow-hidden flex flex-col">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4">
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
      {/* Stats */}
      <div className="mb-3 flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-200/60">
          <span className="text-xs text-slate-600">
            <span className="font-semibold text-blue-800">{filteredAndSortedNodes.length}</span> düğüm
            {nodes.length !== filteredAndSortedNodes.length && (
              <span className="text-slate-500 dark:text-slate-400 ml-1">/ {nodes.length}</span>
            )}
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 border border-slate-200/60">
          <span className="text-xs text-slate-600">
            <span className="font-semibold text-purple-800">{edges.length}</span> bağlantı
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-gray-600/50 shadow-lg overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-gray-700 dark:to-gray-600 border-b border-slate-200/50 dark:border-gray-600/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5 text-left">
                  <SortButton field="label">Düğüm</SortButton>
                </th>
                <th className="px-4 py-2.5 text-left">
                  <SortButton field="type">Tür</SortButton>
                </th>
                <th className="px-4 py-2.5 text-left">Özellikler</th>
                <th className="px-4 py-2.5 text-left">
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
                      border-b border-slate-100/60 dark:border-gray-700/60 hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors
                      ${index % 2 === 0 ? "bg-white/60 dark:bg-gray-800/60" : "bg-slate-50/40 dark:bg-gray-700/40"}
                    `}>
                      {/* Node Info */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-white dark:border-gray-800 shadow-sm"
                            style={{ backgroundColor: node.backgroundColor }}
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{node.label}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-2.5">
                        <div className={`
                          inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium
                          ${getTypeColor(node.type)}
                        `}>
                          <span className="text-xs">{getTypeIcon(node.type)}</span>
                          <span className="capitalize">{node.type}</span>
                        </div>
                      </td>

                      {/* Properties */}
                      <td className="px-4 py-2.5">
                        <div className="space-y-0.5 max-w-xs">
                          {Object.entries(node.properties).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-xs truncate">
                              <span className="text-slate-500 dark:text-slate-400 font-medium">{key}:</span>{" "}
                              <span className="text-slate-700 dark:text-slate-300">{String(value)}</span>
                            </div>
                          ))}
                          {Object.keys(node.properties).length > 2 && (
                            <div className="text-xs text-slate-400 dark:text-slate-500 italic">
                              +{Object.keys(node.properties).length - 2} özellik
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Connections */}
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Network className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {node.connections.length}
                          </span>
                          {node.connections.length > 0 && (
                            <button
                              onClick={() => toggleExpanded(node.id)}
                              className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-colors ml-1"
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all">
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row - Connections Detail */}
                    {isExpanded && node.connections.length > 0 && (
                      <tr className="bg-blue-50/20 dark:bg-gray-700/30 border-l-2 border-blue-400">
                        <td colSpan={5} className="px-4 py-2">
                          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-gray-600/50">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                              <Network className="w-3.5 h-3.5" />
                              Bağlantılar ({node.connections.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {node.connections.map((conn, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-slate-50/60 dark:bg-gray-700/60 rounded-md border border-slate-200/40 dark:border-gray-600/40"
                                >
                                  <div className={`
                                    w-1.5 h-1.5 rounded-full
                                    ${conn.direction === "outgoing" ? "bg-green-500" : "bg-blue-500"}
                                  `} />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                                      {conn.targetLabel}
                                    </div>
                                    {conn.edgeLabel && (
                                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {conn.edgeLabel}
                                      </div>
                                    )}
                                  </div>
                                  <div className={`
                                    text-xs px-1.5 py-0.5 rounded text-white font-medium
                                    ${conn.direction === "outgoing" ? "bg-green-500" : "bg-blue-500"}
                                  `}>
                                    {conn.direction === "outgoing" ? "→" : "←"}
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
