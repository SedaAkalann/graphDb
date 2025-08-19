import React from "react";

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
  const [selected, setSelected] = React.useState(relationTypes[0]);

  React.useEffect(() => {
    if (open) setSelected(relationTypes[0]);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-lg font-semibold mb-4">İlişki Türü Seç</h3>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
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
            className="px-4 py-2 bg-gray-100 rounded-md"
            onClick={onClose}
          >
            İptal
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => onSave(selected)}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};