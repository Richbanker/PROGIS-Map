import { describe, expect, it } from 'vitest';
import { buildWmsTileUrl } from './wms';

describe('buildWmsTileUrl', () => {
  it('adds a query string when the service URL has no parameters', () => {
    const url = new URL(buildWmsTileUrl({ url: 'https://maps.example.org/wms', layers: 'roads' }));
    expect(url.searchParams.get('service')).toBe('WMS');
    expect(url.searchParams.get('request')).toBe('GetMap');
    expect(url.searchParams.get('layers')).toBe('roads');
  });

  it.each([
    'https://maps.example.org/wms?token=demo',
    'https://maps.example.org/wms?token=demo&',
  ])('preserves existing query parameters: %s', (serviceUrl) => {
    const url = new URL(buildWmsTileUrl({ url: serviceUrl, layers: 'roads' }));
    expect(url.searchParams.get('token')).toBe('demo');
    expect(url.searchParams.get('request')).toBe('GetMap');
    expect(url.searchParams.get('layers')).toBe('roads');
  });
});
