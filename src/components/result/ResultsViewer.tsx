
import React, { useState } from "react";
import type { CytoData } from "../../types/types";
import { GraphTable } from "./GraphTable";
import { GraphView } from "./GraphView";
import "./ResultsViewer.css";
import type { ViewMode } from "./ViewToggle";
import { ViewToggle } from "./ViewToggle";

interface ResultsViewerProps {
  data: CytoData | null;
  isLoading: boolean;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ data, isLoading }) => {
  const [currentView, setCurrentView] = useState<ViewMode>("graph");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60 ">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-slate-600 dark:text-slate-400">Sorgu çalışıyor...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60 ">
        <div className="text-slate-600 dark:text-slate-400">Sorgu oluşturup "Sorgula" butonuna basın</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60 ">
      {/* Header with View Toggle */}
      <div className="absolute top-3 left-6 right-6 z-10 flex items-center justify-end ">
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
