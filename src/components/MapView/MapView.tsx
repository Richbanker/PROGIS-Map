import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  useMapEvent,
  Popup,
  ZoomControl
} from 'react-leaflet';
import L, { LatLng, LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import layersConfig from '@/config/layers.json';
import { FeaturePopup } from './FeaturePopup';
import { LayerControl } from './LayerControl';
import { Spinner } from '@/components/common/Spinner';
import { getFeatureInfo } from '@/lib/ogc/wms';
import { getFeature } from '@/lib/ogc/wfs';
import { LayerConfig, WFSLayerConfig, WMSLayerConfig } from '@/types/ogc';
import { getHighlightStyle, unionBbox } from '@/utils/leaflet';
import { useSelection } from '@/state/selection';
import toast from 'react-hot-toast';

type ClickInfo = { latlng: LatLng; containerPoint: L.Point } | null;

export function MapView() {
  const [layers, setLayers] = useState<LayerConfig[]>(() => layersConfig as LayerConfig[]);
  const [loading, setLoading] = useState(false);
  const [geojsonData, setGeojsonData] = useState<Record<string, GeoJSON.FeatureCollection>>({});
  const [popupContent, setPopupContent] = useState<Record<string, unknown> | null>(null);
  const [popupPos, setPopupPos] = useState<LatLng | null>(null);
  const clickRef = useRef<ClickInfo>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { selected, setSelected, setHighlightId } = useSelection();

  const bounds = useMemo(() => {
    const activeBboxes = layers
      .filter((l) => l.visible !== false && l.bbox)
      .map((l) => l.bbox!) as Array<[number, number, number, number]>;
    return unionBbox(activeBboxes);
  }, [layers]);

  useEffect(() => {
    const loadWfs = async () => {
      const wfsLayers = layers.filter(
        (l): l is WFSLayerConfig => l.type === 'wfs' && (l.visible ?? true)
      );

      if (wfsLayers.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const tasks = wfsLayers.map(async (l) => {
          try {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 10000)
            );
            const dataPromise = getFeature({
              url: l.url,
              typeName: l.typeName,
              version: l.version,
              crs: l.crs,
              extraParams: l.extraParams
            });
            const data = await Promise.race([dataPromise, timeoutPromise]);
            return [l.id, data] as const;
          } catch (err) {
            console.error(`Ошибка загрузки слоя ${l.name}:`, err);
            toast.error(`Не удалось загрузить слой: ${l.name}`);
            return null;
          }
        });
        const results = await Promise.all(tasks);
        const validEntries = results.filter(
          (r): r is [string, GeoJSON.FeatureCollection] => r !== null
        );
        setGeojsonData((prev) => ({ ...prev, ...Object.fromEntries(validEntries) }));
      } catch (e) {
        console.error('Ошибка загрузки WFS:', e);
        toast.error('Ошибка загрузки WFS слоёв');
      } finally {
        setLoading(false);
      }
    };
    loadWfs();
  }, [layers]);

  const onMapClick = async (e: L.LeafletMouseEvent) => {
    clickRef.current = { latlng: e.latlng, containerPoint: e.containerPoint };
    const map = mapRef.current;
    if (!map) return;
    const size = map.getSize();
    const bbox = map.getBounds().toBBoxString();

    for (const layer of layers) {
      if (layer.visible === false) continue;
      if (layer.type === 'wms' && (layer.queryable ?? true)) {
        try {
          const info = await getFeatureInfo({
            url: layer.url,
            version: layer.version,
            layers: layer.layers,
            queryLayers: layer.layers,
            infoFormat: 'application/json',
            iOrX: Math.floor(e.containerPoint.x),
            jOrY: Math.floor(e.containerPoint.y),
            width: size.x,
            height: size.y,
            bbox,
            crs: 'EPSG:3857',
            extraParams: layer.extraParams
          });
          const data = normalizeWmsFeatureInfo(info);
          if (data) {
            setPopupContent(data.properties);
            setPopupPos(e.latlng);
            setSelected({ layerId: layer.id, properties: data.properties, latlng: e.latlng });
            return;
          }
        } catch {
          toast.error('Ошибка GetFeatureInfo');
        }
      }
      if (layer.type === 'wfs') {
        const fc = geojsonData[layer.id];
        if (fc) {
          const found = hitTestFeatureCollection(fc, e.latlng);
          if (found) {
            setPopupContent(found.properties ?? {});
            setPopupPos(e.latlng);
            const fid = getFeatureId(found);
            setSelected({
              layerId: layer.id,
              featureId: fid,
              geometry: found.geometry,
              properties: found.properties ?? {},
              latlng: e.latlng
            });
            setHighlightId(fid ?? null);
            return;
          }
        }
      }
    }

    setPopupContent(null);
    setSelected(null);
    setHighlightId(null);
  };

  function ResetOnKey() {
    useMapEvent('keydown', (ev) => {
      if (ev.originalEvent.key.toLowerCase() === 'escape') {
        setPopupContent(null);
        setSelected(null);
        setHighlightId(null);
      }
    });
    return null;
  }

  function MapClickHandler() {
    useMapEvent('click', onMapClick);
    return null;
  }

  useEffect(() => {
    if (!mapRef.current || !bounds) return;
    mapRef.current.fitBounds(bounds as LatLngBoundsExpression, { padding: [24, 24] });
  }, [bounds]);

  return (
    <div className="h-full relative">
      {loading && <Spinner />}
      <LayerControl layers={layers} onChange={setLayers} />
      <MapContainer
        ref={(m) => (mapRef.current = m as unknown as L.Map)}
        className="h-full"
        center={[55.751244, 37.618423]}
        zoom={10}
        zoomControl={false}
        preferCanvas
      >
        <ZoomControl position="bottomright" />
        <MapClickHandler />
        <ResetOnKey />
        {layers
          .filter((l) => l.visible ?? true)
          .map((l) => {
            if (l.type === 'xyz') {
              return (
                <TileLayer
                  key={l.id}
                  url={l.url}
                  attribution={l.attribution}
                  minZoom={l.minZoom}
                  maxZoom={l.maxZoom}
                />
              );
            }
            if (l.type === 'wms') {
              const w = l as WMSLayerConfig;
              return (
                <WMSTileLayer
                  key={l.id}
                  url={w.url}
                  layers={w.layers}
                  format={w.format ?? 'image/png'}
                  styles={w.styles}
                  transparent={w.transparent ?? true}
                  version={w.version ?? '1.3.0'}
                  opacity={1}
                  params={w.extraParams as any}
                />
              );
            }
            if (l.type === 'wfs') {
              const data = geojsonData[l.id];
              return (
                <GeoJSON
                  key={l.id}
                  data={data as any}
                  style={(feature) => {
                    const fid = getFeatureId(feature as any);
                    if (selected?.layerId === l.id && selected.featureId === fid) {
                      return getHighlightStyle();
                    }
                    return { color: '#111827', weight: 1, fillOpacity: 0.2 };
                  }}
                />
              );
            }
            return null;
          })}

        {popupContent && popupPos && (
          <Popup position={popupPos} eventHandlers={{ remove: () => setPopupContent(null) }}>
            <FeaturePopup
              data={popupContent}
              onCopy={() => toast.success('Скопировано')}
              onCenter={() => {
                if (!mapRef.current) return;
                mapRef.current.setView(popupPos, Math.max(mapRef.current.getZoom(), 14), {
                  animate: true
                });
              }}
            />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}

function getFeatureId(f: GeoJSON.Feature | undefined) {
  if (!f) return undefined;
  return (f.id as string | number | undefined) ?? (f.properties?.id as string | number | undefined);
}

function hitTestFeatureCollection(fc: GeoJSON.FeatureCollection, latlng: LatLng) {
  const point = L.latLng(latlng.lat, latlng.lng);
  for (const f of fc.features) {
    if (!f.geometry) continue;
    const layer = L.geoJSON(f as any);
    let hit = false;
    layer.getLayers().forEach((l) => {
      if ('getBounds' in l) {
        const b = (l as any).getBounds?.();
        if (b && b.contains(point)) hit = true;
      } else if ('getLatLng' in l) {
        const p = (l as any).getLatLng?.();
        if (p && p.distanceTo(point) < 10) hit = true;
      }
    });
    if (hit) return f;
  }
  return null;
}

function normalizeWmsFeatureInfo(data: any): { properties: Record<string, unknown> } | null {
  if (!data) return null;
  if (data.features && Array.isArray(data.features) && data.features.length > 0) {
    const f = data.features[0];
    return { properties: f.properties ?? {} };
  }
  if (data && typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length > 0) return { properties: data };
  }
  return null;
}
