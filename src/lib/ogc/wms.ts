import { http } from '@/utils/http';

type GetMapParams = {
  url: string;
  version?: '1.1.1' | '1.3.0';
  layers: string;
  format?: string;
  styles?: string;
  transparent?: boolean;
  extraParams?: Record<string, string | number>;
};

export function buildWmsTileUrl(params: GetMapParams) {
  const {
    url,
    version = '1.3.0',
    layers,
    format = 'image/png',
    styles = '',
    transparent = true,
    extraParams
  } = params;
  const query = new URLSearchParams({
    service: 'WMS',
    request: 'GetMap',
    version,
    layers,
    styles,
    format,
    transparent: String(transparent)
  });
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => query.set(k, String(v)));
  }
  return `${url}?${query.toString()}`;
}

type GetFeatureInfoParams = {
  url: string;
  version?: '1.1.1' | '1.3.0';
  layers: string;
  queryLayers?: string;
  infoFormat?:
    | 'application/json'
    | 'application/vnd.ogc.gml'
    | 'text/xml'
    | 'application/vnd.esri.wms_featureinfo_xml';
  iOrX: number;
  jOrY: number;
  width: number;
  height: number;
  bbox: string;
  crs?: string;
  extraParams?: Record<string, string | number>;
};

export async function getFeatureInfo(params: GetFeatureInfoParams) {
  const {
    url,
    version = '1.3.0',
    layers,
    queryLayers,
    infoFormat = 'application/json',
    iOrX,
    jOrY,
    width,
    height,
    bbox,
    crs = version === '1.3.0' ? 'EPSG:3857' : 'EPSG:4326',
    extraParams
  } = params;

  const query = new URLSearchParams({
    service: 'WMS',
    request: 'GetFeatureInfo',
    version,
    layers,
    query_layers: queryLayers ?? layers,
    info_format: infoFormat,
    width: String(width),
    height: String(height),
    bbox
  });

  if (version === '1.3.0') {
    query.set('crs', crs);
    query.set('i', String(iOrX));
    query.set('j', String(jOrY));
  } else {
    query.set('srs', crs);
    query.set('x', String(iOrX));
    query.set('y', String(jOrY));
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => query.set(k, String(v)));
  }

  const resp = await http.get(`${url}?${query.toString()}`, {
    responseType: infoFormat === 'application/json' ? 'json' : 'text'
  });

  if (infoFormat === 'application/json') {
    return resp.data;
  }

  const text = String(resp.data);
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  return xmlToObject(xml);
}

function xmlToObject(xml: Document) {
  function nodeToObj(node: Node): any {
    const element = node as Element;
    if (!element.children || element.children.length === 0) {
      return element.textContent ?? '';
    }
    const obj: Record<string, any> = {};
    Array.from(element.children).forEach((child) => {
      const key = child.nodeName;
      const value = nodeToObj(child);
      if (obj[key] !== undefined) {
        const existing = obj[key];
        obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }
  return nodeToObj(xml.documentElement);
}
