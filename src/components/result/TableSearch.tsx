import { Search, X } from "lucide-react";
import React from "react";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TableSearch: React.FC<TableSearchProps> = ({
  value,
  onChange,
  placeholder = "Düğümlerde ara...",
}) => {
  return (
    <div className="relative max-w-md">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-10 py-3 
          bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
          border border-slate-200/60 dark:border-gray-600/60 rounded-xl
          text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 focus:border-blue-400 dark:focus:border-blue-500
          transition-all duration-200 ease-out
          shadow-sm hover:shadow-md
        "
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute right-3 top-1/2 transform -translate-y-1/2
            p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700
            transition-all duration-150
          "
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
