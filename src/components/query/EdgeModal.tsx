import React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface EdgeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (relationType: string) => void;
}

const relationTypes = [
  "Arkadaş",
  "Çalışan",
  "Sahip",
  "Bağlantı",
  "Ebeveyn",
  "Yönetici",
];

export const EdgeModal: React.FC<EdgeModalProps> = ({ open, onClose, onSave }) => {
  const { isDarkMode } = useDarkMode();
  const [selected, setSelected] = React.useState(relationTypes[0]);

  React.useEffect(() => {
    if (open) setSelected(relationTypes[0]);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 ">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">İlişki Türü Seç</h3>
        <select
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {relationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 "
            onClick={onClose}
          >
            İptal
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            onClick={() => onSave(selected)}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};