import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import type { CytoData } from "../../types/types";
import { GraphTable } from "./GraphTable";
import { GraphView } from "./GraphView";
import "./ResultsViewer.css";
import type { ViewMode } from "./ViewToggle";
import { ViewToggle } from "./ViewToggle";

export const ResultsViewer: React.FC<{ data: CytoData | null; onBack: () => void }> = ({ data, onBack }) => {
  const [currentView, setCurrentView] = useState<ViewMode>("graph");

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/30 dark:via-gray-900 dark:to-indigo-900/30 ">
        <div className="text-slate-600 dark:text-slate-400">Veri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900/30 dark:via-gray-900 dark:to-indigo-900/30 ">
      {/* Header with Back Button and View Toggle */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="
            h-12 px-6 rounded-2xl
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
            text-white font-bold text-sm
            shadow-lg hover:shadow-2xl hover:-translate-y-1
            transition-all duration-300 ease-out
            flex items-center gap-3
            active:scale-[0.96] border border-indigo-400/50
            overflow-hidden group
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-0.5 drop-shadow-sm" />
          <span className="relative z-10 drop-shadow-sm">Sorguya Geri Dön</span>
        </button>

        {/* View Toggle */}
        <ViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>

      {/* Content Area */}
      <div className="w-full h-full pt-20">
        {currentView === "graph" ? (
          <GraphView data={data} />
        ) : (
          <GraphTable data={data} />
        )}
      </div>
    </div>
  );
};
