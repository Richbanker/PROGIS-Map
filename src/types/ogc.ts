export type XYZLayerConfig = {
  id: string;
  type: 'xyz';
  name: string;
  url: string;
  attribution?: string;
  minZoom?: number;
  maxZoom?: number;
  visible?: boolean;
  bbox?: [number, number, number, number];
};

export type WMSLayerConfig = {
  id: string;
  type: 'wms';
  name: string;
  url: string;
  layers: string;
  format?: string;
  styles?: string;
  transparent?: boolean;
  version?: '1.1.1' | '1.3.0';
  visible?: boolean;
  queryable?: boolean;
  bbox?: [number, number, number, number];
  extraParams?: Record<string, string>;
};

export type WFSLayerConfig = {
  id: string;
  type: 'wfs';
  name: string;
  url: string;
  typeName: string;
  version?: '1.0.0' | '1.1.0' | '2.0.0';
  crs?: string;
  visible?: boolean;
  bbox?: [number, number, number, number];
  extraParams?: Record<string, string>;
};

export type LayerConfig = XYZLayerConfig | WMSLayerConfig | WFSLayerConfig;

export type FeatureAttributes = Record<string, unknown>;

export type SelectedFeature = {
  layerId: string;
  featureId?: string | number;
  geometry?: GeoJSON.Geometry;
  properties: FeatureAttributes;
  latlng?: { lat: number; lng: number };
};
