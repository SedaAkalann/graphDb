import { entityProperties } from "../../constants/entityProperties";
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
  values: Record<string, string | number | boolean>;
  onChange: (key: string, value: string | number | boolean) => void;
}) => {
  const props = entityProperties[nodeType];
  if (!props) return null;

  return (
    <div className="space-y-4">
      {props.map((prop) => (
        <div key={prop.key} className="space-y-2">
          <Label className="text-sm font-medium text-slate-600 capitalize">
            {prop.label}
          </Label>

          {prop.type === "select" ? (
            <Select
              value={String(values[prop.key] || "")}
              onValueChange={(val) => onChange(prop.key, val)}
            >
              <SelectTrigger className="h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder={`${prop.label} seçin...`} />
              </SelectTrigger>
              <SelectContent>
                {prop.options?.map((opt: string) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={prop.type}
              value={String(values[prop.key] || "")}
              onChange={(e) => {
                const val = prop.type === "number" ? Number(e.target.value) : e.target.value;
                onChange(prop.key, val);
              }}
              className="h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              placeholder={`${prop.label} girin...`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
