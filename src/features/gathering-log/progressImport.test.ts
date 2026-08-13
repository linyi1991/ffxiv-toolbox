import { describe, expect, it } from 'vitest';
import { parseGatheringProgress } from './progressImport';

describe('parseGatheringProgress', () => {
  it('parses the versioned exporter format', () => {
    expect(parseGatheringProgress({ completedItemIds: [2, 3, 3, '8'] })).toEqual([2, 3, 8]);
  });

  it('parses legacy job arrays', () => {
    expect(parseGatheringProgress({ miner: [2, 3], botanist: [3, 4] })).toEqual([2, 3, 4]);
  });

  it('parses a bare localStorage-compatible array', () => {
    expect(parseGatheringProgress([2, 3])).toEqual([2, 3]);
  });

  it('rejects unrelated objects', () => {
    expect(() => parseGatheringProgress({ hello: 'world' })).toThrow();
  });
});

