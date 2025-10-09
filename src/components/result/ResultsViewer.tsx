
import React, { useState } from "react";
import type { CytoData } from "../../types/types";
import { GraphTable } from "./GraphTable";
import { GraphView } from "./GraphView";
import "./ResultsViewer.css";
import type { ViewMode } from "./ViewToggle";
import { ViewToggle } from "./ViewToggle";
import { FullscreenModal } from "./FullscreenModal";

interface ResultsViewerProps {
  data: CytoData | null;
  isLoading: boolean;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({ data, isLoading }) => {
  const [currentView, setCurrentView] = useState<ViewMode>("graph");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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
    <>
      <div className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60 ">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-end p-4 pb-2 flex-shrink-0">
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
            onFullscreen={() => setIsFullscreenOpen(true)}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full overflow-hidden px-4 pb-4">
          {currentView === "graph" ? (
            <GraphView data={data} containerId="cyto-canvas-main" />
          ) : (
            <GraphTable data={data} />
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        title={currentView === "graph" ? "Graph Görünümü - Tam Ekran" : "Tablo Görünümü - Tam Ekran"}
      >
        <div className="flex flex-col w-full h-full bg-gradient-to-br from-slate-50/60 via-white/80 to-slate-100/60 dark:from-gray-900/60 dark:via-gray-800/80 dark:to-gray-900/60">
          {/* Modal içindeki View Toggle */}
          <div className="flex items-center justify-end p-4 pb-2 flex-shrink-0">
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
              showFullscreenButton={false}
              showMinimizeButton={true}
              onMinimize={() => setIsFullscreenOpen(false)}
            />
          </div>

          {/* Modal Content */}
          <div className="flex-1 w-full overflow-hidden px-4 pb-4">
            {currentView === "graph" ? (
              <GraphView data={data} containerId="cyto-canvas-modal" />
            ) : (
              <GraphTable data={data} />
            )}
          </div>
        </div>
      </FullscreenModal>
    </>
  );
};
