import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { parseGatheringProgress } from '../progressImport';

interface Props {
  label: string;
  knownItemIds: Set<number>;
  completedItems: Set<number>;
  onImport: (ids: number[], mode: 'merge' | 'replace') => void;
}

export const ProgressImportButton: React.FC<Props> = ({ label, knownItemIds, completedItems, onImport }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const imported = parseGatheringProgress(JSON.parse(await file.text()));
      const matching = imported.filter(id => knownItemIds.has(id));
      const ignored = imported.length - matching.length;
      const added = matching.filter(id => !completedItems.has(id)).length;

      if (matching.length === 0) {
        throw new Error('No imported IDs match items in this gathering log.');
      }

      onImport(matching, 'merge');
      setMessage(`Imported ${matching.length} items (${added} newly completed${ignored ? `, ${ignored} unknown IDs ignored` : ''}).`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to import this file.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFile} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
        title={label}
      >
        <Upload size={14} />
        <span className="hidden sm:inline">{label}</span>
      </button>
      {message && (
        <button type="button" onClick={() => setMessage(null)} className="text-xs text-slate-500 dark:text-slate-400" title="Dismiss">
          {message}
        </button>
      )}
    </div>
  );
};
