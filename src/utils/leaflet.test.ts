import { describe, expect, it } from 'vitest';
import { unionBbox } from './leaflet';

describe('unionBbox', () => {
  it('combines valid bounds', () => {
    expect(unionBbox([[10, 20, 30, 40], [5, 15, 45, 50]])).toEqual([[15, 5], [50, 45]]);
  });

  it('ignores non-finite and inverted bounds', () => {
    expect(unionBbox([[Number.NaN, 0, 5, 5], [10, 20, 1, 30], [5, 10, 15, 20]])).toEqual([[10, 5], [20, 15]]);
  });

  it('returns null when all bounds are invalid', () => {
    expect(unionBbox([[Number.POSITIVE_INFINITY, 0, 1, 1], [4, 5, 2, 6]])).toBeNull();
  });
});
