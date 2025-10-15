import { LatLngBoundsExpression } from 'leaflet';

export function unionBbox(
  bboxes: Array<[number, number, number, number]>
): LatLngBoundsExpression | null {
  if (bboxes.length === 0) return null;
  const first = bboxes[0];
  if (!first) return null;
  let [minX, minY, maxX, maxY] = first;
  for (let i = 1; i < bboxes.length; i += 1) {
    const bbox = bboxes[i];
    if (!bbox) continue;
    const [x1, y1, x2, y2] = bbox;
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);
  }
  return [
    [minY, minX],
    [maxY, maxX]
  ];
}

export function getHighlightStyle() {
  return {
    color: '#2563eb',
    weight: 3,
    fillColor: '#93c5fd',
    fillOpacity: 0.4
  } as const;
}
