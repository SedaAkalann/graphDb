import React from "react";
import { NodePropertyForm } from "./NodePropertyForm";

export const PropertyPanel: React.FC<{
  selectedNode: any;
  onNodePropertyChange: (key: string, value: any) => void;
  resultLimit: number;
  setResultLimit: (v: number) => void;
  queryDepth: number;
  setQueryDepth: (v: number) => void;
  onQuery: () => void;
  onFilter?: () => void; // opsiyonel, filtre butonu için
}> = ({
  selectedNode,
  onNodePropertyChange,
  resultLimit,
  setResultLimit,
  queryDepth,
  setQueryDepth,
  onQuery,
  onFilter,
}) => (
  <aside className="w-80 overflow-y-auto bg-white border-l border-gray-200 p-6 flex flex-col gap-6 shadow-md z-10">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Sorgu Özellikleri</h2>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-600">Sonuç Limiti</label>
        <input
          type="number"
          min={1}
          className="border rounded px-2 py-1 mb-2"
          value={resultLimit}
          onChange={(e) => setResultLimit(Number(e.target.value))}
        />
        <label className="text-xs font-semibold text-gray-600">Sorgu Derinliği</label>
        <input
          type="number"
          min={1}
          className="border rounded px-2 py-1"
          value={queryDepth}
          onChange={(e) => setQueryDepth(Number(e.target.value))}
        />
      </div>
    </div>
    {selectedNode && (
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {selectedNode.data.label} Özellikleri
        </h3>
        <NodePropertyForm
          nodeType={selectedNode.data.type}
          values={selectedNode.data.properties || {}}
          onChange={onNodePropertyChange}
        />
        <button
          className="mt-4 w-full px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          onClick={onFilter}
          type="button"
        >
          Filtrele
        </button>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-xs text-gray-400">veya</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
      </div>
    )}
    <button
      className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      onClick={onQuery}
      type="button"
    >
      Sorgula
    </button>
  </aside>
);