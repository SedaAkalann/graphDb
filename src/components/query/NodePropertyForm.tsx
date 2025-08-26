import React from "react";
import { entityProperties } from "./entityProperties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <form className="flex flex-col gap-4">
      {props.map((prop) => (
        <div key={prop.key} className="flex flex-col gap-2">
          <Label className="text-xs font-semibold text-gray-600">
            {prop.label}
          </Label>

          {prop.type === "select" ? (
            <Select
              value={values[prop.key] || ""}
              onValueChange={(val) => onChange(prop.key, val)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {prop.options.map((opt: string) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={prop.type}
              value={values[prop.key] || ""}
              onChange={(e) => onChange(prop.key, e.target.value)}
              className="h-9"
            />
          )}
        </div>
      ))}
    </form>
  );
};
