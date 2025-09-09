export type RFNodeData = {
  id: string;
  label: string;
  type: string;
  color?: string;
  properties?: Record<string, string | number | boolean>;
};

export type RFEdgeData = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type CytoData = {
  elements: Array<{
    data: {
      id?: string;
      label?: string;
      source?: string;
      target?: string;
      backgroundColor?: string;
      type?: string;
      properties?: string;
    };
  }>;
};