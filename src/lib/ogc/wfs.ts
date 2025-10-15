import { http } from '@/utils/http';

type GetFeatureParams = {
  url: string;
  typeName: string;
  version?: '1.0.0' | '1.1.0' | '2.0.0';
  crs?: string;
  extraParams?: Record<string, string | number>;
};

export async function getFeature(params: GetFeatureParams) {
  const { url, typeName, version = '2.0.0', crs = 'EPSG:3857', extraParams } = params;
  const query = new URLSearchParams({
    service: 'WFS',
    request: 'GetFeature',
    version,
    typeNames: typeName,
    outputFormat: 'application/json',
    srsName: crs
  });
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => query.set(k, String(v)));
  }
  const resp = await http.get(`${url}?${query.toString()}`);
  return resp.data as GeoJSON.FeatureCollection;
}
