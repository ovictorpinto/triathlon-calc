import { HistoryEntry } from '../types';
import { formatDuration } from '../utils/calculator';
import { deleteEntry, GroupedHistory } from '../utils/history';

interface Props {
  groups: GroupedHistory;
  onDelete: () => void;
  onRestore: (entry: HistoryEntry) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

export function HistoryPanel({ groups, onDelete, onRestore }: Props) {
  if (groups.length === 0) return null;

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteEntry(id);
    onDelete();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
      <p className="text-sm font-medium text-gray-700">Histórico</p>
      {groups.map((group, i) => (
        <div key={group.preset}>
          {i > 0 && <div className="border-t border-gray-100 mb-4" />}
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
            {group.label}
          </span>
          <div className="space-y-1.5">
            {group.entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-1 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <button
                  onClick={() => onRestore(entry)}
                  className="flex-1 flex items-center justify-between px-3 py-2 text-left min-w-0"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                      {formatDuration(entry.totalSeconds)}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {entry.swimPace} · {entry.bikeSpeed}km/h · {entry.runPace}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2 shrink-0">
                    {formatDate(entry.calculatedAt)}
                  </span>
                </button>
                <button
                  onClick={(e) => handleDelete(e, entry.id)}
                  className="px-2 py-2 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                  title="Excluir"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
