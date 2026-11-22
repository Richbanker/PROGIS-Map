import { LatLngBoundsExpression } from 'leaflet';

export function unionBbox(
  bboxes: Array<[number, number, number, number]>
): LatLngBoundsExpression | null {
  const validBboxes = bboxes.filter(([minX, minY, maxX, maxY]) =>
    [minX, minY, maxX, maxY].every(Number.isFinite) &&
    minX <= maxX && minY <= maxY
  );
  const first = validBboxes[0];
  if (!first) return null;
  let [minX, minY, maxX, maxY] = first;
  for (let i = 1; i < validBboxes.length; i += 1) {
    const bbox = validBboxes[i];
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
