declare module 'cytoscape-cose-bilkent' {
  import { Ext } from 'cytoscape';
  
  interface FcoseLayoutOptions {
    name: 'fcose';
    quality?: 'default' | 'draft' | 'proof';
    randomize?: boolean;
    animate?: boolean;
    animationDuration?: number;
    animationEasing?: string;
    fit?: boolean;
    padding?: number;
    nodeDimensionsIncludeLabels?: boolean;
    uniformNodeDimensions?: boolean;
    packComponents?: boolean;
    nodeRepulsion?: number | ((node: any) => number);
    idealEdgeLength?: number | ((edge: any) => number);
    edgeElasticity?: number | ((edge: any) => number);
    nestingFactor?: number;
    gravity?: number;
    numIter?: number;
    tile?: boolean;
    tilingPaddingVertical?: number;
    tilingPaddingHorizontal?: number;
    gravityRangeCompound?: number;
    gravityCompound?: number;
    gravityRange?: number;
    initialEnergyOnIncremental?: number;
  }

  const fcose: Ext;
  export = fcose;
}
