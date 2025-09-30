import { BarChart3, Network } from "lucide-react";
import React from "react";

export type ViewMode = "graph" | "table";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-white/50 dark:border-gray-700/50 ">
      <button
        onClick={() => onViewChange("graph")}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-300 ease-out
          ${currentView === "graph"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-105"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-gray-700/80"
          }
        `}
      >
        <Network className="w-4 h-4" />
        <span>Graph</span>
      </button>

      <button
        onClick={() => onViewChange("table")}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-300 ease-out
          ${currentView === "table"
            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md transform scale-105"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-gray-700/80"
          }
        `}
      >
        <BarChart3 className="w-4 h-4" />
        <span>Tablo</span>
      </button>
    </div>
  );
};
