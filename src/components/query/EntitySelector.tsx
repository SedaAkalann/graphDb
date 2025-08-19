import React from "react";
import { UserIcon, HomeIcon, MapPinIcon, TruckIcon } from "@heroicons/react/24/solid";

const entityList = [
  { id: "insan", label: "İnsan", color: "#2563eb", icon: <UserIcon className="w-5 h-5 text-blue-600" /> },
  { id: "plaka", label: "Plaka", color: "#f59e42", icon: <TruckIcon className="w-5 h-5 text-orange-500" /> },
  { id: "ev", label: "Ev", color: "#22c55e", icon: <HomeIcon className="w-5 h-5 text-green-500" /> },
  { id: "konum", label: "Konum", color: "#a21caf", icon: <MapPinIcon className="w-5 h-5 text-purple-700" /> },
];

export const EntitySelector: React.FC<{
  onClear?: () => void;
  onLoadSample?: () => void;
}> = ({ onClear, onLoadSample }) => (
  <aside className="w-56 bg-white border-r border-gray-200 p-6 flex flex-col gap-4 shadow-md z-10">
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Varlıklar</h2>
      <p className="text-xs text-gray-500 mb-4">Şemaya sürükleyip bırakın</p>
    </div>
    <div className="flex flex-col gap-3 mb-4">
      {entityList.map((entity) => (
        <div
          key={entity.id}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData("application/reactflow-label", entity.label);
            event.dataTransfer.setData("application/reactflow-type", entity.id); // <-- type bilgisini ekle!
            event.dataTransfer.setData("application/reactflow-color", entity.color);
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 cursor-grab transition-all shadow-sm"
        >
          <span>{entity.icon}</span>
          <span className="font-medium text-gray-800">{entity.label}</span>
        </div>
      ))}
    </div>
    <button
      className="mb-2 px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      onClick={onLoadSample}
    >
      Örnek Yükle
    </button>
    <button
      className="px-3 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
      onClick={onClear}
    >
      Sorguyu Temizle
    </button>
  </aside>
);