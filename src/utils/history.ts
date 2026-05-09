import { DistancePreset, HistoryEntry, PRESETS } from '../types';

const STORAGE_KEY = 'triathlon_history';
const MAX_PER_PRESET = 5;

function loadAll(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveAll(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry: Omit<HistoryEntry, 'id' | 'calculatedAt'>): void {
  const all = loadAll();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    calculatedAt: new Date().toISOString(),
  };
  const others = all.filter((e) => e.preset !== entry.preset);
  const same = all.filter((e) => e.preset === entry.preset).slice(0, MAX_PER_PRESET - 1);
  saveAll([newEntry, ...same, ...others]);
}

export type GroupedHistory = { preset: DistancePreset; label: string; entries: HistoryEntry[] }[];

const PRESET_ORDER: DistancePreset[] = ['sprint', 'olympic', 'half-ironman', 'ironman', 'custom'];

function presetLabel(preset: DistancePreset): string {
  return preset === 'custom' ? 'Personalizado' : PRESETS[preset].label;
}

export function getAllGrouped(): GroupedHistory {
  const all = loadAll();
  return PRESET_ORDER
    .map((preset) => ({
      preset,
      label: presetLabel(preset),
      entries: all
        .filter((e) => e.preset === preset)
        .sort((a, b) => b.calculatedAt.localeCompare(a.calculatedAt)),
    }))
    .filter((g) => g.entries.length > 0);
}

export function deleteEntry(id: string): void {
  saveAll(loadAll().filter((e) => e.id !== id));
}
