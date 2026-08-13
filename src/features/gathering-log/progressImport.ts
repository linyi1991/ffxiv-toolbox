export interface GatheringProgressExport {
  schema: 'ffxiv-toolbox-gathering-progress';
  version: 1;
  generatedAt?: string;
  character?: string;
  completedItemIds: number[];
}

export function parseGatheringProgress(input: unknown): number[] {
  let values: unknown;

  if (Array.isArray(input)) {
    values = input;
  } else if (input && typeof input === 'object') {
    const source = input as Record<string, unknown>;
    values = source.completedItemIds ?? source.itemIds;

    // Accept the early exporter format as well as the versioned format.
    if (!Array.isArray(values) && ('miner' in source || 'botanist' in source)) {
      const miner = Array.isArray(source.miner) ? source.miner : [];
      const botanist = Array.isArray(source.botanist) ? source.botanist : [];
      values = [...miner, ...botanist];
    }
  }

  if (!Array.isArray(values)) {
    throw new Error('The file does not contain a completed item ID list.');
  }

  const ids = values.map(Number).filter(id => Number.isSafeInteger(id) && id > 0);
  if (ids.length === 0 && values.length > 0) {
    throw new Error('The completed item ID list contains no valid IDs.');
  }

  return Array.from(new Set(ids));
}
