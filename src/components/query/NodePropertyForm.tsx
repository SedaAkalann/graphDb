import React from "react";
import { entityProperties } from "./entityProperties";

export const NodePropertyForm = ({
  nodeType,
  values,
  onChange,
}: {
  nodeType: string;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}) => {
  const props = entityProperties[nodeType];
  if (!props) return null;

  return (
    <form className="flex flex-col gap-3">
      {props.map((prop) => (
        <div key={prop.key} className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">{prop.label}</label>
          {prop.type === "select" ? (
            <select
              className="border rounded px-2 py-1"
              value={values[prop.key] || ""}
              onChange={(e) => onChange(prop.key, e.target.value)}
            >
              <option value="">Seçiniz</option>
              {prop.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              className="border rounded px-2 py-1"
              type={prop.type}
              value={values[prop.key] || ""}
              onChange={(e) => onChange(prop.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </form>
  );
};