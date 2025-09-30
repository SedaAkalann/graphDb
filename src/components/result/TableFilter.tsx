import { Filter, X } from "lucide-react";
import React from "react";

interface TableFilterProps {
  nodeTypes: string[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClearAll: () => void;
}

export const TableFilter: React.FC<TableFilterProps> = ({
  nodeTypes,
  selectedTypes,
  onTypeToggle,
  onClearAll,
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      insan: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700",
      plaka: "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700",
      ev: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700",
      konum: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700",
      sirket: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700",
      telefon: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700",
      email: "bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600";
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

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-gray-600/60 p-2 shadow-sm ">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Düğüm Türleri</span>
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={onClearAll}
            className="
              flex items-center gap-1 px-2 py-1 text-xs
              text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg
              transition-all duration-150
            "
          >
            <X className="w-3 h-3" />
            Temizle
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {nodeTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium
                transition-all duration-200 ease-out
                ${isSelected
                  ? `${getTypeColor(type)} shadow-sm scale-105`
                  : "bg-slate-50 dark:bg-gray-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
                }
              `}
            >
              <span>{getTypeIcon(type)}</span>
              <span className="capitalize">{type}</span>
              {isSelected && (
                <div className="w-1.5 h-1.5 bg-current rounded-full ml-1"></div>
              )}
            </button>
          );
        })}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-gray-600/50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{selectedTypes.length}</span> tür seçildi
          </p>
        </div>
      )}
    </div>
  );
};
